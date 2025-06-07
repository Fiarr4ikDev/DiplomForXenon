package ru.fiarr4ik.xenonpartapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.fiarr4ik.xenonpartapi.repository.CategoryRepository;
import ru.fiarr4ik.xenonpartapi.repository.InventoryRepository;
import ru.fiarr4ik.xenonpartapi.repository.PartRepository;
import ru.fiarr4ik.xenonpartapi.repository.SupplierRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
public class MetricsController {

    private final PartRepository partRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;

    public MetricsController(
            PartRepository partRepository,
            CategoryRepository categoryRepository,
            SupplierRepository supplierRepository,
            InventoryRepository inventoryRepository) {
        this.partRepository = partRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @GetMapping("/parts-by-category")
    public Object getPartsByCategory() {
        return partRepository.countPartsByCategory();
    }

    @GetMapping("/parts-by-supplier")
    public Object getPartsBySupplier() {
        return partRepository.countPartsBySupplier();
    }

    @GetMapping("/value-by-category")
    public Object getValueByCategory() {
        return partRepository.calculateValueByCategory();
    }

    @GetMapping("/value-by-supplier")
    public Object getValueBySupplier() {
        return partRepository.calculateValueBySupplier();
    }

    @GetMapping("/low-stock")
    public Object getLowStock(@RequestParam(defaultValue = "10") Integer threshold) {
        return inventoryRepository.getLowStockDetails(threshold);
    }

    @GetMapping("/overall")
    public Object getOverall() {
        return partRepository.getOverallMetrics();
    }

    @GetMapping("/category-stats")
    public Object getCategoryStats() {
        return categoryRepository.getCategoryStatistics();
    }

    @GetMapping("/category-inventory")
    public Object getCategoryInventory() {
        return categoryRepository.getCategoryInventoryStats();
    }

    @GetMapping("/supplier-stats")
    public Object getSupplierStats() {
        return supplierRepository.getSupplierStatistics();
    }

    @GetMapping("/supplier-inventory")
    public Object getSupplierInventory() {
        return supplierRepository.getSupplierInventoryStats();
    }

    @GetMapping("/supplier-low-stock")
    public Object getSupplierLowStock() {
        return supplierRepository.getSupplierLowStockStats();
    }

    @GetMapping("/inventory-overview")
    public Object getInventoryOverview() {
        return inventoryRepository.getInventoryOverview();
    }

    @GetMapping("/low-stock-details")
    public Object getLowStockDetails(@RequestParam(defaultValue = "10") Integer threshold) {
        return inventoryRepository.getLowStockDetails(threshold);
    }

    @GetMapping("/stock-distribution")
    public Object getStockDistribution(
        @RequestParam(defaultValue = "10") Integer lowThreshold,
        @RequestParam(defaultValue = "50") Integer mediumThreshold
    ) {
        return inventoryRepository.getStockLevelDistribution(lowThreshold, mediumThreshold);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardData(
        @RequestParam(defaultValue = "10") Integer lowThreshold,
        @RequestParam(defaultValue = "50") Integer mediumThreshold
    ) {
        Map<String, Object> dashboard = new HashMap<>();
        
        dashboard.put("overall", partRepository.getOverallMetrics());
        dashboard.put("partsByCategory", partRepository.countPartsByCategory());
        dashboard.put("partsBySupplier", partRepository.countPartsBySupplier());
        dashboard.put("valueByCategory", partRepository.calculateValueByCategory());
        dashboard.put("valueBySupplier", partRepository.calculateValueBySupplier());
        dashboard.put("lowStock", partRepository.findLowStockParts(lowThreshold));
        dashboard.put("categoryStats", categoryRepository.getCategoryStatistics());
        dashboard.put("supplierStats", supplierRepository.getSupplierStatistics());
        dashboard.put("inventoryOverview", inventoryRepository.getInventoryOverview());
        dashboard.put("stockDistribution", inventoryRepository.getStockLevelDistribution(lowThreshold, mediumThreshold));
        
        return dashboard;
    }
} 