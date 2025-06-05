package ru.fiarr4ik.xenonpartapi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;
import ru.fiarr4ik.xenonpartapi.dto.SupplierRequestDTO;
import ru.fiarr4ik.xenonpartapi.entity.Supplier;

@Mapper(componentModel = "spring")
@Component
public interface SupplierMapper {

    ru.fiarr4ik.xenonpartapi.dto.SupplierResponseDTO toResponseDTO(Supplier supplier);

    Supplier toEntity(SupplierRequestDTO requestDTO);

    void updateEntityFromDto(SupplierRequestDTO supplierRequestDTO, @MappingTarget Supplier supplier);
}
