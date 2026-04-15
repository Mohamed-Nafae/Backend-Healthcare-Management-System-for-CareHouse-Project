# Make Appointment Service

A microservice for managing medical appointments in the CareHouse patient management system. This service handles appointment creation, retrieval, updating, and deletion, as well as managing appointment types.

## Overview

The Make Appointment Service is a RESTful Node.js/Express microservice that provides APIs for:
- **Appointment Management**: Create, read, update, and delete patient appointments
- **Appointment Type Management**: Define and manage different types of appointments (e.g., Consultation, Surgery, Follow-up)
- **Availability Control**: Enable/disable appointment types
- **Duplicate Prevention**: Prevent patients from booking the same appointment type twice

## Features

✅ Full CRUD operations for appointments  
✅ Appointment type management with availability control  
✅ Patient-specific appointment filtering  
✅ Appointment status tracking (waiting, inprogress)  
✅ Geographic location storage (address, country, city, coordinates)  
✅ QR code support for appointment tracking  
✅ Staff assignment (doctor, nurse, care taker)  
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

1. Clone or navigate to the service directory
```bash
cd make_appoinment_service
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
# MongoDB Connection
DATABASE_URI=mongodb://localhost:27017/appointments
# or for remote MongoDB
DATABASE_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/appointments

```

4. Start the service
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The service will listen on `http://localhost:5001`

## Project Structure

```
make_appoinment_service/
├── app.js                           # Express app entry point
├── package.json                     # Dependencies and scripts
├── config/
│   └── connectDB.js                # MongoDB connection configuration
├── controller/
│   ├── appointmentsController.js   # Appointment CRUD handlers
│   └── appointmentTypesController.js # Appointment type handlers
├── middleware/
│   └── verifyRequiredAttributes.js # Request validation middleware
├── model/
│   ├── Appointment.js              # Appointment schema
│   └── AppointmentType.js          # AppointmentType schema
├── route/
│   ├── appointments.js             # Appointment routes
│   └── appointmentTypes.js         # AppointmentType routes
└── test/
    ├── apType.rest                 # Appointment type test requests
    └── test.rest                   # Appointment test requests
```

## Database Models

### Appointment

```javascript
{
  typeofAppointment: String,        // Type of appointment (required)
  date: String,                      // Appointment date
  time: String,                      // Appointment time
  status: String,                    // 'waiting' or 'inprogress' (default: 'waiting')
  createdAt: Date,                   // Creation timestamp (auto-generated)
  location: {
    address: String,                 // Street address (required)
    country: String,                 // Country (required)
    city: String,                    // City (required)
    longitude: Double,               // GPS longitude (required)
    latitude: Double                 // GPS latitude (required)
  },
  careTaker: Boolean,                // Whether care taker is present (default: false)
  qrCode_id: String,                // QR code identifier for tracking
  patient: ObjectId,                // Reference to patient
  doctor: ObjectId,                 // Reference to assigned doctor
  nurse: ObjectId                   // Reference to assigned nurse
}
```

### AppointmentType

```javascript
{
  name: String,                      // Type name (required, unique)
  available: Boolean,                // Is this appointment type available? (default: true)
  createdAt: Date                    // Creation timestamp (auto-generated)
}
```

## API Endpoints

### Base URL
```
http://localhost:5001/api
```

### Appointments

#### Get all appointments
```
GET /appointments
```
**Response**: Array of all appointments

#### Get all appointments for a patient
```
GET /appointments/:patientId
```
**Response**: Array of patient's appointments

#### Get specific appointment
```
GET /appointments/:appointmentId
```
**Response**: Appointment object

#### Create new appointment
```
POST /appointments
Content-Type: application/json

{
  "typeofAppointment": "Consultation",
  "date": "2026-04-20",
  "time": "10:30",
  "status": "waiting",
  "location": {
    "address": "123 Main St",
    "country": "USA",
    "city": "New York",
    "longitude": -74.0060,
    "latitude": 40.7128
  },
  "careTaker": true,
  "qrCode_id": "QR123456",
  "patient": "patient_id",
  "doctor": "doctor_id",
  "nurse": "nurse_id"
}
```
**Response**: 201 Created with appointment object

#### Update appointment
```
PUT /appointments/:appointmentId
Content-Type: application/json

{
  "status": "inprogress",
  ...other fields
}
```
**Response**: Updated appointment object

#### Delete appointment
```
DELETE /appointments/:appointmentId
```
**Response**: 204 No Content

### Appointment Types

#### Get all appointment types
```
GET /appointmentTypes
```
**Response**: Array of appointment types

#### Get specific appointment type
```
GET /appointmentTypes/:typeName
```
**Response**: AppointmentType object

#### Create new appointment type
```
POST /appointmentTypes
Content-Type: application/json

{
  "name": "Consultation"
}
```
**Response**: 201 Created with AppointmentType object

#### Update appointment type availability
```
PUT /appointmentTypes/:typeName
Content-Type: application/json

{
  "available": false
}
```
**Response**: Updated AppointmentType object

## Key Business Logic

### Appointment Creation Validation
1. **Type Check**: Verifies that the requested appointment type exists and is available
2. **Duplicate Prevention**: Prevents patients from booking the same appointment type twice
3. **Error Handling**: Returns appropriate HTTP status codes

### Status Codes
- `200 OK`: Successful GET request
- `201 Created`: Resource successfully created
- `400 Bad Request`: Missing required fields
- `404 Not Found`: Resource doesn't exist or no results found
- `409 Conflict`: Duplicate appointment or type already exists
- `500 Internal Server Error`: Database or server error

## Running Tests

Test files are included in the `test/` directory in REST client format:

- `test.rest`: Appointment endpoint tests
- `apType.rest`: Appointment type endpoint tests

These can be run using VS Code REST Client extension or similar tools.

## Environment Configuration

The service requires the following environment variables:

```env
DATABASE_URI        # MongoDB connection string
PORT               # Service port (default: 5001)
```

For development, create a `.env` file with these variables.

## Performance Considerations

- **Indexes**: Ensure MongoDB has indexes on:
  - `Appointment.patient` (for patient-specific queries)
  - `AppointmentType.name` (for type lookups)
  - `Appointment.typeofAppointment` (for duplicate checking)

- **Scaling**: This service is stateless and can be horizontally scaled behind a load balancer

## Error Handling

The service provides descriptive JSON error responses:

```json
{
  "message": "Error description"
}
```

Common scenarios:
- Missing appointment type returns 404
- Duplicate appointments return 409
- Invalid data returns 400
- Database errors return 500

## Future Enhancements

- [ ] Appointment notification system
- [ ] Availability/Scheduling engine
- [ ] Rate limiting
- [ ] Pagination for list endpoints
- [ ] Advanced filtering and sorting
- [ ] Appointment reminders
- [ ] Conflict detection with doctor/nurse schedules

## License

appache-2.0 License
