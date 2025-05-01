package com.cozy.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.web.exchanges.HttpExchange;
import org.springframework.boot.actuate.web.exchanges.InMemoryHttpExchangeRepository;
import org.springframework.http.HttpStatus;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class CustomInMemoryHttpExchangeRepository extends InMemoryHttpExchangeRepository {

    @Override
    public void add(HttpExchange exchange) {
        Duration timeTaken = exchange.getTimeTaken();
        String method = exchange.getRequest().getMethod();
        String contextPath = exchange.getRequest().getUri().getPath();
        Map<String, List<String>> headers = exchange.getRequest().getHeaders();

        int httpStatus = exchange.getResponse().getStatus();

        String headerString = headers.entrySet()
                .stream()
                .map(entry -> "%s = %s".formatted(entry.getKey(), String.join(" ", entry.getValue())))
                .collect(Collectors.joining(","));

        boolean isActuatorRequest = contextPath.contains("actuator");
        final String LOG_MESSAGE_TEMPLATE = "{} {} {} { headers: {} } took {} ms";
        if (isActuatorRequest) {
            log.trace(LOG_MESSAGE_TEMPLATE, httpStatus, method, contextPath, headerString, timeTaken.toMillis());
        } else {
            HttpStatus statusCode = HttpStatus.valueOf(httpStatus);
            if (statusCode.is4xxClientError() || statusCode.is5xxServerError()) {
                log.error(LOG_MESSAGE_TEMPLATE, httpStatus, method, contextPath, headerString, timeTaken.toMillis());
            } else {
                log.info(LOG_MESSAGE_TEMPLATE, httpStatus, method, contextPath, headerString, timeTaken.toMillis());
            }
        }
        super.add(exchange);
    }

}
