package com.cozy;

import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * This a generic service with the purpose of deleting all data from the database.
 */
@Slf4j
public class DbResetService {

    private final JdbcTemplate jdbcTemplate;

    public DbResetService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Deletes all data from the database.
     */
    public void reset(String... tables) {
        for (String table : tables) {
            // Disable triggers
            jdbcTemplate.execute("ALTER TABLE  %s DISABLE TRIGGER ALL".formatted(table));
            log.debug("Deleting all data from table: {}", table);
            jdbcTemplate.execute("DELETE FROM %s".formatted(table));
            // Enable triggers
            jdbcTemplate.execute("ALTER TABLE %s ENABLE TRIGGER ALL".formatted(table));
        }
    }
}
