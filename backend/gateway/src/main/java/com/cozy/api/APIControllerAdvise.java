package com.cozy.api;

import com.cozy.account.core.exception.AccountNotFoundException;
import com.cozy.listing.core.exception.BookedSpotException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class APIControllerAdvise {

    @ExceptionHandler({AccountNotFoundException.class, EntityNotFoundException.class})
    public ProblemDetail handle(RuntimeException e) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        problemDetail.setTitle(e.getClass().getSimpleName());
        return problemDetail;
    }

    @ExceptionHandler({BookedSpotException.class})
    public ProblemDetail handle(BookedSpotException e) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
        problemDetail.setTitle("Spot already booked");
        return problemDetail;
    }
}
