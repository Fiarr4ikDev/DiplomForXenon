package ru.fiarr4ik.xenonpartapi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;
import ru.fiarr4ik.xenonpartapi.dto.PartRequestDto;
import ru.fiarr4ik.xenonpartapi.dto.PartResponseDto;
import ru.fiarr4ik.xenonpartapi.entity.Part;


@Mapper(componentModel = "spring")
@Component
public interface PartMapper {

    PartResponseDto toResponseDto(Part part);

    Part toEntity(PartRequestDto requestDto);

    void updateEntityFromDto(PartRequestDto dto, @MappingTarget Part entity);
}