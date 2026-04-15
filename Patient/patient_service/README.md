# Patient Service

A microservice for managing patient profiles and user data in the CareHouse patient management system. This service handles patient registration, authentication token management, and comprehensive patient profile CRUD operations.

## Overview

The Patient Service is a RESTful Node.js/Express microservice that provides APIs for:
- **Patient Registration**: Create new patient profiles with unique email and phone validation
- **Patient Profile Management**: Read, update, and delete patient information
- **Authentication**: JWT refresh token management for session persistence
- **Location Tracking**: Store geographic information for each patient
- **Relationship Management**: Link patients to medical records, appointments, and reports
- **Query Operations**: Search patients by email address or refresh token

## Features

✅ Full CRUD operations for patient profiles  
✅ Unique email and phone number validation  
✅ Secure password storage (excluded from responses)  
✅ Geographic location data (address, city, country, GPS coordinates)  
✅ JWT refresh token management  
✅ Role-based patient identification  
✅ Patient profile image support  
✅ Medical records and appointments tracking  
✅ Advanced filtering and query capabilities  
✅ MongoDB persistence with Mongoose ODM  
✅ Automatic timestamp tracking  

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Environment**: dotenv
- **Validation**: Custom middleware for required attributes

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB running locally or remote connection
- npm or yarn

### Setup

1. Clone or navigate to the service directory
```bash
cd patient_service
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
# MongoDB Connection
DATABASE_URI=mongodb://localhost:27017/patients
# or for remote MongoDB
DATABASE_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/patients

```

4. Start the service
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The service will listen on `http://localhost:5003`

## Project Structure

```
patient_service/
├── app.js                           # Express app entry point
├── package.json                     # Dependencies and scripts
├── config/
│   └── connectDB.js                # MongoDB connection configuration
├── controller/
│   └── patientController.js        # Patient CRUD handlers
├── middleWare/
│   └── verifyRequiredAttributes.js # Request validation middleware
├── model/
│   └── Patient.js                  # Patient schema
├── route/
│   └── patients.js                 # Patient routes
└── test/
    └── request.rest                # API test requests
```

## Database Model

### Patient

```javascript
{
  first_name: String,               // First name (required)
  last_name: String,                // Last name (required)
  email_address: String,            // Email (required, unique)
  password: String,                 // Hashed password (required)
  gender: String,                   // Gender (required)
  phone_number: String,             // Phone (required, unique)
  birth_date: String,               // Date of birth (required)
  image: ObjectId,                  // Profile image reference
  role_patient: Number,             // Role identifier (default: 2002)
  location: {
    address: String,                // Street address (required)
    country: String,                // Country (required)
    city: String,                   // City (required)
    longitude: Double,              // GPS longitude (required)
    latitude: Double                // GPS latitude (required)
  },
  createdAt: Date,                  // Creation timestamp (auto-generated)
  medical_reports: [ObjectId],      // Array of report references
  appointments: [ObjectId],         // Array of appointment references
  medical_folder: ObjectId,         // Reference to medical folder
  refreshToken: [String]            // Array of JWT refresh tokens
}
```

**Constraints:**
- Email and phone number must be unique
- All marked fields are required for registration
- Passwords are excluded from all API responses
- Refresh tokens are excluded from list operations

## API Endpoints

### Base URL
```
http://localhost:5003/api/patients
```

### Patients

#### Get all patients
```
GET /patients
```
**Response**: 200 OK - Array of patient profiles (excludes password, refresh token, role)
**Error**: 404 Not Found - If no patients exist

**Note:** Sensitive fields (password, refreshToken, role_patient) are excluded from responses

#### Get specific patient by ID
```
GET /patients/:patientId
```
**Response**: 200 OK - Patient profile object
**Error**: 404 Not Found - If patient doesn't exist

#### Get patient by email or refresh token
```
GET /patients/query?email=user@example.com
GET /patients/query?refreshToken=token_string
```
**Response**: 200 OK - Patient profile object
**Parameters:**
- `email` (optional) - Search by email address
- `refreshToken` (optional) - Search by refresh token

#### Create new patient (Register)
```
POST /patients
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email_address": "john.doe@example.com",
  "password": "securePassword123",
  "gender": "Male",
  "phone_number": "+1-555-0123",
  "birth_date": "1990-01-15",
  "location": {
    "address": "123 Main Street",
    "country": "USA",
    "city": "New York",
    "longitude": -74.0060,
    "latitude": 40.7128
  }
}
```
**Response**: 201 Created - New patient profile
**Error**: 
- 400 Bad Request - Missing required fields
- 409 Conflict - Email or phone already exists

**Required Fields:**
- first_name, last_name, email_address, password, gender, phone_number, birth_date
- location: address, country, city, longitude, latitude

#### Update patient profile
```
PUT /patients/:patientId
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Smith",
  ...other fields to update
}
```
**Response**: 200 OK - Updated patient profile
**Error**: 404 Not Found - If patient doesn't exist

#### Delete patient
```
DELETE /patients/:patientId
```
**Response**: 200 OK - Deletion confirmation
**Error**: 404 Not Found - If patient doesn't exist

#### Delete appointment from patient
```
DELETE /patients/:patientId/appointments/:appointmentId
```
**Response**: 200 OK - Appointment removed from patient profile
**Error**: 404 Not Found - If patient or appointment doesn't exist

**Use Case:** Remove an appointment reference from patient's appointment list

## Key Business Logic

### Patient Registration Validation

1. **Required Fields Check**: Validates all required fields are present
2. **Email Uniqueness**: Ensures no duplicate email addresses
3. **Phone Uniqueness**: Ensures no duplicate phone numbers
4. **Middleware Validation**: Uses `verifyRequiredAttributes` middleware to validate request
5. **Error Handling**: Returns descriptive error messages

### Response Filtering

Sensitive data is automatically excluded from responses:
- `password` - Never returned
- `refreshToken` - Not returned in list operations
- `role_patient` - Internal use only

### Status Codes

- `200 OK`: Successful GET, PUT, or DELETE request
- `201 Created`: Patient successfully created
- `400 Bad Request`: Missing required fields or validation failure
- `404 Not Found`: Patient doesn't exist
- `409 Conflict`: Duplicate email or phone number
- `500 Internal Server Error`: Database or server error

## Running Tests

Test files are included in the `test/` directory in REST client format:

- `request.rest`: Patient API endpoint tests

These can be run using VS Code REST Client extension or similar tools.

## Environment Configuration

The service requires the following environment variables:

```env
DATABASE_URI    # MongoDB connection string
```

For development, create a `.env` file with these variables.

## Performance Considerations

- **Indexes**: Ensure MongoDB has indexes on:
  - `Patient.email_address` (for unique constraint and lookup)
  - `Patient.phone_number` (for unique constraint)
  - `Patient.medical_folder` (for medical record queries)

- **Scaling**: This service is stateless and can be horizontally scaled behind a load balancer

- **Data Privacy**: Implement encryption for sensitive patient data (HIPAA/GDPR compliance)

## Error Handling

The service provides descriptive JSON error responses:

```json
{
  "message": "Error description"
}
```

Common scenarios:
- Missing required fields returns 400
- Duplicate email/phone returns 409
- Patient not found returns 404
- Database errors return 500

## Integration with Other Services

This service integrates with:

- **Appointment Service** (Port 5001): Manages patient appointments
- **Medical Folder Service** (Port 5002): Stores patient medical records
- **Report Service**: Links medical reports to patients
- **Patient Interface Backend** (Port 5000): Uses patient data for authentication and profiles

## Use Cases

### 1. Patient Registration
When a new user registers, create a patient profile with contact information and location.

### 2. Patient Login
Retrieve patient by email and verify credentials for authentication.

### 3. Profile Update
Update patient information such as contact details, address, or personal data.

### 4. Medical Record Association
Link patient to medical folder, appointments, and reports.

### 5. Patient Search
Query patients by email for administrative or verification purposes.

### 6. Appointment Management
Add/remove appointments from patient's appointment list.

## Future Enhancements

- [ ] Email verification for patient registration
- [ ] Patient notification preferences
- [ ] Advanced search and filtering
- [ ] Bulk patient import/export
- [ ] Patient activity audit logs
- [ ] Emergency contact management
- [ ] Medical history summary
- [ ] Patient portal features
- [ ] Appointment scheduling integration
- [ ] Insurance information management

## License

apache-2.0 License
