package com.cozy.account.core.model.payload.internal.field;


public sealed interface AccountField permits
        AboutField,
        AddressField,
        BirthDateField,
        EmailField,
        EmergencyContactField,
        GovernmentIdField,
        LegalNameField,
        PhoneNumberField,
        PreferredLanguageField,
        PreferredCurrencyField,
        PreferredTimeZoneField,
        ProfilePictureUrlField,
        ShowPastBookingField {
}
