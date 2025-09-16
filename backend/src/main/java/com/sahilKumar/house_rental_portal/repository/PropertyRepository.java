package com.sahilKumar.house_rental_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sahilKumar.house_rental_portal.model.Property;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
	List<Property> findByOwnerName(String ownerName);
}