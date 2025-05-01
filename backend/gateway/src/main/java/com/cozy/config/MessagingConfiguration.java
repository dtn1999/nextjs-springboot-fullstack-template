package com.cozy.config;

import com.cozy.core.ResourceManagementEventHandler;
import com.cozy.infra.ResourceManagementEventListener;
import com.cozy.shared.messaging.MessageSender;
import com.cozy.shared.messaging.MessagingProperties;
import com.cozy.shared.messaging.RabbitMQMessageSender;
import com.cozy.shared.messaging.event.CozyEventStore;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@RequiredArgsConstructor
@Import(MessagingProperties.class)
public class MessagingConfiguration {
    public static final String RESOURCE_MANAGEMENT_TOPIC_EXCHANGE_BEAN = "RESOURCE_MANAGEMENT_EXCHANGE";
    public static final String USER_REGISTERED_EVENT_QUEUE_BEAN = "USER_REGISTERED_EVENT_QUEUE";

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean("rabbitMQMessagePublisher")
    public MessageSender messagePublisher(RabbitTemplate rabbitTemplate) {
        return new RabbitMQMessageSender(rabbitTemplate);
    }

    @Bean
    public ResourceManagementEventListener resourceManagementEventListener(ResourceManagementEventHandler eventHandler) {
        return new ResourceManagementEventListener(eventHandler);
    }

    @Bean(RESOURCE_MANAGEMENT_TOPIC_EXCHANGE_BEAN)
    public TopicExchange resourceManagementExchange() {
        return CozyEventStore.ExchangeConfig.RESOURCE_MANAGEMENT_EXCHANGE;
    }


    @Bean(USER_REGISTERED_EVENT_QUEUE_BEAN)
    public Queue accountCreatedQueue() {
        return QueueBuilder.durable(USER_REGISTERED_EVENT_QUEUE_BEAN)
                .build();
    }

    @Bean
    public Binding accountRegisteredBinding(
            @Qualifier(RESOURCE_MANAGEMENT_TOPIC_EXCHANGE_BEAN) TopicExchange resourceManagementExchange,
            @Qualifier(USER_REGISTERED_EVENT_QUEUE_BEAN) Queue accountCreatedQueue
    ) {
        return BindingBuilder.bind(accountCreatedQueue)
                .to(resourceManagementExchange)
                .with(CozyEventStore.USER_REGISTERED.key());
    }

}
