package com.cozy.account.core.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Settings {

    @JsonProperty("global")
    private GlobalSettings global;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GlobalSettings implements Serializable {
        @JsonProperty("default_language")
        private String defaultLanguage;
        @JsonProperty("default_currency")
        private String defaultCurrency;
        @JsonProperty("default_timezone")
        private String defaultTimeZone;
    }

}
