package ru.fiarr4ik.xenonpartapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.fiarr4ik.xenonpartapi.dto.SupplierRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.SupplierResponseDTO;
import ru.fiarr4ik.xenonpartapi.service.SupplierService;

import java.util.List;

/**
 * Контроллер для работы с поставщиками.
 */
@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@Tag(name = "Supplier", description = "API для работы с поставщиками")
public class SupplierController {

    private final SupplierService supplierService;

    /**
     * Создает нового поставщика.
     *
     * @param requestDto данные для создания поставщика
     * @return созданный поставщик
     */
    @Operation(summary = "Создать нового поставщика")
    @ApiResponse(responseCode = "200", description = "Поставщик успешно создан",
            content = @Content(schema = @Schema(implementation = SupplierResponseDTO.class)))
    @PostMapping
    public ResponseEntity<SupplierResponseDTO> create(@Valid @RequestBody SupplierRequestDTO requestDto) {
        SupplierResponseDTO response = supplierService.create(requestDto);
        return ResponseEntity.ok(response);
    }

    /**
     * Получает всех поставщиков.
     *
     * @return список всех поставщиков
     */
    @Operation(summary = "Получить всех поставщиков")
    @ApiResponse(responseCode = "200", description = "Список поставщиков",
            content = @Content(schema = @Schema(implementation = SupplierResponseDTO.class)))
    @GetMapping
    public ResponseEntity<List<SupplierResponseDTO>> findAll() {
        List<SupplierResponseDTO> suppliers = supplierService.findAll();
        return ResponseEntity.ok(suppliers);
    }

    /**
     * Получает поставщика по ID.
     *
     * @param id идентификатор поставщика
     * @return поставщик
     */
    @Operation(summary = "Получить поставщика по ID")
    @ApiResponse(responseCode = "200", description = "Поставщик найден",
            content = @Content(schema = @Schema(implementation = SupplierResponseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Поставщик не найден")
    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponseDTO> findById(@PathVariable Long id) {
        SupplierResponseDTO response = supplierService.findById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Обновляет поставщика по ID.
     *
     * @param id идентификатор поставщика
     * @param requestDto данные для обновления поставщика
     * @return обновленный поставщик
     */
    @Operation(summary = "Обновить поставщика по ID")
    @ApiResponse(responseCode = "200", description = "Поставщик успешно обновлен",
            content = @Content(schema = @Schema(implementation = SupplierResponseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Поставщик не найден")
    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponseDTO> update(@PathVariable Long id,
                                                      @Valid @RequestBody SupplierRequestDTO requestDto) {
        SupplierResponseDTO response = supplierService.update(id, requestDto);
        return ResponseEntity.ok(response);
    }

    /**
     * Удаляет поставщика по ID.
     *
     * @param id идентификатор поставщика
     * @return пустой ответ
     */
    @Operation(summary = "Удалить поставщика по ID")
    @ApiResponse(responseCode = "204", description = "Поставщик успешно удален")
    @ApiResponse(responseCode = "404", description = "Поставщик не найден")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Получает количество поставщиков.
     *
     * @return количество поставщиков
     */
    @Operation(summary = "Получить количество поставщиков")
    @ApiResponse(responseCode = "200", description = "Количество поставщиков получено")
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(supplierService.count());
    }
}
