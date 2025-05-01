/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.account.config;

import com.cozy.account.core.AccountManager;
import com.cozy.account.core.port.in.AccountManagement;
import com.cozy.account.core.port.out.AccountRepository;
import com.cozy.account.core.port.out.ProfileRepository;
import com.cozy.account.infra.AccountRepositoryImpl;
import com.cozy.account.infra.ProfileRepositoryImpl;
import com.cozy.account.infra.jpa.JpaAccountRepository;
import com.cozy.account.infra.jpa.JpaPersonalInformationRepository;
import com.cozy.account.infra.jpa.JpaProfileRepository;
import com.cozy.shared.security.IdPUserManagementAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;

@Import({AccountServiceProperties.class})
class AccountDomainConfiguration {

    @Bean
    @Primary
    public AccountManagement accountManagement(AccountRepository accountRepository,
                                               IdPUserManagementAdapter idpUserManagementAdapter,
                                               ProfileRepository profileRepository,
                                               AccountServiceProperties accountServiceProperties
    ) {
        return new AccountManager(
                accountRepository,
                profileRepository,
                idpUserManagementAdapter,
                accountServiceProperties.getGlobalSettings()
        );
    }

    @Bean
    public AccountRepository accountRepository(JpaAccountRepository accountRepository, JpaPersonalInformationRepository personalInformationRepository) {
        return new AccountRepositoryImpl(accountRepository, personalInformationRepository);
    }

    @Bean
    public ProfileRepository profileRepository(JpaProfileRepository profileRepository) {
        return new ProfileRepositoryImpl(profileRepository);
    }

}
