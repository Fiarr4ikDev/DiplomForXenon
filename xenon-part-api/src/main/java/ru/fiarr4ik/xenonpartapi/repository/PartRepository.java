package ru.fiarr4ik.xenonpartapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.fiarr4ik.xenonpartapi.entity.Part;

public interface PartRepository extends JpaRepository<Part, Long> {

}
