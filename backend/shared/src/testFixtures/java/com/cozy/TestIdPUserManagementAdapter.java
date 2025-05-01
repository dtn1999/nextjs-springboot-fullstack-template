package com.cozy;

import com.cozy.shared.security.IdPUserManagementAdapter;
import com.cozy.shared.security.UserInfo;
import io.vavr.control.Try;

public class TestIdPUserManagementAdapter implements IdPUserManagementAdapter {

    @Override
    public Try<UserInfo> getUserInfo(String userId) {
        return Try.success(UserInfo.builder().build());
    }

    @Override
    public Try<Void> assignRoleToUser(String userId, String role) {
        return Try.run(() -> {
        });
    }
}
