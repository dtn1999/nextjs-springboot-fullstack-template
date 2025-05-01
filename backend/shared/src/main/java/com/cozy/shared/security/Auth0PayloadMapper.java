/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.shared.security;

import com.auth0.json.mgmt.users.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface Auth0PayloadMapper {
    Auth0PayloadMapper INSTANCE = Mappers.getMapper(Auth0PayloadMapper.class);

    default UserInfo map(User user) {
        return UserInfo.builder()
                .sub(user.getId())
                .givenName(user.getGivenName())
                .familyName(user.getFamilyName())
                .nickname(user.getNickname())
                .name(user.getName())
                .picture(user.getPicture())
                .email(user.getEmail())
                .emailVerified(user.isEmailVerified())
                .build();
    }
}
