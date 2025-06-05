package ru.fiarr4ik.xenonpartapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.fiarr4ik.xenonpartapi.entity.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
} 