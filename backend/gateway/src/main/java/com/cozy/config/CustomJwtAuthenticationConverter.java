package com.cozy.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt source) {
        List<SimpleGrantedAuthority> permissions = source.getClaimAsStringList("permissions")
                .stream()
                .map("SCOPE_%s"::formatted)
                .map(SimpleGrantedAuthority::new)
                .toList();
        List<SimpleGrantedAuthority> roles = source.getClaimAsStringList("https://cozy.com/roles")
                .stream()
                .map("ROLE_%s"::formatted)
                .map(SimpleGrantedAuthority::new)
                .toList();
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.addAll(permissions);
        authorities.addAll(roles);
        return new JwtAuthenticationToken(source, authorities);
    }

}
