package com.cozy.shared.api;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Objects;

@Mapper
public interface DateMapper {
    DateMapper INSTANCE = Mappers.getMapper(DateMapper.class);

    default OffsetDateTime map(ZonedDateTime value) {
        if (Objects.isNull(value)) {
            return null;
        }
        return OffsetDateTime.ofInstant(value.toInstant(), ZoneOffset.UTC);
    }

    default ZonedDateTime map(OffsetDateTime value) {
        if (Objects.isNull(value)) {
            return null;
        }
        return value.toZonedDateTime();
    }

}
