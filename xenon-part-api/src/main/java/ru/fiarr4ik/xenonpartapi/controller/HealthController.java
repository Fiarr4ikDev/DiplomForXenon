package ru.fiarr4ik.xenonpartapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Контроллер для проверки состояния приложения.
 */
@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "API для проверки состояния приложения")
public class HealthController {

    /**
     * Проверяет состояние приложения.
     *
     * @return ответ с сообщением о состоянии
     */
    @Operation(summary = "Проверить состояние приложения")
    @ApiResponse(responseCode = "200", description = "Приложение работает",
            content = @Content(schema = @Schema(implementation = String.class)))
    @GetMapping
    public ResponseEntity<String> checkHealth() {
        return ResponseEntity.ok("Приложение работает");
    }
} 