/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.config;

import com.cozy.shared.security.Auth0Properties;
import com.cozy.shared.security.DefaultIdPUserManagementAdapter;
import com.cozy.shared.security.IdPUserManagementAdapter;
import com.cozy.shared.security.ManagementApiAdapter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;
import static org.springframework.security.web.util.matcher.RegexRequestMatcher.regexMatcher;


@EnableMethodSecurity
@RequiredArgsConstructor
@Import(Auth0Properties.class)
public class SecurityConfiguration {
    private final Auth0Properties auth0Properties;

    @Bean
    public ManagementApiAdapter managementAPI() {
        return new ManagementApiAdapter(auth0Properties);
    }

    @Bean
    public IdPUserManagementAdapter userInfoRestClient(ManagementApiAdapter managementAPI) {
        return new DefaultIdPUserManagementAdapter(managementAPI);
    }

    @Bean
    public SecurityFilterChain configure(HttpSecurity httpSecurity, Converter<Jwt, AbstractAuthenticationToken> jwtMonoConverter) throws Exception {
        return httpSecurity
                .cors(corsSpec ->
                        corsSpec.configurationSource(exchange -> {
                            var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                            corsConfiguration.setAllowedOrigins(java.util.List.of("*"));
                            corsConfiguration.setAllowedMethods(java.util.List.of("*"));
                            corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
                            return corsConfiguration;
                        })
                )
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizeExchangeSpec ->
                                authorizeExchangeSpec

                                        .requestMatchers(
                                                EndpointRequest.to("health"),
                                                EndpointRequest.to("info"),
                                                EndpointRequest.to("prometheus"),
                                                antMatcher(HttpMethod.GET, "/listings/**"),
                                                antMatcher(HttpMethod.GET, "/cozy/db-scheduler/**"),
// TODO: Provide Proper Configuration for the following endpoints
//                                        antMatcher(HttpMethod.GET, "/db-scheduler/**"),
//                                        antMatcher(HttpMethod.GET, "/db-scheduler"),
//                                        antMatcher(HttpMethod.GET, "/db-scheduler-ui/**"),
//                                        antMatcher(HttpMethod.GET, "/db-scheduler-api/**"),
                                                antMatcher(HttpMethod.GET, "/locations"),
                                                antMatcher(HttpMethod.GET, "/locations/**"),
                                                antMatcher(HttpMethod.GET, "/amenities"),
                                                antMatcher(HttpMethod.GET, "/amenities/**"),
                                                antMatcher(HttpMethod.GET, "/listing-types"),
                                                antMatcher(HttpMethod.GET, "/listing-types/**")
                                        )
                                        .permitAll()
                                        .anyRequest()
                                        .authenticated()
                )
                .oauth2ResourceServer(oauth2ResourceServerSpec -> oauth2ResourceServerSpec
                        .jwt(jwtSpec -> jwtSpec.jwtAuthenticationConverter(jwtMonoConverter)))
                .build()
                ;
    }


    @Bean
    public Converter<Jwt, AbstractAuthenticationToken> customJwtAuthenticationConverter() {
        return new CustomJwtAuthenticationConverter();
    }

    @Bean
    public RoleHierarchy roleHierarchy() {
        final String hierarchyRule = "ROLE_ADMIN > ROLE_OWNER > ROLE_TENANT";
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        roleHierarchy.setHierarchy(hierarchyRule);
        return roleHierarchy;
    }

    @Bean
    static MethodSecurityExpressionHandler methodSecurityExpressionHandler(RoleHierarchy roleHierarchy) {
        DefaultMethodSecurityExpressionHandler expressionHandler = new DefaultMethodSecurityExpressionHandler();
        expressionHandler.setRoleHierarchy(roleHierarchy);
        return expressionHandler;
    }

}
