package ru.fiarr4ik.xenonpartapi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.fiarr4ik.xenonpartapi.dto.InventoryRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.InventoryResponseDTO;
import ru.fiarr4ik.xenonpartapi.entity.Inventory;
import ru.fiarr4ik.xenonpartapi.exception.ResourceNotFoundException;
import ru.fiarr4ik.xenonpartapi.mapper.GlobalMapper;
import ru.fiarr4ik.xenonpartapi.repository.InventoryRepository;
import ru.fiarr4ik.xenonpartapi.repository.PartRepository;
import ru.fiarr4ik.xenonpartapi.entity.Part;
import java.time.LocalDateTime;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Сервис для работы с инвентарем.
 */
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final GlobalMapper inventoryMapper;
    private final PartRepository partRepository;

    /**
     * Создает новую запись инвентаря.
     *
     * @param requestDto данные для создания записи инвентаря
     * @return созданная запись инвентаря
     */
    public InventoryResponseDTO create(InventoryRequestDTO requestDto) {
        Part part = partRepository.findById(requestDto.getPartId())
                .orElseThrow(() -> new RuntimeException("Запчасть не найдена: " + requestDto.getPartId()));
        Inventory inventory = inventoryMapper.toInventoryEntity(requestDto);
        inventory.setPart(part);
        Inventory savedInventory = inventoryRepository.save(inventory);
        return inventoryMapper.toInventoryResponseDto(savedInventory);
    }

    /**
     * Получает все записи инвентаря.
     *
     * @return список всех записей инвентаря
     */
    public List<InventoryResponseDTO> findAll() {
        return inventoryRepository.findAll().stream()
                .map(inventoryMapper::toInventoryResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Получает запись инвентаря по ID.
     *
     * @param id идентификатор записи инвентаря
     * @return запись инвентаря
     */
    public InventoryResponseDTO findById(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));
        return inventoryMapper.toInventoryResponseDto(inventory);
    }

    /**
     * Обновляет запись инвентаря по ID.
     *
     * @param id идентификатор записи инвентаря
     * @param requestDto данные для обновления записи инвентаря
     * @return обновленная запись инвентаря
     */
    public InventoryResponseDTO update(Long id, InventoryRequestDTO requestDto) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));
        Part part = partRepository.findById(requestDto.getPartId())
                .orElseThrow(() -> new RuntimeException("Запчасть не найдена: " + requestDto.getPartId()));
        inventoryMapper.updateInventoryFromDto(requestDto, inventory);
        inventory.setPart(part);
        Inventory updatedInventory = inventoryRepository.save(inventory);
        return inventoryMapper.toInventoryResponseDto(updatedInventory);
    }

    /**
     * Удаляет запись инвентаря по ID.
     *
     * @param id идентификатор записи инвентаря
     */
    public void delete(Long id) {
        inventoryRepository.deleteById(id);
    }

    /**
     * Получает количество записей инвентаря.
     *
     * @return количество записей инвентаря
     */
    public long count() {
        return inventoryRepository.count();
    }

    /**
     * Добавляет количество к записи инвентаря.
     *
     * @param id идентификатор записи инвентаря
     * @param quantity количество для добавления
     * @return обновленная запись инвентаря
     * @throws ResourceNotFoundException если запись не найдена
     */
    public InventoryResponseDTO addQuantity(Long id, Integer quantity) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Запись инвентаря не найдена"));

        inventory.setQuantityInStock(inventory.getQuantityInStock() + quantity);
        inventory.setLastRestockDate(LocalDateTime.now());

        Inventory savedInventory = inventoryRepository.save(inventory);
        return inventoryMapper.toInventoryResponseDto(savedInventory);
    }

    /**
     * Вычитает количество из записи инвентаря.
     *
     * @param id идентификатор записи инвентаря
     * @param quantity количество для вычитания
     * @return обновленная запись инвентаря
     * @throws ResourceNotFoundException если запись не найдена
     * @throws IllegalArgumentException если недостаточно товара на складе
     */
    public InventoryResponseDTO removeQuantity(Long id, Integer quantity) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Запись инвентаря не найдена"));

        if (inventory.getQuantityInStock() < quantity) {
            throw new IllegalArgumentException("Недостаточно товара на складе");
        }

        inventory.setQuantityInStock(inventory.getQuantityInStock() - quantity);
        inventory.setLastRestockDate(LocalDateTime.now());

        Inventory savedInventory = inventoryRepository.save(inventory);
        return inventoryMapper.toInventoryResponseDto(savedInventory);
    }
}