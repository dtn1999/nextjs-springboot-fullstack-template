package com.cozy.account.core.port.in;

import com.cozy.account.core.model.entity.Profile;
import com.cozy.account.core.model.payload.internal.field.UpdateProfileRequest;
import io.vavr.control.Try;

import java.util.List;

public interface ProfileManagement {
    Try<Profile> findProfileById(Long profileId);

    Try<Profile> updateProfileById(Long profileId, UpdateProfileRequest request);

    Try<List<Profile>> getAllProfiles();
}
