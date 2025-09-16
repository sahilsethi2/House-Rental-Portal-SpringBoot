package com.sahilKumar.house_rental_portal.dto;

import com.sahilKumar.house_rental_portal.model.Booking;
import com.sahilKumar.house_rental_portal.model.Property;

public class BookingWithProperty {
	public Booking booking;
	public Property property;
	
	public BookingWithProperty(Booking booking, Property property) {
		this.booking = booking;
		this.property = property;
	}
}