package com.cozy.infra;

import com.cozy.account.core.port.in.AccountManagement;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public record ServicesFacade(AccountManagement accountService) {

}
