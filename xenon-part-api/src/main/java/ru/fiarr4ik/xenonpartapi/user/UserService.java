package ru.fiarr4ik.xenonpartapi.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerNewUser(String username, String password) {
        // Проверить, существует ли пользователь с таким именем
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Пользователь с таким именем уже существует");
        }

        // Создать нового пользователя
        User user = new User();
        user.setUsername(username);
        user.setPassword(hashPassword(password)); // Хэшируем пароль вручную

        // Сохранить пользователя в базе данных
        return userRepository.save(user);
    }

    public Optional<User> authenticateUser(String username, String password) {
        // Найти пользователя по имени
        Optional<User> userOptional = userRepository.findByUsername(username);

        // Если пользователь найден и пароль совпадает
        if (userOptional.isPresent() && verifyPassword(password, userOptional.get().getPassword())) {
            System.out.println("Логин успешен для " + username);
            return userOptional;
        } else {
            return Optional.empty();
        }
    }

    // Метод для ручного хэширования пароля (SHA-256)
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Ошибка при хэшировании пароля", e);
        }
    }

    // Метод для ручной проверки пароля
    private boolean verifyPassword(String rawPassword, String hashedPassword) {
        // Хэшируем введенный пароль и сравниваем с сохраненным хэшем
        return hashPassword(rawPassword).equals(hashedPassword);
    }

    public User updateUser(Long userId, String username, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Обновляем имя пользователя, если оно изменилось и предоставлено новое имя
        if (username != null && !username.trim().isEmpty() && !username.equals(user.getUsername())) {
            if (userRepository.findByUsername(username).isPresent()) {
                throw new RuntimeException("Пользователь с таким именем уже существует");
            }
            user.setUsername(username.trim());
        }

        // Обновляем пароль, если он указан
        if (newPassword != null && !newPassword.isEmpty()) {
            // Проверяем текущий пароль только при смене пароля
            if (currentPassword == null || currentPassword.isEmpty() || !verifyPassword(currentPassword, user.getPassword())) {
                 throw new RuntimeException("Неверный текущий пароль");
            }
            user.setPassword(hashPassword(newPassword));
        }

        return userRepository.save(user);
    }

    /**
     * Обновляет аватарку пользователя.
     *
     * @param userId ID пользователя.
     * @param avatarData Массив байтов с данными аватарки.
     * @return Обновленный объект пользователя.
     * @throws RuntimeException если пользователь не найден.
     */
    public User updateUserAvatar(Long userId, byte[] avatarData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        user.setAvatar(avatarData);

        return userRepository.save(user);
    }

    // Метод для получения аватарки
    public Optional<byte[]> getUserAvatar(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            return Optional.ofNullable(userOptional.get().getAvatar());
        }
        return Optional.empty();
    }

    public Map<String, String> loginUser(String username, String password) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null && verifyPassword(password, user.getPassword())) {
            // Генерируем простой токен. В реальном приложении использовать JWT или аналог.
            String token = "token-" + user.getUsername() + "-" + System.currentTimeMillis();
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", user.getUsername()); // Добавляем имя пользователя
            return response;
        }
        return null; // Возвращаем null при неуспешном входе
    }
} 