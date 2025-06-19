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
import ru.fiarr4ik.xenonpartapi.config.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
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
        try {
            Optional<User> userOptional = userService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                String token = jwtUtil.generateToken(user.getUsername(), user.getId());
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("username", user.getUsername());
                response.put("userId", user.getId());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверное имя пользователя или пароль");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при логине: " + e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UpdateUserRequest updateRequest, HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не авторизован");
            }
            User updatedUser = userService.updateUser(
                userId,
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
    public ResponseEntity<?> uploadAvatar(@RequestPart("avatar") MultipartFile avatarFile, HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не авторизован");
            }
            if (avatarFile.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Файл аватарки пуст");
            }

            byte[] avatarData = avatarFile.getBytes();
            User updatedUser = userService.updateUserAvatar(userId, avatarData);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Аватарка успешно загружена");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при загрузке аватарки: " + e.getMessage());
        }
    }
} 