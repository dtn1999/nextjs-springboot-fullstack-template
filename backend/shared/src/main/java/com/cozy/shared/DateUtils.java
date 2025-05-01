package com.cozy.shared;

import lombok.experimental.UtilityClass;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

@UtilityClass
public class DateUtils {
    public ZonedDateTime fromInstant(java.time.Instant instant) {
        return ZonedDateTime.ofInstant(instant, ZoneId.of("UTC"));
    }

    public ZonedDateTime now() {
        return ZonedDateTime.now(ZoneId.of("UTC"));
    }

    public long getSeconds(ZonedDateTime zonedDateTime) {
        return zonedDateTime.toLocalDateTime().atZone(ZoneId.of("UTC")).toInstant().getEpochSecond();
    }

    public ZonedDateTime fromSeconds(long seconds) {
        return ZonedDateTime.ofInstant(java.time.Instant.ofEpochSecond(seconds), ZoneId.of("UTC"));
    }

    public LocalDate toLocalDate(ZonedDateTime zonedDateTime) {
        return zonedDateTime.toLocalDate();
    }

    public long computeDaysDifference(LocalDate from, LocalDate to) {
        return ChronoUnit.DAYS.between(from, to);
    }
}
