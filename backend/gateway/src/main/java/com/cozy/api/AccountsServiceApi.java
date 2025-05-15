package com.cozy.api;

import com.cozy.account.core.model.entity.Account;
import com.cozy.account.core.model.entity.PersonalInformation;
import com.cozy.account.core.model.entity.Profile;
import com.cozy.account.core.model.payload.internal.field.*;
import com.cozy.core.adapter.AccountService;
import com.cozy.model.*;
import com.cozy.shared.api.DateMapper;
import com.cozy.shared.security.SecurityContextUtil;
import io.vavr.API;
import io.vavr.control.Try;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AccountsServiceApi implements AccountsApi, ProfilesApi {
    private final AccountService accountService;


    @Override
    public ResponseEntity<AccountDto> register(RegisterUserRequestDto registerUserRequestDto) {
        log.info("Registering new user");
        Try<RegisterUserRequest> registerUserRequest = Try.success(registerUserRequestDto)
                .map(Mapper.INSTANCE::map);
        return API.For(SecurityContextUtil.getAuthenticationToken(), registerUserRequest)
                .yield((token, request) -> this.accountService.register(token.getName(), request))
                .map(Try::get)
                .onSuccess(account -> log.info("Registered new user with id: {}", account.getId()))
                .map(Mapper.INSTANCE::map)
                .map(accountDto -> ResponseEntity.status(HttpStatus.CREATED).body(accountDto))
                .onFailure(e -> log.error("Failed to register user. Reason: {}", e.getMessage()))
                .onFailure(e -> log.debug("", e))
                .get();
    }

    @Override
    public ResponseEntity<AccountDto> whoami() {
        log.info("Fetching authenticated user details.");
        return SecurityContextUtil.getAuthenticationToken()
                .map(token -> this.accountService.me(token.getName()))
                .map(Try::get)
                .onSuccess(account -> log.info("Fetched authenticated user details with id: {}", account.getId()))
                .map(Mapper.INSTANCE::map)
                .map(ResponseEntity::ok)
                .onFailure(e -> log.error("Failed fetch user details. Reason: {}", e.getMessage()))
                .onFailure(e -> log.debug("", e))
                .get();
    }

    @Override
    public ResponseEntity<AccountDto> findAccountById(Long accountId) {
        log.info("Fetching account with id: {}", accountId);
        return this.accountService.findById(accountId)
                .map(Mapper.INSTANCE::map)
                .onSuccess(account -> log.info("Found account with id: {}", account.getId()))
                .map(ResponseEntity::ok)
                .onFailure(e -> log.error("Failed fetch account with ID {}. Reason: {}", accountId, e.getMessage()))
                .onFailure(e -> log.debug("", e))
                .get();
    }

    @Override
    public ResponseEntity<Void> suspendAccount(Long accountId) {
        log.info("Banning account with id: {}", accountId);
        this.accountService.suspendAccount(accountId)
                .onFailure(e -> log.error("Error banning account {}. Reason: {}", accountId, e.getMessage()))
                .onFailure(e -> log.debug("", e))
                .get();
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<EmailUniquenessResponseDto> checkEmailUniqueness(String email) {
        log.info("Checking email uniqueness with id: {}", email);
        return this.accountService.checkEmailUniqueness(email)
                .map(exists -> new EmailUniquenessResponseDto().isUnique(!exists))
                .map(ResponseEntity::ok)
                .onFailure(e -> log.error("Failed check email uniqueness with ID {}. Reason: {}", email, e.getMessage()))
                .onFailure(e -> log.debug("", e))
                .get();
    }

    @Override
    public ResponseEntity<Void> deleteAccount(Long accountId) {
        log.info("Deleting account with id: {}", accountId);
        this.accountService.delete(accountId)
                .get();
        log.info("Deleted account with id: {}", accountId);
        return ResponseEntity.noContent().build();
    }


    @Override
    public ResponseEntity<List<AccountDto>> getAllAccounts() {
        log.info("Fetching all accounts");
        return this.accountService.findAll()
                .onSuccess(accounts -> log.info("Fetched {} accounts", accounts.size()))
                .map(Mapper.INSTANCE::map)
                .map(ResponseEntity::ok)
                .onFailure(e -> log.error("Failed fetch all accounts. Reason: {}", e.getMessage()))
                .onFailure(e -> log.debug("", e))
                .get();
    }

    @Override
    public ResponseEntity<Void> makeUserHost(Long accountId) {
        log.info("Making user host with id: {}", accountId);
        this.accountService.makeUserHost(accountId)
                .onFailure(e -> log.error("Error making user {} host. Reason: {}", accountId, e.getMessage()))
                .onFailure(e -> log.debug("", e))
                .get();
        log.info("Maked user host with id: {}", accountId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> revokeAccount(Long accountId) {
        log.info("Revoking account with id: {}", accountId);
        this.accountService.suspend(accountId)
                .onFailure(e -> log.error("Error revoking account {}. Reason: {}", accountId, e.getMessage()))
                .onFailure(e -> log.debug("", e))
                .get();
        log.info("Revoked account with id: {}", accountId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<AccountDto> updateAccount(Long accountId, AccountPatchRequestDto accountPatchRequestDto) {
        log.info("Patching account with id: {}", accountId);
        return Try.success(accountPatchRequestDto)
                .map(Mapper.INSTANCE::map)
                .flatMap(patchedFields -> this.accountService.patchAccount(accountId, patchedFields))
                .onSuccess(account -> log.info("Account with id {} patched successfully.", accountId))
                .map(Mapper.INSTANCE::map)
                .map(ResponseEntity::ok)
                .onFailure(e -> log.error("Failed patching account with ID {}. Reason: {}", accountId, e.getMessage()))
                .onFailure(e -> log.debug("", e))
                .get();
    }

    @Override
    public ResponseEntity<ProfileDto> findProfileById(Long profileId) {
        log.info("Fetching profile with id: {}", profileId);
        return this.accountService.findProfileById(profileId)
                .onSuccess(profile -> log.info("Found profile with id: {}", profileId))
                .map(Mapper.INSTANCE::map)
                .map(ResponseEntity::ok)
                .onFailure(e -> log.error("Failed fetch profile with ID {}. Reason: {}", profileId, e.getMessage()))
                .onFailure(e -> log.debug("", e))
                .get();
    }

    @Override
    public ResponseEntity<List<ProfileDto>> getAllProfiles() {
        log.info("Fetching all profiles");
        return this.accountService.getAllProfiles()
                .onSuccess(profiles -> log.info("Fetched {} profiles", profiles.size()))
                .map(Mapper.INSTANCE::mapProfiles)
                .map(ResponseEntity::ok)
                .onFailure(e -> log.error("Failed fetch all profiles. Reason: {}", e.getMessage()))
                .onFailure(e -> log.debug("", e))
                .get();
    }

    @org.mapstruct.Mapper(unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE, uses = {DateMapper.class})
    public interface Mapper {
        Mapper INSTANCE = Mappers.getMapper(Mapper.class);

        IdentityVerificationResponseDto mapToIdentityVerificationResponseDto(PersonalInformation.GovernmentId response);

        PersonalInformation.GovernmentIdStatus map(GovernmentIdStatusEnumDto status);

        RegisterUserRequest map(RegisterUserRequestDto registerUserRequestDto);

        AccountDto map(Account account);

        @Mapping(target = "profile", source = "profile")
        @Mapping(target = "legalName", source = "personalInformation.legalName")
        AccountProjectionDto mapProjection(Account account);

        LegalNameDto map(PersonalInformation.LegalName legalName);

        List<AccountDto> map(List<Account> accounts);

        PersonalInformationDto map(PersonalInformation personalInformation);

        ProfileDto map(Profile profile);

        List<ProfileDto> mapProfiles(List<Profile> profile);

        default List<AccountField> map(AccountPatchRequestDto patchRequest) {
            List<AccountField> patchedFields = new ArrayList<>();
            Optional.ofNullable(patchRequest.getAbout())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            Optional.ofNullable(patchRequest.getAddress())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            Optional.ofNullable(patchRequest.getBirthDate())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            Optional.ofNullable(patchRequest.getEmail())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            Optional.ofNullable(patchRequest.getEmergencyContact())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            Optional.ofNullable(patchRequest.getGovernmentId())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            Optional.ofNullable(patchRequest.getLegalName())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            Optional.ofNullable(patchRequest.getPhoneNumber())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            Optional.ofNullable(patchRequest.getPreferredLanguage())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            Optional.ofNullable(patchRequest.getPreferredTimeZone())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            Optional.ofNullable(patchRequest.getPreferredCurrency())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            Optional.ofNullable(patchRequest.getProfilePictureUrl())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            Optional.ofNullable(patchRequest.getShowPastBookings())
                    .map(this::map)
                    .ifPresent(patchedFields::add);
            return patchedFields;
        }

        AboutField map(AccountPatchAboutDto aboutDto);

        AddressField map(AccountPatchAccountAddressDto addressDto);

        BirthDateField map(AccountPatchBirthDateDto birthDateDto);

        EmailField map(AccountPatchEmailDto emailDto);

        EmergencyContactField map(AccountPatchEmergencyContactDto emergencyContactDto);

        GovernmentIdField map(AccountPatchGovernmentIdDto governmentIdDto);

        LegalNameField map(AccountPatchLegalNameDto legalNameDto);

        PhoneNumberField map(AccountPatchPhoneNumberDto phoneNumberDto);

        PreferredCurrencyField map(AccountPatchPreferredCurrencyDto preferredCurrencyDto);

        PreferredLanguageField map(AccountPatchPreferredLanguageDto preferredLanguageDto);

        PreferredTimeZoneField map(AccountPatchPreferredTimeZoneDto preferredTimezoneDto);

        ProfilePictureUrlField map(AccountPatchProfilePictureUrlDto profilePictureDto);

        ShowPastBookingField map(AccountPatchShowPastBookingsDto showPastBookingDto);

    }
}
