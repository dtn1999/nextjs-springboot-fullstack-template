/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.shared.db;

import com.cozy.shared.EqualsAndHashCodeUtils;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.ZonedDateTime;

@Getter
@SuperBuilder
@MappedSuperclass
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity implements Serializable {
    public static final String ID_ATTRIBUTE = "id";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    protected Long id;

    @Setter
    @Column(name = "deleted")
    protected boolean deleted = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    protected ZonedDateTime createdAt;

    @Setter
    @UpdateTimestamp
    @Column(name = "updated_at")
    protected ZonedDateTime updatedAt;

    @Override
    @SuppressWarnings("com.haulmont.jpb.EqualsDoesntCheckParameterClass")
    public final boolean equals(Object object) {
        return EqualsAndHashCodeUtils.checkEquality(this, object);
    }

    @Override
    public final int hashCode() {
        return EqualsAndHashCodeUtils.getHashCode(this);
    }

}

