package com.cozy;

import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

public class ServiceModuleTestConfig {

    @Bean
    public DbResetService dbResetService(JdbcTemplate jdbcTemplate) {
        return new DbResetService(jdbcTemplate);
    }

}
