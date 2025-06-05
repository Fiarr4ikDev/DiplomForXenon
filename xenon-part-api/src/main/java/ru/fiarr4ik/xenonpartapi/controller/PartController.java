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
import ru.fiarr4ik.xenonpartapi.dto.PartRequestDto;
import ru.fiarr4ik.xenonpartapi.dto.PartResponseDTO;
import ru.fiarr4ik.xenonpartapi.service.PartService;

import java.util.List;

/**
 * Контроллер для работы с запчастями.
 */
@RestController
@RequestMapping("/api/parts")
@RequiredArgsConstructor
@Tag(name = "Part", description = "API для работы с запчастями")
public class PartController {

    private final PartService partService;

    /**
     * Создает новую запчасть.
     *
     * @param requestDto данные для создания запчасти
     * @return созданная запчасть
     */
    @Operation(summary = "Создать новую запчасть")
    @ApiResponse(responseCode = "200", description = "Запчасть успешно создана",
            content = @Content(schema = @Schema(implementation = PartResponseDTO.class)))
    @PostMapping
    public ResponseEntity<PartResponseDTO> create(@Valid @RequestBody PartRequestDto requestDto) {
        PartResponseDTO response = partService.create(requestDto);
        return ResponseEntity.ok(response);
    }

    /**
     * Получает все запчасти.
     *
     * @return список всех запчастей
     */
    @Operation(summary = "Получить все запчасти")
    @ApiResponse(responseCode = "200", description = "Список запчастей",
            content = @Content(schema = @Schema(implementation = PartResponseDTO.class)))
    @GetMapping
    public ResponseEntity<List<PartResponseDTO>> findAll() {
        return ResponseEntity.ok(partService.findAll());
    }

    /**
     * Получает запчасть по ID.
     *
     * @param id идентификатор запчасти
     * @return запчасть
     */
    @Operation(summary = "Получить запчасть по ID")
    @ApiResponse(responseCode = "200", description = "Запчасть найдена",
            content = @Content(schema = @Schema(implementation = PartResponseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Запчасть не найдена")
    @GetMapping("/{id}")
    public ResponseEntity<PartResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(partService.findById(id));
    }

    /**
     * Обновляет запчасть по ID.
     *
     * @param id идентификатор запчасти
     * @param requestDto данные для обновления запчасти
     * @return обновленная запчасть
     */
    @Operation(summary = "Обновить запчасть по ID")
    @ApiResponse(responseCode = "200", description = "Запчасть успешно обновлена",
            content = @Content(schema = @Schema(implementation = PartResponseDTO.class)))
    @ApiResponse(responseCode = "404", description = "Запчасть не найдена")
    @PutMapping("/{id}")
    public ResponseEntity<PartResponseDTO> update(@PathVariable Long id,
                                                  @Valid @RequestBody PartRequestDto requestDto) {
        return ResponseEntity.ok(partService.update(id, requestDto));
    }

    /**
     * Удаляет запчасть по ID.
     *
     * @param id идентификатор запчасти
     * @return пустой ответ
     */
    @Operation(summary = "Удалить запчасть по ID")
    @ApiResponse(responseCode = "204", description = "Запчасть успешно удалена")
    @ApiResponse(responseCode = "404", description = "Запчасть не найдена")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        partService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Получает количество запчастей.
     *
     * @return количество запчастей
     */
    @Operation(summary = "Получить количество запчастей")
    @ApiResponse(responseCode = "200", description = "Количество запчастей получено")
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(partService.count());
    }
}
