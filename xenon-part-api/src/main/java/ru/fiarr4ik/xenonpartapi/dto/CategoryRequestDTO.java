package ru.fiarr4ik.xenonpartapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO для запроса на создание или обновление категории.
 */
@Data
public class CategoryRequestDTO {

    /**
     * Название категории.
     */
    @NotBlank(message = "Название категории не должно быть пустым")
    @Size(max = 100, message = "Название категории не должно превышать 100 символов")
    private String name;

    @Size(max = 250, message = "Описание не должно превышать 250 символов")
    private String description;
}