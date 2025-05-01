package com.cozy.account.core.model.converter;

import com.cozy.account.core.model.entity.PersonalInformation;
import com.cozy.shared.MapperUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class GovernmentIdConverter implements AttributeConverter<PersonalInformation.GovernmentId, String> {
    private final ObjectMapper objectMapper = MapperUtils.createObjectMapper();

    @Override
    public String convertToDatabaseColumn(PersonalInformation.GovernmentId governmentId) {
        try {
            return objectMapper.writeValueAsString(governmentId);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to convert Government Id to JSON", e);
        }
    }

    @Override
    public PersonalInformation.GovernmentId convertToEntityAttribute(String s) {
        try {
            if (s == null || s.isEmpty()) {
                return null;
            }
            return objectMapper.readValue(s, PersonalInformation.GovernmentId.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to convert JSON to global settings", e);
        }
    }
}
