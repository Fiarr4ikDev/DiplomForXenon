package ru.fiarr4ik.xenonpartapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO для ответа с информацией о поставщике.
 */
@Data
public class SupplierResponseDTO {

    /**
     * Идентификатор поставщика.
     */
    private Long supplierId;

    /**
     * Название поставщика.
     */
    private String name;

    private String contactPerson;

    private String phone;

    private String email;

    private String address;
}
