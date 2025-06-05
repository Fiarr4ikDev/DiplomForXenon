package ru.fiarr4ik.xenonpartapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.fiarr4ik.xenonpartapi.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
