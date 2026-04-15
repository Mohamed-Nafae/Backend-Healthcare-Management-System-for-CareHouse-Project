# Patient Interface Backend

The main API Gateway and authentication layer for the CareHouse patient management system. This service acts as the single entry point for all patient-facing APIs, handling authentication, authorization, and routing requests to internal microservices.

## Overview

The Patient Interface Backend is a Node.js/Express service that provides:
- **Patient Authentication**: Registration, login, and logout functionality
- **JWT Token Management**: Access token generation and refresh token handling
- **API Gateway**: Routes requests to backend microservices
- **Role-Based Access Control**: Enforces patient role authorization
- **Request Validation**: Middleware for security and error handling
- **CORS Configuration**: Enables frontend communication
- **File Upload Management**: Document and image upload handling
- **Request Logging**: Comprehensive logging of all API requests

## Architecture

```
Client/Frontend
    ↓
Patient Interface Backend (Port 5000)
    ├── Authentication (Login/Register/Logout)
    ├── Token Management (JWT)
    ├── API Gateway (Routes)
    └── Middleware (JWT, Roles, Logging)
        ↓
Internal Microservices
    ├── Patient Service (Port 5003)
    ├── Appointment Service (Port 5001)
    ├── Medical Folder Service (Port 5002)
    ├── Report Service (Port 5005)
    └── Upload File Service (Port 5004)
```

## Features

✅ JWT-based authentication with access and refresh tokens  
✅ Secure password verification with bcrypt  
✅ Patient registration with file upload support  
✅ Login/logout functionality with cookie-based session management  
✅ Token refresh mechanism for extended sessions  
✅ Role-based access control (patient role: 2002)  
✅ Request logging with timestamps  
✅ CORS configuration for frontend security  
✅ File upload validation (size, extension)  
✅ Error handling middleware  
✅ Cookie-based JWT token storage  
✅ Comprehensive middleware chain  

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **HTTP Client**: Axios (for microservice communication)
- **File Upload**: express-fileupload
- **CORS**: cors package
- **Cookie Management**: cookie-parser
- **Environment**: dotenv
- **UUID**: For unique identifiers

## Installation

### Prerequisites
- Node.js (v14+)
- Understanding of JWT authentication
- HTTPS certificates (optional, currently disabled)
- npm or yarn

### Setup

1. Clone or navigate to the service directory
```bash
cd patient_interface_BackEnd
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key

```

4. Start the service
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The service will listen on `http://localhost:5000`

## Project Structure

```
patient_interface_BackEnd/
├── patient_app.js                      # Express app entry point
├── package.json                        # Dependencies and scripts
├── certaficateSSL/                     # HTTPS certificates (optional)
├── config/
│   └── corsOptions.js                 # CORS configuration
├── controller/
│   ├── appointmentController.js       # Appointment handlers
│   ├── login_logoutController.js      # Auth handlers
│   ├── medicalFolderController.js    # Medical folder handlers
│   ├── patientController.js          # Patient handlers
│   ├── refreshTokenController.js     # Token refresh handlers
│   └── reportController.js           # Report handlers
├── middleware/
│   ├── fileErrorhandle.js            # File upload validation
│   ├── logEvents.js                  # Request logging
│   ├── verifyJWT.js                  # JWT verification
│   ├── verifyPatientExist.js        # Patient existence check
│   └── verifyRoles.js                # Role-based access control
├── routes/
│   ├── root.js                       # Main router
│   ├── register.js                   # Patient registration
│   ├── login_logout.js               # Authentication routes
│   ├── refresh.js                    # Token refresh route
│   └── APIS/
│       ├── appointmentAPI.js         # Appointment endpoints
│       ├── medicalFolderAPI.js      # Medical folder endpoints
│       ├── patientAPI.js            # Patient endpoints
│       └── reportAPI.js             # Report endpoints
├── logs/
│   └── reqLog.txt                    # Request activity logs
└── test/
    ├── securetest.rest               # Secure endpoint tests
    └── [API specific tests]/
```

## Authentication Flow

### 1. Registration
```
POST /api/patients/register
{
  "first_name": "John",
  "last_name": "Doe",
  "email_address": "john@example.com",
  "password": "securePassword123",
  ...patient details
}
↓
Patient Service creates patient record
↓
Response: 201 Created with patient ID
```

### 2. Login
```
POST /api/patients/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
↓
Verify credentials with Patient Service
↓
Generate JWT tokens
↓
Response: 200 OK {accessToken, id}
```

### 3. Access Protected Resources
```
GET /api/patients/:id/appointments
Authorization: Bearer <accessToken>
↓
Verify JWT with verifyJWT middleware
↓
Verify role with verifyRoles middleware
↓
Route to Appointment Service
↓
Response: 200 OK [appointments]
```

### 4. Token Refresh
```
GET /api/patients/token
(JWT cookie automatically sent)
↓
Verify refresh token
↓
Generate new access token
↓
Response: 200 OK {accessToken}
```

## API Endpoints

### Base URL
```
http://localhost:5000/api/patients
```

### Authentication Routes

#### Register (Public)
```
POST /api/patients/register
Content-Type: multipart/form-data

Body:
- first_name, last_name, email_address, password, gender
- phone_number, birth_date, location (address, country, city, longitude, latitude)
- file (optional PDF document)
```
**Response**: 201 Created with patient profile
**Middleware**: File validation (size, PDF extension)

#### Login (Public)
```
POST /api/patients/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
**Response**: 200 OK
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "id": "507f1f77bcf86cd799439011"
}
```
**Cookies**: Sets `jwt` refresh token with httpOnly flag

#### Logout (Protected)
```
GET /api/patients/logout
Authorization: Bearer <accessToken>
```
**Response**: 200 OK

#### Refresh Token (Protected)
```
GET /api/patients/token
(No Authorization header needed, uses cookie)
```
**Response**: 200 OK
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Protected API Routes

All routes below require:
- `Authorization: Bearer <accessToken>` header
- Valid JWT token
- Patient role (2002)

#### Patient Management
```
GET    /api/patients/:id              # Get patient profile
PUT    /api/patients/:id              # Update patient info
DELETE /api/patients/:id              # Delete patient account
```

#### Appointment Management
```
GET    /api/patients/:id/appointments              # Get all appointments
POST   /api/patients/:id/appointments              # Create appointment
GET    /api/patients/:id/appointments/:appointmentId
PUT    /api/patients/:id/appointments/:appointmentId
DELETE /api/patients/:id/appointments/:appointmentId
```

#### Medical Folder Management
```
GET    /api/patients/:id/medical-folder           # Get medical folder
POST   /api/patients/:id/medical-folder           # Create medical folder
PUT    /api/patients/:id/medical-folder           # Update medical folder
DELETE /api/patients/:id/medical-folder           # Delete medical folder
```

#### Medical Reports
```
GET    /api/patients/:id/reports                  # Get all reports
GET    /api/patients/:id/reports/:reportId        # Get specific report
POST   /api/patients/:id/reports                  # Create report
DELETE /api/patients/:id/reports/:reportId        # Delete report
```

## Middleware Chain

Requests flow through this middleware stack:

```
1. logger                    # Log all requests
2. express.json()            # Parse JSON bodies
3. cors(corsOptions)         # CORS validation
4. cookieParser()            # Parse cookies
   ↓
5. register                  # Registration route (public)
6. login_logout              # Auth routes (public)
7. refresh                   # Token refresh (public)
8. verifyJWT                 # JWT validation (protected)
9. verifyRoles               # Role validation (protected)
10. API routes               # Route to microservices
11. fileErrorhandle          # File upload validation
```

## Middleware Details

### verifyJWT
- Extracts Bearer token from Authorization header
- Verifies token signature with ACCESS_TOKEN_SECRET
- Attaches user data to request: `req._id`, `req.email_address`, `req.role`
- Returns 401 if missing, 403 if invalid

### verifyRoles
- Checks if user role equals 2002 (patient role)
- Enforces role-based access control
- Returns 401 if role mismatch

### verifyPatientExist
- Verifies patient exists in the system
- Validates patient ID in request parameters
- Prevents operations on non-existent patients

### fileErrorhandle
- Validates file payload existence
- Enforces file extension limits (e.g., .pdf only)
- Validates file size constraints

### logEvents
- Records all HTTP requests with timestamps
- Logs request method, path, and IP address
- Maintains activity audit trail in `reqLog.txt`

## CORS Configuration

Whitelist of allowed origins:
```javascript
[
  'https://www.google.com',
  'http://127.0.0.1:3000',      // Frontend (dev)
  'http://localhost:5000'        // Backend (localhost)
]
```

Requests from non-whitelisted origins receive:
```
Error: Not allowed by CORS
```

**How to update**: Edit `config/corsOptions.js`

## Token Management

### Access Token
- **Duration**: 10 minutes
- **Used For**: Accessing protected resources
- **Stored In**: Response body (client-side)
- **Secret**: Process.env.ACCESS_TOKEN_SECRET

### Refresh Token
- **Duration**: 24 hours
- **Used For**: Requesting new access tokens
- **Stored In**: HttpOnly cookie + database
- **Secret**: Process.env.REFRESH_TOKEN_SECRET
- **Security**: HttpOnly prevents XSS attacks

### Token Rotation
- Old refresh tokens are invalidated on new login
- Multiple refresh tokens supported for multiple sessions
- Refresh tokens cleared on logout

## Request Logging

All requests are logged to `logs/reqLog.txt` with format:
```
[TIMESTAMP] METHOD | PATH | QUERY | BODY | RESPONSE_STATUS | IP_ADDRESS
```

## Error Handling

### Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication failed or token invalid
- `403 Forbidden`: Token invalid or role mismatch
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate email/phone
- `500 Internal Server Error`: Server error

### Error Responses
```json
{
  "message": "Error description"
}
```

## Running Tests

Test files included in `test/` directory:

- `securetest.rest`: Protected endpoint tests requiring JWT
- `appointmentAPI/request.rest`: Appointment tests
- `medicalFolderAPI/request.rest`: Medical folder tests
- `patientAPI/request.rest`: Patient tests
- `reportAPI/request.rest`: Report tests

Run using VS Code REST Client extension or similar tools.

## Security Features

### Password Security
- Passwords hashed with bcrypt before storage
- bcrypt rounds: 10 (configurable)
- Raw passwords never stored in database

### JWT Security
- Signed with cryptographic secret
- Expiration-based token lifespan
- Refresh token rotation on login

### Session Management
- HttpOnly cookies prevent XSS attacks
- SameSite cookie policy (configurable)
- Cookies secure flag for HTTPS (optional)

### CORS Security
- Whitelist-based origin validation
- Prevents unauthorized cross-origin requests
- Configurable for different environments

### File Upload Security
- File type validation (PDF extension)
- File size limits
- Extension blacklist/whitelist support

### Request Logging
- Audit trail of all activities
- IP address tracking
- Timestamp recording

## HTTPS Configuration

HTTPS support is available but currently commented out. To enable:

1. Generate SSL certificates:
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```

2. Place in `certaficateSSL/` directory

3. Uncomment HTTPS code in `patient_app.js`

4. Update CORS for HTTPS origins

## Integration Flow

```
Frontend Request
    ↓
Patient Interface Backend
    ├── Validate Request
    ├── Check Auth (JWT)
    ├── Verify Role
    └── Forward to Microservice
        ↓
    Microservice (Patient/Appointment/etc)
        ├── Process Request
        ├── Query Database
        └── Return Result
    ↓
Patient Interface Backend
    ├── Log Response
    └── Send to Client
```

## Database Schema Integration

This service doesn't directly use database but communicates with:
- **Patient Service**: Patient credentials and profile
- **Appointment Service**: Appointment data
- **Medical Folder Service**: Medical record folders
- **Report Service**: Medical reports
- **Upload File Service**: File storage

## Performance Considerations

- **Stateless**: No server-side session storage needed
- **JWT**: Reduces database queries for authentication
- **Middleware Chain**: Efficient request filtering
- **Async Operations**: All microservice calls are async
- **Connection Pooling**: Reuse HTTP connections to services

## Use Cases

### 1. Patient Registration
New patient creates account with health information.

### 2. Patient Login
Patient logs in to access their health records.

### 3. View Appointments
Patient views scheduled appointments.

### 4. Update Profile
Patient updates personal information.

### 5. Access Medical Records
Patient retrieves medical history and reports.

### 6. Extended Session
Patient refreshes token for continued access.

## Future Enhancements

- [ ] Multi-factor authentication (MFA)
- [ ] OAuth2 integration (Google, Apple)
- [ ] WebSocket support for real-time updates
- [ ] API rate limiting
- [ ] Request validation schemas
- [ ] Comprehensive API documentation (Swagger/OpenAPI)
- [ ] Doctor/Admin user roles
- [ ] Appointment notifications
- [ ] Medical alert system
- [ ] Payment integration
- [ ] Mobile app support
- [ ] Push notifications
- [ ] Two-factor authentication
- [ ] Session management UI

## Troubleshooting

### 401 Unauthorized
- Access token has expired → refresh token
- Token is missing → include Authorization header
- Token format incorrect → use "Bearer <token>"

### 403 Forbidden
- Invalid token signature → re-login
- Token expired → refresh token
- User role not patient → contact admin

### CORS Errors
- Origin not in whitelist → update corsOptions.js
- Credentials not included → add credentials to request

### Connection Refused
- Microservice not running → start required service
- Wrong port → verify service port
- Firewall blocking → check firewall rules

## License

apache-2.0 License
