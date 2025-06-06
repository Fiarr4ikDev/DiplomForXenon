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

/**
 * Контроллер для работы с инвентарем.
 */
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "API для работы с инвентарём")
public class InventoryController {

    private final InventoryService inventoryService;

    /**
     * Создает новую запись инвентаря.
     *
     * @param requestDto данные для создания записи инвентаря
     * @return созданная запись инвентаря
     */
    @Operation(summary = "Создать новую запись инвентаря")
    @ApiResponse(responseCode = "200", description = "Запись инвентаря успешно создана",
            content = @Content(schema = @Schema(implementation = InventoryResponseDTO.class)))
    @PostMapping
    public ResponseEntity<InventoryResponseDTO> create(@Valid @RequestBody InventoryRequestDTO requestDto) {
        InventoryResponseDTO response = inventoryService.create(requestDto);
        return ResponseEntity.ok(response);
    }

    /**
     * Получает все записи инвентаря.
     *
     * @return список всех записей инвентаря
     */
    @Operation(summary = "Получить все записи инвентаря")
    @ApiResponse(responseCode = "200", description = "Список записей инвентаря",
            content = @Content(schema = @Schema(implementation = InventoryResponseDTO.class)))
    @GetMapping
    public ResponseEntity<List<InventoryResponseDTO>> findAll() {
        List<InventoryResponseDTO> inventory = inventoryService.findAll();
        return ResponseEntity.ok(inventory);
    }

    /**
     * Получает запись инвентаря по ID.
     *
     * @param id идентификатор записи инвентаря
     * @return запись инвентаря
     */
    @Operation(summary = "Получить запись инвентаря по ID")
    @ApiResponse(responseCode = "200", description = "Запись инвентаря найдена",
            content = @Content(schema = @Schema(implementation = InventoryResponseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Запись инвентаря не найдена")
    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponseDTO> findById(@PathVariable Long id) {
        InventoryResponseDTO response = inventoryService.findById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Обновляет запись инвентаря по ID.
     *
     * @param id идентификатор записи инвентаря
     * @param requestDto данные для обновления записи инвентаря
     * @return обновленная запись инвентаря
     */
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

    /**
     * Удаляет запись инвентаря по ID.
     *
     * @param id идентификатор записи инвентаря
     * @return пустой ответ
     */
    @Operation(summary = "Удалить запись инвентаря по ID")
    @ApiResponse(responseCode = "204", description = "Запись инвентаря успешно удалена")
    @ApiResponse(responseCode = "404", description = "Запись инвентаря не найдена")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Получает количество записей инвентаря.
     *
     * @return количество записей инвентаря
     */
    @Operation(summary = "Получить количество записей инвентаря")
    @ApiResponse(responseCode = "200", description = "Количество записей инвентаря получено")
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(inventoryService.count());
    }

    /**
     * Добавляет количество к записи инвентаря.
     *
     * @param id идентификатор записи инвентаря
     * @param quantity количество для добавления
     * @return обновленная запись инвентаря
     */
    @Operation(summary = "Добавить количество к записи инвентаря")
    @ApiResponse(responseCode = "200", description = "Количество успешно добавлено",
            content = @Content(schema = @Schema(implementation = InventoryResponseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Запись инвентаря не найдена")
    @PostMapping("/{id}/add")
    public ResponseEntity<InventoryResponseDTO> addQuantity(@PathVariable Long id,
                                                          @RequestParam Integer quantity) {
        InventoryResponseDTO response = inventoryService.addQuantity(id, quantity);
        return ResponseEntity.ok(response);
    }

    /**
     * Вычитает количество из записи инвентаря.
     *
     * @param id идентификатор записи инвентаря
     * @param quantity количество для вычитания
     * @return обновленная запись инвентаря
     */
    @Operation(summary = "Вычесть количество из записи инвентаря")
    @ApiResponse(responseCode = "200", description = "Количество успешно вычтено",
            content = @Content(schema = @Schema(implementation = InventoryResponseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Запись инвентаря не найдена")
    @ApiResponse(responseCode = "400", description = "Недостаточно товара на складе")
    @PostMapping("/{id}/remove")
    public ResponseEntity<InventoryResponseDTO> removeQuantity(@PathVariable Long id,
                                                             @RequestParam Integer quantity) {
        InventoryResponseDTO response = inventoryService.removeQuantity(id, quantity);
        return ResponseEntity.ok(response);
    }
} 