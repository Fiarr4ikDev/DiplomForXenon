package ru.fiarr4ik.xenonpartapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.fiarr4ik.xenonpartapi.entity.Part;
import ru.fiarr4ik.xenonpartapi.entity.Category;
import ru.fiarr4ik.xenonpartapi.entity.Supplier;
import ru.fiarr4ik.xenonpartapi.entity.Inventory;

import java.util.List;
import java.util.Map;

@Repository
public interface PartRepository extends JpaRepository<Part, Long> {
    
    @Query("SELECT category.name as categoryName, COUNT(part) as partCount " +
           "FROM Part part " +
           "JOIN Category category ON part.category.categoryId = category.categoryId " +
           "GROUP BY category.name")
    List<Map<String, Object>> countPartsByCategory();

    @Query("SELECT supplier.name as supplierName, COUNT(part) as partCount " +
           "FROM Part part " +
           "JOIN Supplier supplier ON part.supplier.supplierId = supplier.supplierId " +
           "GROUP BY supplier.name")
    List<Map<String, Object>> countPartsBySupplier();

    @Query("SELECT category.name as categoryName, SUM(part.unitPrice) as totalValue " +
           "FROM Part part " +
           "JOIN Category category ON part.category.categoryId = category.categoryId " +
           "GROUP BY category.name")
    List<Map<String, Object>> calculateValueByCategory();

    @Query("SELECT supplier.name as supplierName, SUM(part.unitPrice) as totalValue " +
           "FROM Part part " +
           "JOIN Supplier supplier ON part.supplier.supplierId = supplier.supplierId " +
           "GROUP BY supplier.name")
    List<Map<String, Object>> calculateValueBySupplier();

    @Query("SELECT part.name as partName, inventory.quantityInStock as quantity " +
           "FROM Part part " +
           "JOIN Inventory inventory ON part.partId = inventory.part.partId " +
           "WHERE inventory.quantityInStock < :threshold")
    List<Map<String, Object>> findLowStockParts(@Param("threshold") Integer threshold);

    @Query("SELECT " +
           "COUNT(part) as totalParts, " +
           "SUM(part.unitPrice) as totalValue, " +
           "AVG(part.unitPrice) as averagePrice " +
           "FROM Part part")
    Map<String, Object> getOverallMetrics();
}
