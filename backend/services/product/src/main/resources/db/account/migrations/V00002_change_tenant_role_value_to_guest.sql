--liquibase formatted sql

--changeset dtn1999:change_tenant_role_value_to_guest
--comment Change all TENANT roles to GUEST

UPDATE ACCOUNT SET role = 'GUEST' WHERE role = 'TENANT';

--rollback UPDATE ACCOUNT SET role = 'TENANT' WHERE role = 'GUEST';
