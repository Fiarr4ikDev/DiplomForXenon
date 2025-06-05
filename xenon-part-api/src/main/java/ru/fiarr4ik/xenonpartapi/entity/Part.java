package ru.fiarr4ik.xenonpartapi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Сущность, представляющая запчасть.
 */
@Entity
@Table(name = "part")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Part {

    /**
     * Уникальный идентификатор запчасти.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "part_id")
    private Long partId;

    /**
     * Название запчасти.
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Описание запчасти.
     */
    @Column(name = "description")
    private String description;

    /**
     * Категория, к которой относится запчасть.
     */
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    /**
     * Поставщик запчасти.
     */
    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    /**
     * Цена запчасти.
     */
    @Column(name = "unit_price", nullable = false)
    private double unitPrice;
}

