package ru.fiarr4ik.xenonpartapi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO для запроса на создание или обновление записи инвентаря.
 */
@Data
public class InventoryRequestDTO {

    /**
     * Идентификатор детали.
     */
    @NotNull(message = "ID детали не может быть пустым")
    private Long InventoryId;

    /**
     * Количество деталей.
     */
    @NotNull(message = "Количество не может быть пустым")
    @Min(value = 0, message = "Количество не может быть отрицательным")
    private Integer quantityInStock;
} 