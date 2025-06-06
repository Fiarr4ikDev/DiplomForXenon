package ru.fiarr4ik.xenonpartapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.fiarr4ik.xenonpartapi.entity.Category;
import ru.fiarr4ik.xenonpartapi.entity.Part;
import ru.fiarr4ik.xenonpartapi.entity.Inventory;

import java.util.List;
import java.util.Map;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    @Query("SELECT category.name as categoryName, " +
           "COUNT(part) as partCount, " +
           "SUM(part.unitPrice) as totalValue, " +
           "AVG(part.unitPrice) as averagePrice " +
           "FROM Category category " +
           "LEFT JOIN Part part ON part.category.categoryId = category.categoryId " +
           "GROUP BY category.name")
    List<Map<String, Object>> getCategoryStatistics();

    @Query("SELECT category.name as categoryName, " +
           "COUNT(inventory) as inventoryCount, " +
           "SUM(inventory.quantityInStock) as totalQuantity " +
           "FROM Category category " +
           "LEFT JOIN Part part ON part.category.categoryId = category.categoryId " +
           "LEFT JOIN Inventory inventory ON inventory.part.partId = part.partId " +
           "GROUP BY category.name")
    List<Map<String, Object>> getCategoryInventoryStats();
}
