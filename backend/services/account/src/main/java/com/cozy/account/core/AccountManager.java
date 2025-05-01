/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.account.core;


import com.cozy.account.config.AccountServiceProperties;
import com.cozy.account.core.exception.AccountIntegrityViolationException;
import com.cozy.account.core.exception.AccountNotFoundException;
import com.cozy.account.core.model.entity.*;
import com.cozy.account.core.model.payload.internal.field.AccountField;
import com.cozy.account.core.model.payload.internal.field.RegisterUserRequest;
import com.cozy.account.core.model.payload.internal.field.UpdateProfileRequest;
import com.cozy.account.core.model.util.AccountUpdater;
import com.cozy.account.core.port.in.AccountManagement;
import com.cozy.account.core.port.out.AccountRepository;
import com.cozy.account.core.port.out.ProfileRepository;
import com.cozy.shared.GenericObjectValidator;
import com.cozy.shared.security.IdPUserManagementAdapter;
import com.cozy.shared.security.SecurityContextUtil;
import io.vavr.control.Try;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
public class AccountManager implements AccountManagement {
    private final AccountRepository accountRepository;
    private final ProfileRepository profileRepository;
    private final IdPUserManagementAdapter idpUserManagementAdapter;
    private final AccountServiceProperties.GlobalSettings globalSettings;

    @Override
    public Try<Account> register(String userId, RegisterUserRequest request) {
        return this.accountRepository.findByUserId(userId)
                .flatMap(account -> this.handleExistingAccount(account, request))
                .recoverWith(AccountNotFoundException.class, exception -> this.setupAccount(userId, request));
    }

    @Override
    public Try<Account> me(String userId) {
        return this.accountRepository.findByUserId(userId)
                .filter(account -> !account.isDeleted(), () -> new AccountNotFoundException("Account not found for user " + userId))
                ;
    }

    @Override
    public Try<Account> findById(Long accountId) {
        return this.getAuthenticatedUserId()
                .flatMap(userId ->
                                this.accountRepository.findById(accountId)
                                        .flatMap(account -> {
//                                    boolean isUserAuthorized = account.getUserId().equals(userId) || account.getRole().equals(Account.Role.ADMIN);
//                                    if (!isUserAuthorized) {
//                                        String message = String.format("User with id %s is not authorized to access account with id %s. It is either not admin or not owner of the account", userId, accountId);
//                                        return Try.failure(new AuthorizationServiceException(message));
//                                    }
                                            return Try.success(account);
                                        })
                );
    }

    @Override
    public Try<Void> makeUserHost(Long accountId) {
        return this.accountRepository.findById(accountId)
                .filter(account -> !account.isDeleted() && account.getId().equals(accountId), () -> new AccessDeniedException("You cannot modified the state of an account not belonging to you"))
                .flatMap(account ->
                        this.assignRoleToUser(account.getUserId(), account, Account.Role.HOST)
                                .map(v -> null)
                )
                .map(t -> null);
    }

    @Override
    public Try<List<Account>> findAll() {
        log.debug("Finding all accounts");
        return this.accountRepository.findAll();
    }

    @Override
    public Try<List<Account>> findAll(Set<Long> accountIds) {
        return this.accountRepository.findAll(accountIds);
    }

    @Override
    public Try<Void> delete(Long accountId) {
        log.debug("Deleting account with id {}", accountId);
        return this.accountRepository.deleteById(accountId)
                .map(o -> null);
    }

    @Override
    public Try<Void> suspend(Long accountId) {
        log.debug("Suspending account with id {}", accountId);
        return this.accountRepository.findById(accountId)
                .flatMap(account -> {
                    account.setStatus(AccountStatus.SUSPENDED);
                    return this.accountRepository.save(account);
                })
                .map(v -> null);
    }

    @Override
    public Try<Account> patchAccount(Long accountId, List<AccountField> patchedFields) {
        return this.isAuthenticatedUserOwnerOrAdmin(accountId)
                .onFailure(ConstraintViolationException.class, exception -> {
                    log.error("Validation failed for listing patchedFields {}, with message {}", patchedFields, exception.getMessage());
                    log.error("Validation failed with violations {}", exception.getConstraintViolations());
                    log.error("", exception);
                })
                .flatMap(account -> this.validate(patchedFields)
                        .flatMap(_v -> {
                            log.info("Patching account with id {} with fields {}", accountId, patchedFields);
                            AccountUpdater accountUpdater = new AccountUpdater(account);
                            patchedFields.forEach(accountUpdater::patch);
                            Account accountWithUpdates = accountUpdater.account();
                            return this.accountRepository.save(accountWithUpdates)
                                    .onSuccess(savedListing -> log.info("Account with id {} updated with patchedFields {}", accountId, patchedFields));
                        })
                );
    }

    @Override
    public Try<Boolean> isUserAllowedToCreateListing(Long accountId) {
        return this.accountRepository.findById(accountId)
                .map(account -> {
                    boolean isHost = account.getRole().equals(Account.Role.HOST);
                    boolean isAdmin = account.getRole().equals(Account.Role.ADMIN);
                    boolean isVerified = this.isAccountVerified(account);
                    boolean isActive = account.getStatus().equals(AccountStatus.ACTIVE);
                    return (isHost || isAdmin) && isVerified && isActive;
                });
    }

    @Override
    public Try<Boolean> doesUserExists(Long accountId) {
        return this.accountRepository.findById(accountId)
                .filter(account -> account.getStatus().equals(AccountStatus.ACTIVE))
                .filter(account -> !account.isDeleted())
                .map(Objects::nonNull);
    }

    @Override
    public Try<Account> findByIdpUserId(String idpUserId) {
        return this.accountRepository.findByUserId(idpUserId);
    }

    @Override
    public Try<Account> getAuthenticatedAccount() {
        return this.getAuthenticatedUserId()
                .flatMap(this.accountRepository::findByUserId);
    }

    @Override
    public Try<Boolean> checkEmailUniqueness(String email) {
        return this.accountRepository.existsByEmail(email);
    }

    @Override
    public Try<PersonalInformation.GovernmentId> verifyIdentityInformation(Long accountId, PersonalInformation.GovernmentIdStatus status, String rejectionReason) {
        if (status.equals(PersonalInformation.GovernmentIdStatus.REJECTED) && rejectionReason == null) {
            return Try.failure(new IllegalArgumentException("Rejection reason must be provided when status is REJECTED"));
        }

        return this.isAuthenticatedUserOwnerOrAdmin(accountId)
                .flatMap(account -> {
                    PersonalInformation.GovernmentId governmentId = account.getPersonalInformation()
                            .getGovernmentId();
                    governmentId.setStatus(status);
                    governmentId.setRejectionReason(rejectionReason);
                    account.getProfile().setIsGovernmentIdVerified(true);
                    return this.accountRepository.save(account);
                })
                .map(account -> account.getPersonalInformation().getGovernmentId())
                ;
    }

    @Override
    public Try<Void> suspendAccount(Long accountId) {
        return this.retrieveIfUserHasRole(accountId, Account.Role.ADMIN)
                .flatMap(account -> {
                    account.setDeleted(true);
                    account.setStatus(AccountStatus.SUSPENDED);
                    return this.accountRepository.save(account);
                })
                .onFailure(error -> log.error("Error banning account with id {}. {}", accountId, error.getMessage()))
                .onFailure(error -> log.debug("", error))
                .map(v -> null);
    }


    @Override
    public Try<Profile> findProfileById(Long profileId) {
        log.debug("Finding profile with id {}", profileId);
        return this.profileRepository.findById(profileId)
                .onFailure(NoSuchElementException.class, error -> log.error("Profile with id {} not found", profileId))
                .onFailure(error -> log.error("", error));
    }

    @Override
    public Try<Profile> updateProfileById(Long profileId, UpdateProfileRequest request) {
        log.debug("Updating profile with id {} with request {}", profileId, request);
        return this.profileRepository.findById(profileId)
                .andThen(profile -> {
                    Optional.ofNullable(request.birthDate())
                            .ifPresent(profile::setBirthDate);
                    Optional.ofNullable(request.profilePictureUrl())
                            .ifPresent(profile::setProfilePictureUrl);
                    Optional.ofNullable(request.about())
                            .ifPresent(profile::setAbout);
                    Optional.ofNullable(request.showPreviousBookings())
                            .ifPresent(profile::setShowPreviousBookings);
                })
                .flatMap(this.profileRepository::save)
                .onFailure(error -> log.error("Error updating profile with id {}. {}", profileId, error.getMessage()))
                .onFailure(error -> log.debug("", error));
    }

    @Override
    public Try<List<Profile>> getAllProfiles() {
        log.debug("Finding all profiles");
        return this.profileRepository.findAll()
                .onFailure(error -> log.error("Error finding all profiles. {}", error.getMessage()))
                .onFailure(error -> log.error("", error));
    }


    private Try<Account> handleExistingAccount(Account account, RegisterUserRequest request) {
        if (!account.isDeleted()) {
            return Try.success(account);
        }

        account.setDeleted(false);

        PersonalInformation.LegalName legalName = PersonalInformation.LegalName.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        account.getPersonalInformation()
                .setEmail(request.getEmail());

        account.getPersonalInformation()
                .setLegalName(legalName);

        return this.accountRepository.save(account);
    }

    private Try<String> getAuthenticatedUserId() {
        return SecurityContextUtil.getAuthenticationToken()
                .map(JwtAuthenticationToken::getName);
    }

    private Try<Account> setupAccount(String userId, RegisterUserRequest request) {
        if (!this.isUserAgeCompliant(request.getBirthDate())) {
            return Try.failure(new IllegalArgumentException("User must be at least 18 years old"));
        }

        return this.idpUserManagementAdapter.getUserInfo(userId)
                .map(userInfo -> {
                    Profile profile = Profile.builder()
                            .profilePictureUrl(userInfo.getPicture())
                            .showPreviousBookings(false)
                            .isEmailVerified(userInfo.isEmailVerified())
                            .isPhoneNumberVerified(false)
                            .isGovernmentIdVerified(false)
                            .birthDate(request.getBirthDate())
                            .build();

                    PersonalInformation.LegalName legalName = PersonalInformation.LegalName.builder()
                            .firstName(request.getFirstName())
                            .lastName(request.getLastName())
                            .build();

                    PersonalInformation personalInformation = PersonalInformation.builder()
                            .email(request.getEmail())
                            .legalName(legalName)
                            .build();


                    Settings settings = new Settings();
                    Settings.GlobalSettings defaultSettings = Settings.GlobalSettings.builder()
                            .defaultLanguage(this.globalSettings.getLanguage())
                            .defaultCurrency(this.globalSettings.getCurrency())
                            .defaultTimeZone(this.globalSettings.getTimeZone())
                            .build();

                    settings.setGlobal(defaultSettings);

                    return Account.builder()
                            .userId(userId)
                            .personalInformation(personalInformation)
                            .profile(profile)
                            .settings(settings)
                            .status(AccountStatus.ACTIVE)
                            .build();
                })
                .flatMap(this.accountRepository::save)
                .flatMap(account -> this.assignRoleToUser(userId, account, Account.Role.GUEST));
    }

    private Try<Account> retrieveIfUserHasRole(Long accountId, Account.Role role) {
        return this.getAuthenticatedUserId()
                .flatMap(userId -> this.accountRepository.findById(accountId)
                        .map(account -> {
                            if (account.hasRole(role)) {
                                throw new AuthorizationServiceException("User is not owner of the account");
                            }
                            return account;
                        })
                );
    }

    private Try<Account> isAuthenticatedUserOwnerOrAdmin(Long accountId) {
        return this.getAuthenticatedUserId()
                .flatMap(userId -> this.accountRepository.findById(accountId)
                        .map(account -> {
                            boolean isOwner = account.getId().equals(accountId);
                            boolean isAdmin = account.getRole().equals(Account.Role.ADMIN);
                            if (!isOwner && !isAdmin) {
                                throw new AuthorizationServiceException("User is not owner of the account");
                            }
                            return account;
                        })
                );
    }

    private Try<Account> admin(Long accountId) {
        return this.getAuthenticatedUserId()
                .flatMap(userId -> this.accountRepository.findById(accountId)
                        .map(account -> {
                            boolean isAdmin = account.getRole().equals(Account.Role.ADMIN);
                            if (!isAdmin) {
                                throw new AuthorizationServiceException("User is not admin");
                            }
                            return account;
                        })
                );
    }

    private Try<Void> validate(List<AccountField> patchedFields) {
        Set<ConstraintViolation<AccountField>> violations = GenericObjectValidator.validate(patchedFields);
        if (!violations.isEmpty()) {
            return Try.failure(AccountIntegrityViolationException.with(violations));
        }
        return Try.run(() -> {
        });
    }

    private Try<Account> assignRoleToUser(String userId, Account account, Account.Role role) {
        return this.idpUserManagementAdapter.assignRoleToUser(userId, role.getName())
                .map(v -> role)
                .flatMap(r -> {
                    account.setRole(r);
                    return this.accountRepository.save(account);
                })
                .onFailure(error -> log.error("Error assigning role to user {}", userId, error));
    }

    private boolean isAccountVerified(Account account) {
        return account.getProfile().getIsEmailVerified();
    }

    private boolean isUserAgeCompliant(LocalDate birthDate) {
        return birthDate.isBefore(LocalDate.now().minusYears(18)) || birthDate.isEqual(LocalDate.now().minusYears(18));
    }

}
