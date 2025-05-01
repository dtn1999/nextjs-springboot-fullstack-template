package com.cozy.account.core.model.payload.internal.field;

import java.time.LocalDate;

public record UpdateProfileRequest(
        LocalDate birthDate,
        String profilePictureUrl,
        String about,
        Boolean showPreviousBookings
) {

}
