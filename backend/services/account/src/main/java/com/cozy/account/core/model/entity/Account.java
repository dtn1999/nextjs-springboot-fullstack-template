/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.account.core.model.entity;

import com.cozy.account.core.model.converter.SettingsConverter;
import com.cozy.shared.db.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.Objects;

@Getter
@Setter
@Entity
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "account", schema = "account_service")
public class Account extends BaseEntity {
    @Column(name = "user_id", unique = true, nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private AccountStatus status = AccountStatus.ACTIVE;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "personal_information_id", referencedColumnName = "id")
    private PersonalInformation personalInformation;

    @Convert(converter = SettingsConverter.class)
    @Column(name = "settings", columnDefinition = "text")
    private Settings settings;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_id", referencedColumnName = "id")
    private Profile profile;

    public boolean isAdmin() {
        return Objects.nonNull(role) && role == Role.ADMIN;
    }

    public boolean isHost() {
        return Objects.nonNull(role) && (role == Role.HOST || isAdmin());
    }

    public boolean hasRole(Role role) {
        if (Objects.isNull(role)) {
            return false;
        }
        return switch (role) {
            case ADMIN -> isAdmin();
            case HOST -> isHost();
            case GUEST -> true;
        };
    }

    @Getter
    public enum Role {
        ADMIN("admin"),
        HOST("host"),
        GUEST("guest");

        private final String name;

        Role(String name) {
            this.name = name;
        }

        public static Role fromString(String name) {
            for (Role role : Role.values()) {
                if (role.name.equalsIgnoreCase(name)) {
                    return role;
                }
            }
            throw new IllegalArgumentException("No constant with name " + name + " found");
        }

    }
}
