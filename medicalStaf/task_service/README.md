# Task Service

A microservice for managing medical staff tasks and appointment assignments in the CareHouse healthcare management system. This service handles task creation, assignment, tracking, and completion with QR code validation.

## Overview

The Task Service is a Node.js/Express microservice that provides APIs for:
- **Task Management**: Create, read, update, and delete task records
- **Staff Task Tracking**: Retrieve all tasks for a specific medical staff member
- **Appointment Association**: Link tasks to specific appointments
- **Task Status Tracking**: Monitor task completion with QR code validation
- **Bulk Operations**: Delete all tasks for a medical staff member
- **Appointment Details**: Store and populate appointment information with tasks
- **Duplicate Prevention**: Prevent duplicate task assignments (same staff + appointment)
- **QR Code Validation**: Verify correct task completion via QR code scanning

## Architecture

```
Medical Staff Interface Backend (Port 5006)
    ↓
Task Service (Port 5009)
    ├── Task CRUD Handlers
    ├── Medical Staff Filtering
    ├── Appointment Association
    ├── QR Code Validation
    └── Duplicate Prevention
        ↓
    MongoDB (tasks, appointments collections)
```

## Features

✅ Full CRUD operations for task records  
✅ Query tasks by medical staff member ID  
✅ Bulk delete tasks for a staff member  
✅ Duplicate task prevention (same staff + appointment)  
✅ Task status tracking (finished: boolean)  
✅ Team/group assignment for tasks  
✅ Task ordering/prioritization  
✅ Appointment data embedding with tasks  
✅ QR code validation for task completion  
✅ Location tracking (address, country, city, GPS coordinates)  
✅ Appointment status management (waiting, inprogress, done)  
✅ Automatic timestamp tracking (createdOn, createdAt)  
✅ MongoDB persistence with Mongoose ODM  
✅ Mongoose populate for appointment details  
✅ Environment-based configuration  

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Double Precision**: mongoose-double (for GPS coordinates)
- **Environment**: dotenv

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB running locally or remote connection
- npm or yarn

### Setup

1. Navigate to the service directory
```bash
cd medicalStaf/task_service
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
# MongoDB Connection
DATABASE_URI=mongodb://localhost:27017/tasks
# or for remote MongoDB
DATABASE_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tasks
```

4. Start the service
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The service will listen on `http://localhost:5009`

## Project Structure

```
task_service/
├── app.js                          # Express app entry point
├── package.json                    # Dependencies and scripts
├── config/
│   └── connectDB.js               # MongoDB connection configuration
├── middleware/
│   ├── getTask.js                 # Get task by ID middleware
│   └── verifyRequiredAttributes.js # Request validation middleware
├── model/
│   ├── Task.js                    # Task schema definition
│   └── Appointment.js             # Appointment schema definition
├── controller/
│   └── taskController.js          # Task handlers
├── route/
│   └── tasks.js                   # Task API routes
└── test/
    └── request.rest               # API test requests
```

## Database Models

### Task

```javascript
Task {
  _id: ObjectId,
  order: Number (optional, for prioritization),
  team: String (required, team/group name),
  appointment: ObjectId (required, reference to Appointment),
  medicalStaff: ObjectId (required, doctor/nurse/driver ID),
  finished: Boolean (default: false),
  createdOn: Date (auto-generated)
}
```

### Appointment

```javascript
Appointment {
  _id: ObjectId,
  typeofAppointment: String (required, e.g., "Consultation"),
  date: String (appointment date),
  time: String (appointment time),
  status: String (enum: ["waiting", "inprogress", "done"], default: "waiting"),
  createdAt: Date (auto-generated),
  location: {
    address: String (required),
    country: String (required),
    city: String (required),
    longitude: Double (GPS coordinate),
    latitude: Double (GPS coordinate)
  },
  careTaker: Boolean (default: false),
  qrCode_id: String (required, unique QR code identifier),
  patient: ObjectId (required, patient reference),
  doctor: ObjectId (optional, assigned doctor),
  nurse: ObjectId (optional, assigned nurse)
}
```

## API Endpoints

### Base URL
```
http://localhost:5009/api/tasks
```

### Get All Tasks
```
GET /api/tasks
Response: [{ task1 }, { task2 }, ...]
Status: 200 OK | 404 No tasks found
```

Note: Responses include populated appointment data.

### Get Tasks for Specific Medical Staff
```
GET /api/tasks/medicalStaffs/:idM
Response: [{ task1 }, { task2 }, ...]
Status: 200 OK | 404 Staff has no tasks
```

### Get Single Task by ID
```
GET /api/tasks/:id
Response: { _id, order, team, appointment, medicalStaff, finished, createdOn }
Status: 200 OK | 404 Task not found
```

### Create Task
```
POST /api/tasks
Content-Type: application/json

Body: {
  "appointment": "507f1f77bcf86cd799439011",
  "medicalStaff": "507f1f77bcf86cd799439012",
  "team": "Cardiology Team"
}

Response: { _id, appointment, medicalStaff, team, finished, createdOn }
Status: 201 Created | 409 Duplicate | 400 Bad Request
```

Validation:
- All fields required (appointment, medicalStaff, team)
- Duplicate prevention: same appointment + medicalStaff not allowed
- appointment and medicalStaff must be valid ObjectIds

### Update Task
```
PUT /api/tasks/:id
Content-Type: application/json

Body: {
  "finished": true,
  "qrCode_id": "abc123def456",
  "team": "Emergency Team",
  "order": 1
}

Response: { _id, appointment, medicalStaff, team, finished, createdOn }
Status: 200 OK | 400 Bad Request
```

Validation for Task Completion:
- To mark finished: true, qrCode_id MUST be provided
- qrCode_id must match the appointment's qrCode_id
- If QR code doesn't match: returns 400 "you had been scan the wrong task"

Fields that can be updated:
- `finished` - Mark task as complete (requires QR validation)
- `team` - Update team assignment
- `order` - Update task priority/order
- `qrCode_id` - Only used for validation during completion

### Delete Single Task
```
DELETE /api/tasks/:id
Response: { deletion info }
Status: 200 OK | 500 Server error
```

### Delete All Tasks for Medical Staff
```
DELETE /api/tasks/medicalStaffs/:idM
Response: { message: "all tasks deleted successfully" }
Status: 200 OK | 500 Server error
```

## Middleware

### getTask.js
- Retrieves task record by ID
- Populates appointment details
- Stores in `res.task` for use in handlers
- Used by GET, PUT, DELETE operations on single task

### verifyRequiredAttributes.js
- Validates POST request contains all required fields
- Ensures appointment, medicalStaff, team present
- Returns 400 if validation fails

## Workflow: Task Creation & Completion

### Task Creation
```
1. Admin creates appointment (Port 5001)
2. Gateway creates task linking doctor to appointment
3. POST /api/tasks with appointment, medicalStaff, team
4. Task created with finished: false
5. Task appears in doctor's task list
```

### Task Completion
```
1. Medical staff scans QR code from appointment
2. QR code ID extracted
3. PUT /api/tasks/:id with finished: true, qrCode_id
4. Service validates QR code matches appointment.qrCode_id
5. If valid: task marked finished: true
6. Cascading delete triggered in gateway (deletes task + appointment + removes from staff)
7. Task removed from staff's task list
```

## QR Code Validation

The task completion includes QR code validation for security:

- Each appointment has a unique `qrCode_id`
- When marking task as finished, medical staff must provide `qrCode_id`
- Service compares provided QR code with appointment's QR code
- If mismatch: returns 400 error "you had been scan the wrong task"
- If match: task marked as finished

## Error Handling

| Status | Message | Cause |
|--------|---------|-------|
| 200 | Success | Operation completed |
| 201 | Created | Task created successfully |
| 400 | Bad Request | Missing fields, QR code mismatch, validation error |
| 404 | Not Found | Task or staff not found |
| 409 | Conflict | Duplicate task for same staff+appointment |
| 500 | Server Error | Database or connection error |

## Integration with Other Services

This service is called by:

- **Medical Staff Interface Backend (Port 5006)**
  - Creates tasks for appointments
  - Retrieves staff tasks
  - Marks tasks as complete with QR validation
  - Deletes tasks

- **Appointment Service (Port 5001)**
  - Provides appointment data for tasks
  - Supplies QR code IDs for validation

- **Medical Staff Service (Port 5007)**
  - Provides staff IDs for task assignment
  - Receives task updates

## Use Cases

### 1. Doctor Assigned to Appointment
```
Admin creates appointment with doctor assignment
→ Task created linking doctor to appointment
→ Doctor sees task in task list
```

### 2. Doctor Completes Task
```
Doctor scans appointment QR code
→ Extracts QR code ID
→ Sends PUT with finished: true, qrCode_id
→ Service validates QR code
→ Task marked complete
→ Cascading delete removes task + appointment
```

### 3. View Staff Workload
```
Manager requests all tasks for doctor
→ GET /api/tasks/medicalStaffs/:doctorId
→ Returns all active (unfinished) and completed tasks
```

## Constraints & Validations

### Required Fields
- `team` - Team or group assignment
- `appointment` - Reference to appointment (ObjectId)
- `medicalStaff` - Reference to staff member (ObjectId)

### Business Rules
- Cannot create duplicate task (same staff + appointment combination)
- Task completion requires QR code validation
- QR code must match appointment's QR code
- MedicalStaff and Appointment must be valid ObjectIds

### Date Logic
- createdOn tracks when task was created
- Task remains in system until explicitly deleted
- Completed tasks still queryable and deletable

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB Connection Failed** | Verify MongoDB running. Check DATABASE_URI in `.env`. Check network connectivity. |
| **Duplicate Task Error** | Same staff + appointment already has task. Assign to different staff or appointment. |
| **Task Not Found** | Verify task ID exists. Check query parameters. Ensure staff/appointment not deleted. |
| **QR Code Mismatch** | Scanned wrong appointment QR code. Ensure correct appointment QR code is scanned. |
| **Validation Failed** | Verify all required fields present. Check appointment/medicalStaff are valid ObjectIds. |
| **Port 5009 Already in Use** | Kill existing process or change port in `app.js`. Restart service. |
| **Staff Tasks Not Returned** | Verify staff ID is valid. Check staff has active tasks. Confirm MongoDB running. |

## Future Enhancements

- [ ] Task priority levels (critical, high, normal, low)
- [ ] Task status workflow (pending, assigned, in-progress, completed)
- [ ] Task duration tracking and time estimates
- [ ] Task dependencies and prerequisites
- [ ] Bulk task assignment and import
- [ ] Task reassignment to different staff
- [ ] Task history and audit trail
- [ ] Notification on task assignment and completion
- [ ] Task rating/feedback system
- [ ] Performance metrics per staff member
- [ ] Task templates and automation
- [ ] Recurring task scheduling
- [ ] Task attachment support (documents, images)
- [ ] Task comments and collaboration
- [ ] Real-time task status updates (WebSocket)

## Security Notes

- Validate all input before processing
- QR code validation prevents unauthorized task completion
- Ensure only authorized staff can mark tasks complete
- Use HTTPS in production
- Validate ObjectId format for medicalStaff and appointment
- Implement audit trail for task modifications
- Prevent unauthorized staff from accessing others' tasks
- Use role-based access control in gateway

## Running Tests

Test files included in `test/` directory:

Use `.rest` files with VS Code REST Client extension:
```
test/request.rest
```

## Notes

- Service expects medicalStaff to be valid ObjectId from Medical Staff Service (Port 5007)
- Service expects appointment to be valid ObjectId from Appointment Service (Port 5001)
- QR code validation is critical for task security
- Tasks are typically deleted after completion (cascading delete from gateway)
- Appointment data is populated in task responses for convenience
- GPS coordinates use double precision for accuracy

## License
apache-2.0 License
