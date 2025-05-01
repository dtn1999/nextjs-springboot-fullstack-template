--liquibase formatted sql

--changeset dtn1999:create_db_scheduler_tables
DROP TABLE IF EXISTS SCHEDULED_EXECUTION_LOGS;

CREATE TABLE SCHEDULED_EXECUTION_LOGS
(
    id                   BIGINT                   not null primary key,
    task_name            text                     not null,
    task_instance        text                     not null,
    task_data            bytea,
    picked_by            text,
    time_started         timestamp with time zone not null,
    time_finished        timestamp with time zone not null,
    succeeded            BOOLEAN                  not null,
    duration_ms          BIGINT                   not null,
    exception_class      text,
    exception_message    text,
    exception_stacktrace text
);

CREATE INDEX stl_started_idx ON SCHEDULED_EXECUTION_LOGS (time_started);
CREATE INDEX stl_task_name_idx ON SCHEDULED_EXECUTION_LOGS (task_name);
CREATE INDEX stl_exception_class_idx ON SCHEDULED_EXECUTION_LOGS (exception_class);

-- an optimization for users of priority might be to add priority to the execution_time_idx
-- this _might_ save reads as the priority-value is already in the index
-- CREATE INDEX execution_time_idx ON scheduled_tasks (execution_time asc, priority desc);

--rollback DROP TABLE SCHEDULED_EXECUTION_LOGS;
