package com.sahilKumar.house_rental_portal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "properties")
public class Property {
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
	private String imageUrl;

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
		this.imageUrl = null;
	}
	
	public Property(String title, String description, String address, double monthlyRent, int bedrooms, int bathrooms, String ownerName, String imageUrl) {
		this.title = title;
		this.description = description;
		this.address = address;
		this.monthlyRent = monthlyRent;
		this.bedrooms = bedrooms;
		this.bathrooms = bathrooms;
		this.ownerName = ownerName;
		this.imageUrl = imageUrl;
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
	
	public String getImageUrl() { return imageUrl; }
	public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}