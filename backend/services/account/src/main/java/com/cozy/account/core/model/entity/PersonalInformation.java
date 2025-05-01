/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.account.core.model.entity;

import com.cozy.account.core.model.converter.GovernmentIdConverter;
import com.cozy.shared.DateUtils;
import com.cozy.shared.db.BaseEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "personal_information", schema = "account_service")
public class PersonalInformation extends BaseEntity {
    private String email;
    @Embedded
    private LegalName legalName;
    @Embedded
    private PhoneNumber phoneNumber;
    @Convert(converter = GovernmentIdConverter.class)
    @Column(name = "government_id", columnDefinition = "text")
    private GovernmentId governmentId;
    @Embedded
    private Address address;
    @Embedded
    private EmergencyContact emergencyContact;


    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LegalName {
        private String firstName;
        private String lastName;

        @Override
        public String toString() {
            return "%s, %s".formatted(lastName, firstName);
        }
    }

    @Data
    @Builder
    @Embeddable
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PhoneNumber {
        @Column(name = "phone_country_code")
        private String countryCode;
        @Column(name = "phone_number")
        private String number;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GovernmentId implements Serializable {
        @JsonProperty("idFrontSideImage")
        private String idFrontSideImage;
        @JsonProperty("idBacksideSideImage")
        private String idBackSideImage;
        @JsonProperty("selfieWithIdImage")
        private String selfieWithIdImage;
        @JsonProperty("createdAt")
        private ZonedDateTime createdAt = DateUtils.now();
        @JsonProperty("status")
        private GovernmentIdStatus status = GovernmentIdStatus.PENDING;
        @JsonProperty("rejectionReason")
        private String rejectionReason;
    }

    public static enum GovernmentIdStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    @Data
    @Builder
    @Embeddable
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Address implements Serializable {
        @Column(name = "address_street")
        private String street;
        @Column(name = "address_city")
        private String city;
        @Column(name = "address_state")
        private String state;
        @Column(name = "address_country")
        private String country;
        @Column(name = "address_zip_code")
        private String zipCode;
    }

    @Data
    @Builder
    @Embeddable
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EmergencyContact {
        @Column(name = "emergency_contact_name")
        private String name;

        @Column(name = "relationship_with_emergency_contact")
        private String relationship;

        @Column(name = "emergency_contact_preferred_language")
        private String preferredLanguage;

        @Embedded
        @AttributeOverride(name = "countryCode", column = @Column(name = "emergency_contact_phone_country_code"))
        @AttributeOverride(name = "number", column = @Column(name = "emergency_contact_phone_number"))
        private PhoneNumber phoneNumber;

        @Column(name = "emergency_contact_email")
        private String email;
    }
}
