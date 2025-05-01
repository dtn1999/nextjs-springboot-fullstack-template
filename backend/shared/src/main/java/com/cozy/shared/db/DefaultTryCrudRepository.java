package com.cozy.shared.db;

import io.vavr.control.Try;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor(staticName = "of")
public class DefaultTryCrudRepository<T extends BaseEntity> implements TryCrudRepository<T> {
    private final JpaRepository<T, Long> repository;
    private final Class<T> entityClass;

    @Override
    public Try<T> save(T entity) {
        return Try.success(this.repository.save(entity));
    }

    @Override
    public Try<T> findById(Long entityId) {
        String entityName = this.entityClass.getSimpleName();
        return Try.of(() -> this.repository.findById(entityId))
                .filter(Optional::isPresent, () -> new EntityNotFoundException("No %s with id %s found".formatted(entityName, entityId)))
                .map(Optional::get);
    }

    @Override
    public Try<List<T>> findAll() {
        return Try.of(this.repository::findAll);
    }

    @Override
    @Transactional
    public Try<Void> deleteById(Long id, boolean hardDelete) {
        if (hardDelete) {
            return this.findById(id)
                    .andThen(this.repository::delete)
                    .map(v -> null);
        }
        return this.findById(id)
                .andThen(entity -> entity.setDeleted(true))
                .flatMap(this::save)
                .map(v -> null);
    }

}
