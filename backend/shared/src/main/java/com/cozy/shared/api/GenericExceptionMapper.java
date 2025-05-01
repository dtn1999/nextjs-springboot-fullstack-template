package com.cozy.shared.api;

import jakarta.persistence.EntityNotFoundException;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.MethodNotAllowedException;
import org.springframework.web.server.ServerWebInputException;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;

/**
 * This class is responsible for handling exceptions and returning a {@link ProblemDetail} object.
 * It is the central point for handling exception in the application and decides which HTTP status code
 */
@Slf4j
@UtilityClass
public class GenericExceptionMapper {

    public ProblemDetail map(Exception exception) {
        return switch (exception) {
            case AccessDeniedException accessDeniedException -> map(accessDeniedException);
            case EntityNotFoundException entityNotFoundException ->
                    generateProblemDetail(HttpStatus.NOT_FOUND, entityNotFoundException);
            case NoSuchElementException noSuchElementException ->
                    generateProblemDetail(HttpStatus.NOT_FOUND, noSuchElementException);
            case IllegalArgumentException illegalArgumentException ->
                    generateProblemDetail(HttpStatus.BAD_REQUEST, illegalArgumentException);
            case MethodArgumentNotValidException methodArgumentNotValidException ->
                    generateProblemDetail(HttpStatus.BAD_REQUEST, methodArgumentNotValidException);
            case MethodNotAllowedException methodNotAllowedException -> map(methodNotAllowedException);
            case ServerWebInputException serverWebInputException -> map(serverWebInputException);
            default -> generateProblemDetail(HttpStatus.INTERNAL_SERVER_ERROR, exception);
        };
    }

    private ProblemDetail map(AccessDeniedException accessDeniedException) {
        return generateProblemDetail(HttpStatus.FORBIDDEN, accessDeniedException);
    }

    private ProblemDetail map(MethodNotAllowedException exception) {
        return generateProblemDetail(HttpStatus.METHOD_NOT_ALLOWED, exception);
    }

    private ProblemDetail map(ServerWebInputException exception) {
        return generateProblemDetail(HttpStatus.BAD_REQUEST, exception);
    }

    public ProblemDetail generateProblemDetail(HttpStatus httpStatus, Exception exception) {
        String title = exception.getClass().getSimpleName();
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(httpStatus, exception.getMessage());
        problemDetail.setProperty("errors", provideMoreDetails(exception));
        problemDetail.setTitle(title);
        return problemDetail;
    }

    private Object provideMoreDetails(Exception exception) {
        if (exception instanceof MethodArgumentNotValidException methodArgumentNotValidException) {
            return methodArgumentNotValidException.getBindingResult().getAllErrors();
        } else if (exception instanceof WebExchangeBindException webBindException) {
            FieldError fieldError = webBindException.getBindingResult()
                    .getFieldError();
            if (Objects.nonNull(fieldError)) {
                return List.of(Map.of(fieldError.getField(), Objects.toString(fieldError.getDefaultMessage(), "incorrect")));
            }
        }
        return null;
    }

}
