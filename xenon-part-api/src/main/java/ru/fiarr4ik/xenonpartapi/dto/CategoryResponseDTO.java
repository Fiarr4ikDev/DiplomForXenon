package ru.fiarr4ik.xenonpartapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO для ответа с информацией о категории.
 */
@Data
public class CategoryResponseDTO {

    /**
     * Идентификатор категории.
     */
    private Long categoryId;

    /**
     * Название категории.
     */
    private String name;

    private String description;
}
