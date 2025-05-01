package com.cozy.shared;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Map;
import java.util.Objects;

@Getter
@Setter
@ConfigurationProperties
@SuppressWarnings("ConfigurationProperties")
public class ServiceConfigurationProperties {
    @JsonProperty("services")
    private Map<String, ServiceConfiguration> services;

    public LiquibaseProperties getServiceLiquibaseProperties(String serviceName) {
        this.checkServiceConfiguration(serviceName);
        ServiceConfiguration serviceConfiguration = this.services.get(serviceName);
        LiquibaseProperties serviceLiquibase = serviceConfiguration.getLiquibase();
        this.validateLiquibaseProperties(serviceName, serviceLiquibase);
        return Objects.requireNonNull(serviceLiquibase, "No Liquibase configuration found for service (module) %s. Please check your configuration file.".formatted(serviceName));
    }

    private void checkServiceConfiguration(String serviceName) {
        if (!this.services.containsKey(serviceName)) {
            throw new IllegalStateException("No service configuration found for service (module) %s. Please check your configuration file.".formatted(serviceName));
        }

    }

    private void validateLiquibaseProperties(String serviceName, LiquibaseProperties liquibaseProperties) {
        if (Objects.isNull(liquibaseProperties)) {
            throw new IllegalStateException("No Liquibase configuration found for service (module) %s. Please check your configuration file for services.%s.liquibase".formatted(serviceName, serviceName));
        }

        if (Objects.isNull(liquibaseProperties.getChangeLog())) {
            throw new IllegalStateException("No Liquibase change log found for service (module) %s. Please check your configuration file for services.%s.liquibase.change-log".formatted(serviceName, serviceName));
        }

        if (Objects.isNull(liquibaseProperties.getDefaultSchema())) {
            throw new IllegalStateException("No Liquibase default schema found for service (module) %s. Please check your configuration file for services.%s.liquibase.default-schema".formatted(serviceName, serviceName));
        }

        String defaultSchema = liquibaseProperties.getDefaultSchema();
        String liquibaseSchema = liquibaseProperties.getLiquibaseSchema();

        String expectedSchemaName = "%s-service".formatted(serviceName);
        if (defaultSchema.isBlank() || defaultSchema.equals(expectedSchemaName)) {
            throw new IllegalStateException("Liquibase default schema for service (module) %s is not set or is not correct. Please check your configuration file for services.%s.liquibase.default-schema, should be %s".formatted(serviceName, serviceName, expectedSchemaName));
        }

        if (liquibaseSchema.isBlank() || liquibaseSchema.equals(expectedSchemaName)) {
            throw new IllegalStateException("Liquibase schema for service (module) %s is not set or is not correct. Please check your configuration file for services.%s.liquibase.liquibase-schema, should be %s".formatted(serviceName, serviceName, expectedSchemaName));
        }

    }

    @Getter
    @Setter
    public static class ServiceConfiguration {
        @JsonProperty("name")
        private String name;
        @JsonProperty("enabled")
        private boolean enabled;
        @JsonProperty("liquibase")
        private LiquibaseProperties liquibase;
    }
}
