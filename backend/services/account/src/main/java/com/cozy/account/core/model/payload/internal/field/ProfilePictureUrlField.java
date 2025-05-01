package com.cozy.account.core.model.payload.internal.field;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public final class ProfilePictureUrlField implements AccountField{
    @NotBlank
    private String profilePictureUrl;
}
