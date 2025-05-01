package com.cozy.shared.messaging.event;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.TopicExchange;

public enum CozyEventStore {
    // GENERIC RESOURCE EVENTS
    USER_REGISTERED(ExchangeConfig.RESOURCE_MANAGEMENT_EXCHANGE.getName(), "cozy.account.created"),
    USER_INFO_UPDATED(ExchangeConfig.RESOURCE_MANAGEMENT_EXCHANGE.getName(), "cozy.account.updated"),
    INQUIRY_CREATED(ExchangeConfig.RESOURCE_MANAGEMENT_EXCHANGE.getName(), "cozy.inquiry.created"),

    BOOKING_CREATED(ExchangeConfig.BOOKING_PROCESSING_EXCHANGE.getName(), "cozy.booking.created"),

    // BOOKING PROCESSING
    PAYMENT_FAILED(ExchangeConfig.BOOKING_PROCESSING_EXCHANGE.getName(), "cozy.billing.payment.failed"),
    PAYMENT_SUCCEEDED(ExchangeConfig.BOOKING_PROCESSING_EXCHANGE.getName(), "cozy.billing.payment.succeeded"),
    REFUND_PAYMENT(ExchangeConfig.BOOKING_PROCESSING_EXCHANGE.getName(), "cozy.billing.payment.refund");

    private final String exchangeName;
    private final String key;

    CozyEventStore(String exchange, String key) {
        this.key = key;
        this.exchangeName = exchange;
    }

    public String exchangeName() {
        return this.exchangeName;
    }

    public String key() {
        return this.key;
    }

    public static class ExchangeConfig {
        public static final TopicExchange RESOURCE_MANAGEMENT_EXCHANGE = new TopicExchange("cozy.resource.management");
        public static final DirectExchange BOOKING_PROCESSING_EXCHANGE = new DirectExchange("cozy.booking.processing");
    }

}
