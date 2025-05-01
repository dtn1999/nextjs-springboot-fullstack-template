/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.shared.security;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;


@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo {
    private String sub;
    private String givenName;
    private String familyName;
    private String nickname;
    private String name;
    private String picture;
    private String email;
    private boolean emailVerified;
    private String locale;
    @Builder.Default
    private Set<String> roles = new HashSet<>();
    @Builder.Default
    private Set<String> permissions = Set.of();
}
