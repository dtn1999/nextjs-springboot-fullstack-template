package com.cozy;

import com.cozy.listing.core.model.entity.Amenity;
import com.cozy.listing.core.model.entity.ListingType;
import com.cozy.model.*;
import com.cozy.shared.security.UserInfo;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.RandomStringUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@UtilityClass
public class DummyModels {

    public UserInfo userInfo(String sub) {
        return UserInfo.builder()
                .email("dummy@email.com")
                .name("Dummy User")
                .familyName("Dummy Family")
                .givenName("Dummy Given")
                .sub(sub)
                .nickname("Dummy Nickname")
                .locale("en")
                .picture("https://dummy.com/dummy.jpg")
                .emailVerified(true)
                .build();
    }

    public UserInfo userInfo(String sub, String email) {
        UserInfo userInfo = userInfo(sub);
        userInfo.setEmail(email);
        return userInfo;
    }

    public AccountPatchRequestDto accountPatchRequestDto() {
        return new AccountPatchRequestDto()
                .about(accountPatchAboutDto())
                .address(accountPatchAddressDto())
                .birthDate(accountPatchBirthDateDto())
                .email(accountPatchEmailDto())
                .emergencyContact(accountPatchEmergencyContactDto())
                .governmentId(accountPatchGovernmentIdDto())
                .legalName(accountPatchLegalNameDto())
                .phoneNumber(accountPatchPhoneNumberDto())
                .preferredLanguage(accountPatchPreferredLanguageDto())
                .preferredCurrency(accountPatchPreferredCurrencyDto())
                .preferredTimeZone(accountPatchPreferredTimeZoneDto())
                .profilePictureUrl(accountPatchProfilePictureUrlDto())
                .showPastBookings(accountPatchShowPastBookingsDto());
    }

    public AccountPatchAboutDto accountPatchAboutDto() {
        return new AccountPatchAboutDto()
                .about(UUID.randomUUID().toString());
    }

    public AccountPatchAccountAddressDto accountPatchAddressDto() {
        return new AccountPatchAccountAddressDto()
                .city("Dummy City")
                .country("Dummy Country")
                .state("Dummy State")
                .street("Dummy Street")
                .zipCode("Dummy Zip Code");
    }

    public AccountPatchBirthDateDto accountPatchBirthDateDto() {
        return new AccountPatchBirthDateDto()
                .birthDate(LocalDate.parse("2000-01-01"));
    }

    public AccountPatchEmailDto accountPatchEmailDto() {
        return new AccountPatchEmailDto()
                .email("dummy@email.com");
    }

    public AccountPatchEmergencyContactDto accountPatchEmergencyContactDto() {
        return new AccountPatchEmergencyContactDto()
                .name("Dummy Name")
                .email("dummy@email.com")
                .relationship("Dummy Relationship")
                .preferredLanguage("en")
                .phoneNumber(accountPatchPhoneNumberDto());
    }

    public AccountPatchGovernmentIdDto accountPatchGovernmentIdDto() {
        return new AccountPatchGovernmentIdDto();
    }

    public AccountPatchLegalNameDto accountPatchLegalNameDto() {
        return new AccountPatchLegalNameDto()
                .firstName("Dummy First Name")
                .lastName("Dummy Last Name");
    }

    public AccountPatchPhoneNumberDto accountPatchPhoneNumberDto() {
        return new AccountPatchPhoneNumberDto()
                .number("1234567890")
                .countryCode("1");
    }

    public AccountPatchPreferredLanguageDto accountPatchPreferredLanguageDto() {
        return new AccountPatchPreferredLanguageDto()
                .preferredLanguage("en");
    }

    public AccountPatchPreferredCurrencyDto accountPatchPreferredCurrencyDto() {
        return new AccountPatchPreferredCurrencyDto()
                .preferredCurrency("USD");
    }

    public AccountPatchPreferredTimeZoneDto accountPatchPreferredTimeZoneDto() {
        return new AccountPatchPreferredTimeZoneDto()
                .preferredTimeZone("UTC");
    }

    public AccountPatchProfilePictureUrlDto accountPatchProfilePictureUrlDto() {
        return new AccountPatchProfilePictureUrlDto()
                .profilePictureUrl("https://dummy.com/dummy.jpg");
    }

    public AccountPatchShowPastBookingsDto accountPatchShowPastBookingsDto() {
        return new AccountPatchShowPastBookingsDto()
                .showPastBooking(true);
    }

    public RegisterUserRequestDto registerUserRequestDto() {
        return registerUserRequestDto("dummy@email.com");
    }

    public RegisterUserRequestDto registerUserRequestDto(String email) {
        return new RegisterUserRequestDto()
                .birthDate(LocalDate.parse("2000-01-01"))
                .email(email)
                .firstName("Dummy First Name")
                .lastName("Dummy Last Name")
                .newsletter(true)
                ;
    }

    public List<Amenity> amenities(int number) {
        return IntStream.range(0, number)
                .<Amenity>mapToObj(i -> Amenity.builder()
                        .name("Amenity " + i)
                        .description("Description " + i)
                        .icon("https://example.com/icon-%s.png".formatted(i))
                        .build()
                )
                .toList();
    }

    public List<ListingType> listingTypes() {
        return Stream.of("house", "apartment", "resort")
                .<ListingType>map(name ->
                        ListingType.builder()
                                .name(name)
                                .description("Description " + name)
                                .icon("https://example.com/icon-%s.png".formatted(name))
                                .build()
                )
                .toList();
    }

    public String randomString(int length) {
        return RandomStringUtils.randomAlphabetic(length);
    }

    public ListingPatchTitleDto titleDto(String title) {
        return new ListingPatchTitleDto()
                .title(title);
    }

    public ListingPatchDescriptionDto descriptionDto(String description) {
        return new ListingPatchDescriptionDto()
                .description(description);
    }

    public ListingPatchPriceDto priceDto() {
        return new ListingPatchPriceDto()
                .amount(10L)
                .currency("USD");

    }

    public ListingPatchTypeDto listingTypeDto(Long typeId) {
        return new ListingPatchTypeDto()
                .typeId(typeId);
    }

    public ListingPatchFloorPlanDto floorPlanDto() {
        return new ListingPatchFloorPlanDto()
                .bathroomCount(2L)
                .bedroomCount(3L)
                .bedCount(4L)
                .guestCount(5L);
    }

    public ListingPatchAddressDto addressDto() {
        return new ListingPatchAddressDto()
                .quarter("");
    }

    public ListingPatchLocationDto locationDto() {
        return new ListingPatchLocationDto()
                .lat(10.0)
                .lng(20.0);
    }

    public ListingPatchAmenitiesDto amenitiesDto(List<Long> amenityIds) {
        return new ListingPatchAmenitiesDto()
                .amenities(amenityIds);
    }

    public ListingPatchPhotosDto photosDto(int numbers) {
        List<ListingPatchPhotoDto> photos = IntStream.range(0, numbers)
                .mapToObj(DummyModels::createListingPatchPhoto)
                .toList();
        return new ListingPatchPhotosDto()
                .photos(photos);
    }

    public ListingPatchPhotoDto createListingPatchPhoto(int id) {
        return new ListingPatchPhotoDto()
                .url("https://example.com/photo-%s.png".formatted(id))
                .position(1);

    }
}
