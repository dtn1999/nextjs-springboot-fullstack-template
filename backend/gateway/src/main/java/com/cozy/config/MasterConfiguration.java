package com.cozy.config;

import com.cozy.account.core.port.in.AccountManagement;
import com.cozy.core.BookingProcessingEventHandler;
import com.cozy.core.ResourceManagementEventHandler;
import com.cozy.core.adapter.AccountService;
import com.cozy.infra.ServicesFacade;
import com.cozy.shared.ServiceConfigurationProperties;
import com.cozy.shared.SystemConfigurationProperties;
import com.cozy.shared.caching.CachingConfiguration;
import com.cozy.shared.messaging.MessageSender;
import liquibase.integration.spring.SpringLiquibase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Slf4j
@EnableAsync
@EnableCaching
@EnableScheduling
@EnableJpaAuditing
@EnableMethodSecurity
@EnableTransactionManagement
@Import({
        SecurityConfiguration.class,
        CachingConfiguration.class,
        MessagingConfiguration.class,
        SchedulingConfiguration.class
})
@EnableConfigurationProperties({
        ServiceConfigurationProperties.class,
        SystemConfigurationProperties.class
})
public class MasterConfiguration {

    @Bean("systemLiquibaseRunner")
    public SpringLiquibase getSpringLiquibase(DataSource dataSource, SystemConfigurationProperties properties) {
        LiquibaseProperties liquibaseProperties = properties.getLiquibase();
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setBeanName("systemLiquibaseRunner");
        liquibase.setChangeLog(liquibaseProperties.getChangeLog());
        liquibase.setDataSource(dataSource);
        liquibase.setLiquibaseSchema(liquibaseProperties.getLiquibaseSchema());
        liquibase.setLiquibaseTablespace(liquibaseProperties.getLiquibaseTablespace());
        liquibase.setDatabaseChangeLogTable(liquibaseProperties.getDatabaseChangeLogTable());
        liquibase.setDatabaseChangeLogLockTable(liquibaseProperties.getDatabaseChangeLogLockTable());
        liquibase.setDropFirst(liquibaseProperties.isDropFirst());
        liquibase.setShouldRun(liquibaseProperties.isEnabled());
        liquibase.setClearCheckSums(liquibaseProperties.isClearChecksums());
        liquibase.setDefaultSchema(liquibaseProperties.getDefaultSchema());
        return liquibase;
    }

    @Bean
    public AccountService accountsService(ServicesFacade servicesFacade, MessageSender messageSender) {
        return new AccountService(servicesFacade, messageSender);
    }

    @Bean
    public ServicesFacade servicesFacade(
            AccountManagement accountService
    ) {
        return new ServicesFacade(accountService);
    }

    @Bean
    public BookingProcessingEventHandler bookingProcessingEventHandler(ServicesFacade servicesFacade, MessageSender messageSender) {
        return new BookingProcessingEventHandler(servicesFacade, messageSender);
    }

    @Bean
    public ResourceManagementEventHandler resourceManagementEventHandler(ServicesFacade servicesFacade, MessageSender messageSender) {
        return new ResourceManagementEventHandler(servicesFacade, messageSender);
    }

    @Bean
    public CustomInMemoryHttpExchangeRepository customInMemoryHttpExchangeRepository() {
        return new CustomInMemoryHttpExchangeRepository();
    }
}
