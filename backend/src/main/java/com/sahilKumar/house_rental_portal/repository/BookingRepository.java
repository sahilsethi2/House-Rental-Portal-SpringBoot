package com.sahilKumar.house_rental_portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sahilKumar.house_rental_portal.model.Booking;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
	List<Booking> findByCustomerEmail(String customerEmail);
	List<Booking> findByPropertyIdIn(List<Long> propertyIds);
}