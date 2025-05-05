package de.convit.microservice.amsintegrator.domain.model;

import lombok.Getter;

@Getter
public enum MediaType {
    IMAGE("image"),
    VIDEO("video"),
    AUDIO("audio"),
    DOCUMENT("document"),
    OTHER("other");

    private final String type;

    MediaType(String type) {
        this.type = type;
    }

}
