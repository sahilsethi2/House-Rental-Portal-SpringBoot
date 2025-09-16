package com.sahilKumar.house_rental_portal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class HouseRentalPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(HouseRentalPortalApplication.class, args);
	}

//	@Bean
//	CommandLineRunner seed(PropertyRepository repo) {
//		return args -> {
//			if (repo.count() == 0) {
//				repo.saveAll(List.of(
//						new Property("Cozy 1BHK Apartment", "Beautiful 1BHK apartment in the heart of the city. Perfect for young professionals.", "Sector 15, Noida, UP", 15000.0, 1, 1, "John Smith"),
//						new Property("Spacious 2BHK Family Home", "Well-ventilated 2BHK apartment with modern amenities. Great for small families.", "Cyber City, Gurugram, Haryana", 25000.0, 2, 2, "Sarah Johnson"),
//						new Property("Luxury 3BHK Villa", "Premium villa with garden, parking, and all modern facilities. Perfect for large families.", "DLF Phase 2, Gurugram, Haryana", 45000.0, 3, 3, "Mike Davis")
//				));
//				System.out.println("✅ Demo data initialized successfully!");
//			}
//		};
//	}
}

@Entity
@Table(name = "properties")
class Property {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String title;
	
	@Column(length = 1000)
	private String description;
	
	private String address;
	private double monthlyRent;
	private int bedrooms;
	private int bathrooms;
	private String ownerName;

	// Constructors
	public Property() {}

	public Property(String title, String description, String address, double monthlyRent, int bedrooms, int bathrooms, String ownerName) {
		this.title = title;
		this.description = description;
		this.address = address;
		this.monthlyRent = monthlyRent;
		this.bedrooms = bedrooms;
		this.bathrooms = bathrooms;
		this.ownerName = ownerName;
	}

	// Getters and Setters
	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	
	public String getTitle() { return title; }
	public void setTitle(String title) { this.title = title; }
	
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	
	public String getAddress() { return address; }
	public void setAddress(String address) { this.address = address; }
	
	public double getMonthlyRent() { return monthlyRent; }
	public void setMonthlyRent(double monthlyRent) { this.monthlyRent = monthlyRent; }
	
	public int getBedrooms() { return bedrooms; }
	public void setBedrooms(int bedrooms) { this.bedrooms = bedrooms; }
	
	public int getBathrooms() { return bathrooms; }
	public void setBathrooms(int bathrooms) { this.bathrooms = bathrooms; }
	
	public String getOwnerName() { return ownerName; }
	public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
}

@Entity
@Table(name = "bookings")
class Booking {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private Long propertyId;
	
	@Column(nullable = false)
	private String customerName;
	
	@Column(nullable = false)
	private String customerEmail;
	
	@Column(nullable = false)
	private String customerPhone;
	
	@Column(nullable = false)
	private LocalDate checkInDate;
	
	@Column(nullable = false)
	private LocalDate checkOutDate;
	
	@Column(nullable = false)
	private String status = "PENDING";
	
	private LocalDate bookingDate = LocalDate.now();
	
	// Constructors
	public Booking() {}
	
	public Booking(Long propertyId, String customerName, String customerEmail, String customerPhone, LocalDate checkInDate, LocalDate checkOutDate) {
		this.propertyId = propertyId;
		this.customerName = customerName;
		this.customerEmail = customerEmail;
		this.customerPhone = customerPhone;
		this.checkInDate = checkInDate;
		this.checkOutDate = checkOutDate;
	}
	
	// Getters and Setters
	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	
	public Long getPropertyId() { return propertyId; }
	public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }
	
	public String getCustomerName() { return customerName; }
	public void setCustomerName(String customerName) { this.customerName = customerName; }
	
	public String getCustomerEmail() { return customerEmail; }
	public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
	
	public String getCustomerPhone() { return customerPhone; }
	public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
	
	public LocalDate getCheckInDate() { return checkInDate; }
	public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }
	
	public LocalDate getCheckOutDate() { return checkOutDate; }
	public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }
	
	public String getStatus() { return status; }
	public void setStatus(String status) { this.status = status; }
	
	public LocalDate getBookingDate() { return bookingDate; }
	public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
}

@Repository
interface PropertyRepository extends JpaRepository<Property, Long> {
	List<Property> findByOwnerName(String ownerName);
}

@Repository
interface BookingRepository extends JpaRepository<Booking, Long> {
	List<Booking> findByCustomerEmail(String customerEmail);
	List<Booking> findByPropertyIdIn(List<Long> propertyIds);
}

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:3005")
class PropertyController {
	private final PropertyRepository repository;

	public PropertyController(PropertyRepository repository) {
		this.repository = repository;
	}

	@GetMapping
	public List<Property> getAllProperties() {
		return repository.findAll();
	}

	@GetMapping("/owner/{ownerName}")
	public List<Property> getPropertiesByOwner(@PathVariable String ownerName) {
		return repository.findByOwnerName(ownerName);
	}

	@PostMapping("/owner")
	public Property createProperty(@RequestBody PropertyRequest request) {
		Property property = new Property();
		property.setTitle(request.title);
		property.setDescription(request.description);
		property.setAddress(request.address);
		property.setMonthlyRent(request.monthlyRent);
		property.setBedrooms(request.bedrooms);
		property.setBathrooms(request.bathrooms);
		property.setOwnerName(request.ownerName);
		return repository.save(property);
	}
	
	@GetMapping("/{id}")
	public Property getPropertyById(@PathVariable Long id) {
		return repository.findById(id).orElse(null);
	}

	@DeleteMapping("/{id}")
	public boolean deleteProperty(@PathVariable Long id) {
		if (repository.existsById(id)) {
			repository.deleteById(id);
			return true;
		}
		return false;
	}
}

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3005")
class BookingController {
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

class PropertyRequest {
	public String title;
	public String description;
	public String address;
	public double monthlyRent;
	public int bedrooms;
	public int bathrooms;
	public String ownerName;
}

class BookingRequest {
	public Long propertyId;
	public String customerName;
	public String customerEmail;
	public String customerPhone;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	public LocalDate checkInDate;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	public LocalDate checkOutDate;
}

class BookingWithProperty {
	public Booking booking;
	public Property property;
	
	public BookingWithProperty(Booking booking, Property property) {
		this.booking = booking;
		this.property = property;
	}
}

class StatusUpdateRequest {
	public String status;
}
