/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy;

import com.auth0.client.auth.AuthAPI;
import com.cozy.config.MasterConfiguration;
import com.cozy.shared.security.ManagementApiAdapter;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.mockito.Mockito.mock;


@TestConfiguration
@Import({MasterConfiguration.class})
public class CoreTestConfiguration {

    @Bean
    public AuthAPI authAPI() {
        return mock(AuthAPI.class);
    }

    @Bean
    public ManagementApiAdapter managementAPI() {
        return mock(ManagementApiAdapter.class);
    }

    @Bean
    public DbResetService dbResetService(JdbcTemplate jdbcTemplate) {
        return new DbResetService(jdbcTemplate);
    }

}
