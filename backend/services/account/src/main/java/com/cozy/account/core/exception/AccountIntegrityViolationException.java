package com.cozy.account.core.exception;

import com.cozy.account.core.model.payload.internal.field.AccountField;
import jakarta.validation.ConstraintViolation;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Set;

@Getter
@RequiredArgsConstructor(staticName = "with")
public class AccountIntegrityViolationException extends RuntimeException {
    private final Set<ConstraintViolation<AccountField>> violations;
}
