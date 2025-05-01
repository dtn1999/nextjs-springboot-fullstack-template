package com.cozy.account.core.model.converter;

import com.cozy.account.core.model.entity.Settings;
import com.cozy.shared.MapperUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class SettingsConverter implements AttributeConverter<Settings, String> {
    private final ObjectMapper objectMapper = MapperUtils.createObjectMapper();

    @Override
    public String convertToDatabaseColumn(Settings globalSettings) {
        try {
            return objectMapper.writeValueAsString(globalSettings);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to convert global settings to JSON", e);
        }
    }

    @Override
    public Settings convertToEntityAttribute(String s) {
        try {
            return objectMapper.readValue(s, Settings.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to convert JSON to global settings", e);
        }
    }
}
