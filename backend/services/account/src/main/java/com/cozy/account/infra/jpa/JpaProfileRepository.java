/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.account.infra.jpa;

import com.cozy.account.core.model.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaProfileRepository extends JpaRepository<Profile, Long> {
}
