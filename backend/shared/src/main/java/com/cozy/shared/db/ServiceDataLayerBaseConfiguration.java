package com.cozy.shared.db;

import liquibase.integration.spring.SpringLiquibase;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;

import javax.sql.DataSource;

@RequiredArgsConstructor
public abstract class ServiceDataLayerBaseConfiguration {
    private final DataSource dataSource;
    private final LiquibaseProperties liquibaseProperties;

    protected SpringLiquibase getSpringLiquibase(String beanName) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setBeanName(beanName);
        liquibase.setChangeLog(this.liquibaseProperties.getChangeLog());
        liquibase.setDataSource(this.dataSource);
        liquibase.setLiquibaseSchema(this.liquibaseProperties.getLiquibaseSchema());
        liquibase.setLiquibaseTablespace(this.liquibaseProperties.getLiquibaseTablespace());
        liquibase.setDatabaseChangeLogTable(this.liquibaseProperties.getDatabaseChangeLogTable());
        liquibase.setDatabaseChangeLogLockTable(this.liquibaseProperties.getDatabaseChangeLogLockTable());
        liquibase.setDropFirst(this.liquibaseProperties.isDropFirst());
        liquibase.setShouldRun(this.liquibaseProperties.isEnabled());
        liquibase.setClearCheckSums(this.liquibaseProperties.isClearChecksums());
        liquibase.setDefaultSchema(this.liquibaseProperties.getDefaultSchema());
        return liquibase;
    }

}
