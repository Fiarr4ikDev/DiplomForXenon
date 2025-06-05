package ru.fiarr4ik.xenonpartapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequestDTO {

    @NotBlank(message = "Название категории не должно быть пустым")
    @Size(max = 100, message = "Название категории не должно превышать 100 символов")
    private String name;

    @Size(max = 250, message = "Описание не должно превышать 250 символов")
    private String description;
}