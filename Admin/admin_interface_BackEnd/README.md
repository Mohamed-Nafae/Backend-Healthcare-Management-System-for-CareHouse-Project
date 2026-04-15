# Admin Interface Backend

The main API Gateway for the admin dashboard in the CareHouse healthcare management system. This service handles admin authentication, authorization, and routes requests to internal microservices for managing appointments, medical staff, tasks, and more.

## Overview

The Admin Interface Backend is a Node.js/Express service that provides:
- **Admin Authentication**: Login/logout and JWT token management
- **API Gateway**: Routes admin requests to backend microservices
- **Role-Based Access Control**: Enforces admin role authorization
- **Token Refresh**: Handles JWT refresh token lifecycle
- **Request Logging**: Comprehensive logging of all API requests
- **File Upload Management**: Support for staff profile images and documents

## Architecture

```
Admin Client
    ↓
Admin Interface Backend (Port 5011)
    ├── Authentication (Login/Logout/Token Refresh)
    ├── JWT Token Management
    ├── API Gateway & Routing
    └── Middleware (JWT verification, Role check, Admin verification)
        ↓
Internal Microservices
    ├── Admin Service (Port 5010) - Admin profiles
    ├── Appointment Service (Port 5001) - Appointment management
    ├── Medical Staff Service (Port 5007) - Doctor/Nurse/Driver profiles
    ├── Task Service (Port 5009) - Task management
    └── File Service (Port 5004) - Image & document storage
```

## Features

✅ JWT-based authentication with access and refresh tokens  
✅ Secure password verification with bcrypt  
✅ Admin login/logout functionality with cookie-based session management  
✅ Token refresh mechanism for extended sessions  
✅ Role-based access control (admin role verification)  
✅ Request logging with timestamps and event tracking  
✅ CORS configuration for frontend communication  
✅ File upload validation and processing  
✅ Error handling middleware  
✅ Cookie-based JWT token storage  
✅ Comprehensive middleware chain for security  

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
- MongoDB running (for admin & internal services)
- npm or yarn
- Admin Service (Port 5010) running

### Setup

1. Navigate to the service directory
```bash
cd Admin/admin_interface_BackEnd
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

The service will listen on `http://localhost:5011`

## Project Structure

```
admin_interface_BackEnd/
├── admin_app.js                         # Express app entry point
├── package.json                         # Dependencies and scripts
├── .env                                 # Environment variables
├── middleware/
│   ├── verifyJWT.js                    # JWT token verification
│   ├── verifyRoles.js                  # Role-based access control
│   ├── verifyAdminExist.js             # Admin existence check
│   ├── verifymedicalStaffExist.js      # Medical staff verification
│   ├── logEvents.js                    # Request logging
│   └── fileErrorhandle.js              # File upload error handling
├── controllers/
│   ├── login_logoutController.js       # Authentication handlers
│   ├── refreshTokenController.js       # Token refresh handler
│   ├── appointmentController.js        # Appointment CRUD
│   ├── appointmentTypeController.js    # Appointment type CRUD
│   ├── medicalStaffController.js       # Medical staff operations
│   ├── taskController.js               # Task management
│   └── absenceController.js            # Absence/leave management
├── routes/
│   ├── root.js                         # Main routing setup
│   ├── appointmentAPI.js               # Appointment endpoints
│   ├── appointmentTypeAPI.js           # Appointment type endpoints
│   ├── taskAPI.js                      # Task endpoints
│   └── APIs/
│       ├── doctorAPI/
│       │   └── doctorAPI.js            # Doctor management endpoints
│       └── nurseAPI/
│           └── nurseAPI.js             # Nurse management endpoints
├── logs/                               # Application logs directory
└── test/                               # Test files and API requests
```

## API Endpoints

### Base URL
```
http://localhost:5011/api/admins
```

### Authentication Endpoints

```
POST /login
  Description: Admin login
  Body: { email, password }
  Response: { accessToken, id }

GET /token
  Description: Refresh access token
  Cookie: jwt (refreshToken)
  Response: { accessToken }

GET /logout
  Description: Logout (clear session)
  Response: { message: "Logged out successfully" }
```

### Protected Endpoints (Require JWT)
All endpoints below require valid JWT token and admin role verification.

```
/:id/appointmentTypes
  GET    - Get all appointment types
  POST   - Create appointment type
  PUT    - Update appointment type
  DELETE - Delete appointment type

/:id/appointments
  GET    - Get all appointments
  POST   - Create appointment
  PUT    - Update appointment
  DELETE - Delete appointment

/:id/tasks
  GET    - Get all tasks
  POST   - Create task
  PUT    - Update task
  DELETE - Delete task

/:id/doctors
  GET    - Get all doctors
  POST   - Create doctor
  PUT    - Update doctor
  DELETE - Delete doctor
  POST   - Upload doctor image

/:id/nurses
  GET    - Get all nurses
  POST   - Create nurse
  PUT    - Update nurse
  DELETE - Delete nurse
  POST   - Upload nurse image
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
   - Checks admin role from JWT
   - Verifies role-based permissions

5. **Verification Middleware** (`verifyAdminExist.js`)
   - Confirms admin exists in database
   - Validates admin status

6. **Error Handling Middleware** (`fileErrorhandle.js`)
   - Handles file upload errors
   - Validates file types and sizes

## Authentication Flow

### Login Process
```
1. Admin POST /login with email & password
2. Service queries Admin Service (5010) by email
3. Compare hashed passwords with bcrypt
4. Generate JWT tokens:
   - accessToken (10 minutes)
   - refreshToken (24 hours)
5. Store refreshToken in database
6. Return accessToken + admin ID to client
```

### Token Refresh
```
1. Admin GET /token with refreshToken cookie
2. Verify refreshToken validity
3. Generate new accessToken
4. Return new token
```

### Protected Request
```
1. Admin includes JWT in Authorization header
2. verifyJWT middleware validates token
3. verifyRoles middleware checks admin role
4. Request proceeds to handler
```

## Database Models

The service interacts with these external microservices:

### Admin (Port 5010)
```javascript
Admin {
  _id, email, password, role_admin, refreshToken, created_at
}
```

### Appointment (Port 5001)
```javascript
Appointment {
  _id, patient, appointment_type, doctor, status, created_at
}
```

### Medical Staff (Port 5007)
```javascript
Doctor/Nurse {
  _id, email, password, name, specialization, tasks[], image, created_at
}
```

## File Upload

The service supports file uploads for medical staff profile images:

```
POST /:id/doctors/:doctorId/image
  Content-Type: multipart/form-data
  Body: { file: [image file] }
  
  Process:
  1. Parse multipart form-data
  2. Forward to File Service (5004)
  3. Store in MongoDB GridFS (images bucket)
  4. Get file_id from GridFS
  5. Update doctor profile with file_id
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
Use the `.rest` files in the `test/` directory with VS Code REST Client extension.

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
| Admin Service | 5010 | Admin CRUD operations |
| Appointment Service | 5001 | Appointment management |
| Medical Staff Service | 5007 | Doctor/Nurse/Driver management |
| Task Service | 5009 | Task management |
| File Service | 5004 | Image & document storage |

## Security Notes

- Always use environment variables for sensitive data
- Never commit `.env` files to version control
- Access tokens expire after 10 minutes for security
- Refresh tokens are stored securely in HTTP-only cookies
- All passwords are hashed with bcrypt before storage
- Role-based access control prevents unauthorized operations
- JWT verification is mandatory for protected endpoints

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **401 Unauthorized** | Verify email/password correct. Check if admin exists in Port 5010. Ensure Admin Service is running. |
| **403 Forbidden** | Verify admin role is set. Token may have expired, use `/token` to refresh. Check ACCESS_TOKEN_SECRET. |
| **CORS Errors** | Check frontend origin is whitelisted. Verify CORS configuration matches client domain. Clear cache. |
| **Port 5011 Already in Use** | Kill existing process: `lsof -i :5011` then `kill -9 <PID>`. Or change port in `admin_app.js`. |
| **Microservice Connection Failed** | Verify Port 5010, 5001, 5007, 5009 services are running. Check firewall. Confirm service URLs. |
| **JWT Token Invalid** | Verify ACCESS_TOKEN_SECRET set in `.env`. Token expires in 10 min, refresh using `/token`. Re-login. |
| **File Upload Failed** | Check file size limits. Verify file format (jpg, png). Ensure Port 5004 running. Check permissions. |
| **Appointment Creation Failed** | Verify appointment type exists. Check doctor/nurse exists in Port 5007. Confirm Port 5001 running. |
| **No Request Logs** | Verify `logs/` directory exists. Check write permissions. Restart service. Verify logger initialized. |
| **MongoDB Connection Error** | Ensure MongoDB running. Check connection string. Verify network connectivity. Check credentials. |

## Future Enhancements

- [ ] Multi-factor authentication (MFA) for admins
- [ ] OAuth2/SAML integration for enterprise SSO
- [ ] Task priority levels (critical, high, normal, low)
- [ ] Task dependencies and workflow management
- [ ] Comprehensive admin dashboard with KPIs
- [ ] Staff utilization and performance reports
- [ ] Webhook support for external systems
- [ ] Real-time notifications (WebSocket)
- [ ] Message queue integration (RabbitMQ/Redis)
- [ ] Caching layer for performance
- [ ] Admin web dashboard UI
- [ ] Error tracking and alerting (Sentry)
- [ ] Performance monitoring (APM)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Support ticket system integration

## License
apache-2.0 License


