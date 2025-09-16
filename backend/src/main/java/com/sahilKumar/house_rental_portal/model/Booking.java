package com.sahilKumar.house_rental_portal.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {
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