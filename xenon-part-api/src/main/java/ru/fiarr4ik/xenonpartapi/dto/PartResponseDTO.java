package ru.fiarr4ik.xenonpartapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO для ответа с информацией о детали.
 */
@Data
public class PartResponseDTO {

    /**
     * Идентификатор детали.
     */
    private Long id;

    /**
     * Название детали.
     */
    private String name;

    /**
     * Описание детали.
     */
    private String description;

    /**
     * Цена детали.
     */
    private Double price;

    /**
     * Идентификатор категории.
     */
    private Long categoryId;

    /**
     * Идентификатор поставщика.
     */
    private Long supplierId;
}
