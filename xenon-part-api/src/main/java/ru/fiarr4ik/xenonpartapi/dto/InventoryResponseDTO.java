package ru.fiarr4ik.xenonpartapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO для ответа с информацией о записи инвентаря.
 */
@Data
public class InventoryResponseDTO {

    /**
     * Идентификатор записи инвентаря.
     */
    private Long id;

    /**
     * Идентификатор детали.
     */
    private Long partId;

    /**
     * Количество деталей.
     */
    private Integer quantityInStock;

    private LocalDateTime lastRestockDate;
} 