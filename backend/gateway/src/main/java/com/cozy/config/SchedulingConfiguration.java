package com.cozy.config;

import org.jobrunr.jobs.mappers.JobMapper;
import org.jobrunr.scheduling.JobScheduler;
import org.jobrunr.storage.InMemoryStorageProvider;
import org.jobrunr.storage.StorageProvider;
import org.springframework.context.annotation.Bean;

/**
 * See <a href="https://www.baeldung.com/java-jobrunr-spring">documentation</a> for more information about configuring
 * JobRunr library
 */
public class SchedulingConfiguration {

    @Bean
    public StorageProvider storageProvider(JobMapper jobMapper) {
        InMemoryStorageProvider inMemoryStorageProvider = new InMemoryStorageProvider();
        inMemoryStorageProvider.setJobMapper(jobMapper);
        return inMemoryStorageProvider;
    }

    @Bean
    public JobScheduler jobScheduler(StorageProvider storageProvider) {
        return new JobScheduler(storageProvider);
    }

}
