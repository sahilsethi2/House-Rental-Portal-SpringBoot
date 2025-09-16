package com.sahilKumar.house_rental_portal.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.sahilKumar.house_rental_portal.model.User;
import com.sahilKumar.house_rental_portal.model.UserRole;
import com.sahilKumar.house_rental_portal.repository.UserRepository;
import com.sahilKumar.house_rental_portal.util.JwtUtil;
import com.sahilKumar.house_rental_portal.dto.SignupRequest;
import com.sahilKumar.house_rental_portal.dto.LoginRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	
	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtil = jwtUtil;
	}
	
	public Map<String, Object> register(SignupRequest request) {
		Map<String, Object> response = new HashMap<>();
		
		if (userRepository.existsByEmail(request.email)) {
			response.put("success", false);
			response.put("message", "Email already exists");
			return response;
		}
		
		User user = new User(
			request.name,
			request.email,
			passwordEncoder.encode(request.password),
			request.phone,
			UserRole.valueOf(request.role.toUpperCase())
		);
		
		userRepository.save(user);
		
		String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString(), user.getName());
		
		response.put("success", true);
		response.put("message", "User registered successfully");
		response.put("token", token);
		response.put("user", Map.of(
			"id", user.getId(),
			"name", user.getName(),
			"email", user.getEmail(),
			"role", user.getRole().toString(),
			"phone", user.getPhone()
		));
		
		return response;
	}
	
	public Map<String, Object> login(LoginRequest request) {
		Map<String, Object> response = new HashMap<>();
		
		Optional<User> userOpt = userRepository.findByEmail(request.email);
		if (userOpt.isEmpty()) {
			response.put("success", false);
			response.put("message", "User not found");
			return response;
		}
		
		User user = userOpt.get();
		if (!passwordEncoder.matches(request.password, user.getPassword())) {
			response.put("success", false);
			response.put("message", "Invalid password");
			return response;
		}
		
		String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString(), user.getName());
		
		response.put("success", true);
		response.put("message", "Login successful");
		response.put("token", token);
		response.put("user", Map.of(
			"id", user.getId(),
			"name", user.getName(),
			"email", user.getEmail(),
			"role", user.getRole().toString(),
			"phone", user.getPhone()
		));
		
		return response;
	}
}