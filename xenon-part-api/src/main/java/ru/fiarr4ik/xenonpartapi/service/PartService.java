package ru.fiarr4ik.xenonpartapi.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.fiarr4ik.xenonpartapi.dto.PartRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.PartResponseDTO;
import ru.fiarr4ik.xenonpartapi.entity.Category;
import ru.fiarr4ik.xenonpartapi.entity.Part;
import ru.fiarr4ik.xenonpartapi.entity.Supplier;
import ru.fiarr4ik.xenonpartapi.mapper.PartMapper;
import ru.fiarr4ik.xenonpartapi.repository.CategoryRepository;
import ru.fiarr4ik.xenonpartapi.repository.PartRepository;
import ru.fiarr4ik.xenonpartapi.repository.SupplierRepository;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Сервис для работы с запчастями.
 */
@Service
@RequiredArgsConstructor
public class PartService {

    private final PartRepository partRepository;
    private final PartMapper partMapper;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    /**
     * Создает новую запчасть.
     *
     * @param requestDto данные для создания запчасти
     * @return созданная запчасть
     */
    public PartResponseDTO create(PartRequestDTO requestDto) {
        Category category = categoryRepository.findById(requestDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Категория не найдена: " + requestDto.getCategoryId()));
        Supplier supplier = supplierRepository.findById(requestDto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Поставщик не найден: " + requestDto.getSupplierId()));

        Part part = partMapper.toEntity(requestDto);
        part.setCategory(category);
        part.setSupplier(supplier);

        Part saved = partRepository.save(part);
        return partMapper.toResponseDto(saved);
    }

    /**
     * Обновляет запчасть по ID.
     *
     * @param id идентификатор запчасти
     * @param requestDto данные для обновления запчасти
     * @return обновленная запчасть
     */
    public PartResponseDTO update(Long id, PartRequestDTO requestDto) {
        Part existing = partRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запчасть не найдена: " + id));

        partMapper.updateEntityFromDto(requestDto, existing);

        Category category = categoryRepository.findById(requestDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Категория не найдена: " + requestDto.getCategoryId()));
        Supplier supplier = supplierRepository.findById(requestDto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Поставщик не найден: " + requestDto.getSupplierId()));

        existing.setCategory(category);
        existing.setSupplier(supplier);

        Part updated = partRepository.save(existing);
        return partMapper.toResponseDto(updated);
    }

    /**
     * Удаляет запчасть по ID.
     *
     * @param id идентификатор запчасти
     */
    public void delete(Long id) {
        if (!partRepository.existsById(id)) {
            throw new RuntimeException("Запчасть не найдена: " + id);
        }
        partRepository.deleteById(id);
    }

    /**
     * Получает запчасть по ID.
     *
     * @param id идентификатор запчасти
     * @return запчасть
     */
    public PartResponseDTO findById(Long id) {
        Part part = partRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запчасть не найдена: " + id));
        return partMapper.toResponseDto(part);
    }

    /**
     * Получает все запчасти.
     *
     * @return список всех запчастей
     */
    public List<PartResponseDTO> findAll() {
        return partRepository.findAll().stream()
                .map(partMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Получает количество запчастей.
     *
     * @return количество запчастей
     */
    public long count() {
        return partRepository.count();
    }
}