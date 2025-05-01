package com.cozy.infra;

import com.cozy.core.ResourceManagementEventHandler;
import com.cozy.core.event.UserRegisteredEvent;
import com.rabbitmq.client.Channel;
import io.vavr.control.Try;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.scheduling.annotation.Async;

import static com.cozy.config.MessagingConfiguration.USER_REGISTERED_EVENT_QUEUE_BEAN;


@Slf4j
@RequiredArgsConstructor
public class ResourceManagementEventListener {
    private static final String USER_REGISTERED_EVENT_QUEUE_NAME = "#{" + USER_REGISTERED_EVENT_QUEUE_BEAN + ".name}";

    private final ResourceManagementEventHandler eventHandler;

    @Async
    @RabbitListener(queues = USER_REGISTERED_EVENT_QUEUE_NAME)
    public void handle(UserRegisteredEvent event, Channel channel) {
        Try.success(event)
                .onSuccess(e -> log.info("Start processing event {} from queue {}", event, USER_REGISTERED_EVENT_QUEUE_NAME))
                .andThen(this.eventHandler::handle)
                .get();
    }

}
