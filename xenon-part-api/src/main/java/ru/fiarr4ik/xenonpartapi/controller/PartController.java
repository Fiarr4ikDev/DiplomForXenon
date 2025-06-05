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
import ru.fiarr4ik.xenonpartapi.dto.PartResponseDto;
import ru.fiarr4ik.xenonpartapi.service.PartService;

import java.util.List;

@RestController
@RequestMapping("/api/parts")
@RequiredArgsConstructor
@Tag(name = "Part", description = "API для работы с запчастями")
public class PartController {

    private final PartService partService;

    @Operation(summary = "Создать новую запчасть")
    @ApiResponse(responseCode = "200", description = "Запчасть успешно создана",
            content = @Content(schema = @Schema(implementation = PartResponseDto.class)))
    @PostMapping
    public ResponseEntity<PartResponseDto> create(@Valid @RequestBody PartRequestDto requestDto) {
        PartResponseDto response = partService.create(requestDto);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Получить все запчасти")
    @ApiResponse(responseCode = "200", description = "Список запчастей",
            content = @Content(schema = @Schema(implementation = PartResponseDto.class)))
    @GetMapping
    public ResponseEntity<List<PartResponseDto>> findAll() {
        return ResponseEntity.ok(partService.findAll());
    }

    @Operation(summary = "Получить запчасть по ID")
    @ApiResponse(responseCode = "200", description = "Запчасть найдена",
            content = @Content(schema = @Schema(implementation = PartResponseDto.class)))
    @ApiResponse(responseCode = "404", description = "Запчасть не найдена")
    @GetMapping("/{id}")
    public ResponseEntity<PartResponseDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(partService.findById(id));
    }

    @Operation(summary = "Обновить запчасть по ID")
    @ApiResponse(responseCode = "200", description = "Запчасть успешно обновлена",
            content = @Content(schema = @Schema(implementation = PartResponseDto.class)))
    @ApiResponse(responseCode = "404", description = "Запчасть не найдена")
    @PutMapping("/{id}")
    public ResponseEntity<PartResponseDto> update(@PathVariable Long id,
                                                  @Valid @RequestBody PartRequestDto requestDto) {
        return ResponseEntity.ok(partService.update(id, requestDto));
    }

    @Operation(summary = "Удалить запчасть по ID")
    @ApiResponse(responseCode = "204", description = "Запчасть успешно удалена")
    @ApiResponse(responseCode = "404", description = "Запчасть не найдена")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        partService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Получить количество запчастей")
    @ApiResponse(responseCode = "200", description = "Количество запчастей получено")
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(partService.count());
    }
}
