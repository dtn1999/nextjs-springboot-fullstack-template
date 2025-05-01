package com.cozy.account.core.model.payload.internal.field;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public final class PreferredTimeZoneField implements AccountField {
    @NotNull
    @NotBlank
    private String preferredTimeZone;
}
