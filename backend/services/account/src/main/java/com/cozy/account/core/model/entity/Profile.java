/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.account.core.model.entity;

import com.cozy.shared.db.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "profile", schema = "account_service")
public class Profile extends BaseEntity {
    @Column(name = "birthdate")
    private LocalDate birthDate;
    @Column(name = "profile_picture_url", columnDefinition = "TEXT")
    private String profilePictureUrl;
    @Column(name = "about", columnDefinition = "TEXT")
    private String about;
    @Column(name = "show_previous_bookings", nullable = false)
    private Boolean showPreviousBookings;
    @Column(name = "is_email_verified", nullable = false)
    private Boolean isEmailVerified;
    @Column(name = "is_phone_number_verified", nullable = false)
    private Boolean isPhoneNumberVerified;
    @Column(name = "is_government_id_verified", nullable = false)
    private Boolean isGovernmentIdVerified;
}
