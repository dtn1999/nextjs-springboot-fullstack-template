package com.cozy.account.core.model.payload.internal.field;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public final class BirthDateField implements AccountField {
    @Past
    @NotNull
    private LocalDate birthDate;
}
