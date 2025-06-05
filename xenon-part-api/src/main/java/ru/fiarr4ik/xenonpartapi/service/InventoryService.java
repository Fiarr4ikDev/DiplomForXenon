package ru.fiarr4ik.xenonpartapi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.fiarr4ik.xenonpartapi.dto.InventoryRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.InventoryResponseDTO;
import ru.fiarr4ik.xenonpartapi.entity.Inventory;
import ru.fiarr4ik.xenonpartapi.repository.InventoryRepository;
import ru.fiarr4ik.xenonpartapi.mapper.InventoryMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryMapper inventoryMapper;

    public InventoryResponseDTO create(InventoryRequestDTO requestDto) {
        Inventory inventory = inventoryMapper.toEntity(requestDto);
        Inventory savedInventory = inventoryRepository.save(inventory);
        return inventoryMapper.toDto(savedInventory);
    }

    public List<InventoryResponseDTO> findAll() {
        return inventoryRepository.findAll().stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    public InventoryResponseDTO findById(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));
        return inventoryMapper.toDto(inventory);
    }

    public InventoryResponseDTO update(Long id, InventoryRequestDTO requestDto) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));
        inventoryMapper.updateEntityFromDto(requestDto, inventory);
        Inventory updatedInventory = inventoryRepository.save(inventory);
        return inventoryMapper.toDto(updatedInventory);
    }

    public void delete(Long id) {
        inventoryRepository.deleteById(id);
    }

    public Long count() {
        return inventoryRepository.count();
    }
} 