package com.cozy.shared.security;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ConfigurationProperties(prefix = "auth0")
public class Auth0Properties {
    private String userInfoUri;
    private String domain;
    private String clientId;
    private String clientSecret;

    public String getRequestTokenUri() {
        return "https://%s/api/v2/".formatted(domain);
    }

}
