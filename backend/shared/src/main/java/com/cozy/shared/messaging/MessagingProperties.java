package com.cozy.shared.messaging;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ConfigurationProperties("messaging")
public class MessagingProperties {
    // Account

    // Booking
    @JsonProperty("resource-management-exchange")
    private String resourceManagementExchange;
    @JsonProperty("booking-processing-exchange")
    private String bookingProcessingExchange;
    @JsonProperty("booking-created-event-queue")
    private String bookingCreatedEventQueue;
    @JsonProperty("booking-state-event-queue")
    private String bookingStateEventQueue;

    // Payment
    @JsonProperty("payment-succeeded-event-queue")
    private String paymentSucceededEventQueue;
    @JsonProperty("payment-filed-event-queue")
    private String paymentFailedEventQueue;
}
