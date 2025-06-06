package ru.fiarr4ik.xenonpartapi.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long InventoryId;

    @ManyToOne
    @JoinColumn(name = "part_id")
    private Part part;

    private Integer quantityInStock;
    private LocalDateTime lastRestockDate;

    @PreUpdate
    public void preUpdate() {
        lastRestockDate = LocalDateTime.now();
    }
}