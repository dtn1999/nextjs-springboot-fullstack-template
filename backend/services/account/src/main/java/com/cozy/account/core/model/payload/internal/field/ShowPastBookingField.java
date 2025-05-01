package com.cozy.account.core.model.payload.internal.field;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public final class ShowPastBookingField implements AccountField {
    @NotNull
    private Boolean showPastBooking;
}
