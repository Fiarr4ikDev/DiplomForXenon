package ru.fiarr4ik.xenonpartapi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    private Long partId;

    /**
     * Название детали.
     */
    private String name;

    /**
     * Описание детали.
     */
    private String description;

    /**
     * Идентификатор категории.
     */
    private Long categoryId;

    /**
     * Название категории.
     */
    private String categoryName;

    /**
     * Идентификатор поставщика.
     */
    private Long supplierId;

    /**
     * Название поставщика.
     */
    private String supplierName;

    /**
     * Цена за единицу.
     */
    private Double unitPrice;
}
