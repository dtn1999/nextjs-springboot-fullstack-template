package com.cozy.account.config;

import com.cozy.account.core.exception.AccountIntegrityViolationException;
import com.cozy.account.core.exception.AccountNotFoundException;
import com.cozy.shared.security.IdentityProviderException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.NestedExceptionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientException;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class AccountApiControllerAdvise {

    @ExceptionHandler(RestClientException.class)
    public ProblemDetail handle(RestClientException notFound) {
        String title = RestClientException.class.getSimpleName();
        return this.getProblemDetailFromException(HttpStatus.NOT_FOUND, title, notFound.getMessage());
    }

    @ExceptionHandler({AccountNotFoundException.class, EntityNotFoundException.class})
    public ProblemDetail handle(RuntimeException exception) {
        String title = NestedExceptionUtils.getMostSpecificCause(exception).getClass().getSimpleName();
        return this.getProblemDetailFromException(HttpStatus.NOT_FOUND, title, exception.getMessage());
    }

    @ExceptionHandler(IdentityProviderException.class)
    public ProblemDetail handle(IdentityProviderException exception) {
        String title = IdentityProviderException.class.getSimpleName();
        return this.getProblemDetailFromException(HttpStatus.INTERNAL_SERVER_ERROR, title, exception.getMessage());
    }


    @ExceptionHandler(AuthorizationServiceException.class)
    public ProblemDetail handle(AuthorizationServiceException exception) {
        String title = exception.getClass().getSimpleName();
        return this.getProblemDetailFromException(HttpStatus.FORBIDDEN, title, exception.getMessage());
    }

    @ExceptionHandler(AccountIntegrityViolationException.class)
    public ProblemDetail handle(AccountIntegrityViolationException exception) {
        String title = exception.getClass().getSimpleName();
        String detail = exception.getViolations()
                .stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));
        return this.getProblemDetailFromException(HttpStatus.BAD_REQUEST, title, detail);
    }

    private ProblemDetail getProblemDetailFromException(HttpStatus status, String title, String detail) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(status);
        problemDetail.setDetail(detail);
        problemDetail.setTitle(title);
        return problemDetail;
    }

}
