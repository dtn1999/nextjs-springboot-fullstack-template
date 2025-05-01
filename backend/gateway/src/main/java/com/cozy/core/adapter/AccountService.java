package com.cozy.core.adapter;

import com.cozy.account.core.model.entity.Account;
import com.cozy.account.core.model.entity.PersonalInformation;
import com.cozy.account.core.model.entity.Profile;
import com.cozy.account.core.model.payload.internal.field.AccountField;
import com.cozy.account.core.model.payload.internal.field.RegisterUserRequest;
import com.cozy.account.core.model.payload.internal.field.UpdateProfileRequest;
import com.cozy.account.core.port.in.AccountManagement;
import com.cozy.account.core.port.in.ProfileManagement;
import com.cozy.core.event.UserRegisteredEvent;
import com.cozy.infra.ServicesFacade;
import com.cozy.shared.messaging.MessageSender;
import io.vavr.control.Try;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Objects;
import java.util.Set;

@Slf4j
@RequiredArgsConstructor
public class AccountService implements AccountManagement, ProfileManagement {
    private final ServicesFacade servicesFacade;
    private final MessageSender messageSender;

    @Override
    public Try<Account> register(String userId, RegisterUserRequest request) {
        return this.servicesFacade.accountService()
                .register(userId, request)
                .andThen(account -> this.messageSender.send(new UserRegisteredEvent(account)));
    }

    @Override
    public Try<Account> me(String userId) {
        return this.servicesFacade.accountService()
                .me(userId);
    }

    @Override
    public Try<Account> findById(Long accountId) {
        return this.servicesFacade.accountService()
                .findById(accountId);
    }

    @Override
    public Try<Void> makeUserHost(Long accountId) {
        return this.servicesFacade.accountService()
                .makeUserHost(accountId);
    }

    @Override
    public Try<List<Account>> findAll() {
        return this.servicesFacade.accountService()
                .findAll();
    }

    @Override
    public Try<List<Account>> findAll(Set<Long> accountIds) {
        return this.servicesFacade.accountService()
                .findAll(accountIds);
    }

    @Override
    public Try<Void> delete(Long accountId) {
        return this.servicesFacade.accountService()
                .delete(accountId);
    }

    @Override
    public Try<Void> suspend(Long accountId) {
        return this.servicesFacade.accountService()
                .suspend(accountId);
    }

    @Override
    public Try<Account> patchAccount(Long accountId, List<AccountField> accountFields) {
        return this.servicesFacade.accountService()
                .patchAccount(accountId, accountFields);
    }

    @Override
    public Try<Boolean> isUserAllowedToCreateListing(Long accountId) {
        return this.servicesFacade.accountService()
                .isUserAllowedToCreateListing(accountId);
    }

    @Override
    public Try<Boolean> doesUserExists(Long entityId) {
        return this.servicesFacade.accountService()
                .findById(entityId)
                .map(Objects::nonNull)
                .recoverWith(EntityNotFoundException.class, e -> Try.success(false));
    }

    @Override
    public Try<Account> findByIdpUserId(String idpUserId) {
        return this.servicesFacade.accountService()
                .findByIdpUserId(idpUserId);
    }

    @Override
    public Try<Account> getAuthenticatedAccount() {
        return this.servicesFacade.accountService()
                .getAuthenticatedAccount();
    }

    @Override
    public Try<Boolean> checkEmailUniqueness(String email) {
        return this.servicesFacade.accountService().checkEmailUniqueness(email);
    }

    @Override
    public Try<PersonalInformation.GovernmentId> verifyIdentityInformation(Long accountId, PersonalInformation.GovernmentIdStatus status, String rejectionReason) {
        return this.servicesFacade.accountService().verifyIdentityInformation(accountId, status, rejectionReason);
    }

    @Override
    public Try<Void> suspendAccount(Long accountId) {
        return this.servicesFacade.accountService().suspendAccount(accountId);
    }

    @Override
    public Try<Profile> findProfileById(Long profileId) {
        return this.servicesFacade.accountService()
                .findProfileById(profileId);
    }

    @Override
    public Try<List<Profile>> getAllProfiles() {
        return this.servicesFacade.accountService()
                .getAllProfiles();
    }

    @Override
    public Try<Profile> updateProfileById(Long profileId, UpdateProfileRequest request) {
        return this.servicesFacade.accountService()
                .updateProfileById(profileId, request);
    }

}
