package ru.fiarr4ik.xenonpartapi.dto;

import lombok.Data;

@Data
public class PartResponseDto {

    private Long partId;

    private String name;

    private String description;

    private String categoryName;

    private String supplierName;

    private double unitPrice;
}
