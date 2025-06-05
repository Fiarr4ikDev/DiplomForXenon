package ru.fiarr4ik.xenonpartapi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fiarr4ik.xenonpartapi.dto.CategoryRequestDTO;
import ru.fiarr4ik.xenonpartapi.dto.CategoryResponseDTO;
import ru.fiarr4ik.xenonpartapi.entity.Category;
import ru.fiarr4ik.xenonpartapi.exception.EntityNotFoundException;
import ru.fiarr4ik.xenonpartapi.mapper.CategoryMapper;
import ru.fiarr4ik.xenonpartapi.repository.CategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryResponseDTO create(CategoryRequestDTO requestDto) {
        Category category = categoryMapper.toEntity(requestDto);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponseDTO findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Категория не найдена: " + id));
        return categoryMapper.toResponseDto(category);
    }

    public CategoryResponseDTO update(Long id, CategoryRequestDTO requestDto) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Категория не найдена: " + id));
        categoryMapper.updateEntityFromDto(requestDto, existing);
        Category updated = categoryRepository.save(existing);
        return categoryMapper.toResponseDto(updated);
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Категория не найдена: " + id);
        }
        categoryRepository.deleteById(id);
    }

    public long count() {
        return categoryRepository.count();
    }
}