# Medical Staff Service

A microservice for managing medical staff profiles (doctors, nurses, and drivers) in the CareHouse healthcare management system. This service handles staff registration, CRUD operations, task management, absence tracking, and report associations.

## Overview

The Medical Staff Service is a Node.js/Express microservice that provides APIs for:
- **Doctor Management**: Create, read, update, and delete doctor profiles with specialization
- **Nurse Management**: Create, read, update, and delete nurse profiles
- **Driver Management**: Create, read, update, and delete driver profiles
- **Task Assignment**: Manage tasks assigned to each staff member
- **Absence Tracking**: Manage absences and leave records for staff
- **Report Association**: Link medical reports to doctors
- **Query Operations**: Search staff by email or refresh token
- **Unique Validation**: Prevent duplicate email and phone registrations

## Architecture

```
Medical Staff Interface Backend (Port 5006)
    ↓
Medical Staff Service (Port 5007)
    ├── Doctor CRUD & Report Management
    ├── Nurse CRUD & Task Management
    ├── Driver CRUD & Task Management
    ├── Password Hashing (bcrypt)
    ├── Token Management
    └── Validation Middleware
        ↓
    MongoDB (doctors, nurses, drivers collections)
```

## Features

✅ Full CRUD operations for doctors, nurses, and drivers  
✅ Role-based staff differentiation (role_doctor: 1954, role_nurse: 2021, role_driver: 2022)  
✅ Specialization tracking for doctors  
✅ Unique email and phone number validation per staff type  
✅ Secure password storage with bcrypt  
✅ Refresh token array management for multiple sessions  
✅ Profile image support (GridFS file references)  
✅ Geographic location tracking (address, city, country)  
✅ Task array management for staff assignments  
✅ Absence array for tracking staff leaves  
✅ Report references for doctors (link to reports they created)  
✅ Query staff by email or refresh token  
✅ Automatic timestamp tracking (createdAt)  
✅ MongoDB persistence with Mongoose ODM  
✅ Environment-based configuration  

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Environment**: dotenv

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB running locally or remote connection
- npm or yarn

### Setup

1. Navigate to the service directory
```bash
cd medicalStaf/medical_staf_service
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
# MongoDB Connection
DATABASE_URI=mongodb://localhost:27017/medicalStaff
# or for remote MongoDB
DATABASE_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/medicalStaff
```

4. Start the service
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The service will listen on `http://localhost:5007`

## Project Structure

```
medical_staf_service/
├── app.js                          # Express app entry point
├── package.json                    # Dependencies and scripts
├── config/
│   └── connectDB.js               # MongoDB connection configuration
├── middleware/
│   └── verifyRequiredAttributes.js # Request validation middleware
├── models/
│   ├── Doctor.js                  # Doctor schema definition
│   ├── Nurse.js                   # Nurse schema definition
│   └── Driver.js                  # Driver schema definition
├── controller/
│   ├── medicalStaffController.js  # Common staff handlers
│   └── doctorController.js        # Doctor-specific handlers (reports)
├── routes/
│   ├── doctors.js                 # Doctor API routes
│   ├── nurses.js                  # Nurse API routes
│   └── drivers.js                 # Driver API routes
└── test/
    └── request.rest               # API test requests
```

## Database Models

### Doctor

```javascript
Doctor {
  _id: ObjectId,
  first_name: String (required),
  last_name: String (required),
  email_address: String (required, unique),
  password: String (required, hashed),
  gender: String (required),
  phone_number: Number (required, unique),
  birth_date: Date (required),
  speciality: String (required), // e.g., Cardiology, Neurology
  image: ObjectId (GridFS file ID),
  role_doctor: Number (default: 1954),
  location: {
    address: String (required),
    country: String (required),
    city: String (required)
  },
  createdAt: Date (auto-generated),
  reports: [ObjectId], // Array of report IDs created by doctor
  tasks: [ObjectId], // Array of task IDs assigned to doctor
  absences: [ObjectId], // Array of absence record IDs
  refreshToken: [String] // Array for multiple sessions
}
```

### Nurse

```javascript
Nurse {
  _id: ObjectId,
  first_name: String (required),
  last_name: String (required),
  email_address: String (required, unique),
  password: String (required, hashed),
  gender: String (required),
  phone_number: Number (required, unique),
  birth_date: Date (required),
  image: ObjectId (GridFS file ID),
  role_nurse: Number (default: 2021),
  location: {
    address: String (required),
    country: String (required),
    city: String (required)
  },
  createdAt: Date (auto-generated),
  tasks: [ObjectId], // Array of task IDs assigned to nurse
  absences: [ObjectId], // Array of absence record IDs
  refreshToken: [String] // Array for multiple sessions
}
```

### Driver

```javascript
Driver {
  _id: ObjectId,
  first_name: String (required),
  last_name: String (required),
  email_address: String (required, unique),
  password: String (required, hashed),
  gender: String (required),
  phone_number: Number (required, unique),
  birth_date: Date (required),
  image: ObjectId (GridFS file ID),
  role_driver: Number (default: 2022),
  location: {
    address: String (required),
    country: String (required),
    city: String (required)
  },
  createdAt: Date (auto-generated),
  tasks: [ObjectId], // Array of task IDs assigned to driver
  absences: [ObjectId], // Array of absence record IDs
  refreshToken: [String] // Array for multiple sessions
}
```

## API Endpoints

### Base URLs
```
http://localhost:5007/api/doctors
http://localhost:5007/api/nurses
http://localhost:5007/api/drivers
```

### Get All Medical Staff
```
GET /api/doctors
GET /api/nurses
GET /api/drivers

Response: [{ staff1 }, { staff2 }, ...]
Status: 200 OK
```

### Get Staff by Query
```
GET /api/doctors/query?email=doctor@example.com
GET /api/doctors/query?refreshToken=<token>
GET /api/nurses/query?email=nurse@example.com
GET /api/drivers/query?email=driver@example.com

Response: { _id, first_name, last_name, email_address, ... }
Status: 200 OK | 404 Not Found
```

### Get Staff by ID
```
GET /api/doctors/:id
GET /api/nurses/:id
GET /api/drivers/:id

Response: { _id, first_name, last_name, email_address, ... }
Status: 200 OK | 404 Not Found
```

### Create Medical Staff
```
POST /api/doctors
Content-Type: application/json

Body: {
  "first_name": "Jane",
  "last_name": "Smith",
  "email_address": "jane@example.com",
  "password": "securePassword123",
  "gender": "Female",
  "phone_number": 1234567890,
  "birth_date": "1985-05-15",
  "speciality": "Cardiology",
  "location": {
    "address": "123 Medical St",
    "country": "USA",
    "city": "New York"
  }
}

Response: { _id, first_name, last_name, ... (hashed password) }
Status: 201 Created | 400 Bad Request | 409 Conflict (duplicate email/phone)
```

### Update Medical Staff
```
PUT /api/doctors/:id
Content-Type: application/json

Body: {
  "last_name": "Johnson",
  "phone_number": 9876543210,
  "refreshToken": ["token1", "token2"]
}

Response: { message: "Staff updated successfully" }
Status: 200 OK | 404 Not Found
```

### Delete Medical Staff
```
DELETE /api/doctors/:id
DELETE /api/nurses/:id
DELETE /api/drivers/:id

Response: { message: "Staff deleted successfully" }
Status: 200 OK | 404 Not Found
```

### Doctor-Specific: Add Report
```
POST /api/doctors/:idD/reports/:idR
Response: { message: "Report added successfully" }
Status: 200 OK | 404 Not Found
```

### Doctor-Specific: Remove Report
```
DELETE /api/doctors/:idD/reports/:idR
Response: { message: "Report deleted successfully" }
Status: 200 OK | 404 Not Found
```

### Delete Absence Record
```
DELETE /api/doctors/:idM/absences/:idA
DELETE /api/nurses/:idM/absences/:idA
DELETE /api/drivers/:idM/absences/:idA

Response: { message: "Absence deleted successfully" }
Status: 200 OK | 404 Not Found
```

## Validation & Constraints

### Required Fields
- `first_name` - Staff first name
- `last_name` - Staff last name
- `email_address` - Must be unique per staff type
- `password` - Will be hashed before storage
- `gender` - Staff gender
- `phone_number` - Must be unique per staff type
- `birth_date` - Date of birth
- `speciality` - Doctor specialization only
- `location` - Address, country, city (all required)

### Unique Constraints
- Email addresses unique per staff type (doctor can have same email as nurse)
- Phone numbers unique per staff type

### Default Values
- `role_doctor`: 1954
- `role_nurse`: 2021
- `role_driver`: 2022
- `createdAt`: Current timestamp
- `refreshToken`: Empty array initially
- `tasks`: Empty array initially
- `absences`: Empty array initially

## Array Management

### Tasks Array
- Stores ObjectIds of assigned tasks
- Updated when task is created/assigned
- Cleared when task is completed/deleted

### Absences Array
- Stores ObjectIds of absence records
- Updated when absence is created
- Cleared when absence ends

### Reports Array (Doctors Only)
- Stores ObjectIds of reports created by doctor
- Only available for doctors
- Not present for nurses or drivers

## Authentication Flow

### Staff Creation
```
1. Request: POST /api/doctors with email, phone, password
2. Validate all required fields exist
3. Check email uniqueness for staff type
4. Check phone uniqueness for staff type
5. Hash password with bcrypt
6. Create staff in MongoDB
7. Initialize empty tasks[], absences[], reports[] (if doctor)
8. Return new staff object
```

### Staff Login (via Medical Staff Interface Gateway)
```
1. Request: GET /api/doctors/query?email=...
2. Service returns staff object
3. Gateway validates password with bcrypt.compare()
4. Generate JWT tokens
5. Update refreshToken array
```

## Middleware

### verifyRequiredAttributes
- Validates POST request contains all required fields
- Ensures first_name, last_name, email, password, etc. present
- Returns 400 if validation fails

## Error Handling

| Status | Message | Cause |
|--------|---------|-------|
| 200 | Success | Operation completed |
| 201 | Created | Staff created successfully |
| 400 | Bad Request | Missing fields, validation error |
| 404 | Not Found | Staff not found |
| 409 | Conflict | Duplicate email or phone number |
| 500 | Server Error | Database or connection error |

## Integration with Other Services

This service is called by:

- **Medical Staff Interface Backend (Port 5006)**
  - Creates doctor/nurse/driver profiles
  - Updates staff information
  - Deletes staff
  - Manages tasks and absences

- **Task Service (Port 5009)**
  - Adds task IDs to staff.tasks[]
  - Removes task IDs when completed

- **Absence Service (Port 5008)**
  - Adds absence IDs to staff.absences[]
  - Removes absence IDs when ended

- **Report Service (Port 5005)**
  - Links report IDs to doctor.reports[]

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB Connection Failed** | Verify MongoDB running. Check DATABASE_URI in `.env`. Check network connectivity. |
| **Duplicate Email Error** | Email already registered for this staff type. Use different email. |
| **Duplicate Phone Error** | Phone already registered for this staff type. Use different phone. |
| **Validation Failed** | Verify all required fields present. Check birth_date format. Location object required. |
| **Staff Not Found** | Verify staff ID exists. Check query parameters. Confirm staff type endpoint. |
| **Port 5007 Already in Use** | Kill existing process or change port in `app.js`. Restart service. |
| **Password Mismatch on Login** | Ensure password hashed with bcrypt. Check bcrypt comparison in gateway (Port 5006). |

## Future Enhancements

- [ ] Staff availability calendar
- [ ] Shift scheduling management
- [ ] License/certification expiration tracking
- [ ] Staff department assignment
- [ ] On-call scheduling
- [ ] Staff search/filtering by specialization
- [ ] Workload balancing suggestions
- [ ] Staff performance analytics
- [ ] Emergency contact information
- [ ] Professional credentials verification
- [ ] Staff suspension/reactivation status
- [ ] Bulk staff import/export

## Security Notes

- Always use strong passwords
- Passwords stored as bcrypt hashes only
- Unique email/phone prevents account duplication per staff type
- Use HTTPS in production
- Validate all inputs on both client and server
- Never return passwords in API responses
- Keep dependencies updated
- Store JWT secrets securely in environment variables
- Implement role-based access control in gateway

## Running Tests

Test files included in `test/` directory:

Use `.rest` files with VS Code REST Client extension:
```
test/request.rest
```

## Notes

- Service manages three separate collections: doctors, nurses, drivers
- Each staff type has separate role ID and can be queried independently
- Doctors have additional fields: speciality and reports array
- All staff types support tasks and absences tracking
- Email/phone uniqueness is per staff type (not global)
- Profile images stored in GridFS via File Service (Port 5004)

## License
apache-2.0 License
