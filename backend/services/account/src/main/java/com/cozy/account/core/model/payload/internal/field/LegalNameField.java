package com.cozy.account.core.model.payload.internal.field;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public final class LegalNameField implements AccountField {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
}
