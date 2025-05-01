package com.cozy.shared.messaging;

import com.cozy.shared.messaging.event.CozyEvent;
import io.vavr.control.Try;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@RequiredArgsConstructor
public class RabbitMQMessageSender implements MessageSender {
    private final RabbitTemplate rabbitTemplate;

    @Override
    public <T extends CozyEvent> Try<Void> send(T event) {
        return Try.run(() -> {
            String exchangeName = event.getType().exchangeName();
            String exchangeKey = event.getType().key();
            rabbitTemplate.convertAndSend(exchangeName, exchangeKey, event);
        });
    }

}
