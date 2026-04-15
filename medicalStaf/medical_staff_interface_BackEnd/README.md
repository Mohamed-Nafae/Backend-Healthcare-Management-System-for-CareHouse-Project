# Medical Staff Interface Backend

The main API Gateway for medical staff (doctors, nurses, and drivers) in the CareHouse healthcare management system. This service handles staff authentication, authorization, and routes requests to internal microservices for managing tasks, patients, medical records, and reports.

## Overview

The Medical Staff Interface Backend is a Node.js/Express service that provides:
- **Staff Authentication**: Doctor/Nurse/Driver login/logout and JWT token management
- **API Gateway**: Routes medical staff requests to backend microservices
- **Role-Based Access Control**: Enforces staff role authorization (doctor: 1954, nurse: 2021, driver: 2022)
- **Token Refresh**: Handles JWT refresh token lifecycle
- **Request Logging**: Comprehensive logging of all API requests
- **File Upload Management**: Support for staff profile images and documents
- **Task Management**: Retrieve, update, and complete assigned tasks
- **Patient Data Access**: View patient information and medical records

## Architecture

```
Medical Staff Client (Web/Mobile)
    ↓
Medical Staff Interface Backend (Port 5006)
    ├── Authentication (Login/Logout/Token Refresh)
    ├── JWT Token Management
    ├── API Gateway & Routing
    └── Middleware (JWT verification, Role check, Staff verification)
        ↓
Internal Microservices
    ├── Medical Staff Service (Port 5007) - Doctor/Nurse/Driver profiles
    ├── Task Service (Port 5009) - Task management
    ├── Appointment Service (Port 5001) - Appointment data
    ├── Patient Service (Port 5003) - Patient profiles
    ├── Medical Folder Service (Port 5002) - Medical records
    ├── Report Service (Port 5005) - Clinical reports
    └── File Service (Port 5004) - Image & document storage
```

## Features

✅ JWT-based authentication with access and refresh tokens  
✅ Secure password verification with bcrypt  
✅ Doctor/Nurse/Driver login with role-based routing  
✅ Login/logout functionality with cookie-based session management  
✅ Token refresh mechanism for extended sessions  
✅ Role-based access control (doctor, nurse, driver)  
✅ Request logging with timestamps  
✅ CORS configuration for frontend security  
✅ File upload validation and processing  
✅ Error handling middleware  
✅ Cookie-based JWT token storage  
✅ Multi-role support (doctor, nurse, driver)  
✅ Task assignment and completion tracking  
✅ Patient information access  
✅ Medical record and report viewing  

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **HTTP Client**: Axios (for microservice communication)
- **File Upload**: express-fileupload
- **CORS**: cors package
- **Cookie Management**: cookie-parser
- **Utilities**: date-fns for date operations, uuid for unique identifiers
- **Environment**: dotenv

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB running (for internal services)
- npm or yarn
- Medical Staff Service (Port 5007) running

### Setup

1. Navigate to the service directory
```bash
cd medicalStaf/medical_staff_interface_BackEnd
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

The service will listen on `http://localhost:5006`

## Project Structure

```
medical_staff_interface_BackEnd/
├── medical_staff_app.js                    # Express app entry point
├── package.json                            # Dependencies and scripts
├── middleware/
│   ├── verifyJWT.js                       # JWT token verification
│   ├── verifyRoles.js                     # Role-based access control
│   ├── verifymedicalStaffExist.js         # Staff existence check
│   ├── logEvents.js                       # Request logging
│   └── fileErrorhandle.js                 # File upload error handling
├── controllers/
│   ├── login_logoutController.js          # Authentication handlers
│   ├── refreshTokenController.js          # Token refresh handler
│   ├── taskController.js                  # Task management handlers
│   ├── patientConttroller.js             # Patient data handlers
│   ├── medicalFolderController.js        # Medical records handlers
│   ├── reportController.js                # Report handlers
│   ├── absenceController.js               # Absence management
│   └── medicalStaffController.js          # Staff profile operations
├── routes/
│   ├── root.js                            # Main routing setup
│   └── APIS/
│       ├── doctorRoot.js                  # Doctor endpoints
│       ├── nurseRoot.js                   # Nurse endpoints
│       └── driverRoot.js                  # Driver endpoints
├── logs/                                  # Application logs directory
└── tests/                                 # Test files and API requests
```

## API Endpoints

### Base URL
```
http://localhost:5006/api
```

### Authentication Endpoints (Public)

```
POST /doctors/login
  Description: Doctor authentication
  Body: { email, password }
  Response: { accessToken, id }

POST /nurses/login
  Description: Nurse authentication
  Body: { email, password }
  Response: { accessToken, id }

POST /drivers/login
  Description: Driver authentication
  Body: { email, password }
  Response: { accessToken, id }

GET /doctors/token
GET /nurses/token
GET /drivers/token
  Description: Refresh access token
  Cookie: jwt (refreshToken)
  Response: { accessToken }

GET /doctors/logout
GET /nurses/logout
GET /drivers/logout
  Description: Logout (clear session)
  Response: { message: "Logged out successfully" }
```

### Protected Endpoints (Require JWT & Role)

```
/doctors/:id/tasks
  GET    - Get all tasks for doctor
  PUT    - Update/complete task
  DELETE - Delete task

/doctors/:id/patients/:patientId
  GET    - Get patient information

/doctors/:id/patients/:patientId/medicalFolder
  GET    - Get patient medical folder
  PUT    - Update medical folder

/doctors/:id/patients/:patientId/reports
  GET    - Get patient reports

/nurses/:id/tasks
  GET    - Get all tasks for nurse
  PUT    - Update/complete task

/drivers/:id/tasks
  GET    - Get all tasks for driver
  PUT    - Update/complete task
```

## Middleware Chain

The service uses a comprehensive middleware chain for security:

1. **Logger Middleware** (`logEvents.js`)
   - Logs all incoming requests
   - Records timestamp and request details
   - Writes to logs directory

2. **Request Parser**
   - JSON body parsing
   - Cookie parsing
   - File upload handling

3. **Authentication Middleware** (`verifyJWT.js`)
   - Verifies JWT token from headers or cookies
   - Validates token signature and expiration
   - Extracts user information

4. **Authorization Middleware** (`verifyRoles.js`)
   - Checks staff role from JWT (doctor/nurse/driver)
   - Verifies role-based permissions

5. **Verification Middleware** (`verifymedicalStaffExist.js`)
   - Confirms staff member exists in Medical Staff Service
   - Validates staff status and availability

6. **Error Handling Middleware** (`fileErrorhandle.js`)
   - Handles file upload errors
   - Validates file types and sizes

## Authentication Flow

### Login Process
```
1. Staff POST /doctors|nurses|drivers/login with email & password
2. Service queries Medical Staff Service (5007) by email
3. Compare hashed passwords with bcrypt
4. Generate JWT tokens:
   - accessToken (10 minutes)
   - refreshToken (24 hours)
5. Store refreshToken in database
6. Return accessToken + staff ID to client
```

### Token Refresh
```
1. Staff GET /doctors|nurses|drivers/token with refreshToken cookie
2. Verify refreshToken validity
3. Generate new accessToken
4. Return new token
```

### Protected Request
```
1. Staff includes JWT in Authorization header
2. verifyJWT middleware validates token
3. verifyRoles middleware checks staff role
4. Request proceeds to handler
```

## Staff Roles

| Staff Type | Role ID | Endpoints |
|------------|---------|-----------|
| Doctor | 1954 | /doctors/* |
| Nurse | 2021 | /nurses/* |
| Driver | 2022 | /drivers/* |

Each role has appropriate access levels to different services and data.

## Task Management

### Get Assigned Tasks
```
GET /api/doctors/:id/tasks
Response: [{ task1 }, { task2 }, ...]
- Retrieves all tasks assigned to doctor
- Includes appointment details
- Shows task status (finished: true/false)
```

### Complete Task
```
PUT /api/doctors/:id/tasks/:idT
Body: { 
  finished: true,
  qrCode_id: "abc123def456"
}
Response: { message: "task deleted successfully" }
- Marks task as complete
- Validates QR code against appointment
- Cascades delete: removes task, appointment, updates patient
```

## Patient Data Access

### Get Patient Information
```
GET /api/doctors/:id/patients/:patientId
Response: { _id, name, email, phone, ... }
- Requires staff authentication
- Retrieves patient profile data
```

### Get Patient Medical Folder
```
GET /api/doctors/:id/patients/:patientId/medicalFolder
Response: Medical folder document (PDF)
- Downloads patient's medical records
- Verifies patient has medical folder
- Returns file stream
```

### Get Patient Reports
```
GET /api/doctors/:id/patients/:patientId/reports
Response: [{ report1 }, { report2 }, ...]
- Retrieves all clinical reports for patient
- Reports created by doctors
```

## File Upload

The service supports file uploads for medical staff profile images:

```
POST /api/doctors/:id/image
  Content-Type: multipart/form-data
  Body: { file: [image file] }
  
  Process:
  1. Parse multipart form-data
  2. Validate file type and size
  3. Forward to File Service (5004)
  4. Store in MongoDB GridFS (images bucket)
  5. Get file_id from GridFS
  6. Update staff profile with file_id
```

## Error Handling

The service responds with appropriate HTTP status codes:

- **400**: Bad request (missing fields, validation errors)
- **401**: Unauthorized (invalid credentials, invalid token)
- **403**: Forbidden (insufficient permissions, invalid role)
- **404**: Not found (resource doesn't exist)
- **500**: Server error (database error, service unavailable)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ACCESS_TOKEN_SECRET` | Secret key for access tokens | Required |
| `REFRESH_TOKEN_SECRET` | Secret key for refresh tokens | Required |

## Development

### Running in Development Mode
```bash
npm run dev
```

This uses `nodemon` for automatic restart on file changes.

### Testing API Endpoints
Use the `.rest` files in the `tests/` directory with VS Code REST Client extension.

### Logging
All requests are logged to the `logs/` directory with timestamps and details.

## Dependencies

- **axios** - HTTP client for microservice communication
- **bcrypt** - Password hashing and comparison
- **cookie-parser** - Parse HTTP cookies
- **cors** - Cross-Origin Resource Sharing
- **date-fns** - Date utilities
- **dotenv** - Environment variable management
- **express** - Web framework
- **express-fileupload** - File upload handling
- **form-data** - Form data serialization
- **jsonwebtoken** - JWT creation and verification
- **uuid** - Unique identifier generation

## Integration with Other Services

This gateway communicates with:

| Service | Port | Purpose |
|---------|------|---------|
| Medical Staff Service | 5007 | Staff CRUD and validation |
| Task Service | 5009 | Task management |
| Appointment Service | 5001 | Appointment data |
| Patient Service | 5003 | Patient profiles |
| Medical Folder Service | 5002 | Medical records |
| Report Service | 5005 | Clinical reports |
| File Service | 5004 | Image & document storage |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **401 Unauthorized** | Verify email/password correct. Check Medical Staff Service (5007) running. Check staff exists. |
| **403 Forbidden** | Verify staff role is set correctly. Token may have expired, use `/token` to refresh. |
| **CORS Errors** | Check frontend origin is whitelisted. Verify CORS configuration. Clear browser cache. |
| **Port 5006 Already in Use** | Kill existing process: `lsof -i :5006` then `kill -9 <PID>`. Change port in `medical_staff_app.js`. |
| **Microservice Connection Failed** | Verify Port 5007, 5009, 5001, 5003, 5002, 5005, 5004 services running. Check firewall. |
| **JWT Token Invalid** | Verify ACCESS_TOKEN_SECRET set in `.env`. Token expires in 10 min, refresh using `/token`. Re-login. |
| **Task Completion Failed** | Verify QR code correct. Check appointment exists. Ensure Port 5009 running. |
| **Patient Not Found** | Verify patient ID exists. Check Patient Service (5003) running. Confirm permissions. |

## Future Enhancements

- [ ] Multi-factor authentication (MFA) for staff
- [ ] Real-time task notifications (WebSocket)
- [ ] Staff availability calendar
- [ ] Patient search and filtering
- [ ] Medical record annotations
- [ ] Report generation templates
- [ ] Staff-to-staff messaging
- [ ] Shift scheduling integration
- [ ] Performance dashboard
- [ ] Bulk task assignment
- [ ] Task filtering and sorting
- [ ] Patient appointment history
- [ ] Medical record version control
- [ ] Emergency access protocols
- [ ] Compliance and audit logging

## Security Notes

- Always use environment variables for sensitive data
- Never commit `.env` files to version control
- Access tokens expire after 10 minutes for security
- Refresh tokens are stored securely in HTTP-only cookies
- All passwords are hashed with bcrypt before storage
- Role-based access control prevents unauthorized operations
- JWT verification is mandatory for protected endpoints
- QR code validation adds security to task completion
- Use HTTPS in production
- Implement request rate limiting

## License
apache-2.0 License
