package com.cozy.shared.security;

import com.auth0.client.auth.AuthAPI;
import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.client.mgmt.filter.PageFilter;
import com.auth0.client.mgmt.filter.RolesFilter;
import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.auth.TokenHolder;
import com.auth0.json.mgmt.permissions.Permission;
import com.auth0.json.mgmt.roles.Role;
import com.auth0.json.mgmt.users.User;
import com.auth0.json.mgmt.users.UsersPage;
import com.auth0.net.Request;
import com.auth0.net.Response;
import com.auth0.net.TokenRequest;
import io.vavr.API;
import io.vavr.control.Try;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.*;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Slf4j
public class ManagementApiAdapter {
    private final Auth0Properties auth0Properties;
    private AuthAPI auth0Api;
    private ManagementAPI auth0ManagementApi;

    public ManagementApiAdapter(final Auth0Properties auth0Properties) {
        this.auth0Properties = auth0Properties;
        this.auth0Api = null;
        this.auth0ManagementApi = null;
    }

    public Try<UserInfo> getUserInfo(String userId) {
        this.init();
        return this.runWithRefreshToken(
                        Try.of(() -> this.auth0ManagementApi.users().get(userId, new UserFilter()).execute())
                                .map(Response::getBody)
                )
                .map(Auth0PayloadMapper.INSTANCE::map);
    }

    public Try<Set<String>> findPermissionsByRoleId(String roleId) {
        this.init();
        return this.runWithRefreshToken(
                        Try.of(() -> this.auth0ManagementApi.roles().listPermissions(roleId, new PageFilter()).execute())
                                .map(response -> response.getBody().getItems())
                                .map(response -> response.stream().map(Permission::getName).collect(Collectors.toSet()))
                )
                .onFailure(Exception.class, e -> log.error("Error getting permissions from Auth0 with roleId: {}", roleId, e))
                .onFailure(Exception.class, e -> log.debug("", e))
                .recoverWith(Auth0Exception.class, e -> Try.failure(new IdentityProviderException(e.getMessage(), e)));
    }


    public Try<Role> findRoleByName(String role) {
        this.init();
        return this.runWithRefreshToken(
                        Try.of(() -> this.auth0ManagementApi.roles().list(new RolesFilter()).execute())
                                .map(response -> response
                                        .getBody()
                                        .getItems()
                                        .stream()
                                        .filter(auth0Role -> filterRoleByEquality(auth0Role, role))
                                        .findFirst()
                                )
                )
                .onFailure(Exception.class, e -> log.error("Error getting role with name: {}", role))
                .onFailure(Exception.class, e -> log.debug("", e))
                .recoverWith(Auth0Exception.class, e -> Try.failure(new IdentityProviderException(e.getMessage(), e)))
                .map(optionalRole -> optionalRole.orElseThrow(() -> new EntityNotFoundException("Auth0 Role not found")))
                ;
    }

    public Try<Set<Role>> findAllRoleByUserId(String userId) {
        return this.runWithRefreshToken(
                        Try.of(() -> this.auth0ManagementApi.users().listRoles(userId, new PageFilter()).execute())
                                .map(response -> response.getBody().getItems())
                                .map(Set::copyOf)
                )
                .onFailure(Exception.class, e -> log.error("Error getting roles from Auth0 with userId: {}", userId))
                .onFailure(Exception.class, e -> log.debug("", e))
                .recoverWith(Auth0Exception.class, e -> Try.failure(new IdentityProviderException(e.getMessage(), e)));
    }

    public Try<Void> assignRoleToUser(String userId, String roleId) {
        return this.runWithRefreshToken(
                Try.of(() -> this.auth0ManagementApi.users().addRoles(userId, List.of(roleId)))
                        .flatMap(request -> Try.of(() -> request.execute().getStatusCode()))
                        .map(HttpStatus::valueOf)
                        .filter(HttpStatus::is2xxSuccessful, () -> new IdentityProviderException("Error assigning role"))
                        .onSuccess(status -> log.info("Role with Id {} assigned to user {}", roleId, userId))
                        .onFailure(e -> log.error("Error assigning role with Id {} to user {}. Status code.", roleId, userId))
                        .onFailure(e -> log.debug("", e))
                        .flatMap(v -> Try.run(() -> {
                        }))
        );
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Try<Integer> migrateUsersRole(String fromRole, String toRole, boolean force) {
        return this.runWithRefreshToken(
                Try.of(() -> {
                            Try<Role> roleToAssign = this.findRoleByName(toRole)
                                    .recoverWith(EntityNotFoundException.class, e -> {
                                        if (force) {
                                            return this.createRole(toRole);
                                        }
                                        return Try.failure(e);
                                    });

                            Try<Role> roleToChange = this.findRoleByName(fromRole);

                            return API.For(roleToChange, roleToAssign)
                                    .yield((oldRole, newRole) -> {
                                        PageFilter filter = getIntialPageFilter();
                                        UsersPage responsePage = this.findRoleUsers(oldRole, filter);
                                        List<User> batch = responsePage.getItems();
                                        List<User> processedUsers = new ArrayList<>();
                                        do {
                                            this.assignRoleToUsers(newRole, batch, processedUsers);
                                            if (Objects.nonNull(responsePage.getNext())) {
                                                log.info("Assigning next page of users");
                                                responsePage = this.findRoleUsers(oldRole, new PageFilter().withFrom(responsePage.getNext()));
                                                batch = responsePage.getItems();
                                            } else {
                                                batch = Collections.emptyList();
                                            }
                                        } while (!batch.isEmpty());
                                        return processedUsers.size();
                                    });
                        })
                        .map(Try::get)
        );
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Try<Integer> removeUsersRole(String roleName, boolean force) {
        return this.runWithRefreshToken(
                this.findRoleByName(roleName)
                        .map(role -> {
                            PageFilter filter = getIntialPageFilter();
                            UsersPage responsePage = this.findRoleUsers(role, filter);
                            List<User> batch = responsePage.getItems();
                            List<User> processedUsers = new ArrayList<>();
                            do {
                                this.removeUsersRole(role, batch, processedUsers);
                                if (Objects.nonNull(responsePage.getNext())) {
                                    log.info("Removing the next page of users");
                                    responsePage = this.findRoleUsers(role, new PageFilter().withFrom(responsePage.getNext()));
                                    batch = responsePage.getItems();
                                } else {
                                    batch = Collections.emptyList();
                                }

                            } while (!batch.isEmpty());
                            return processedUsers.size();
                        })
        );
    }

    private PageFilter getIntialPageFilter() {
        PageFilter filter = new PageFilter();
        filter.withPage(0, 50);
        return filter;
    }

    private UsersPage findRoleUsers(Role role, PageFilter filter) {
        return Try.of(() -> this.auth0ManagementApi.roles().listUsers(role.getId(), filter))
                .mapTry(Request::execute)
                .map(response -> {
                    if (!HttpStatus.valueOf(response.getStatusCode()).is2xxSuccessful()) {
                        throw new IdentityProviderException("Error getting users with role: %s. Failed with status code %s".formatted(role, response.getStatusCode()));
                    }
                    return response.getBody();
                })
                .get();
    }

    private void assignRoleToUsers(Role role, List<User> users, List<User> processedUsers) {
        int waitTimeBetweenRequests = 1000;
        users.forEach(u ->
                // Hack to avoid getting 429 from Auth0
                this.waitFor(() -> this.assignRoleToUser(u.getId(), role.getId()), waitTimeBetweenRequests)
                        .map(_d -> processedUsers.add(u))
                        .recoverWith(assignmentError -> {
                            log.error("Error assigning role to user: {}", u.getId(), assignmentError);
                            log.warn("Rolling back changes for user: {}", u.getId());
                            processedUsers.forEach(updatedUser ->
                                    this.waitFor(() -> this.assignRoleToUser(updatedUser.getId(), role.getId()), waitTimeBetweenRequests)
                                            .onFailure(rollbackError -> log.error("Error rolling back changes for user: {}", updatedUser.getId()))
                                            .onFailure(rollbackError -> log.debug("", rollbackError))
                                            .get()
                            );
                            throw new IdentityProviderException("Error assigning role to user: %s".formatted(u.getId()), assignmentError);
                        })
                        .get()
        );
    }

    private void removeUsersRole(Role role, List<User> users, List<User> processedUsers) {
        int waitTimeBetweenRequests = 1000;
        users.forEach(u ->
                // Hack to avoid getting 429 from Auth0
                this.waitFor(() -> this.removeRoleFromUser(u.getId(), role.getId()), waitTimeBetweenRequests)
                        .map(_d -> processedUsers.add(u))
                        .recoverWith(assignmentError -> {
                            log.error("Error removing role from user: {}", u.getId(), assignmentError);
                            log.warn("Rolling back changes for user: {}", u.getId());
                            processedUsers.forEach(updatedUser ->
                                    this.waitFor(() -> this.assignRoleToUser(updatedUser.getId(), role.getId()), waitTimeBetweenRequests)
                                            .onFailure(rollbackError -> log.error("Error rolling back changes for user: {}", updatedUser.getId()))
                                            .onFailure(rollbackError -> log.debug("", rollbackError))
                                            .get()
                            );
                            throw new IdentityProviderException("Error removing role from user: %s".formatted(u.getId()), assignmentError);
                        })
                        .get()
        );
    }

    private Try<Void> removeRoleFromUser(String userId, String roleId) {
        return Try.of(() -> this.auth0ManagementApi.users().removeRoles(userId, Collections.singletonList(roleId)))
                .flatMap(request -> Try.of(() -> request.execute().getStatusCode()))
                .map(HttpStatus::valueOf)
                .filter(HttpStatus::is2xxSuccessful, () -> new IdentityProviderException("Error removing role"))
                .onSuccess(status -> log.info("Role with Id {} removed from user {}", roleId, userId))
                .onFailure(e -> log.error("Error removing role with Id {} from user {}. Status code.", roleId, userId))
                .onFailure(e -> log.debug("", e))
                .flatMap(v -> Try.run(() -> {
                }));
    }

    private Try<Role> createRole(String toRole) {
        return Try.of(() -> {
                    Role newRole = new Role();
                    newRole.setName(toRole);
                    newRole.setDescription("This role was created by the system when migrating users roles. Provide a description");
                    return this.auth0ManagementApi.roles().create(newRole);
                })
                .mapTry(request -> request.execute())
                .map(response -> {
                    if (!HttpStatus.valueOf(response.getStatusCode()).is2xxSuccessful()) {
                        throw new IdentityProviderException("Role creation failed with status code: " + response.getStatusCode());
                    }
                    return response.getBody();
                });
    }

    private boolean filterRoleByEquality(Role auth0Role, String role) {
        return auth0Role.getName().equalsIgnoreCase(role);
    }

    public <T> Try<T> runWithRefreshToken(Try<T> operation) {
        return operation
                .recoverWith(Auth0Exception.class, e -> {
                            this.refreshApiToken();
                            return operation;
                        }
                );
    }

    private String getAuthToken(String requestTokenUri) {
        try {
            TokenRequest tokenRequest = this.auth0Api.requestToken(requestTokenUri);
            TokenHolder holder = tokenRequest.execute().getBody();
            return holder.getAccessToken();
        } catch (Auth0Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private Try<Void> refreshApiToken() {
        return Try.success(this.getAuthToken(auth0Properties.getRequestTokenUri()))
                .andThen(this.auth0ManagementApi::setApiToken)
                .map(e -> null);
    }

    private void init() {
        if (Objects.isNull(auth0Api) || Objects.isNull(auth0ManagementApi)) {
            this.auth0Api = AuthAPI.newBuilder(
                    auth0Properties.getDomain(),
                    auth0Properties.getClientId(),
                    auth0Properties.getClientSecret()
            ).build();
            String domain = auth0Properties.getDomain();
            String accessToken = this.getAuthToken(auth0Properties.getRequestTokenUri());
            this.auth0ManagementApi = ManagementAPI.newBuilder(domain, accessToken).build();
        }
    }

    private <T> T waitFor(Supplier<T> supplier, int milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            log.error("Error waiting for operation", e);
        }
        return supplier.get();
    }

}
