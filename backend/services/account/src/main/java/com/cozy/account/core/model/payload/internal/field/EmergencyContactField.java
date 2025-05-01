package com.cozy.account.core.model.payload.internal.field;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public final class EmergencyContactField implements AccountField {
    @NotBlank
    private String name;
    @NotBlank
    private String relationship;
    @NotBlank
    private String preferredLanguage;
    @NotNull
    private PhoneNumberField phoneNumber;
    @Email
    @NotBlank
    private String email;
}
