package ru.fiarr4ik.xenonpartapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fiarr4ik.xenonpartapi.dto.InventoryRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.InventoryResponseDTO;
import ru.fiarr4ik.xenonpartapi.service.InventoryService;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "API для работы с инвентарём")
public class InventoryController {

    private final InventoryService inventoryService;

    @Operation(summary = "Создать новую запись инвентаря")
    @ApiResponse(responseCode = "200", description = "Запись инвентаря успешно создана",
            content = @Content(schema = @Schema(implementation = InventoryResponseDTO.class)))
    @PostMapping
    public ResponseEntity<InventoryResponseDTO> create(@Valid @RequestBody InventoryRequestDTO requestDto) {
        InventoryResponseDTO response = inventoryService.create(requestDto);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Получить все записи инвентаря")
    @ApiResponse(responseCode = "200", description = "Список записей инвентаря",
            content = @Content(schema = @Schema(implementation = InventoryResponseDTO.class)))
    @GetMapping
    public ResponseEntity<List<InventoryResponseDTO>> findAll() {
        List<InventoryResponseDTO> inventory = inventoryService.findAll();
        return ResponseEntity.ok(inventory);
    }

    @Operation(summary = "Получить запись инвентаря по ID")
    @ApiResponse(responseCode = "200", description = "Запись инвентаря найдена",
            content = @Content(schema = @Schema(implementation = InventoryResponseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Запись инвентаря не найдена")
    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponseDTO> findById(@PathVariable Long id) {
        InventoryResponseDTO response = inventoryService.findById(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Обновить запись инвентаря по ID")
    @ApiResponse(responseCode = "200", description = "Запись инвентаря успешно обновлена",
            content = @Content(schema = @Schema(implementation = InventoryResponseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Запись инвентаря не найдена")
    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponseDTO> update(@PathVariable Long id,
                                                      @Valid @RequestBody InventoryRequestDTO requestDto) {
        InventoryResponseDTO response = inventoryService.update(id, requestDto);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Удалить запись инвентаря по ID")
    @ApiResponse(responseCode = "204", description = "Запись инвентаря успешно удалена")
    @ApiResponse(responseCode = "404", description = "Запись инвентаря не найдена")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Получить количество записей инвентаря")
    @ApiResponse(responseCode = "200", description = "Количество записей инвентаря получено")
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(inventoryService.count());
    }
} 