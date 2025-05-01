package com.cozy.api;

import com.cozy.BaseApiTest;
import com.cozy.DummyModels;
import com.cozy.ServiceModuleTest;
import com.cozy.account.core.model.entity.Account;
import com.cozy.account.core.model.entity.AccountStatus;
import com.cozy.account.infra.jpa.JpaAccountRepository;
import com.cozy.model.*;
import com.cozy.shared.security.IdPUserManagementAdapter;
import com.cozy.shared.security.IdentityProviderException;
import com.cozy.shared.security.UserInfo;
import com.fasterxml.jackson.core.type.TypeReference;
import io.vavr.control.Try;
import lombok.SneakyThrows;
import org.hamcrest.text.IsEqualIgnoringCase;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@Disabled
@ServiceModuleTest
class AccountServiceApiTest extends BaseApiTest {

    @Autowired
    JpaAccountRepository accountRepository;

    @MockBean
    IdPUserManagementAdapter idpUserManagementAdapter;

    @AfterEach
    void tearDown() {
        dbResetService.reset(
                "account_service.account",
                "account_service.profile",
                "account_service.personal_information"
        );
    }

    @SneakyThrows
    @Test
    void test_register_new_account_with_40x_responses() {
        // unauthorized
        RegisterUserRequestDto requestDto = DummyModels.registerUserRequestDto();
        create_resource_without_authentication("/accounts/register");

        when(this.idpUserManagementAdapter.getUserInfo(USER_AUTH0_ID))
                .thenThrow(IdentityProviderException.class);

        // internal server error
        create_resource_with_authentication("/accounts/register", requestDto, HttpStatus.INTERNAL_SERVER_ERROR)
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE))
                .andExpect(jsonPath("$.status").value(HttpStatus.INTERNAL_SERVER_ERROR.value()))
                .andExpect(jsonPath("$.title").value(IdentityProviderException.class.getSimpleName()))
        ;

        // times
        verify(this.idpUserManagementAdapter, times(1)).getUserInfo(USER_AUTH0_ID);
    }

    @Test
    @SneakyThrows
    void test_register_new_account_with_20x_responses() {
        // given
        RegisterUserRequestDto requestDto = DummyModels.registerUserRequestDto();

        // dummy user info
        when(this.idpUserManagementAdapter.getUserInfo(anyString()))
                .thenReturn(Try.success(DummyModels.userInfo(USER_AUTH0_ID)));

        when(this.idpUserManagementAdapter.assignRoleToUser(USER_AUTH0_ID, Account.Role.GUEST.getName()))
                .thenReturn(Try.run(() -> {
                }));

        // when
        create_resource_with_authentication("/accounts/register", requestDto, HttpStatus.CREATED)
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.settings").exists())
                .andExpect(jsonPath("$.profile").exists())
                .andExpect(jsonPath("$.personalInformation").exists())
                .andExpect(jsonPath("$.role").value(new IsEqualIgnoringCase(Account.Role.GUEST.getName())));

        // verify
        verify(this.idpUserManagementAdapter, times(1)).getUserInfo(USER_AUTH0_ID);
    }

    @SneakyThrows
    @Test
    void test_patch_account_with_40x_responses() {
        // given
        AccountDto accountDto = setupAccount();
        String uri = "/accounts/%s".formatted(accountDto.getId());
        String notFoundUri = "/accounts/%s".formatted(-1 * accountDto.getId());
        RegisterUserRequestDto requestDto = DummyModels.registerUserRequestDto();

        // unauthorized
        patch_resource_without_authentication(uri, new AccountPatchRequestDto());

        // not found
        patch_resource_with_role(notFoundUri, new AccountPatchRequestDto(), "ROLE_TENANT", HttpStatus.NOT_FOUND);

        // forbidden (register a new user and try to update someone else's account)
        when(this.idpUserManagementAdapter.getUserInfo("yet-registered-user-1-token"))
                .thenReturn(Try.success(DummyModels.userInfo("yet-registered-user-1")));

        when(this.idpUserManagementAdapter.assignRoleToUser("yet-registered-user-1", Account.Role.GUEST.getName()))
                .thenReturn(Try.run(() -> {
                }));

        ResultActions response = create_resource_with_authentication("/accounts/register", requestDto, HttpStatus.CREATED);
        AccountDto accountDto2 = parseResponse(response, AccountDto.class);
        String uriAccount2 = "/accounts/%s".formatted(accountDto2.getId());

        mockMvc
                .perform(
                        patch(uriAccount2)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(new AccountPatchRequestDto()))
                                .with(jwt().jwt(b ->
                                        b.subject("yet-registered-user-1")
                                                .tokenValue("yet-registered-user-1-token")
                                ))
                )
                .andExpect(status().is(HttpStatus.FORBIDDEN.value()));
    }

    @SneakyThrows
    @ParameterizedTest(name = "{0}")
    @MethodSource("badRequestPayloads")
    void test_patch_account_with_400_responses(AccountPatchRequestDto request) {
        // given
        AccountDto accountDto = setupAccount();
        String uri = "/accounts/%s".formatted(accountDto.getId());

        // when
        patch_resource_with_role(uri, request, "TENANT", HttpStatus.BAD_REQUEST)
                .andExpect(jsonPath("$.status").value(HttpStatus.BAD_REQUEST.value()));

    }

    @Test
    void test_patch_account_with_20x_responses() {
        // given
        AccountDto accountDto = setupAccount();
        String uri = "/accounts/%s".formatted(accountDto.getId());
        AccountPatchRequestDto requestDto = new AccountPatchRequestDto();
        AccountDto response;
        // when
        requestDto.setAbout(DummyModels.accountPatchAboutDto());
        response = patch_resource_with_role(uri, requestDto, "TENANT", HttpStatus.OK, AccountDto.class);

        assertThat(response).isNotNull();
        assertAbout(response.getProfile().getAbout(), requestDto.getAbout().getAbout());

        requestDto.address(DummyModels.accountPatchAddressDto());
        response = patch_resource_with_role(uri, requestDto, "TENANT", HttpStatus.OK, AccountDto.class);

        assertThat(response).isNotNull();
        assertAccountAddress(response.getPersonalInformation().getAddress(), requestDto.getAddress());

        requestDto.setBirthDate(DummyModels.accountPatchBirthDateDto());
        response = patch_resource_with_role(uri, requestDto, "TENANT", HttpStatus.OK, AccountDto.class);

        assertThat(response).isNotNull();
        assertBirthDate(response.getProfile().getBirthDate(), requestDto.getBirthDate().getBirthDate());

        requestDto.setEmail(DummyModels.accountPatchEmailDto());
        response = patch_resource_with_role(uri, requestDto, "TENANT", HttpStatus.OK, AccountDto.class);

        assertThat(response).isNotNull();
        assertEmail(response.getPersonalInformation().getEmail(), requestDto.getEmail().getEmail());

        requestDto.setEmergencyContact(DummyModels.accountPatchEmergencyContactDto());
        response = patch_resource_with_role(uri, requestDto, "TENANT", HttpStatus.OK, AccountDto.class);

        assertThat(response).isNotNull();
        assertEmergencyContact(response.getPersonalInformation().getEmergencyContact(), requestDto.getEmergencyContact());

        requestDto.setGovernmentId(DummyModels.accountPatchGovernmentIdDto());
        response = patch_resource_with_role(uri, requestDto, "TENANT", HttpStatus.OK, AccountDto.class);

        assertThat(response).isNotNull();
        assertGovernmentId(response.getPersonalInformation().getGovernmentId(), requestDto.getGovernmentId());

        requestDto.setPreferredCurrency(DummyModels.accountPatchPreferredCurrencyDto());
        response = patch_resource_with_role(uri, requestDto, "TENANT", HttpStatus.OK, AccountDto.class);

        assertThat(response).isNotNull();
        assertPreferredCurrency(response.getSettings().getGlobal().getDefaultCurrency(), requestDto.getPreferredCurrency());

        requestDto.setPreferredLanguage(DummyModels.accountPatchPreferredLanguageDto());
        response = patch_resource_with_role(uri, requestDto, "TENANT", HttpStatus.OK, AccountDto.class);

        assertThat(response).isNotNull();
        assertPreferredLanguage(response.getSettings().getGlobal().getDefaultLanguage(), requestDto.getPreferredLanguage());

        requestDto.setPreferredTimeZone(DummyModels.accountPatchPreferredTimeZoneDto());
        response = patch_resource_with_role(uri, requestDto, "TENANT", HttpStatus.OK, AccountDto.class);

        assertThat(response).isNotNull();
        assertPreferredTimeZone(response.getSettings().getGlobal().getDefaultTimeZone(), requestDto.getPreferredTimeZone());

        requestDto.setProfilePictureUrl(DummyModels.accountPatchProfilePictureUrlDto());
        response = patch_resource_with_role(uri, requestDto, "TENANT", HttpStatus.OK, AccountDto.class);

        assertThat(response).isNotNull();
        assertProfilePictureUrl(response.getProfile().getProfilePictureUrl(), requestDto.getProfilePictureUrl().getProfilePictureUrl());

        requestDto.setShowPastBookings(DummyModels.accountPatchShowPastBookingsDto());
        response = patch_resource_with_role(uri, requestDto, "TENANT", HttpStatus.OK, AccountDto.class);

        assertThat(response).isNotNull();
        assertShowPastBookings(response.getProfile().getShowPreviousBookings(), requestDto.getShowPastBookings().getShowPastBooking());
    }

    @Test
    void test_delete_account_with_40x_responses() {
        // given
        AccountDto accountDto = setupAccount();
        String uri = "/accounts/%s/delete".formatted(accountDto.getId());
        String notFoundUri = "/accounts/%s/delete".formatted(-1 * accountDto.getId());

        // unauthorized
        delete_resource_without_authentication(uri);

        // forbidden
        delete_resource_with_role(uri, "ROLE_TENANT", HttpStatus.FORBIDDEN);

        // forbidden
        delete_resource_with_role(uri, "ROLE_HOST", HttpStatus.FORBIDDEN);

        // not found
        delete_resource_with_role(notFoundUri, "ROLE_ADMIN", HttpStatus.NOT_FOUND);
    }

    @Test
    void test_delete_account_with_20x_responses() {
        // given
        AccountDto accountDto = createCompleteAccount();
        String uri = "/accounts/%s/delete".formatted(accountDto.getId());

        // when
        delete_resource_with_role(uri, "ROLE_ADMIN", HttpStatus.NO_CONTENT);

        Optional<Account> optionalAccount = this.accountRepository.findById(accountDto.getId());
        assertThat(optionalAccount).isPresent();
        assertThat(optionalAccount.get().isDeleted()).isTrue();
    }

    @Test
    void test_find_account_by_id_with_40x_responses() {
        // given
        AccountDto accountDto = setupAccount();
        String uri = "/accounts/%s".formatted(accountDto.getId());
        String notFoundUri = "/accounts/%s".formatted(-1 * accountDto.getId());

        // unauthorized
        read_resource_without_authentication(uri);

        // not found
        read_resource_with_role(notFoundUri, "ROLE_TENANT", HttpStatus.NOT_FOUND);
    }

    @Test
    void test_find_account_by_id_with_20x_responses() {
        // given
        AccountDto accountDto = createCompleteAccount();
        String uri = "/accounts/%s".formatted(accountDto.getId());

        // when
        AccountDto response = read_resource_with_role(uri, "ROLE_TENANT", HttpStatus.OK, AccountDto.class);

        // then
        Optional<Account> optionalAccount = this.accountRepository.findById(accountDto.getId());
        assertThat(optionalAccount).isPresent();

//        assertThat(response)
//                .isNotNull()
//                .isEqualTo(AccountRestController.Mapper.INSTANCE.map(optionalAccount.get()));
    }

    @Test
    void test_get_all_accounts_with_40x_responses() {
        // unauthorized
        read_resource_without_authentication("/accounts");

        // forbidden
        read_resource_with_role("/accounts", "ROLE_TENANT", HttpStatus.FORBIDDEN);

        // forbidden
        read_resource_with_role("/accounts", "ROLE_HOST", HttpStatus.FORBIDDEN);
    }

    @SneakyThrows
    @Test
    void test_get_all_accounts_with_20x_responses() {
        // 1
        createCompleteAccount();
        RegisterUserRequestDto requestDto2 = DummyModels.registerUserRequestDto("dummy2@email.com");
        RegisterUserRequestDto requestDto3 = DummyModels.registerUserRequestDto("dummy3@email.com");

        // 2
        when(this.idpUserManagementAdapter.getUserInfo("yet-registered-user-1-token"))
                .thenReturn(Try.success(DummyModels.userInfo("yet-registered-user-1", "user2@email.com")));

        when(this.idpUserManagementAdapter.assignRoleToUser("yet-registered-user-1", Account.Role.GUEST.getName()))
                .thenReturn(Try.run(() -> {
                }));

        mockMvc
                .perform(
                        post("/accounts/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestDto2))
                                .with(jwt().jwt(b ->
                                        b.subject("yet-registered-user-1")
                                                .tokenValue("yet-registered-user-1-token")
                                ))
                )
                .andExpect(status().is(HttpStatus.CREATED.value()));

        // 3
        when(this.idpUserManagementAdapter.getUserInfo("yet-registered-user-2-token"))
                .thenReturn(Try.success(DummyModels.userInfo("yet-registered-user-2", "user3@email.com")));
        when(this.idpUserManagementAdapter.assignRoleToUser("yet-registered-user-2", Account.Role.GUEST.getName()))
                .thenReturn(Try.run(() -> {
                }));

        mockMvc
                .perform(
                        post("/accounts/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestDto3))
                                .with(jwt().jwt(b ->
                                        b.subject("yet-registered-user-2")
                                                .tokenValue("yet-registered-user-2-token")
                                ))
                )
                .andExpect(status().is(HttpStatus.CREATED.value()));

        List<AccountDto> response = read_resource_with_role("/accounts", "ROLE_ADMIN", HttpStatus.OK, new TypeReference<List<AccountDto>>() {
        });

        assertThat(response)
                .hasSize(3);
    }

    @Test
    void test_make_user_host_with_40x_responses() {
        // given
        AccountDto accountDto = setupAccount();
        String uri = "/accounts/%s/become-host".formatted(accountDto.getId());
        String notFoundUri = "/accounts/%s/become-host".formatted(-1 * accountDto.getId());

        // unauthorized
        update_resource_without_authentication(uri);

        // not found
        update_resource_with_authentication(notFoundUri, HttpStatus.NOT_FOUND);
    }

    @Test
    void test_make_host_with_20x_responses() {
        // given
        AccountDto accountDto = createCompleteAccount();
        String uri = "/accounts/%s/become-host".formatted(accountDto.getId());

        when(this.idpUserManagementAdapter.assignRoleToUser(USER_AUTH0_ID, Account.Role.HOST.getName()))
                .thenReturn(Try.run(() -> {
                }));

        // when
        update_resource_with_role(uri, "ROLE_ADMIN", HttpStatus.NO_CONTENT);

        // then
        Optional<Account> optionalAccount = this.accountRepository.findById(accountDto.getId());
        assertThat(optionalAccount).isPresent();
        assertThat(optionalAccount.get().getRole()).isEqualTo(Account.Role.HOST);
    }

    @SneakyThrows
    @Test
    void test_whoami_with_40x_responses() {
        String uri = "/accounts/whoami";
        // unauthorized
        read_resource_without_authentication(uri);

        //
        mockMvc
                .perform(
                        get(uri)
                                .with(jwt().jwt(b ->
                                        b.subject("not-registered-user")
                                                .tokenValue("not-registered-user-token")
                                ))
                )
                .andExpect(status().is(HttpStatus.NOT_FOUND.value()));

        // exist but deleted
        AccountDto accountDto = createCompleteAccount();
        String uriDelete = "/accounts/%s/delete".formatted(accountDto.getId());

        // when
        delete_resource_with_role(uriDelete, "ROLE_ADMIN", HttpStatus.NO_CONTENT);

        // then
        read_resource_with_role(uri, "ROLE_TENANT", HttpStatus.NOT_FOUND);
    }

    @Test
    void test_whoami_with_20x_responses() {
        // given
        AccountDto accountDto = createCompleteAccount();
        String uri = "/accounts/whoami";

        // when
        AccountDto response = read_resource_with_role(uri, "ROLE_TENANT", HttpStatus.OK, AccountDto.class);

        Optional<Account> optionalAccount = this.accountRepository.findById(accountDto.getId());
        assertThat(optionalAccount).isPresent();

//        // then
//        assertThat(response)
//                .isNotNull()
//                .isEqualTo(AccountRestController.Mapper.INSTANCE.map(optionalAccount.get()));
    }

    @Test
    void test_revoke_account_with_40x_responses() {
        // given
        AccountDto accountDto = setupAccount();
        String uri = "/accounts/%s/revoke".formatted(accountDto.getId());
        String notFoundUri = "/accounts/%s/revoke".formatted(-1 * accountDto.getId());

        // unauthorized
        update_resource_without_authentication(uri);

        // forbidden
        update_resource_with_role(uri, "ROLE_TENANT", HttpStatus.FORBIDDEN);

        // forbidden
        update_resource_with_role(uri, "ROLE_HOST", HttpStatus.FORBIDDEN);

        // not found
        update_resource_with_role(notFoundUri, "ROLE_ADMIN", HttpStatus.NOT_FOUND);
    }

    @Test
    void test_revoke_account_with_20x_responses() {
        // given
        AccountDto accountDto = createCompleteAccount();
        String uri = "/accounts/%s/revoke".formatted(accountDto.getId());

        // when
        update_resource_with_role(uri, "ROLE_ADMIN", HttpStatus.NO_CONTENT);

        // then
        Optional<Account> optionalAccount = this.accountRepository.findById(accountDto.getId());
        assertThat(optionalAccount).isPresent();
        assertThat(optionalAccount.get().getStatus()).isEqualTo(AccountStatus.SUSPENDED);
    }

    private AccountDto createCompleteAccount() {
        // given
        AccountDto accountDto = setupAccount();
        String uri = "/accounts/%s".formatted(accountDto.getId());
        AccountPatchRequestDto requestDto = DummyModels.accountPatchRequestDto();

        return patch_resource_with_role(uri, requestDto, "TENANT", HttpStatus.OK, AccountDto.class);
    }

    @SneakyThrows
    private AccountDto setupAccount() {
        Try<UserInfo> success = Try.success(DummyModels.userInfo(USER_AUTH0_ID));
        RegisterUserRequestDto requestDto = DummyModels.registerUserRequestDto();
        when(this.idpUserManagementAdapter.getUserInfo(anyString()))
                .thenReturn(success);

        when(this.idpUserManagementAdapter.assignRoleToUser(USER_AUTH0_ID, Account.Role.GUEST.getName()))
                .thenReturn(Try.run(() -> {
                }));

        return create_resource_with_authentication("/accounts/register", requestDto, HttpStatus.CREATED, AccountDto.class);
    }


    private void assertPreferredTimeZone(String defaultTimeZone, AccountPatchPreferredTimeZoneDto preferredTimeZone) {
        assertThat(defaultTimeZone).isEqualTo(preferredTimeZone.getPreferredTimeZone());
    }

    private void assertShowPastBookings(Boolean showPreviousBookings, Boolean showPastBooking) {
        assertThat(showPreviousBookings).isEqualTo(showPastBooking);
    }

    private void assertProfilePictureUrl(String profilePictureUrlA, String profilePictureUrlB) {
        assertThat(profilePictureUrlA).isEqualTo(profilePictureUrlB);
    }

    private void assertPreferredLanguage(String defaultLanguage, AccountPatchPreferredLanguageDto preferredLanguage) {
        assertThat(defaultLanguage).isEqualTo(preferredLanguage.getPreferredLanguage());
    }

    private void assertPreferredCurrency(String defaultCurrency, AccountPatchPreferredCurrencyDto preferredCurrency) {
        assertThat(defaultCurrency).isEqualTo(preferredCurrency.getPreferredCurrency());
    }

    private void assertGovernmentId(GovernmentIdDto governmentIdA, AccountPatchGovernmentIdDto governmentIdB) {
    }

    private void assertEmergencyContact(EmergencyContactDto emergencyContactA, AccountPatchEmergencyContactDto emergencyContactB) {
        assertThat(emergencyContactA.getName()).isEqualTo(emergencyContactB.getName());
        assertThat(emergencyContactA.getPhoneNumber().getCountryCode()).isEqualTo(emergencyContactB.getPhoneNumber().getCountryCode());
        assertThat(emergencyContactA.getPhoneNumber().getNumber()).isEqualTo(emergencyContactB.getPhoneNumber().getNumber());
        assertThat(emergencyContactA.getPreferredLanguage()).isEqualTo(emergencyContactB.getPreferredLanguage());
        assertThat(emergencyContactA.getEmail()).isEqualTo(emergencyContactB.getEmail());
    }

    private void assertEmail(String emailA, String emailB) {
        assertThat(emailA).isEqualTo(emailB);
    }

    private void assertBirthDate(LocalDate birthDateA, LocalDate birthDateB) {
        assertThat(birthDateA).isEqualTo(birthDateB);
    }

    private void assertAccountAddress(AccountAddressDto addressA, AccountPatchAccountAddressDto addressB) {
        assertThat(addressA.getCity()).isEqualTo(addressB.getCity());
        assertThat(addressA.getCountry()).isEqualTo(addressB.getCountry());
        assertThat(addressA.getState()).isEqualTo(addressB.getState());
        assertThat(addressA.getStreet()).isEqualTo(addressB.getStreet());
    }

    private void assertAbout(String aboutA, String aboutB) {
        assertThat(aboutA).isEqualTo(aboutB);
    }


    static Stream<Arguments> badRequestPayloads() {
        return Stream.of(
                Arguments.of(new AccountPatchRequestDto().about(new AccountPatchAboutDto())),
                Arguments.of(new AccountPatchRequestDto().about(new AccountPatchAboutDto().about(" "))),
                Arguments.of(new AccountPatchRequestDto().address(new AccountPatchAccountAddressDto())),
                Arguments.of(new AccountPatchRequestDto().address(new AccountPatchAccountAddressDto().city("city"))),
                Arguments.of(new AccountPatchRequestDto().address(new AccountPatchAccountAddressDto().country("country"))),
                Arguments.of(new AccountPatchRequestDto().address(new AccountPatchAccountAddressDto().state("state"))),
                Arguments.of(new AccountPatchRequestDto().address(new AccountPatchAccountAddressDto().street("street"))),
                Arguments.of(new AccountPatchRequestDto().birthDate(new AccountPatchBirthDateDto())),
                Arguments.of(new AccountPatchRequestDto().birthDate(new AccountPatchBirthDateDto().birthDate(null))),
                Arguments.of(new AccountPatchRequestDto().email(new AccountPatchEmailDto())),
                Arguments.of(new AccountPatchRequestDto().email(new AccountPatchEmailDto().email(" "))),
                Arguments.of(new AccountPatchRequestDto().email(new AccountPatchEmailDto().email("email"))),
                Arguments.of(new AccountPatchRequestDto().emergencyContact(new AccountPatchEmergencyContactDto())),
                Arguments.of(new AccountPatchRequestDto().emergencyContact(new AccountPatchEmergencyContactDto().name("name"))),
                Arguments.of(new AccountPatchRequestDto().emergencyContact(new AccountPatchEmergencyContactDto().phoneNumber(new AccountPatchPhoneNumberDto()))),
                Arguments.of(new AccountPatchRequestDto().emergencyContact(new AccountPatchEmergencyContactDto().phoneNumber(new AccountPatchPhoneNumberDto().number(" ")))),
                Arguments.of(new AccountPatchRequestDto().governmentId(new AccountPatchGovernmentIdDto())),
                Arguments.of(new AccountPatchRequestDto().preferredCurrency(new AccountPatchPreferredCurrencyDto())),
                Arguments.of(new AccountPatchRequestDto().preferredLanguage(new AccountPatchPreferredLanguageDto())),
                Arguments.of(new AccountPatchRequestDto().preferredTimeZone(new AccountPatchPreferredTimeZoneDto())),
                Arguments.of(new AccountPatchRequestDto().profilePictureUrl(new AccountPatchProfilePictureUrlDto())),
                Arguments.of(new AccountPatchRequestDto().showPastBookings(new AccountPatchShowPastBookingsDto()))
        );
    }


}
