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

    private Long partId;

    private String name;

    private String description;

    private Long categoryId;

    private Long supplierId;

    private double unitPrice;
}
