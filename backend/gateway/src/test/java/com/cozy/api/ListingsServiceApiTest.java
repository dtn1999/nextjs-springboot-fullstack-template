package com.cozy.api;

import com.cozy.BaseApiTest;
import com.cozy.DummyModels;
import com.cozy.ServiceModuleTest;
import com.cozy.listing.core.model.entity.Listing;
import com.cozy.listing.core.model.entity.ListingState;
import com.cozy.listing.core.model.entity.ListingType;
import com.cozy.listing.infra.db.jpa.JpaAmenityRepository;
import com.cozy.listing.infra.db.jpa.JpaListingRepository;
import com.cozy.listing.infra.db.jpa.JpaListingTypeRepository;
import com.cozy.model.*;
import com.cozy.shared.db.BaseEntity;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.SneakyThrows;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@Disabled
@ServiceModuleTest
class ListingsServiceApiTest extends BaseApiTest {

    @Autowired
    JpaListingRepository listingRepository;

    @Autowired
    JpaListingTypeRepository listingTypeRepository;

    @Autowired
    JpaAmenityRepository amenityRepository;

//    @MockBean
//    AccountServiceFacade accountServiceFacade;

    @AfterEach
    void tearDown() {
        dbResetService.reset(
                "listing_service.listing",
                "listing_service.listing_type",
                "listing_service.amenity",
                "listing_service.listing_photo"
        );
    }

    @Test
    void test_setup_listing_for_account_with_id_with_40x_responses() {
        // Given
        String nonExistingAccountId = "1";

        String nonOwnerAccountId = "2";

        String accountIdCausingUnexpectedError = "3";

        // When
//        when(this.accountServiceFacade.isUserAllowedToCreateListing(nonExistingAccountId))
//                .thenReturn(Try.failure(new EntityNotFoundException("Account not found")));
//
//        when(this.accountServiceFacade.isUserAllowedToCreateListing(nonOwnerAccountId))
//                .thenReturn(Try.success(false));
//
//        when(this.accountServiceFacade.isUserAllowedToCreateListing(accountIdCausingUnexpectedError))
//                .thenReturn(Try.failure(new RuntimeException("Unexpected error")));

        // unauthenticated
        create_resource_without_authentication("/listings/owners/%s".formatted(nonExistingAccountId));

        // authenticated but no owner found
        create_resource_with_role("/listings/owners/%s".formatted(nonExistingAccountId), "ROLE_OWNER", HttpStatus.NOT_FOUND);

        // authenticated with an owner role
        create_resource_with_role("/listings/owners/%s".formatted(nonOwnerAccountId), "ROLE_TENANT", HttpStatus.FORBIDDEN);

        // authenticated with an owner role
        create_resource_with_role("/listings/owners/%s".formatted(accountIdCausingUnexpectedError), "ROLE_OWNER", HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @Test
    void test_setup_listing_for_account_with_id_with_20x_responses() {
        // Given
        String accountId = "1";
        // When
//        when(this.accountServiceFacade.isUserAllowedToCreateListing(accountId))
//                .thenReturn(Try.success(true));
//
        // authenticated with an owner role
        ListingDto result = create_resource_with_role("/listings/owners/%s".formatted(accountId), "ROLE_OWNER", HttpStatus.CREATED, new TypeReference<ListingDto>() {
        });

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isNotNull();
        assertThat(result.getOwnerId()).hasToString(accountId);
        assertThat(result.getState()).isEqualTo(ListingStateDto.DRAFT);

        Optional<Listing> optionalListing = this.listingRepository.findById(result.getId());
        assertThat(optionalListing).isPresent();
        Listing listing = optionalListing.get();
        assertThat(listing.getId()).isEqualTo(result.getId());
        assertThat(listing.getOwnerId()).isEqualTo(result.getOwnerId());
        assertThat(listing.getState()).isEqualTo(ListingState.DRAFT);
        assertThat(listing.getCalendars()).hasSize(1);
        assertThat(listing.getConnectedCalendars()).isEmpty();
    }


    @Test
    void test_patch_listing_by_id_with_40x_responses() {
        /* ==============================================
         * 1. Setup a listing
         * ==============================================*/
        ListingDto result = setupListing("1");
        String requestUri = "/listings/%s".formatted(result.getId());

        // Bad Title
        patching_listing_with_bad_title(requestUri);

        // Bad Description
        patching_listing_with_bad_description(requestUri);

        // Bad FloorPlan
        patching_listing_with_bad_floor_plan(requestUri);

        // Bad Price
        patching_listing_with_bad_price(requestUri);

        // Bad Address
        patching_listing_with_bad_address(requestUri);

        // Location
        patching_listing_with_bad_location(requestUri);

        // Type
        patching_listing_with_non_existing_listing_type(requestUri);

        // Amenities
        patching_listing_with_non_existing_amenity(requestUri);

        // Photos
        patching_listing_with_bad_photos(requestUri);

    }

    @Test
    void test_patch_listing_by_id_with_20x_responses() {
        /* ==============================================
         * 1. Setup a listing
         * ==============================================*/
        ListingDto result = setupListing("1");

        String requestUri = "/listings/%s".formatted(result.getId());

        ListingPatchRequestDto body = new ListingPatchRequestDto();
        // Good Title
        ListingPatchTitleDto titleDto = DummyModels.titleDto("Good Title");
        body.setTitle(titleDto);
        result = patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.OK, ListingDto.class);
        assertThat(result).isNotNull();

        // Good Description
        ListingPatchDescriptionDto descriptionDto = DummyModels.descriptionDto("Good Description");
        body.setDescription(descriptionDto);
        result = patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.OK, ListingDto.class);

        assertThat(result).isNotNull();
        assertThat(result.getDescription()).isEqualTo(descriptionDto.getDescription());

        // Good FloorPlan
        ListingPatchFloorPlanDto floorPlanDto = DummyModels.floorPlanDto();
        body.setFloorPlan(floorPlanDto);
        result = patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.OK, ListingDto.class);

        assertFloorPlan(result, floorPlanDto);

        // Good Price
        ListingPatchPriceDto priceDto = DummyModels.priceDto();
        body.setPrice(priceDto);
        result = patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.OK, ListingDto.class);

        assertThat(result).isNotNull();
        assertThat(result.getPrice()).isEqualTo(priceDto.getAmount());
//        assertThat(result.getCurrency()).isEqualTo(priceDto.getCurrency());

        // Good Address
        ListingPatchAddressDto addressDto = DummyModels.addressDto();
        body.setAddress(addressDto);
        result = patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.OK, ListingDto.class);

        assertAddress(result, addressDto);

        // Good Location
        ListingPatchLocationDto locationDto = DummyModels.locationDto();
        body.setLocation(locationDto);
        result = patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.OK, ListingDto.class);

        assertLocation(result, locationDto);

        // Good Type
        ListingType typeDto = this.listingTypeRepository.save(DummyModels.listingTypes().getFirst());
        ListingPatchTypeDto listingTypeDto = new ListingPatchTypeDto().typeId(typeDto.getId());
        body.setType(listingTypeDto);
        result = patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.OK, ListingDto.class);

        assertListingType(result, listingTypeDto);

        // Good Amenities
        List<Long> amenities = this.amenityRepository.saveAll(DummyModels.amenities(5))
                .stream()
                .map(BaseEntity::getId)
                .toList();
        ListingPatchAmenitiesDto amenitiesDto = new ListingPatchAmenitiesDto().amenities(amenities);
        body.setAmenities(amenitiesDto);
        result = patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.OK, ListingDto.class);

        assertAmenities(result, amenities);

        // Good Photos
        ListingPatchPhotosDto photos = DummyModels.photosDto(5);
        body.setPhotos(photos);

        result = patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.OK, ListingDto.class);

        assertPhotos(result, photos);

    }

    @Test
    void test_publish_listing_by_id_with_40x_responses() {
        /* ==============================================
         * 1. Setup a listing
         * ==============================================*/
        ListingDto result = setupListing("1");

        String requestUri = "/listings/%s/publish".formatted(result.getId());
        update_resource_with_role(requestUri, "ROLE_OWNER", HttpStatus.BAD_REQUEST);
    }

    @Test
    void test_publish_listing_by_id_with_20x_responses() {
        /* ==============================================
         * 1. Setup a listing
         * ==============================================*/
        ListingDto listingDto = setupListing("1");

        /* ==============================================
         * 2. Patch all the fields with correct values
         * ==============================================*/
        completeListingCreation(listingDto.getId());

        // When
        String requestUri = "/listings/%s/publish".formatted(listingDto.getId());
        ListingDto publishedListing = update_resource_with_role(requestUri, "ROLE_OWNER", HttpStatus.OK, ListingDto.class);

        // Then
        assertThat(publishedListing).isNotNull();
        assertThat(publishedListing.getState()).isEqualTo(ListingStateDto.PUBLISHED);
    }

    @Test
    void test_delete_listing_by_id_with_40x_responses() {
        // Given
        String nonExistingListingId = "-1";

        // When
        // unauthenticated
        delete_resource_without_authentication("/listings/%s".formatted(nonExistingListingId));

        // authenticated with an non-owner role
        delete_resource_with_role("/listings/%s".formatted(nonExistingListingId), "ROLE_TENANT", HttpStatus.FORBIDDEN);

        // authenticated with an owner role
        delete_resource_with_role("/listings/%s".formatted(nonExistingListingId), "ROLE_OWNER", HttpStatus.NOT_FOUND);
    }

    @Test
    void test_delete_listing_by_id_with_20x_responses() {
        // Given
        ListingDto fistListing = setupListing("1");

        ListingDto secondListing = setupListing("1");
        completeListingCreation(secondListing.getId());

        // When
        delete_resource_with_role("/listings/%s".formatted(fistListing.getId()), "ROLE_OWNER", HttpStatus.NO_CONTENT);

        delete_resource_with_role("/listings/%s".formatted(secondListing.getId()), "ROLE_OWNER", HttpStatus.NO_CONTENT);

        // Then
        assertThat(this.listingRepository.count()).isEqualTo(2);

        this.listingRepository.findAll()
                .forEach(listing -> {
                    assertThat(listing.isDeleted()).isTrue();
                });
    }

    @Test
    void test_find_all_listing_by_owner_id_with_40x_responses() {
        // Given
        String nonExistingOwnerId = "-1";
        // When
        List<ListingDto> emptyWithout = read_resource_without_authentication("/listings/owners/%s".formatted(nonExistingOwnerId), HttpStatus.OK, new TypeReference<>() {
        });

        assertThat(emptyWithout).isEmpty();

        // authenticated with an non-owner role
        List<ListingDto> emptyWith = read_resource_with_authentication("/listings/owners/%s".formatted(nonExistingOwnerId), HttpStatus.OK, new TypeReference<>() {
        });

        assertThat(emptyWith).isEmpty();

    }

    @Test
    void test_find_all_listing_by_owner_id_with_20x_responses() {
        // Given
        setupListing("1");

        ListingDto listingDto = setupListing("2");
        completeListingCreation(listingDto.getId());

        setupListing("1");

        // When
        List<ListingDto> result = read_resource_without_authentication("/listings/owners/%s".formatted("1"), HttpStatus.OK, new TypeReference<>() {
        });

        assertThat(result)
                .hasSize(2);

        result = read_resource_with_role("/listings/owners/%s".formatted("1"), "ROLE_OWNER", HttpStatus.OK, new TypeReference<>() {
        });
        assertThat(result)
                .hasSize(2);

        result = read_resource_with_role("/listings/owners/%s".formatted("2"), "ROLE_OWNER", HttpStatus.OK, new TypeReference<>() {
        });
        assertThat(result)
                .hasSize(1);

        result = read_resource_without_authentication("/listings/owners/%s".formatted("2"), HttpStatus.OK, new TypeReference<>() {
        });
        assertThat(result)
                .hasSize(1);

    }

    @Test
    void test_find_listing_by_id_with_40x_responses() {
        // Given
        String nonExistingListingId = "-1";
        // When
        read_resource_without_authentication("/listings/%s".formatted(nonExistingListingId), HttpStatus.NOT_FOUND);

        // authenticated with an non-owner role
        read_resource_with_role("/listings/%s".formatted(nonExistingListingId), "ROLE_TENANT", HttpStatus.NOT_FOUND);

        // authenticated with an owner role
        read_resource_with_role("/listings/%s".formatted(nonExistingListingId), "ROLE_OWNER", HttpStatus.NOT_FOUND);
    }

    @Test
    void test_find_listing_by_id_with_20x_responses() {
        // Given
        ListingDto listingDto = setupListing("1");
        completeListingCreation(listingDto.getId());

        // When
        ListingDto result = read_resource_without_authentication("/listings/%s".formatted(listingDto.getId()), HttpStatus.OK, new TypeReference<>() {
        });

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(listingDto.getId());

        result = read_resource_with_role("/listings/%s".formatted(listingDto.getId()), "ROLE_OWNER", HttpStatus.OK, new TypeReference<>() {
        });

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(listingDto.getId());
    }

    @Test
    void test_find_all_listings_with_20x_responses() {
        // Given
        setupListing("1");
        setupListing("2");
        setupListing("3");

        ListingDto listingDto = setupListing("4");
        completeListingCreation(listingDto.getId());

        // When
        List<ListingDto> result = read_resource_without_authentication("/listings", HttpStatus.OK, new TypeReference<>() {
        });
        assertThat(result)
                .hasSize(4);

        result = read_resource_with_role("/listings", "ROLE_OWNER", HttpStatus.OK, new TypeReference<>() {
        });

        assertThat(result)
                .hasSize(4);
    }

    @Test
    void test_unpublish_listing_by_id_with_40x_responses() {
        // Given
        String nonExistingListingId = "-1";
        UnlistListingRequestDto requestDto = new UnlistListingRequestDto()
                .from(LocalDate.MIN)
                .to(LocalDate.MAX);
        // When
        // unauthenticated
        update_resource_without_authentication("/listings/%s/unlist".formatted(nonExistingListingId));

        // authenticated with an non-owner role
        update_resource_with_role("/listings/%s/unlist".formatted(nonExistingListingId), requestDto, "ROLE_TENANT", HttpStatus.FORBIDDEN);

        // authenticated with an owner role
        update_resource_with_role("/listings/%s/unlist".formatted(nonExistingListingId), requestDto, "ROLE_OWNER", HttpStatus.NOT_FOUND);

    }

    @Test
    void test_unpublish_listing_by_id_with_20x_responses() {
        // Given
        UnlistListingRequestDto requestDto = new UnlistListingRequestDto()
                .from(LocalDate.MIN)
                .to(LocalDate.MAX);
        ListingDto result;
        // when
        ListingDto firstListing = setupListing("1");
        completeListingCreation(firstListing.getId());
        result = update_resource_with_role("/listings/%s/publish".formatted(firstListing.getId()), "ROLE_OWNER", HttpStatus.OK, ListingDto.class);

        assertThat(result).isNotNull();
        assertThat(result.getState()).isEqualTo(ListingStateDto.PUBLISHED);

        result = update_resource_with_role("/listings/%s/unlist".formatted(firstListing.getId()), requestDto, "ROLE_OWNER", HttpStatus.OK, new TypeReference<>() {
        });

        assertThat(result).isNotNull();
        assertThat(result.getState()).isEqualTo(ListingStateDto.UNLISTED);

        // Given
        ListingDto secondListing = setupListing("2");
        ListingDto draftListingDto = update_resource_with_role("/listings/%s/unlist".formatted(secondListing.getId()), requestDto, "ROLE_OWNER", HttpStatus.OK, new TypeReference<>() {
        });

        // Then
        assertThat(draftListingDto).isNotNull();
        assertThat(draftListingDto.getState()).isEqualTo(ListingStateDto.DRAFT);
    }

    @SneakyThrows
    @Test
    void test_booking_listing_by_id_with_20x_responses() {
        // Given
        LocalDate now = LocalDate.now();

        List<BookListingRequestDto> freeRanges = List.of(
                new BookListingRequestDto()
                        .from(now)
                        .to(now.plusDays(5)),

                new BookListingRequestDto()
                        .from(now.minusDays(30))
                        .to(now.minusDays(10)), // a range far before,

                new BookListingRequestDto()
                        .from(now.minusDays(5 + 1))
                        .to(now.minusDays(1)), // a range before,

                new BookListingRequestDto()
                        .from(now.plusDays(5 + 1))
                        .to(now.plusDays(7)), // a range after,

                new BookListingRequestDto()
                        .from(now.plusDays(10))
                        .to(now.plusDays(20)) // a range far after,

        );
        // when
        ListingDto listing = setupListing("1");
        completeListingCreation(listing.getId());
        update_resource_with_role("/listings/%s/publish".formatted(listing.getId()), "ROLE_OWNER", HttpStatus.OK, ListingDto.class);

        freeRanges.forEach(range -> {
            try {
                create_resource_with_role("/listings/book/%s".formatted(listing.getId()), range, "ROLE_OWNER", HttpStatus.OK)
                        .andExpect(jsonPath("$.bookedAvailabilityId").exists());
            } catch (Exception e) {
                fail(e.getMessage());
            }
        });

    }

    @SneakyThrows
    @Test
    void test_booking_listing_by_id_with_40x_responses() {
        // Given
        LocalDate now = LocalDate.now();

        BookListingRequestDto bookListingRequest = new BookListingRequestDto()
                .from(now)
                .to(now.plusDays(5));

        List<BookListingRequestDto> conflictRanges = List.of(
                new BookListingRequestDto()
                        .from(now.minusDays(4))
                        .to(now), // touches lower bound

                bookListingRequest, // same

                new BookListingRequestDto()
                        .from(now.plusDays(5))
                        .to(now.plusDays(10)), // touches upper bound

                new BookListingRequestDto()
                        .from(now.minusDays(1))
                        .to(now.plusDays(6)), // covers the whole range

                new BookListingRequestDto()
                        .from(now.plusDays(1))
                        .to(now.plusDays(3)), // within the range

                new BookListingRequestDto()
                        .from(now.minusDays(1))
                        .to(now.plusDays(3)), // intersects

                new BookListingRequestDto()
                        .from(now.plusDays(3))
                        .to(now.plusDays(7)) // intersects
        );

        // when
        ListingDto listing = setupListing("1");
        completeListingCreation(listing.getId());
        update_resource_with_role("/listings/%s/publish".formatted(listing.getId()), "ROLE_OWNER", HttpStatus.OK, ListingDto.class);

        create_resource_with_role("/listings/book/%s".formatted(listing.getId()), bookListingRequest, "ROLE_OWNER", HttpStatus.OK)
                .andExpect(jsonPath("$.bookedAvailabilityId").exists());

        conflictRanges.forEach(range -> {
            try {
                create_resource_with_role("/listings/book/%s".formatted(listing.getId()), range, "ROLE_OWNER", HttpStatus.CONFLICT);
            } catch (Exception e) {
                fail(e.getMessage());
            }
        });

    }

    private ListingDto completeListingCreation(Long listingId) {
        ListingPatchRequestDto body = new ListingPatchRequestDto();
        // Good Title
        ListingPatchTitleDto titleDto = DummyModels.titleDto("Good Title");
        body.setTitle(titleDto);

        // Good Description
        ListingPatchDescriptionDto descriptionDto = DummyModels.descriptionDto("Good Description");
        body.setDescription(descriptionDto);

        // Good FloorPlan
        ListingPatchFloorPlanDto floorPlanDto = DummyModels.floorPlanDto();
        body.setFloorPlan(floorPlanDto);

        // Good Price
        ListingPatchPriceDto priceDto = DummyModels.priceDto();
        body.setPrice(priceDto);

        // Good Address
        ListingPatchAddressDto addressDto = DummyModels.addressDto();
        body.setAddress(addressDto);

        // Good Location
        ListingPatchLocationDto locationDto = DummyModels.locationDto();
        body.setLocation(locationDto);

        // Good Type
        ListingType typeDto = this.listingTypeRepository.save(DummyModels.listingTypes().getFirst());
        ListingPatchTypeDto listingTypeDto = new ListingPatchTypeDto().typeId(typeDto.getId());
        body.setType(listingTypeDto);

        // Good Amenities
        List<Long> amenities = this.amenityRepository.saveAll(DummyModels.amenities(5))
                .stream()
                .map(BaseEntity::getId)
                .toList();
        ListingPatchAmenitiesDto amenitiesDto = new ListingPatchAmenitiesDto().amenities(amenities);
        body.setAmenities(amenitiesDto);

        // Good Photos
        ListingPatchPhotosDto photos = DummyModels.photosDto(5);
        body.setPhotos(photos);

        return patch_resource_with_role("/listings/%s".formatted(listingId), body, "ROLE_OWNER", HttpStatus.OK, ListingDto.class);
    }

    private ListingDto setupListing(String accountId) {
//        when(this.accountServiceFacade.isUserAllowedToCreateListing(accountId))
//                .thenReturn(io.vavr.control.Try.success(true));
//
        // authenticated with an owner role
        ListingDto result = create_resource_with_role("/listings/owners/%s".formatted(accountId), "ROLE_OWNER", HttpStatus.CREATED, new TypeReference<>() {
        });

        assertThat(result).isNotNull();
        return result;
    }

    private void patching_listing_with_bad_photos(String requestUri) {
        ListingPatchPhotosDto photosDto = DummyModels.photosDto(4); // At least 5 photos
        ListingPatchRequestDto body = new ListingPatchRequestDto().photos(photosDto);
        patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.BAD_REQUEST);
    }

    private void patching_listing_with_non_existing_amenity(String requestUri) {
        ListingPatchAmenitiesDto amenitiesDto = DummyModels.amenitiesDto(Stream.of(1000000000L, 200000000000L).toList());
        ListingPatchRequestDto body = new ListingPatchRequestDto().amenities(amenitiesDto);
        patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.NOT_FOUND);
    }

    private void patching_listing_with_non_existing_listing_type(String requestUri) {
        ListingPatchTypeDto listingTypeDto = DummyModels.listingTypeDto(1000000000L);
        ListingPatchRequestDto body = new ListingPatchRequestDto().type(listingTypeDto);
        patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.NOT_FOUND);
    }

    private void patching_listing_with_bad_location(String requestUri) {
        ListingPatchLocationDto locationDto = new ListingPatchLocationDto();
        locationDto.setLat(null);
        patch_resource_with_role(
                requestUri,
                new ListingPatchRequestDto().location(locationDto),
                "ROLE_OWNER",
                HttpStatus.BAD_REQUEST
        );
    }

    private void patching_listing_with_bad_address(String requestUri) {
        ListingPatchAddressDto addressDto = DummyModels.addressDto();
//        addressDto.setAddressId(null);
        ListingPatchRequestDto body = new ListingPatchRequestDto().address(addressDto);
        patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.BAD_REQUEST);
    }

    private void patching_listing_with_bad_price(String requestUri) {
        Stream.of(-100L, 0L)
                .forEach(price -> {
                    ListingPatchPriceDto priceDto = new ListingPatchPriceDto()
                            .amount(price)
                            .currency("USD");
                    ListingPatchRequestDto body = new ListingPatchRequestDto().price(priceDto);
                    patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.BAD_REQUEST);
                });
    }

    private void patching_listing_with_bad_floor_plan(String requestUri) {
        ListingPatchFloorPlanDto floorPlanDto = DummyModels.floorPlanDto();
        floorPlanDto.setBathroomCount(-1L);
        floorPlanDto.setBedCount(-1L);
        floorPlanDto.setBedroomCount(-1L);
        ListingPatchRequestDto body = new ListingPatchRequestDto().floorPlan(floorPlanDto);
        patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.BAD_REQUEST);
    }

    private void patching_listing_with_bad_description(String requestUri) {
        Stream.of(4, 501)
                .map(DummyModels::randomString)
                .forEach(description -> {
                    ListingPatchDescriptionDto descriptionDto = DummyModels.descriptionDto(description);
                    ListingPatchRequestDto body = new ListingPatchRequestDto().description(descriptionDto);
                    patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.BAD_REQUEST);
                });
    }

    private void patching_listing_with_bad_title(String requestUri) {
        Stream.of(4, 101)
                .map(DummyModels::randomString)
                .forEach(title -> {
                    ListingPatchTitleDto titleDto = DummyModels.titleDto(title);
                    ListingPatchRequestDto body = new ListingPatchRequestDto().title(titleDto);
                    patch_resource_with_role(requestUri, body, "ROLE_OWNER", HttpStatus.BAD_REQUEST);
                });
    }

    private void assertFloorPlan(ListingDto result, ListingPatchFloorPlanDto floorPlanDto) {
        assertThat(result).isNotNull();
        assertThat(result.getBathroomCount()).isEqualTo(floorPlanDto.getBathroomCount());
        assertThat(result.getBedCount()).isEqualTo(floorPlanDto.getBedCount());
        assertThat(result.getBedroomCount()).isEqualTo(floorPlanDto.getBedroomCount());
        assertThat(result.getGuestCount()).isEqualTo(floorPlanDto.getGuestCount());
    }

    private void assertPhotos(ListingDto result, ListingPatchPhotosDto photos) {
        assertThat(result).isNotNull();
        assertThat(result.getPhotos()).isNotNull();
        assertThat(result.getPhotos()).hasSize(photos.getPhotos().size());
    }

    private void assertAmenities(ListingDto result, List<Long> amenities) {
        assertThat(result).isNotNull();
        assertThat(result.getAmenities()).isNotNull();
        assertThat(result.getAmenities()).hasSize(amenities.size());
    }

    private void assertListingType(ListingDto result, ListingPatchTypeDto typeDto) {
        assertThat(result).isNotNull();
        assertThat(result.getType()).isNotNull();
        assertThat(result.getType().getId()).isEqualTo(typeDto.getTypeId());
    }

    private void assertAddress(ListingDto result, ListingPatchAddressDto addressDto) {
        assertThat(result).isNotNull();
        assertThat(result.getAddress()).isNotNull();
    }

    private void assertLocation(ListingDto result, ListingPatchLocationDto locationDto) {
        assertThat(result).isNotNull();
        assertThat(result.getLocation()).isNotNull();
        assertThat(result.getLocation().getLat()).isEqualTo(locationDto.getLat());
        assertThat(result.getLocation().getLng()).isEqualTo(locationDto.getLng());
    }



}
