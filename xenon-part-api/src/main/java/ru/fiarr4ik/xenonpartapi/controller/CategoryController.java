package ru.fiarr4ik.xenonpartapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fiarr4ik.xenonpartapi.dto.CategoryRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.CategoryResponseDTO;
import ru.fiarr4ik.xenonpartapi.service.CategoryService;

import java.util.List;

/**
 * Контроллер для работы с категориями.
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Category", description = "API для работы с категориями")
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Создает новую категорию.
     *
     * @param requestDto данные для создания категории
     * @return созданная категория
     */
    @Operation(summary = "Создать новую категорию")
    @ApiResponse(responseCode = "200", description = "Категория успешно создана",
            content = @Content(schema = @Schema(implementation = CategoryResponseDTO.class)))
    @PostMapping
    public ResponseEntity<CategoryResponseDTO> create(@Valid @RequestBody CategoryRequestDTO requestDto) {
        CategoryResponseDTO response = categoryService.create(requestDto);
        return ResponseEntity.ok(response);
    }

    /**
     * Получает все категории.
     *
     * @return список всех категорий
     */
    @Operation(summary = "Получить все категории")
    @ApiResponse(responseCode = "200", description = "Список категорий",
            content = @Content(schema = @Schema(implementation = CategoryResponseDTO.class)))
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> findAll() {
        List<CategoryResponseDTO> categories = categoryService.findAll();
        return ResponseEntity.ok(categories);
    }

    /**
     * Получает категорию по ID.
     *
     * @param id идентификатор категории
     * @return категория
     */
    @Operation(summary = "Получить категорию по ID")
    @ApiResponse(responseCode = "200", description = "Категория найдена",
            content = @Content(schema = @Schema(implementation = CategoryResponseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Категория не найдена")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> findById(@PathVariable Long id) {
        CategoryResponseDTO response = categoryService.findById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Обновляет категорию по ID.
     *
     * @param id идентификатор категории
     * @param requestDto данные для обновления категории
     * @return обновленная категория
     */
    @Operation(summary = "Обновить категорию по ID")
    @ApiResponse(responseCode = "200", description = "Категория успешно обновлена",
            content = @Content(schema = @Schema(implementation = CategoryResponseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Категория не найдена")
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> update(@PathVariable Long id,
                                                      @Valid @RequestBody CategoryRequestDTO requestDto) {
        CategoryResponseDTO response = categoryService.update(id, requestDto);
        return ResponseEntity.ok(response);
    }

    /**
     * Удаляет категорию по ID.
     *
     * @param id идентификатор категории
     * @return пустой ответ
     */
    @Operation(summary = "Удалить категорию по ID")
    @ApiResponse(responseCode = "204", description = "Категория успешно удалена")
    @ApiResponse(responseCode = "404", description = "Категория не найдена")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Получает количество категорий.
     *
     * @return количество категорий
     */
    @Operation(summary = "Получить количество категорий")
    @ApiResponse(responseCode = "200", description = "Количество категорий получено")
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(categoryService.count());
    }
}
