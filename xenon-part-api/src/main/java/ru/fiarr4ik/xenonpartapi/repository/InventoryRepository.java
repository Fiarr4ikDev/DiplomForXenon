package ru.fiarr4ik.xenonpartapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
           "WHERE inventory.quantityInStock < :threshold " +
           "ORDER BY inventory.quantityInStock ASC")
    List<Map<String, Object>> getLowStockDetails(@Param("threshold") Integer threshold);

    @Query("SELECT " +
           "CASE " +
           "  WHEN inventory.quantityInStock = 0 THEN 'Нет в наличии' " +
           "  WHEN inventory.quantityInStock < :lowThreshold THEN 'Низкий запас' " +
           "  WHEN inventory.quantityInStock < :mediumThreshold THEN 'Средний запас' " +
           "  ELSE 'Высокий запас' " +
           "END as stockLevel, " +
           "COUNT(*) as count " +
           "FROM Inventory inventory " +
           "GROUP BY " +
           "CASE " +
           "  WHEN inventory.quantityInStock = 0 THEN 'Нет в наличии' " +
           "  WHEN inventory.quantityInStock < :lowThreshold THEN 'Низкий запас' " +
           "  WHEN inventory.quantityInStock < :mediumThreshold THEN 'Средний запас' " +
           "  ELSE 'Высокий запас' " +
           "END " +
           "ORDER BY " +
           "CASE " +
           "  WHEN inventory.quantityInStock = 0 THEN 1 " +
           "  WHEN inventory.quantityInStock < :lowThreshold THEN 2 " +
           "  WHEN inventory.quantityInStock < :mediumThreshold THEN 3 " +
           "  ELSE 4 " +
           "END")
    List<Map<String, Object>> getStockLevelDistribution(
        @Param("lowThreshold") Integer lowThreshold,
        @Param("mediumThreshold") Integer mediumThreshold
    );
} 