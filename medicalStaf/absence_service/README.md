# Absence Service

A microservice for managing medical staff absences, leave requests, and vacation records in the CareHouse healthcare management system. This service handles absence creation, retrieval, updating, and deletion for doctors, nurses, and drivers.

## Overview

The Absence Service is a Node.js/Express microservice that provides APIs for:
- **Absence Management**: Create, read, update, and delete absence records
- **Staff Absence Tracking**: Retrieve all absences for a specific medical staff member
- **Bulk Operations**: Delete all absences for a medical staff member
- **Reason Management**: Update absence reason
- **Date Range Storage**: Track start date and end date for absences
- **Duplicate Prevention**: Prevent duplicate absence records for same staff/date

## Architecture

```
Medical Staff Interface Backend (Port 5006)
    ↓
Absence Service (Port 5008)
    ├── Absence CRUD Handlers
    ├── Medical Staff Filtering
    ├── Date Range Tracking
    └── Validation Middleware
        ↓
    MongoDB (absences collection)
```

## Features

✅ Full CRUD operations for absence records  
✅ Query absences by medical staff member ID  
✅ Bulk delete absences for a staff member  
✅ Duplicate absence prevention (same staff + start date)  
✅ Absence reason tracking and updates  
✅ Start date and end date management  
✅ Automatic timestamp tracking (createdAt)  
✅ MongoDB persistence with Mongoose ODM  
✅ Environment-based configuration  
✅ Request validation middleware  

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
cd medicalStaf/absence_service
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
# MongoDB Connection
DATABASE_URI=mongodb://localhost:27017/absences
# or for remote MongoDB
DATABASE_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/absences
```

4. Start the service
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The service will listen on `http://localhost:5008`

## Project Structure

```
absence_service/
├── app.js                          # Express app entry point
├── package.json                    # Dependencies and scripts
├── config/
│   └── connectDB.js               # MongoDB connection configuration
├── middleware/
│   ├── getAbsence.js              # Get absence by ID middleware
│   └── verifyRequiredAttributes.js # Request validation middleware
├── model/
│   └── Absence.js                 # Absence schema definition
├── controller/
│   └── absenceController.js       # Absence handlers
├── route/
│   └── absences.js                # Absence API routes
└── test/
    └── request.rest               # API test requests
```

## Database Model

### Absence

```javascript
Absence {
  _id: ObjectId,
  startDate: String (required, date format),
  endDate: String (required, date format),
  reason: String (required, absence reason),
  medicalStaff: ObjectId (required, doctor/nurse/driver ID),
  createdAt: Date (auto-generated)
}
```

## API Endpoints

### Base URL
```
http://localhost:5008/api/absences
```

### Get All Absences
```
GET /api/absences
Response: [{ absence1 }, { absence2 }, ...]
Status: 200 OK | 404 No absences found
```

### Get Absences for Specific Medical Staff
```
GET /api/absences/medicalStaffs/:idM
Response: [{ absence1 }, { absence2 }, ...]
Status: 200 OK | 404 Staff has no absences
```

### Get Single Absence by ID
```
GET /api/absences/:id
Response: { _id, startDate, endDate, reason, medicalStaff, createdAt }
Status: 200 OK | 404 Absence not found
```

### Create Absence
```
POST /api/absences
Content-Type: application/json

Body: {
  "startDate": "2024-05-20",
  "endDate": "2024-05-25",
  "reason": "Vacation",
  "medicalStaff": "507f1f77bcf86cd799439011"
}

Response: { _id, startDate, endDate, reason, medicalStaff, createdAt }
Status: 201 Created | 409 Duplicate | 400 Bad Request
```

Validation:
- All fields required
- Duplicate prevention: same medicalStaff + startDate not allowed
- Date format should be valid (e.g., "YYYY-MM-DD")

### Update Absence Reason
```
PUT /api/absences/:id
Content-Type: application/json

Body: {
  "reason": "Medical Leave"
}

Response: { _id, startDate, endDate, reason, medicalStaff, createdAt }
Status: 200 OK | 400 Bad Request
```

Note: Currently only reason field can be updated.

### Delete Single Absence
```
DELETE /api/absences/:id
Response: { deletion info }
Status: 200 OK | 500 Server error
```

### Delete All Absences for Medical Staff
```
DELETE /api/absences/medicalStaffs/:idM
Response: { message: "all absences deleted successfully" }
Status: 200 OK | 500 Server error
```

Note: Deletes all absence records for specified medical staff member.

## Middleware

### getAbsence.js
- Retrieves absence record by ID
- Stores in `res.absence` for use in handlers
- Used by GET, PUT, DELETE operations on single absence

### verifyRequiredAttributes.js
- Validates POST request contains all required fields
- Ensures startDate, endDate, reason, medicalStaff present
- Returns 400 if validation fails

## Use Cases

### 1. Medical Staff Requests Leave
```
Doctor/Nurse submits absence request via gateway
→ POST /api/absences
→ Absence created in database
→ In-app notification sent to admin
```

### 2. Admin Views Staff Absences
```
Admin Portal requests staff absences
→ GET /api/absences/medicalStaffs/:staffId
→ Returns all absences for that staff member
→ Admin can approve/reject/view details
```

### 3. Absence Ends
```
When absence timeline expires
→ Frontend deletes absence record
→ DELETE /api/absences/:id
→ Staff marked as available again
```

## Error Handling

| Status | Message | Cause |
|--------|---------|-------|
| 200 | Success | Operation completed |
| 201 | Created | Absence created successfully |
| 400 | Bad Request | Missing fields, validation error |
| 404 | Not Found | Absence or staff not found |
| 409 | Conflict | Duplicate absence for same staff/date |
| 500 | Server Error | Database or connection error |

## Integration with Other Services

This service is called by:

- **Medical Staff Interface Backend (Port 5006)**
  - Creates absence records for staff
  - Retrieves staff absences
  - Updates absence reasons
  - Deletes absences

- **Task Scheduler (Port 5009)**
  - May check staff absences to disable task assignment
  - Prevent assigning tasks to absent staff

## Constraints & Validations

### Required Fields
- `startDate` - Leave start date (format: YYYY-MM-DD)
- `endDate` - Leave end date (format: YYYY-MM-DD)
- `reason` - Reason for absence (vacation, sick leave, training, etc.)
- `medicalStaff` - ObjectId of doctor/nurse/driver

### Business Rules
- startDate should be before or equal to endDate
- Cannot create duplicate absence (same staff + startDate)
- Only reason can be updated (dates are immutable)
- Absence records are soft or hard deleted

### Date Logic
- Dates stored as strings (frontend handles date validation)
- Frontend should validate startDate < endDate before sending
- Frontend should delete absence when startDate passes

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB Connection Failed** | Verify MongoDB running. Check DATABASE_URI in `.env`. Check network connectivity. |
| **Duplicate Absence Error** | Same staff + start date already exists. Use different date or update existing record. |
| **Absence Not Found** | Verify absence ID exists. Check query parameters. Ensure staff deletion didn't cascade. |
| **Validation Failed** | Verify all required fields present. Check date format (YYYY-MM-DD). Check medicalStaff is valid ObjectId. |
| **Port 5008 Already in Use** | Kill existing process or change port in `app.js`. Restart service. |
| **Staff Absences Not Returned** | Verify staff ID is valid. Check staff has absences. Confirm MongoDB running. |

## Future Enhancements

- [ ] Absence status (pending, approved, rejected, completed)
- [ ] Approval workflow for absence requests
- [ ] Absence type classification (vacation, sick, training, etc.)
- [ ] Absence balance tracking (annual leave balance)
- [ ] Notifications for absence approval/rejection
- [ ] Absence history and archival
- [ ] Bulk absence import from CSV
- [ ] Absence calendar view integration
- [ ] Email notifications to admin on absence request
- [ ] SMS reminders before absence ends
- [ ] Automatic absence cleanup after end date
- [ ] Absence conflict detection (overlapping dates)
- [ ] Manager approval workflows
- [ ] Department-level absence reports
- [ ] Compliance monitoring (excessive absences)

## Security Notes

- Validate all input before processing
- Ensure only authorized users can create/delete absences
- Use HTTPS in production
- Validate ObjectId format for medicalStaff
- Store dates consistently (recommend ISO 8601 format)
- Implement audit trail for absence modifications
- Prevent unauthorized staff from accessing others' absences
- Use role-based access control in gateway

## Running Tests

Test files included in `test/` directory:

Use `.rest` files with VS Code REST Client extension:
```
test/request.rest
```

## Notes

- Service expects medicalStaff to be valid ObjectId from Medical Staff Service (Port 5007)
- Dates should be validated on frontend before sending
- Consider implementing soft delete instead of hard delete for audit trail
- Each medical staff member can have multiple absence records
- Implement auto-deletion of past absences for data cleanup

## License
apache-2.0 License
