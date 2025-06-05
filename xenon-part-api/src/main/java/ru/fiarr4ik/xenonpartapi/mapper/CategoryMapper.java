package ru.fiarr4ik.xenonpartapi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import ru.fiarr4ik.xenonpartapi.dto.CategoryRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.CategoryResponseDTO;
import ru.fiarr4ik.xenonpartapi.entity.Category;


@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryResponseDTO toResponseDto(Category category);

    Category toEntity(CategoryRequestDTO requestDto);

    void updateEntityFromDto(CategoryRequestDTO dto, @MappingTarget Category entity);
}
