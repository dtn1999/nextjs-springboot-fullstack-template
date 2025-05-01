package com.cozy.account.core.model.payload.internal.field;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public final class GovernmentIdField implements AccountField {
    @NotBlank
    private String idFrontSideImage;
    @NotBlank
    private String idBackSideImage;
    @NotBlank
    private String selfieWithIdImage;
}
