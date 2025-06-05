package ru.fiarr4ik.xenonpartapi.service;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.fiarr4ik.xenonpartapi.dto.SupplierRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.SupplierResponseDTO;
import ru.fiarr4ik.xenonpartapi.entity.Supplier;
import ru.fiarr4ik.xenonpartapi.mapper.SupplierMapper;
import ru.fiarr4ik.xenonpartapi.repository.SupplierRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    public SupplierResponseDTO create(SupplierRequestDTO requestDTO) {
        try {
            Supplier supplier = supplierMapper.toEntity(requestDTO);
            Supplier saved = supplierRepository.save(supplier);
            return supplierMapper.toResponseDTO(saved);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при создании поставщика: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<SupplierResponseDTO> findAll() {
        return supplierRepository.findAll().stream()
                .map(supplierMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SupplierResponseDTO findById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Поставщик не найден: " + id));
        return supplierMapper.toResponseDTO(supplier);
    }

    public SupplierResponseDTO update(Long id, SupplierRequestDTO requestDTO) {
        Supplier existing = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Поставщик не найден: " + id));
        supplierMapper.updateEntityFromDto(requestDTO, existing);
        Supplier updated = supplierRepository.save(existing);
        return supplierMapper.toResponseDTO(updated);
    }

    public void delete(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Поставщик не найден: " + id);
        }
        supplierRepository.deleteById(id);
    }

    public long count() {
        return supplierRepository.count();
    }
}
