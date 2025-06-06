package ru.fiarr4ik.xenonpartapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.fiarr4ik.xenonpartapi.entity.Supplier;
import ru.fiarr4ik.xenonpartapi.entity.Part;
import ru.fiarr4ik.xenonpartapi.entity.Inventory;

import java.util.List;
import java.util.Map;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    
    @Query("SELECT supplier.name as supplierName, " +
           "COUNT(part) as partCount, " +
           "SUM(part.unitPrice) as totalValue, " +
           "AVG(part.unitPrice) as averagePrice " +
           "FROM Supplier supplier " +
           "LEFT JOIN Part part ON part.supplier.supplierId = supplier.supplierId " +
           "GROUP BY supplier.name")
    List<Map<String, Object>> getSupplierStatistics();

    @Query("SELECT supplier.name as supplierName, " +
           "COUNT(inventory) as inventoryCount, " +
           "SUM(inventory.quantityInStock) as totalQuantity " +
           "FROM Supplier supplier " +
           "LEFT JOIN Part part ON part.supplier.supplierId = supplier.supplierId " +
           "LEFT JOIN Inventory inventory ON inventory.part.partId = part.partId " +
           "GROUP BY supplier.name")
    List<Map<String, Object>> getSupplierInventoryStats();

    @Query("SELECT supplier.name as supplierName, " +
           "SUM(CASE WHEN inventory.quantityInStock < 10 THEN 1 ELSE 0 END) as lowStockCount " +
           "FROM Supplier supplier " +
           "LEFT JOIN Part part ON part.supplier.supplierId = supplier.supplierId " +
           "LEFT JOIN Inventory inventory ON inventory.part.partId = part.partId " +
           "GROUP BY supplier.name")
    List<Map<String, Object>> getSupplierLowStockStats();
}
