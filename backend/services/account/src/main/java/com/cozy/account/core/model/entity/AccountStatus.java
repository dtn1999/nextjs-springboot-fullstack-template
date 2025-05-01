package com.cozy.account.core.model.entity;

import lombok.Getter;

@Getter
public enum AccountStatus {
    ACTIVE("active"),
    INACTIVE("inactive"),
    SUSPENDED("suspended"),
    DELETED("deleted");

    private final String status;

    AccountStatus(String status) {
        this.status = status;
    }

    public static AccountStatus fromString(String status) {
        for (AccountStatus accountStatus : AccountStatus.values()) {
            if (accountStatus.status.equalsIgnoreCase(status)) {
                return accountStatus;
            }
        }
        throw new IllegalArgumentException("No constant with status " + status + " found");
    }
}
