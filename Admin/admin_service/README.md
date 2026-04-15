# Admin Service

A backend microservice for managing admin profiles and CRUD operations in the CareHouse healthcare management system. This service provides RESTful APIs for admin registration, authentication, and profile management.

## Overview

The Admin Service is a Node.js/Express microservice that provides:
- **Admin CRUD Operations**: Create, read, update, and delete admin profiles
- **Admin Authentication**: Password hashing with bcrypt and refresh token management
- **Query Operations**: Search admins by email or refresh token
- **Data Validation**: Required field verification and uniqueness checks
- **MongoDB Integration**: Persistent admin profile storage
- **Email/Phone Uniqueness**: Prevent duplicate admin accounts

## Architecture

```
Admin Interface Backend (Port 5011)
    ↓
Admin Service (Port 5010)
    ├── Admin CRUD Handlers
    ├── Password Hashing (bcrypt)
    ├── Token Management
    └── Validation Middleware
        ↓
    MongoDB (admins collection)
```

## Features

✅ Full CRUD operations for admin profiles  
✅ Unique email and phone number validation  
✅ Secure password storage with bcrypt (10 rounds)  
✅ Refresh token array management for multiple sessions  
✅ Admin role identification (default role: 5168)  
✅ Query admins by email or refresh token  
✅ Automatic timestamp tracking (createdAt)  
✅ MongoDB persistence with Mongoose ODM  
✅ Environment-based configuration  
✅ Request validation middleware  

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Password Hashing**: bcrypt
- **Environment**: dotenv

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB running locally or remote connection
- npm or yarn

### Setup

1. Navigate to the service directory
```bash
cd Admin/admin_service
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
# MongoDB Connection
DATABASE_URI=mongodb://localhost:27017/admins
# or for remote MongoDB
DATABASE_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/admins
```

4. Start the service
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The service will listen on `http://localhost:5010`

## Project Structure

```
admin_service/
├── app.js                          # Express app entry point
├── package.json                    # Dependencies and scripts
├── config/
│   └── connectDB.js               # MongoDB connection configuration
├── middleware/
│   └── verifyRequiredAttributes.js # Request validation middleware
├── model/
│   └── Admin.js                   # Admin schema definition
├── route/
│   └── admins.js                  # Admin API routes
└── test/
    └── request.rest               # API test requests
```

## Database Model

### Admin

```javascript
Admin {
  _id: ObjectId,
  first_name: String (required),
  last_name: String (required),
  email_address: String (required, unique),
  password: String (required, hashed),
  phone_number: Number (required, unique),
  role_admin: Number (default: 5168),
  refreshToken: [String],
  createdAt: Date (auto-generated)
}
```

## API Endpoints

### Base URL
```
http://localhost:5010/api/admins
```

### Get All Admins
```
GET /api/admins
Response: [{ admin1 }, { admin2 }, ...]
Status: 200 OK
```

### Get Admin by Query
```
GET /api/admins/query?email=admin@example.com
GET /api/admins/query?refreshToken=<token>

Response: { _id, first_name, last_name, email_address, ... }
Status: 200 OK | 404 Not Found | 400 Bad Request
```

### Get Admin by ID
```
GET /api/admins/:id
Response: { _id: "<id>" }
Status: 200 OK | 404 Not Found
```

### Create Admin
```
POST /api/admins
Content-Type: application/json

Body: {
  "first_name": "John",
  "last_name": "Doe",
  "email_address": "john@example.com",
  "password": "securePassword123",
  "phone_number": 1234567890
}

Response: { _id, first_name, last_name, email_address, phone_number, role_admin, createdAt }
Status: 201 Created | 400 Bad Request (email/phone exists)
```

### Update Admin
```
PUT /api/admins/:id
Content-Type: application/json

Body: {
  "first_name": "Jane",
  "password": "newPassword456",
  "refreshToken": ["token1", "token2"]
}

Response: { message: "Admin updated successfully" }
Status: 200 OK | 404 Not Found
```

### Delete Admin
```
DELETE /api/admins/:id
Response: { message: "Admin deleted successfully" }
Status: 200 OK | 404 Not Found
```

## Validation & Constraints

### Required Fields
- `first_name` - Admin first name
- `last_name` - Admin last name
- `email_address` - Must be unique
- `password` - Will be hashed before storage
- `phone_number` - Must be unique

### Unique Constraints
- Email addresses must be unique (prevents duplicate logins)
- Phone numbers must be unique (contact validation)

### Default Values
- `role_admin`: 5168 (default admin role)
- `createdAt`: Current timestamp
- `refreshToken`: Empty array initially

## Password Security

Passwords are hashed using bcrypt with:
- **Algorithm**: bcrypt
- **Rounds**: 10
- **Storage**: Hashed only (original password discarded)

```javascript
// Password hashing on creation
req.body.password = await bcrypt.hash(req.body.password, 10);
```

## Authentication Flow

### Admin Creation
```
1. Request: POST /api/admins with email, phone, password
2. Validate all required fields exist
3. Check email uniqueness
4. Check phone uniqueness
5. Hash password with bcrypt
6. Create admin in MongoDB
7. Return new admin object (password hashed)
```

### Admin Login (via Admin Interface Gateway)
```
1. Request: POST /api/admins/query?email=...
2. Admin Service returns admin object
3. Gateway validates password with bcrypt.compare()
4. Generate JWT tokens
5. Update refreshToken array
```

## Middleware

### verifyRequiredAttributes
- Validates POST request contains all required fields
- Prevents creation with missing data
- Returns 400 if validation fails

## Error Handling

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Admin created successfully |
| 400 | Bad request (missing fields, duplicates) |
| 404 | Admin not found |
| 500 | Server error (database, connection) |

## Integration with Other Services

This service is called by:

- **Admin Interface Backend (Port 5011)**
  - Queries admin by email on login
  - Updates refreshToken array
  - Gets admin details by ID
  - Creates new admin accounts

- **Directly via API**
  - Can be called from any authorized client

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management

## Running Tests

Test files included in `test/` directory:

Use `.rest` files with VS Code REST Client extension:
```
test/request.rest
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB Connection Failed** | Verify MongoDB is running. Check DATABASE_URI in `.env`. Verify network connectivity. |
| **Duplicate Email Error** | Email already registered. Use different email or verify existing admin. |
| **Duplicate Phone Error** | Phone number already registered. Use different phone or verify existing admin. |
| **Validation Failed** | Verify all required fields present. Check data types (phone_number must be number). |
| **Admin Not Found** | Verify admin ID or email exists. Check query parameters are correct. |
| **Password Mismatch** | Ensure password was hashed with bcrypt. Check bcrypt comparison in gateway. |

## Future Enhancements

- [ ] Admin activity audit logging
- [ ] Account lockout after failed attempts
- [ ] Password expiration policies
- [ ] Multi-factor authentication (MFA)
- [ ] Admin profile image support
- [ ] Department/facility assignment
- [ ] Bulk admin import
- [ ] Admin deactivation (soft delete)
- [ ] OAuth2/SAML integration
- [ ] Admin notification preferences
- [ ] Session management
- [ ] API rate limiting
- [ ] Request validation schemas (Joi/Yup)

## Security Notes

- Always use strong passwords
- Passwords stored as bcrypt hashes only
- Unique email/phone prevents account duplication
- Use HTTPS in production
- Validate all inputs on both client and server
- Never return passwords in API responses
- Keep dependencies updated
- Store JWT secrets securely in environment variables

## License
apache-2.0 License
