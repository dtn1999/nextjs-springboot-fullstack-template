package com.cozy.core.event;

import com.cozy.account.core.model.entity.Account;
import com.cozy.shared.messaging.event.CozyEvent;
import com.cozy.shared.messaging.event.CozyEventStore;

public record UserRegisteredEvent(Account account) implements CozyEvent {

    @Override
    public CozyEventStore getType() {
        return CozyEventStore.USER_REGISTERED;
    }

}
