DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'account_service') THEN
            CREATE SCHEMA account_service;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'listing_service') THEN
            CREATE SCHEMA listing_service;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'booking_service') THEN
            CREATE SCHEMA booking_service;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'billing_service') THEN
            CREATE SCHEMA billing_service;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'communication_service') THEN
            CREATE SCHEMA communication_service;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'feedback_service') THEN
            CREATE SCHEMA feedback_service;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'system') THEN
            CREATE SCHEMA system;
        END IF;
    END $$;

DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
            CREATE EXTENSION postgis SCHEMA listing_service;
        END IF;
    END $$;
