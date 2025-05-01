package com.cozy.core;

import com.cozy.core.event.UserRegisteredEvent;
import com.cozy.infra.ServicesFacade;
import com.cozy.shared.messaging.MessageSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class ResourceManagementEventHandler {
    private final ServicesFacade servicesFacade;
    private final MessageSender messageSender;

    public void handle(UserRegisteredEvent event) {
        // Handle user registration event
    }

}
