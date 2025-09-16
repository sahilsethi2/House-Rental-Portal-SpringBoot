package com.sahilKumar.house_rental_portal.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3001")
public class FileUploadController {
	
	private final String uploadDir = "uploads/";
	
	@PostMapping("/image")
	public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
		try {
			if (file.isEmpty()) {
				return ResponseEntity.badRequest().body(Map.of("error", "Please select a file to upload"));
			}
			
			// Check if file is an image
			String contentType = file.getContentType();
			if (contentType == null || !contentType.startsWith("image/")) {
				return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed"));
			}
			
			// Create uploads directory if it doesn't exist
			Path uploadPath = Paths.get(uploadDir);
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}
			
			// Generate unique filename
			String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
			String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
			String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
			
			// Save the file
			Path filePath = uploadPath.resolve(uniqueFilename);
			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
			
			// Return the file URL
			String fileUrl = "/uploads/" + uniqueFilename;
			return ResponseEntity.ok(Map.of(
				"success", true,
				"message", "File uploaded successfully",
				"imageUrl", fileUrl
			));
			
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Map.of("error", "Failed to upload file: " + e.getMessage()));
		}
	}
}