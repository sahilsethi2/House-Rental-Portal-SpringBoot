# House Rental Portal Backend

This is the backend service for the House Rental Portal application built with Spring Boot.

## Project Structure

```
src/main/java/com/sahilKumar/house_rental_portal/
├── HouseRentalPortalApplication.java  # Main Spring Boot application class
├── config/                            # Configuration classes
│   ├── SecurityConfig.java           # Spring Security configuration
│   └── WebConfig.java                # Web MVC configuration
├── controller/                        # REST API controllers
│   ├── AuthController.java           # Authentication endpoints
│   ├── BookingController.java        # Booking management endpoints
│   ├── FileUploadController.java     # File upload endpoints
│   └── PropertyController.java       # Property management endpoints
├── dto/                              # Data Transfer Objects
│   ├── BookingRequest.java           # Booking creation request
│   ├── BookingWithProperty.java      # Booking with property details
│   ├── LoginRequest.java             # User login request
│   ├── PropertyRequest.java          # Property creation/update request
│   ├── SignupRequest.java            # User registration request
│   └── StatusUpdateRequest.java      # Booking status update request
├── model/                            # Entity models
│   ├── Booking.java                  # Booking entity
│   ├── Property.java                 # Property entity
│   ├── User.java                     # User entity
│   └── UserRole.java                 # User role enum
├── repository/                       # Data access layer
│   ├── BookingRepository.java        # Booking repository
│   ├── PropertyRepository.java       # Property repository
│   └── UserRepository.java           # User repository
├── service/                          # Business logic layer
│   └── AuthService.java              # Authentication service
└── util/                             # Utility classes
    └── JwtUtil.java                  # JWT token utility
```

## Features

- **User Authentication**: JWT-based authentication system
- **Property Management**: CRUD operations for properties
- **Booking System**: Property booking and management
- **File Upload**: Image upload for properties
- **Role-based Access**: Owner and Customer roles

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/{id}` - Get property by ID
- `GET /api/properties/owner/{ownerName}` - Get properties by owner
- `POST /api/properties/owner` - Create new property
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/customer/{email}` - Get customer bookings
- `GET /api/bookings/owner/{ownerName}` - Get owner bookings
- `PUT /api/bookings/{id}/status` - Update booking status

### File Upload
- `POST /api/upload/image` - Upload property image

## Database Configuration

The application uses MySQL database with the following configuration in `application.properties`:

- Database: `house_rental_db`
- Port: `3306`
- Hibernate DDL: `update` (preserves data between restarts)

## Running the Application

1. Ensure MySQL is running
2. Update database credentials in `application.properties` if needed
3. Run: `mvn spring-boot:run`
4. The application will start on `http://localhost:8080`

## Technologies Used

- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- MySQL
- JWT for authentication
- Maven for build management