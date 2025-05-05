package de.convit.microservice.amsintegrator.domain.model;

import lombok.Getter;

@Getter
public enum AMSProvider {
    AEM("Adobe Experience Manager"),;

    private final String name;

    AMSProvider(String name) {
        this.name = name;
    }

}
