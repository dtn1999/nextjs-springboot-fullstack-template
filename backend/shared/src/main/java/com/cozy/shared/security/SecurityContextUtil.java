package com.cozy.shared.security;

import io.vavr.control.Try;
import lombok.experimental.UtilityClass;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

@UtilityClass
public class SecurityContextUtil {
    public Try<JwtAuthenticationToken> getAuthenticationToken() {
        return Try.success(SecurityContextHolder.getContext())
                .map(securityContext -> (JwtAuthenticationToken) securityContext.getAuthentication());
    }
}
