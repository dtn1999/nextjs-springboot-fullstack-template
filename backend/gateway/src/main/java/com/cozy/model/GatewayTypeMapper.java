package com.cozy.model;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface GatewayTypeMapper {
    GatewayTypeMapper INSTANCE = Mappers.getMapper(GatewayTypeMapper.class);

}
