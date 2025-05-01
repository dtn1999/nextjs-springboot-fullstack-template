package com.cozy.account.infra;

import com.cozy.account.core.exception.AccountNotFoundException;
import com.cozy.account.core.model.entity.Account;
import com.cozy.account.core.port.out.AccountRepository;
import com.cozy.account.infra.jpa.JpaAccountRepository;
import com.cozy.account.infra.jpa.JpaPersonalInformationRepository;
import com.cozy.shared.db.DefaultTryCrudRepository;
import io.vavr.control.Try;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public class AccountRepositoryImpl implements AccountRepository {
    private final DefaultTryCrudRepository<Account> crudRepositoryHelper;
    private final JpaAccountRepository repository;
    private final JpaPersonalInformationRepository personalInformationRepository;

    public AccountRepositoryImpl(JpaAccountRepository repository, JpaPersonalInformationRepository personalInformationRepository) {
        this.crudRepositoryHelper = DefaultTryCrudRepository.of(repository, Account.class);
        this.repository = repository;
        this.personalInformationRepository = personalInformationRepository;
    }

    @Override
    public Try<Account> save(Account account) {
        return this.crudRepositoryHelper.save(account);
    }

    @Override
    public Try<Account> findById(Long id) {
        return this.crudRepositoryHelper.findById(id);
    }

    @Override
    public Try<Account> findByUserId(String userId) {
        return Try.of(() -> this.repository.findByUserId(userId))
                .filter(Optional::isPresent, () -> new AccountNotFoundException("Account with userId %s not found".formatted(userId)))
                .map(Optional::get);
    }

    @Override
    public Try<Void> delete(Account account) {
        return this.findById(account.getId())
                .andThen(acc -> acc.setDeleted(true))
                .andThen(this::save)
                .map(p -> null);
    }

    @Override
    public Try<Void> deleteById(Long accountId) {
        return this.findById(accountId)
                .andThen(acc -> acc.setDeleted(true))
                .andThen(this::save)
                .map(p -> null);
    }

    @Override
    public Try<List<Account>> findAll() {
        return this.crudRepositoryHelper.findAll();
    }

    @Override
    public Try<List<Account>> findAll(Set<Long> accountIds) {
        return Try.success(this.repository.findAllById(accountIds));
    }

    @Override
    public Try<Boolean> existsByEmail(String email) {
        return Try.success(this.personalInformationRepository.countByEmail(email))
                .map(count -> count > 0);
    }
}
