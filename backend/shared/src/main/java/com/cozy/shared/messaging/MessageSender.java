package com.cozy.shared.messaging;

import com.cozy.shared.messaging.event.CozyEvent;
import io.vavr.control.Try;

public interface MessageSender {
    <T extends CozyEvent> Try<Void> send(T event);
}
