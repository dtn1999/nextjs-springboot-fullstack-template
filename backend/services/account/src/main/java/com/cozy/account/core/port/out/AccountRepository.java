/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.account.core.port.out;

import com.cozy.account.core.model.entity.Account;
import io.vavr.control.Try;

import java.util.List;
import java.util.Set;

/**
 *
 */
public interface AccountRepository {
    Try<Account> save(Account account);

    Try<Account> findById(Long id);

    Try<Account> findByUserId(String userId);

    Try<Void> delete(Account account);

    Try<Void> deleteById(Long id);

    Try<List<Account>> findAll();

    Try<List<Account>> findAll(Set<Long> accountIds);

    Try<Boolean> existsByEmail(String email);
}
