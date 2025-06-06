package ru.fiarr4ik.xenonpartapi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.fiarr4ik.xenonpartapi.dto.InventoryRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.InventoryResponseDTO;
import ru.fiarr4ik.xenonpartapi.entity.Inventory;

@Mapper(componentModel = "spring")
public interface InventoryMapper {
    Inventory toEntity(InventoryRequestDTO dto);

    InventoryResponseDTO toDto(Inventory entity);

    void updateEntityFromDto(InventoryRequestDTO dto, @MappingTarget Inventory entity);
} 