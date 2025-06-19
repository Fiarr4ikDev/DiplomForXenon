package ru.fiarr4ik.xenonpartapi.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import ru.fiarr4ik.xenonpartapi.dto.*;
import ru.fiarr4ik.xenonpartapi.entity.*;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class GlobalMapper {

    private final ModelMapper modelMapper;

    public GlobalMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    // ---------- Category ----------
    public CategoryResponseDTO toCategoryResponseDto(Category category) {
        return modelMapper.map(category, CategoryResponseDTO.class);
    }

    public Category toCategoryEntity(CategoryRequestDTO dto) {
        return modelMapper.map(dto, Category.class);
    }

    public void updateCategoryFromDto(CategoryRequestDTO dto, Category entity) {
        modelMapper.map(dto, entity);
    }

    public List<CategoryResponseDTO> toCategoryResponseList(List<Category> categories) {
        return categories.stream().map(this::toCategoryResponseDto).collect(Collectors.toList());
    }

    // ---------- Inventory ----------
    public Inventory toInventoryEntity(InventoryRequestDTO dto) {
        return modelMapper.map(dto, Inventory.class);
    }

    public InventoryResponseDTO toInventoryResponseDto(Inventory entity) {
        InventoryResponseDTO dto = modelMapper.map(entity, InventoryResponseDTO.class);
        if (entity.getPart() != null) {
            dto.setPartId(entity.getPart().getPartId());
        }
        return dto;
    }

    public void updateInventoryFromDto(InventoryRequestDTO dto, Inventory entity) {
        modelMapper.map(dto, entity);
    }

    public List<InventoryResponseDTO> toInventoryResponseList(List<Inventory> inventoryList) {
        return inventoryList.stream().map(this::toInventoryResponseDto).collect(Collectors.toList());
    }

    // ---------- Part ----------
    public Part toPartEntity(PartRequestDTO dto) {
        return modelMapper.map(dto, Part.class);
    }

    public PartResponseDTO toPartResponseDto(Part part) {
        PartResponseDTO dto = modelMapper.map(part, PartResponseDTO.class);
        if (part.getCategory() != null) {
            dto.setCategoryId(part.getCategory().getCategoryId());
            dto.setCategoryName(part.getCategory().getName());
        }
        if (part.getSupplier() != null) {
            dto.setSupplierId(part.getSupplier().getSupplierId());
            dto.setSupplierName(part.getSupplier().getName());
        }
        return dto;
    }

    public void updatePartFromDto(PartRequestDTO dto, Part entity) {
        modelMapper.map(dto, entity);
    }

    public List<PartResponseDTO> toPartResponseList(List<Part> parts) {
        return parts.stream().map(this::toPartResponseDto).collect(Collectors.toList());
    }

    // ---------- Supplier ----------
    public Supplier toSupplierEntity(SupplierRequestDTO dto) {
        return modelMapper.map(dto, Supplier.class);
    }

    public SupplierResponseDTO toSupplierResponseDto(Supplier supplier) {
        return modelMapper.map(supplier, SupplierResponseDTO.class);
    }

    public void updateSupplierFromDto(SupplierRequestDTO dto, Supplier supplier) {
        modelMapper.map(dto, supplier);
    }

    public List<SupplierResponseDTO> toSupplierResponseList(List<Supplier> suppliers) {
        return suppliers.stream().map(this::toSupplierResponseDto).collect(Collectors.toList());
    }
}
