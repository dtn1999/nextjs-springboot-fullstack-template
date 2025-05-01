package com.cozy.account.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ConfigurationProperties(prefix = "services.account.domain")
public class AccountServiceProperties {
    @JsonProperty("globalSettings")
    private GlobalSettings globalSettings;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GlobalSettings {
        @JsonProperty("currency")
        private String currency;
        @JsonProperty("language")
        private String language;
        @JsonProperty("timezone")
        private String timeZone;
    }
}
