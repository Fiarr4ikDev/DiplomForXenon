package ru.fiarr4ik.xenonpartapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import ru.fiarr4ik.xenonpartapi.dto.RegisterRequest;
import ru.fiarr4ik.xenonpartapi.dto.LoginRequest;
import ru.fiarr4ik.xenonpartapi.dto.UpdateUserRequest;
import ru.fiarr4ik.xenonpartapi.user.UserService;
import ru.fiarr4ik.xenonpartapi.user.User;

import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User registeredUser = userService.registerNewUser(registerRequest.getUsername(), registerRequest.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = "token-" + user.getUsername() + "-" + System.currentTimeMillis();
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверное имя пользователя или пароль");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UpdateUserRequest updateRequest) {
        try {
            // В реальном приложении здесь нужно получить ID пользователя из токена
            // Для простоты пока используем ID 1
            User updatedUser = userService.updateUser(
                1L,
                updateRequest.getUsername(),
                updateRequest.getCurrentPassword(),
                updateRequest.getNewPassword()
            );
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/avatar/{userId}")
    public ResponseEntity<?> getUserAvatar(@PathVariable Long userId) {
        try {
            Optional<byte[]> avatarDataOptional = userService.getUserAvatar(userId);

            if (avatarDataOptional.isPresent()) {
                byte[] avatarData = avatarDataOptional.get();
                // Определяем Content-Type. В реальном приложении нужно определять по типу файла.
                // Здесь для простоты предполагаем image/jpeg или image/png. Можно сделать проверку первых байтов.
                MediaType contentType = MediaType.IMAGE_JPEG; // Замените на MediaType.IMAGE_PNG если нужно
                // В более надежной реализации нужно определять тип по содержимому файла

                return ResponseEntity.ok()
                        .contentType(contentType)
                        .body(avatarData);
            } else {
                // Если пользователь не найден или у него нет аватарки
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Аватарка не найдена");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при получении аватарки: " + e.getMessage());
        }
    }

    @PostMapping("/avatar/upload")
    public ResponseEntity<?> uploadAvatar(@RequestPart("avatar") MultipartFile avatarFile) {
        try {
            // В реальном приложении здесь нужно получить ID пользователя из токена
            // Для простоты пока используем ID 1
            if (avatarFile.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Файл аватарки пуст");
            }

            byte[] avatarData = avatarFile.getBytes();
            User updatedUser = userService.updateUserAvatar(1L, avatarData);

            // Можно вернуть что-то полезное, например, подтверждение или часть данных пользователя
            Map<String, String> response = new HashMap<>();
            response.put("message", "Аватарка успешно загружена");
            // В реальном приложении, возможно, здесь нужно вернуть URL для получения аватарки
            // или Base64 представление (для небольших)

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Логируем ошибку на сервере для отладки
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при загрузке аватарки: " + e.getMessage());
        }
    }
} 