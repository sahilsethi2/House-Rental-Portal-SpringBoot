package com.sahilKumar.house_rental_portal.controller;

import org.springframework.web.bind.annotation.*;
import com.sahilKumar.house_rental_portal.model.Booking;
import com.sahilKumar.house_rental_portal.model.Property;
import com.sahilKumar.house_rental_portal.repository.BookingRepository;
import com.sahilKumar.house_rental_portal.repository.PropertyRepository;
import com.sahilKumar.house_rental_portal.dto.BookingRequest;
import com.sahilKumar.house_rental_portal.dto.BookingWithProperty;
import com.sahilKumar.house_rental_portal.dto.StatusUpdateRequest;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3001")
public class BookingController {
	private final BookingRepository bookingRepository;
	private final PropertyRepository propertyRepository;

	public BookingController(BookingRepository bookingRepository, PropertyRepository propertyRepository) {
		this.bookingRepository = bookingRepository;
		this.propertyRepository = propertyRepository;
	}

	@PostMapping
	public Booking createBooking(@RequestBody BookingRequest request) {
		Booking booking = new Booking(
			request.propertyId,
			request.customerName,
			request.customerEmail,
			request.customerPhone,
			request.checkInDate,
			request.checkOutDate
		);
		return bookingRepository.save(booking);
	}

	@GetMapping("/customer/{email}")
	public List<BookingWithProperty> getCustomerBookings(@PathVariable String email) {
		List<Booking> bookings = bookingRepository.findByCustomerEmail(email);
		return bookings.stream().map(booking -> {
			Property property = propertyRepository.findById(booking.getPropertyId()).orElse(null);
			return new BookingWithProperty(booking, property);
		}).toList();
	}

	@GetMapping("/owner/{ownerName}")
	public List<BookingWithProperty> getOwnerBookings(@PathVariable String ownerName) {
		List<Property> ownerProperties = propertyRepository.findByOwnerName(ownerName);
		List<Long> propertyIds = ownerProperties.stream().map(Property::getId).toList();
		List<Booking> bookings = bookingRepository.findByPropertyIdIn(propertyIds);
		return bookings.stream().map(booking -> {
			Property property = propertyRepository.findById(booking.getPropertyId()).orElse(null);
			return new BookingWithProperty(booking, property);
		}).toList();
	}

	@PutMapping("/{id}/status")
	public Booking updateBookingStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
		Booking booking = bookingRepository.findById(id).orElse(null);
		if (booking != null) {
			booking.setStatus(request.status);
			return bookingRepository.save(booking);
		}
		return null;
	}
}