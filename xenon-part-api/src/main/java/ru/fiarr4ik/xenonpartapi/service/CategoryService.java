package ru.fiarr4ik.xenonpartapi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.fiarr4ik.xenonpartapi.dto.CategoryRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.CategoryResponseDTO;
import ru.fiarr4ik.xenonpartapi.entity.Category;
import ru.fiarr4ik.xenonpartapi.exception.EntityNotFoundException;
import ru.fiarr4ik.xenonpartapi.mapper.GlobalMapper;
import ru.fiarr4ik.xenonpartapi.repository.CategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Сервис для работы с категориями.
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final GlobalMapper categoryMapper;

    /**
     * Создает новую категорию.
     *
     * @param requestDto данные для создания категории
     * @return созданная категория
     */
    public CategoryResponseDTO create(CategoryRequestDTO requestDto) {
        Category category = categoryMapper.toCategoryEntity(requestDto);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toCategoryResponseDto(saved);
    }

    /**
     * Получает все категории.
     *
     * @return список всех категорий
     */
    public List<CategoryResponseDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toCategoryResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Получает категорию по ID.
     *
     * @param id идентификатор категории
     * @return категория
     */
    public CategoryResponseDTO findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Категория не найдена: " + id));
        return categoryMapper.toCategoryResponseDto(category);
    }

    /**
     * Обновляет категорию по ID.
     *
     * @param id идентификатор категории
     * @param requestDto данные для обновления категории
     * @return обновленная категория
     */
    public CategoryResponseDTO update(Long id, CategoryRequestDTO requestDto) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Категория не найдена: " + id));
        categoryMapper.updateCategoryFromDto(requestDto, existing);
        Category updated = categoryRepository.save(existing);
        return categoryMapper.toCategoryResponseDto(updated);
    }

    /**
     * Удаляет категорию по ID.
     *
     * @param id идентификатор категории
     */
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Категория не найдена: " + id);
        }
        categoryRepository.deleteById(id);
    }

    /**
     * Получает количество категорий.
     *
     * @return количество категорий
     */
    public long count() {
        return categoryRepository.count();
    }
}