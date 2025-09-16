package com.sahilKumar.house_rental_portal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sahilKumar.house_rental_portal.service.AuthService;
import com.sahilKumar.house_rental_portal.dto.SignupRequest;
import com.sahilKumar.house_rental_portal.dto.LoginRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3001")
public class AuthController {
	private final AuthService authService;
	
	public AuthController(AuthService authService) {
		this.authService = authService;
	}
	
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
		Map<String, Object> response = authService.register(request);
		return ResponseEntity.ok(response);
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request) {
		Map<String, Object> response = authService.login(request);
		return ResponseEntity.ok(response);
	}
}