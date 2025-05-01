/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.shared.security;

import io.vavr.control.Try;

public interface IdPUserManagementAdapter {
    /**
     * Get user profile info from Auth0
     *
     * @param userId user access token
     * @return user profile
     */
    Try<UserInfo> getUserInfo(String userId);

    /**
     * Assign the given role to the user.
     *
     * @param userId id of the user
     * @param role   role to assign
     * @return void
     */
    Try<Void> assignRoleToUser(String userId, String role);

}
