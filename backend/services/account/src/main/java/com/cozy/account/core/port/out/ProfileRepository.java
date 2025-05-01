/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

package com.cozy.account.core.port.out;

import com.cozy.account.core.model.entity.Profile;
import io.vavr.control.Try;

import java.util.List;

public interface ProfileRepository {
    Try<Profile> save(Profile profile);

    Try<Profile> findById(Long id);

    Try<List<Profile>> findAll();

}
