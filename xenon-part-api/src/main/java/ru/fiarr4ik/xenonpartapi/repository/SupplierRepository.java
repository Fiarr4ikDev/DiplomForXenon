package ru.fiarr4ik.xenonpartapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.fiarr4ik.xenonpartapi.entity.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

}
