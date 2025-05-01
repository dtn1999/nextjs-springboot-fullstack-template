--liquibase formatted sql

--changeset dtn1999:create_initial_tables
DROP TABLE IF EXISTS ACCOUNT;
DROP TABLE IF EXISTS PROFILE;
DROP TABLE IF EXISTS PERSONAL_INFORMATION;

--comment: Table personal_information
CREATE TABLE PERSONAL_INFORMATION
(
    id                                   BIGSERIAL    NOT NULL,
    created_at                           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted                              BOOLEAN      NOT NULL DEFAULT FALSE,
    email                                VARCHAR(255) UNIQUE,
    first_name                           VARCHAR(255) NOT NULL,
    last_name                            VARCHAR(255) NOT NULL,
    phone_country_code                   VARCHAR(255),
    phone_number                         VARCHAR(255),
    address_city                         VARCHAR(255),
    address_country                      VARCHAR(255),
    address_state                        VARCHAR(255),
    address_street                       VARCHAR(255),
    address_zip_code                     VARCHAR(255),
    government_id                        TEXT,
    emergency_contact_name               VARCHAR(255),
    emergency_contact_email              VARCHAR(255),
    emergency_contact_phone_country_code VARCHAR(255),
    emergency_contact_phone_number       VARCHAR(255),
    relationship_with_emergency_contact  VARCHAR(255),
    emergency_contact_preferred_language VARCHAR(255),

--  Constraints
    PRIMARY KEY (id)
);

--comment: Table profile

CREATE TABLE PROFILE
(
    id                        BIGSERIAL NOT NULL,
    created_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted                   BOOLEAN   NOT NULL DEFAULT FALSE,
    birthdate                 DATE,
    profile_picture_url       TEXT,
    about                     TEXT,
    is_email_verified         BOOLEAN   NOT NULL DEFAULT FALSE,
    is_phone_number_verified  BOOLEAN   NOT NULL DEFAULT FALSE,
    is_government_id_verified BOOLEAN   NOT NULL DEFAULT FALSE,
    show_previous_bookings    BOOLEAN   NOT NULL DEFAULT FALSE,

--  Constraints
    PRIMARY KEY (id)
);

--comment: Table account

CREATE TABLE ACCOUNT
(
    id                      BIGSERIAL    NOT NULL,
    created_at              TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted                 BOOLEAN      NOT NULL DEFAULT FALSE,
    user_id                 VARCHAR(255) NOT NULL UNIQUE,
    role                    VARCHAR(190),
    status                  VARCHAR(190),
    settings                TEXT         NOT NULL,


--  Foreign keys
    profile_id              BIGINT       NOT NULL UNIQUE,
    personal_information_id BIGINT       NOT NULL UNIQUE,

--  Constraints
    PRIMARY KEY (id)
);

--Comment: Configure constraints on table account
ALTER TABLE ACCOUNT
    ADD CONSTRAINT fk_account_on_profile FOREIGN KEY (profile_id) REFERENCES PROFILE (id),
    ADD CONSTRAINT fk_account_on_personal_information FOREIGN KEY (personal_information_id) REFERENCES PERSONAL_INFORMATION (id);

--rollback DROP TABLE ACCOUNT;
--rollback DROP TABLE PROFILE;
--rollback DROP TABLE PERSONAL_INFORMATION;
