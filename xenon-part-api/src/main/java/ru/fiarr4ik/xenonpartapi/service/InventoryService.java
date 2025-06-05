package ru.fiarr4ik.xenonpartapi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fiarr4ik.xenonpartapi.dto.InventoryRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.InventoryResponseDTO;
import ru.fiarr4ik.xenonpartapi.entity.Inventory;
import ru.fiarr4ik.xenonpartapi.repository.InventoryRepository;
import ru.fiarr4ik.xenonpartapi.mapper.InventoryMapper;
import ru.fiarr4ik.xenonpartapi.repository.PartRepository;
import ru.fiarr4ik.xenonpartapi.entity.Part;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Сервис для работы с инвентарем.
 */
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryMapper inventoryMapper;
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
        Inventory inventory = inventoryMapper.toEntity(requestDto);
        inventory.setPart(part);
        Inventory savedInventory = inventoryRepository.save(inventory);
        return inventoryMapper.toDto(savedInventory);
    }

    /**
     * Получает все записи инвентаря.
     *
     * @return список всех записей инвентаря
     */
    public List<InventoryResponseDTO> findAll() {
        return inventoryRepository.findAll().stream()
                .map(inventoryMapper::toDto)
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
        return inventoryMapper.toDto(inventory);
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
        inventoryMapper.updateEntityFromDto(requestDto, inventory);
        inventory.setPart(part);
        Inventory updatedInventory = inventoryRepository.save(inventory);
        return inventoryMapper.toDto(updatedInventory);
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
    public Long count() {
        return inventoryRepository.count();
    }
}