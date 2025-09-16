package com.sahilKumar.house_rental_portal.dto;

import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

public class BookingRequest {
	public Long propertyId;
	public String customerName;
	public String customerEmail;
	public String customerPhone;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	public LocalDate checkInDate;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	public LocalDate checkOutDate;
}