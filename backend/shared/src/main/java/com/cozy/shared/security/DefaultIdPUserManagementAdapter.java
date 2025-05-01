/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.shared.security;

import com.auth0.json.mgmt.roles.Role;
import io.vavr.API;
import io.vavr.control.Try;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
public class DefaultIdPUserManagementAdapter implements IdPUserManagementAdapter {
    private static final String USER_INFO_CACHE = "user-info";
    private final ManagementApiAdapter managementAPIAdapter;

    @Override
    @Cacheable(value = USER_INFO_CACHE, key = "#p0")
    public Try<UserInfo> getUserInfo(String userId) {
        log.debug("Getting user info from Auth0 with userId: {}", userId);
        Try<UserInfo> user = this.managementAPIAdapter.getUserInfo(userId);
        Try<Set<Role>> roles = this.managementAPIAdapter.findAllRoleByUserId(userId);

        return API.For(user, roles)
                .yield((userInfo, rolesSet) -> {
                    Set<String> roleNames = rolesSet.stream().map(Role::getName).collect(Collectors.toSet());
                    userInfo.setRoles(roleNames);
//                    return roleIds
//                            .stream()
//                            .map(this.managementAPIAdapter::findPermissionsByRoleId)
//                            .map(Try::get)
//                            .map(permissionsSet -> {
//                                userInfo.setPermissions(permissionsSet);
//                                return userInfo;
//                            });
                    return userInfo;
                })
                .onSuccess(userInfo -> log.debug("User info from Auth0: {}", userInfo));
    }

    @Override
    public Try<Void> assignRoleToUser(String userId, String role) {
        return this.managementAPIAdapter.findRoleByName(role)
                .map(Role::getId)
                .flatMap(roleId -> this.managementAPIAdapter.assignRoleToUser(userId, roleId));
    }

}
