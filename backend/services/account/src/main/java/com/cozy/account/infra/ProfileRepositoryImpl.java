package com.cozy.account.infra;

import com.cozy.account.core.exception.AccountNotFoundException;
import com.cozy.account.core.model.entity.Account;
import com.cozy.account.core.model.entity.Profile;
import com.cozy.account.core.port.out.ProfileRepository;
import com.cozy.account.infra.jpa.JpaProfileRepository;
import com.cozy.shared.db.DefaultTryCrudRepository;
import io.vavr.control.Try;

import java.util.List;
import java.util.Optional;

public class ProfileRepositoryImpl implements ProfileRepository {
    private final DefaultTryCrudRepository<Profile> crudRepositoryHelper;
    private final JpaProfileRepository repository;

    public ProfileRepositoryImpl(JpaProfileRepository repository) {
        this.crudRepositoryHelper = DefaultTryCrudRepository.of(repository, Profile.class);
        this.repository = repository;
    }

    @Override
    public Try<Profile> save(Profile profile) {
        return this.crudRepositoryHelper.save(profile);
    }

    @Override
    public Try<Profile> findById(Long id) {
        return this.crudRepositoryHelper.findById(id);
    }

    @Override
    public Try<List<Profile>> findAll() {
        return this.crudRepositoryHelper.findAll();
    }
}
