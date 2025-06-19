package ru.fiarr4ik.xenonpartapi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.fiarr4ik.xenonpartapi.dto.SupplierRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.SupplierResponseDTO;
import ru.fiarr4ik.xenonpartapi.entity.Supplier;
import ru.fiarr4ik.xenonpartapi.mapper.GlobalMapper;
import ru.fiarr4ik.xenonpartapi.repository.SupplierRepository;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Сервис для работы с поставщиками.
 */
@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final GlobalMapper supplierMapper;

    /**
     * Создает нового поставщика.
     *
     * @param requestDTO данные для создания поставщика
     * @return созданный поставщик
     */
    public SupplierResponseDTO create(SupplierRequestDTO requestDTO) {
        try {
            Supplier supplier = supplierMapper.toSupplierEntity(requestDTO);
            Supplier saved = supplierRepository.save(supplier);
            return supplierMapper.toSupplierResponseDto(saved);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при создании поставщика: " + e.getMessage());
        }
    }

    /**
     * Получает всех поставщиков.
     *
     * @return список всех поставщиков
     */
    public List<SupplierResponseDTO> findAll() {
        return supplierRepository.findAll().stream()
                .map(supplierMapper::toSupplierResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Получает поставщика по ID.
     *
     * @param id идентификатор поставщика
     * @return поставщик
     */
    public SupplierResponseDTO findById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Поставщик не найден: " + id));
        return supplierMapper.toSupplierResponseDto(supplier);
    }

    /**
     * Обновляет поставщика по ID.
     *
     * @param id идентификатор поставщика
     * @param requestDTO данные для обновления поставщика
     * @return обновленный поставщик
     */
    public SupplierResponseDTO update(Long id, SupplierRequestDTO requestDTO) {
        Supplier existing = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Поставщик не найден: " + id));
        supplierMapper.updateSupplierFromDto(requestDTO, existing);
        Supplier updated = supplierRepository.save(existing);
        return supplierMapper.toSupplierResponseDto(updated);
    }

    /**
     * Удаляет поставщика по ID.
     *
     * @param id идентификатор поставщика
     */
    public void delete(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Поставщик не найден: " + id);
        }
        supplierRepository.deleteById(id);
    }

    /**
     * Получает количество поставщиков.
     *
     * @return количество поставщиков
     */
    public long count() {
        return supplierRepository.count();
    }
}
