package ru.fiarr4ik.xenonpartapi.dto;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PartRequestDto {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Long categoryId;

    @NotNull
    private Long supplierId;

    @Min(0)
    private double unitPrice;
}