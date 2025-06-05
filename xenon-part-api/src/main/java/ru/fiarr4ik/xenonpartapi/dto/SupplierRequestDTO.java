package ru.fiarr4ik.xenonpartapi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplierRequestDTO {

    @NotBlank(message = "Название компании не может быть пустым")
    private String name;

    private String contactPerson;

    @NotBlank(message = "Телефон не может быть пустым")
    private String phone;

    @NotBlank(message = "Email не может быть пустым")
    @Email(message = "Некорректный формат email")
    private String email;

    private String address;

}
