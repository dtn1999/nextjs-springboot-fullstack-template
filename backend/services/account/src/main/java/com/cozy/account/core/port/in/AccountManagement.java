/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.account.core.port.in;

import com.cozy.account.core.model.entity.Account;
import com.cozy.account.core.model.entity.PersonalInformation;
import com.cozy.account.core.model.payload.internal.field.AccountField;
import com.cozy.account.core.model.payload.internal.field.RegisterUserRequest;
import io.vavr.control.Try;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Set;

public interface AccountManagement extends ProfileManagement {
    /**
     * Register a new user based on the provided userId and accessToken coming from the authorization server.
     * This function has a silent behavior, meaning that if the user already exists,
     * no error is thrown, the existing user is simply returned.
     *
     * @param userId  the id of the user on the authorization server
     * @param request the user information
     * @return the newly or existing account
     */
    Try<Account> register(String userId, RegisterUserRequest request);

    Try<Account> me(String userId);

    Try<Account> findById(Long accountId);

    Try<Void> makeUserHost(Long accountId);

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    Try<List<Account>> findAll();

    Try<List<Account>> findAll(Set<Long> accountIds);

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    Try<Void> delete(Long accountId);

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    Try<Void> suspend(Long accountId);

    Try<Account> patchAccount(Long accountId, List<AccountField> accountFields);

    Try<Boolean> isUserAllowedToCreateListing(Long accountId);

    Try<Boolean> doesUserExists(Long entityId);

    Try<Account> findByIdpUserId(String idpUserId);

    Try<Account> getAuthenticatedAccount();

    Try<Boolean> checkEmailUniqueness(String email);

    Try<PersonalInformation.GovernmentId> verifyIdentityInformation(Long accountId, PersonalInformation.GovernmentIdStatus status, String rejectionReason);

    Try<Void> suspendAccount(Long accountId);
}
