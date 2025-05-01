package com.cozy.shared.db;

import io.vavr.control.Try;

import java.util.List;

public interface TryCrudRepository<T extends BaseEntity> {
    Try<T> save(T entity);

    Try<T> findById(Long id);

    Try<List<T>> findAll();

    Try<Void> deleteById(Long id, boolean hardDelete);
}
