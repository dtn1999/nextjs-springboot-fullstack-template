package com.cozy.account.core.model.converter;

import com.cozy.shared.MapperUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class JsonAttributeConverter<T> implements AttributeConverter<T, String> {
    private final ObjectMapper objectMapper = MapperUtils.createObjectMapper();

    @Override
    public String convertToDatabaseColumn(T t) {
        try {
            return objectMapper.writeValueAsString(t);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to convert global settings to JSON", e);
        }
    }

    @Override
    public T convertToEntityAttribute(String s) {
        try {
            return objectMapper.readValue(s, new TypeReference<T>() {
            });
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to convert JSON to global settings", e);
        }
    }
}
