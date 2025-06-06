package ru.fiarr4ik.xenonpartapi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;
import ru.fiarr4ik.xenonpartapi.dto.PartRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.PartResponseDTO;
import ru.fiarr4ik.xenonpartapi.entity.Part;

@Mapper(componentModel = "spring")
@Component
public interface PartMapper {

    @Mapping(target = "categoryId", source = "category.categoryId")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "supplierId", source = "supplier.supplierId")
    @Mapping(target = "supplierName", source = "supplier.name")
    PartResponseDTO toResponseDto(Part part);

    Part toEntity(PartRequestDTO requestDto);

    void updateEntityFromDto(PartRequestDTO dto, @MappingTarget Part entity);
}