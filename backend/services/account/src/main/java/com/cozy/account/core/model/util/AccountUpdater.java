package com.cozy.account.core.model.util;

import com.cozy.account.core.model.entity.Account;
import com.cozy.account.core.model.entity.PersonalInformation;
import com.cozy.account.core.model.payload.internal.field.*;
import com.cozy.shared.DateUtils;

public record AccountUpdater(Account account) {

    public void patch(AccountField field) {
        switch (field) {
            case AboutField about -> patchAbout(about);
            case AddressField address -> patchAddress(address);
            case BirthDateField birthDate -> patchBirthDate(birthDate);
            case EmailField email -> patchEmail(email);
            case EmergencyContactField emergencyContact -> patchEmergencyContact(emergencyContact);
            case GovernmentIdField governmentId -> patchGovernmentId(governmentId);
            case LegalNameField legalName -> patchLegalName(legalName);
            case PhoneNumberField phoneNumber -> patchPhoneNumber(phoneNumber);
            case PreferredLanguageField preferredLanguage -> patchPreferredLanguage(preferredLanguage);
            case PreferredCurrencyField preferredCurrency -> patchPreferredCurrency(preferredCurrency);
            case PreferredTimeZoneField preferredTimezone -> patchPreferredTimezone(preferredTimezone);
            case ProfilePictureUrlField profilePictureUrl -> patchProfilePictureUrl(profilePictureUrl);
            case ShowPastBookingField showPastBooking -> patchShowPastBooking(showPastBooking);
            default -> throw new IllegalArgumentException("Unknown field: " + field.getClass().getSimpleName());
        }

    }

    private void patchAbout(AboutField about) {
        account.getProfile().setAbout(about.getAbout());
    }

    private void patchAddress(AddressField address) {
        PersonalInformation.Address accountAddress = PersonalInformation.Address.builder()
                .country(address.getCountry())
                .city(address.getCity())
                .state(address.getState())
                .street(address.getStreet())
                .zipCode(address.getZipCode())
                .build();
        account.getPersonalInformation().setAddress(accountAddress);
    }

    private void patchBirthDate(BirthDateField birthDate) {
        account.getProfile().setBirthDate(birthDate.getBirthDate());
    }

    private void patchEmail(EmailField email) {
        account.getPersonalInformation().setEmail(email.getEmail());
    }

    private void patchEmergencyContact(EmergencyContactField emergencyContact) {
        PersonalInformation.EmergencyContact accountEmergencyContact = PersonalInformation.EmergencyContact.builder()
                .name(emergencyContact.getName())
                .relationship(emergencyContact.getRelationship())
                .preferredLanguage(emergencyContact.getPreferredLanguage())
                .email(emergencyContact.getEmail())
                .phoneNumber(PersonalInformation.PhoneNumber.builder()
                        .countryCode(emergencyContact.getPhoneNumber().getCountryCode())
                        .number(emergencyContact.getPhoneNumber().getNumber())
                        .build())
                .build();
        account.getPersonalInformation().setEmergencyContact(accountEmergencyContact);

    }

    private void patchGovernmentId(GovernmentIdField governmentId) {
        PersonalInformation.GovernmentId accountGovernmentId = PersonalInformation.GovernmentId.builder()
                .idBackSideImage(governmentId.getIdBackSideImage())
                .idFrontSideImage(governmentId.getIdFrontSideImage())
                .selfieWithIdImage(governmentId.getSelfieWithIdImage())
                .createdAt(DateUtils.now())
                .status(PersonalInformation.GovernmentIdStatus.PENDING)
                .build();
        account.getPersonalInformation().setGovernmentId(accountGovernmentId);

    }

    private void patchLegalName(LegalNameField legalName) {
        PersonalInformation.LegalName accountLegalName = PersonalInformation.LegalName.builder()
                .firstName(legalName.getFirstName())
                .lastName(legalName.getLastName())
                .build();
        account.getPersonalInformation().setLegalName(accountLegalName);
    }

    private void patchPhoneNumber(PhoneNumberField phoneNumber) {
        PersonalInformation.PhoneNumber accountPhoneNumber = PersonalInformation.PhoneNumber.builder()
                .countryCode(phoneNumber.getCountryCode())
                .number(phoneNumber.getNumber())
                .build();
        account.getPersonalInformation().setPhoneNumber(accountPhoneNumber);
    }

    private void patchPreferredLanguage(PreferredLanguageField preferredLanguage) {
        account.getSettings()
                .getGlobal()
                .setDefaultLanguage(preferredLanguage.getPreferredLanguage());
    }

    private void patchPreferredCurrency(PreferredCurrencyField preferredCurrency) {
        account.getSettings()
                .getGlobal()
                .setDefaultCurrency(preferredCurrency.getPreferredCurrency());
    }

    private void patchPreferredTimezone(PreferredTimeZoneField preferredTimeZone) {
        account.getSettings()
                .getGlobal()
                .setDefaultTimeZone(preferredTimeZone.getPreferredTimeZone());
    }

    private void patchProfilePictureUrl(ProfilePictureUrlField profilePictureUrl) {
        account.getProfile().setProfilePictureUrl(profilePictureUrl.getProfilePictureUrl());
    }

    private void patchShowPastBooking(ShowPastBookingField showPastBooking) {
        account.getProfile().setShowPreviousBookings(showPastBooking.getShowPastBooking());
    }

}
