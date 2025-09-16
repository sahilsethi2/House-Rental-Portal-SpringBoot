package com.sahilKumar.house_rental_portal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sahilKumar.house_rental_portal.model.Property;
import com.sahilKumar.house_rental_portal.repository.PropertyRepository;
import com.sahilKumar.house_rental_portal.dto.PropertyRequest;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:3001")
public class PropertyController {
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
		property.setImageUrl(request.imageUrl);
		return repository.save(property);
	}
	
	@GetMapping("/{id}")
	public Property getPropertyById(@PathVariable Long id) {
		return repository.findById(id).orElse(null);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Property> updateProperty(@PathVariable Long id, @RequestBody PropertyRequest request) {
		Optional<Property> propertyOpt = repository.findById(id);
		if (propertyOpt.isPresent()) {
			Property property = propertyOpt.get();
			property.setTitle(request.title);
			property.setDescription(request.description);
			property.setAddress(request.address);
			property.setMonthlyRent(request.monthlyRent);
			property.setBedrooms(request.bedrooms);
			property.setBathrooms(request.bathrooms);
			property.setOwnerName(request.ownerName);
			if (request.imageUrl != null) {
				property.setImageUrl(request.imageUrl);
			}
			Property updatedProperty = repository.save(property);
			return ResponseEntity.ok(updatedProperty);
		}
		return ResponseEntity.notFound().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, Object>> deleteProperty(@PathVariable Long id) {
		if (repository.existsById(id)) {
			repository.deleteById(id);
			return ResponseEntity.ok(Map.of("success", true, "message", "Property deleted successfully"));
		}
		return ResponseEntity.ok(Map.of("success", false, "message", "Property not found"));
	}
}