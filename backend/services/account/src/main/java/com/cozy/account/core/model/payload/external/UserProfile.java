/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.account.core.model.payload.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile {
    private Long profileId;
    private String givenName;
    private String familyName;
    private String nickname;
    private String name;
    private String picture;
    private String email;
    private boolean emailVerified;
    private boolean hasUnreadNotifications;
    private boolean hasUnreadMessages;
}
