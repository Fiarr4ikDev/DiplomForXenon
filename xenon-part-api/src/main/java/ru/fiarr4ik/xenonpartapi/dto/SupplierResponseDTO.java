package ru.fiarr4ik.xenonpartapi.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplierResponseDTO {

    private Long supplierId;

    private String name;

    private String contactPerson;

    private String phone;

    private String email;

    private String address;
}
