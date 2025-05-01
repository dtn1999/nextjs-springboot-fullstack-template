/*
 *  Copyright (c) Dntech 2023 - All rights reserved.
 */

INSERT INTO account (id, address_id, emergency_contact_email, emergency_contact_name, emergency_contact_phone_number, formatted_address, government_id, legal_name, phone_number, preferred_currency, preferred_language, preferred_language_of_emergency_contact, relationship_with_emergency_contact, role, time_zone, user_id)
VALUES (1, 1, 'emergency@email.com', 'emergency name', '1234', 'test 68, 52080', '1234', 'test name', '1234', 'USD', 'en', 'en', 'friend', 'user', 'UTC', 'goauth|1057865343911659');

INSERT INTO profile (id, account_id, profile_picture_url, bio, is_email_verified, is_phone_number_verified, is_national_id_card_verified, work)
VALUES (1, 1, 'https://lh3.googlentent.com/a/AAcHTtf_gAcjP96DQB92J3tC40G7dIBBbKwAbLSYg1Qo=s96-c', 'I am a software engineer', true, true, true, 'Software Engineer');

