package ru.fiarr4ik.xenonpartapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.fiarr4ik.xenonpartapi.entity.Inventory;

import java.util.List;
import java.util.Map;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    @Query("SELECT " +
           "SUM(inventory.quantityInStock) as totalQuantity, " +
           "COUNT(DISTINCT inventory.part) as uniqueParts, " +
           "AVG(inventory.quantityInStock) as averageQuantity " +
           "FROM Inventory inventory")
    Map<String, Object> getInventoryOverview();

    @Query("SELECT part.name as partName, " +
           "inventory.quantityInStock as quantity, " +
           "part.unitPrice as unitPrice, " +
           "inventory.quantityInStock * part.unitPrice as totalValue " +
           "FROM Inventory inventory " +
           "JOIN inventory.part part " +
           "WHERE inventory.quantityInStock < 10 " +
           "ORDER BY inventory.quantityInStock ASC")
    List<Map<String, Object>> getLowStockDetails();

    @Query("SELECT " +
           "CASE " +
           "  WHEN inventory.quantityInStock = 0 THEN 'Нет в наличии' " +
           "  WHEN inventory.quantityInStock < 10 THEN 'Низкий запас' " +
           "  WHEN inventory.quantityInStock < 50 THEN 'Средний запас' " +
           "  ELSE 'Высокий запас' " +
           "END as stockLevel, " +
           "COUNT(*) as count " +
           "FROM Inventory inventory " +
           "GROUP BY " +
           "CASE " +
           "  WHEN inventory.quantityInStock = 0 THEN 'Нет в наличии' " +
           "  WHEN inventory.quantityInStock < 10 THEN 'Низкий запас' " +
           "  WHEN inventory.quantityInStock < 50 THEN 'Средний запас' " +
           "  ELSE 'Высокий запас' " +
           "END")
    List<Map<String, Object>> getStockLevelDistribution();
} 