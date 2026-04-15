# CareHouse Microservices System - Complete Data Flow Documentation

## 📊 System Architecture Overview

The CareHouse healthcare management system is built as a distributed microservices architecture with three main domains:
1. **Patient Module** (Ports 5000-5005)
2. **Admin Module** (Ports 5010-5011)
3. **Medical Staff Module** (Ports 5006-5009)

Each module has an API Gateway (Interface Backend) that coordinates communication between services and external clients.

---

## 🏗️ System Architecture Diagram

```
                                    CLIENTS (Web/Mobile)
                                          |
                    ________________________|________________________
                   |                       |                       |
                   ▼                       ▼                       ▼
         ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
         │   PATIENT ADMIN  │   │  ADMIN INTERFACE │   │ MEDICAL STAFF    │
         │   PORT 5000      │   │  GATEWAY         │   │ GATEWAY          │
         │                  │   │  PORT 5011       │   │ PORT 5006        │
         │ (API Gateway)    │   │                  │   │                  │
         │                  │   │ (API Gateway)    │   │ (API Gateway)    │
         └──────────────────┘   └──────────────────┘   └──────────────────┘
                   |                       |                       |
       ____________|_______________________|_______________________
       |           |           |           |           |           |
       ▼           ▼           ▼           ▼           ▼           ▼
    5001        5002        5003        5004        5005        5010
  APPOINT    MEDICAL     PATIENT      FILE       REPORT       ADMIN
  MENT       FOLDER      SERVICE      SERVICE    SERVICE      SERVICE
  SERVICE    SERVICE                  (GridFS)
    |           |           |            |           |           |
    └───────────┴───────────┴────────────┴───────────┴───────────┘
                                |
                       MongoDB Database
                       (Microservice Specific)
```

---

## 🔗 SERVICE INTERCONNECTION MAP

### PATIENT SYSTEM (Ports 5000-5005)

#### Port 5000: Patient Interface Backend (API Gateway) ⚙️
**Role:** Main entry point for patient-facing APIs
**Authentication:** JWT-based (access + refresh tokens)
**Responsibilities:**
- Patient login/register/logout
- Token management (refresh)
- Request routing to internal services
- Request logging
- File upload handling

**Outbound Connections:**
- → 5001 (Appointments API)
- → 5002 (Medical Folders API)
- → 5003 (Patient Service)
- → 5004 (File Upload Service)
- → 5005 (Reports API)

**Data Flow:**
```
Client Request → Port 5000 (Authenticate) → Route to Service → MongoDB → Response
```

---

#### Port 5001: Make Appointment Service 📅
**Role:** Manages patient appointments and appointment types
**Database:** MongoDB (appointments collection)

**Key Models:**
- **Appointment**: Patient appointment records with status (waiting, inprogress)
- **AppointmentType**: Available appointment types with availability control

**Data Managed:**
```
Appointment {
  _id, patient_id, appointment_type_id, doctor_id, nurse_id, 
  status, date, time, location, qr_code, created_at
}

AppointmentType {
  _id, name, enabled, description
}
```

**Integration Points:**
- ← From Patient Service (5003): Patient validation
- ← From Admin Interface (5011): Appointment CRUD operations
- ← From Medical Staff Interface (5006): Task assignments

**Data Relationships:**
```
Patient (5003) ──→ Appointment (5001)
                      ↓
                Medical Staff (5007)
                      ↓
                  Tasks (5009)
```

---

#### Port 5002: Medical Folder Service 📁
**Role:** Manages patient medical records and clinical documentation
**Database:** MongoDB (medicalFolder collection)

**Key Data Structure:**
```
MedicalFolder {
  _id, patient_id, folder_content_file_id, created_at, updated_at
}
```

**Integration Points:**
- ← From Patient Service (5003): Patient medical folder reference
- ← From Medical Staff Interface (5006): Read/write medical records
- → To File Service (5004): Get/upload medical documents

**Data Flow:**
```
Medical Staff → Port 5006 → Port 5002 → Get medical_folder_id → 
Port 5004 (Download file from GridFS) → Return to Medical Staff
```

---

#### Port 5003: Patient Service 👤
**Role:** Manages patient profiles and authentication tokens
**Database:** MongoDB (patients collection)

**Key Models:**
```
Patient {
  _id, email, password, phone, name, age, gender,
  address, city, country, gps_coordinates,
  profile_image, medical_folder_id, refresh_token,
  created_at, updated_at
}
```

**Core Operations:**
- Patient registration (with email/phone validation)
- Patient profile CRUD
- JWT refresh token management
- Patient search (by email, refresh token)

**Integration Points:**
- ← From Patient Interface Gateway (5000): Patient auth/profile operations
- ← From Medical Staff Interface (5006): Patient lookup
- ← From Admin Interface (5011): Patient validation

**Data Query Examples:**
```
GET /patients/:id → Get patient profile
POST /patients → Create patient (registration)
PUT /patients/:id → Update patient info
DELETE /patients/:id → Delete patient
GET /patients/query?email=... → Find by email
```

---

#### Port 5004: Upload File Service 📤
**Role:** File storage using MongoDB GridFS
**Storage:** MongoDB GridFS (distributed file storage)

**Features:**
- Multipart form-data handling
- Dynamic bucket support (buckets for different document types)
- Automatic filename preservation
- Content-type handling

**File Buckets (Collections):**
```
1. images (Patient & Medical Staff profile pictures)
2. medicalFolders (PDF documents, medical records)
3. reports (Clinical report documents)
```

**Data Flow:**
```
Request (with file) → Port 5004
                        ↓
                   Parse multipart data
                        ↓
                   MongoDB GridFS
                        ↓
                   Return file_id
                        ↓
                   Response with file_id
```

**Integration Points:**
- ← From Patient Interface (5000): Patient image upload
- ← From Medical Staff Interface (5006): Staff images, medical documents
- ← From Admin Interface (5011): Medical staff image uploads

---

#### Port 5005: Report Service 📋
**Role:** Manages medical reports generated by doctors
**Database:** MongoDB (reports collection)

**Key Model:**
```
Report {
  _id, patient_id, doctor_id, report_content,
  report_file_id, created_at
}
```

**Core Operations:**
- Create medical reports (by doctors)
- Retrieve patient-specific reports
- Delete reports
- Report content management

**Integration Points:**
- ← From Medical Staff Interface (5006): Doctor creates reports
- ← From Patient Interface (5000): Patient views reports
- → To File Service (5004): Store report files

---

### ADMIN SYSTEM (Ports 5010-5011)

#### Port 5011: Admin Interface Backend (API Gateway) ⚙️
**Role:** Main entry point for admin-facing APIs
**Authentication:** JWT-based (access + refresh tokens)

**Endpoints Structure:**
```
POST /login          → Authenticate admin
GET /token           → Refresh access token
GET /logout          → Clear session
POST /:id/appointmentTypes → CRUD appointment types
POST /:id/appointments     → CRUD appointments
POST /:id/tasks            → CRUD tasks
POST /:id/doctors          → CRUD doctors
POST /:id/nurses           → CRUD nurses
```

**Middleware Chain:**
1. Logger middleware (log all requests)
2. JWT verification middleware
3. Role verification middleware
4. Admin existence verification

**Outbound Connections:**
- → 5010 (Admin Service for admin validation)
- → 5001 (Appointments for global appointment management)
- → 5003 (Patient Service for patient deletion cascading)
- → 5007 (Medical Staff Service for staff management)
- → 5009 (Task Service for task management)

---

#### Port 5010: Admin Service (REST API) 🛠️
**Role:** CRUD operations for admin profiles
**Database:** MongoDB (admins collection)

**Key Model:**
```
Admin {
  _id, email, password, role_admin, refresh_token,
  created_at, updated_at
}
```

**Core Operations:**
```
GET /api/admins           → Get all admins
GET /api/admins/:id       → Get admin profile
GET /api/admins/query?email=... → Find by email
POST /api/admins          → Create admin
PUT /api/admins/:id       → Update admin
DELETE /api/admins/:id    → Delete admin
```

**Integration Points:**
- ← From Admin Interface Gateway (5011): Validate admin on login

---

### MEDICAL STAFF SYSTEM (Ports 5006-5009)

#### Port 5006: Medical Staff Interface Backend (API Gateway) ⚙️
**Role:** Main entry point for medical staff (doctors, nurses, drivers)
**Authentication:** JWT-based with role differentiation

**Middleware Chain:**
1. Logger middleware
2. JWT verification
3. Role verification (doctor/nurse/driver)
4. Medical staff existence verification

**Endpoint Structure:**
```
POST /doctors/login      → Doctor authentication
POST /nurses/login       → Nurse authentication
POST /drivers/login      → Driver authentication
GET /token               → Refresh token
GET /logout              → Clear session
GET /doctors/:id/...     → Doctor operations
GET /nurses/:id/...      → Nurse operations
GET /drivers/:id/...     → Driver operations
```

**Outbound Connections:**
- → 5007 (Medical Staff Service for staff validation)
- → 5001 (Appointments for appointment management)
- → 5002 (Medical Folders for medical records)
- → 5003 (Patient Service for patient data)
- → 5004 (File Service for profile images & documents)
- → 5005 (Report Service for clinical reports)
- → 5008 (Absence Service for staff absences)
- → 5009 (Task Service for task management)

---

#### Port 5007: Medical Staff Service 🏥
**Role:** Manages doctor, nurse, and driver profiles
**Database:** MongoDB (medicalStaff collection)

**Key Models:**
```
Doctor {
  _id, email, password, name, specialization, license_number,
  phone, address, tasks[], role_doctor, profile_image,
  refresh_token, created_at
}

Nurse {
  _id, email, password, name, certification, license_number,
  phone, address, tasks[], role_nurse, profile_image,
  refresh_token, created_at
}

Driver {
  _id, email, password, name, license_number, vehicle_type,
  phone, address, tasks[], role_driver, profile_image,
  refresh_token, created_at
}
```

**Core Operations:**
```
GET /api/doctors           → Get all doctors
POST /api/doctors          → Create doctor
PUT /api/doctors/:id       → Update doctor
DELETE /api/doctors/:id    → Delete doctor
GET /api/nurses            → Get all nurses
POST /api/nurses           → Create nurse
... (similar for nurses & drivers)
```

**Data Field: tasks[]**
- Array of task IDs assigned to the medical staff member
- Linked to Port 5009 (Task Service)

---

#### Port 5008: Absence Service ⏰
**Role:** Manages medical staff absences/leave records
**Database:** MongoDB (absences collection)

**Key Model:**
```
Absence {
  _id, medicalStaff_id, start_date, end_date,
  reason, status (approved/pending/rejected),
  created_at, updated_at
}
```

**Core Operations:**
```
GET /api/absences                    → Get all absences
GET /api/absences/medicalStaff/:id   → Get absences for staff
POST /api/absences                   → Create absence request
PUT /api/absences/:id                → Update absence status
DELETE /api/absences/:id             → Delete absence
```

**Integration Points:**
- ← From Medical Staff Interface (5006): Staff creates absence request
- ← From Admin Interface (5011): Admin approves/rejects absence

---

#### Port 5009: Task Service ✓
**Role:** Manages tasks assigned to medical staff for appointments
**Database:** MongoDB (tasks collection)

**Key Model:**
```
Task {
  _id, medicalStaff_id, appointment_id, patient_id,
  task_description, status, priority, created_at, updated_at
}
```

**Core Operations:**
```
GET /api/tasks                       → Get all tasks
GET /api/tasks/medicalStaffs/:id     → Get tasks for staff
POST /api/tasks                      → Create task
PUT /api/tasks/:id                   → Update task (mark complete)
DELETE /api/tasks/:id                → Delete task
```

**Complex Data Flow - Task Completion:**
```
Medical Staff completes task (PUT /api/tasks/:id)
    ↓
Update task status
    ↓
DELETE /api/tasks/:id (remove task)
    ↓
DELETE /api/appointments/:appointmentId (remove appointment)
    ↓
Update medical staff tasks array (remove task_id)
    ↓
DELETE /patients/:patientId/appointments/:appointmentId (cascade)
    ↓
Response: "Task completed successfully"
```

---

## 📊 COMPLETE DATA FLOW SEQUENCES

### 1. PATIENT REGISTRATION & LOGIN

```
┌─────────────────────────────────────────────────────────────────┐
│ PATIENT REGISTRATION FLOW                                       │
└─────────────────────────────────────────────────────────────────┘

1. Client POST /auth/register
        ↓
2. Port 5000 (Patient Gateway) receives request
        ↓
3. Hash password with bcrypt
        ↓
4. Forward to Port 5003 (Patient Service)
        ↓
5. Port 5003 validates email/phone uniqueness
        ↓
6. Create patient record in MongoDB
        ↓
7. Return patient object to Port 5000
        ↓
8. Response with patient data to client

Data Saved in Database:
- MongoDB patient collection: Complete patient profile
```

---

```
┌─────────────────────────────────────────────────────────────────┐
│ PATIENT LOGIN & TOKEN GENERATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

1. Client POST /auth/login (email, password)
        ↓
2. Port 5000 receives, validates input
        ↓
3. Query Port 5003 for patient by email
        ↓
4. Port 5003 searches MongoDB (Patient.find({email}))
        ↓
5. Compare hashed passwords with bcrypt
        ↓
6. Generate JWT tokens:
   - accessToken (10 minutes) with _id, email, role
   - refreshToken (24 hours) with _id
        ↓
7. Save refreshToken array in patient document
        ↓
8. Set JWT in HTTP cookie (secure, httpOnly)
        ↓
9. Response with accessToken + patient._id to client
```

---

### 2. APPOINTMENT CREATION & TASK ASSIGNMENT

```
┌──────────────────────────────────────────────────────────────────┐
│ APPOINTMENT CREATION AND ASSIGNMENT FLOW                        │
└──────────────────────────────────────────────────────────────────┘

1. Admin POST /api/admins/:adminId/appointments
        ↓
2. Port 5011 (Admin Gateway) validates JWT + role
        ↓
3. Forward appointment data to Port 5001 (Appointment Service)
        ↓
4. Port 5001 validates:
   - Patient exists (query 5003)
   - Appointment type exists
   - No duplicate appointments for patient
        ↓
5. Create appointment in MongoDB:
   {
     _id: auto,
     patient: patient_id,
     appointment_type: aptype_id,
     doctor: doctor_id,
     status: "waiting",
     created_at: now
   }
        ↓
6. Create correlated task in Port 5009 (Task Service):
   {
     _id: auto,
     medicalStaff: doctor_id,
     appointment: appointment_id,
     patient: patient_id,
     status: "pending"
   }
        ↓
7. Update doctor profile in Port 5007:
   - Add task_id to doctor.tasks[]
        ↓
8. Add appointment to patient profile in Port 5003:
   - Append appointment_id to patient.appointments[]
        ↓
9. Response with appointment data

Result:
- Port 5001: New Appointment record
- Port 5009: New Task record  
- Port 5007: Doctor.tasks[] updated
- Port 5003: Patient.appointments[] updated
```

---

### 3. TASK COMPLETION BY MEDICAL STAFF

```
┌──────────────────────────────────────────────────────────────────┐
│ TASK COMPLETION CASCADING DELETE FLOW                           │
└──────────────────────────────────────────────────────────────────┘

1. Medical Staff (Doctor) PUT /api/tasks/:taskId (mark complete)
        ↓
2. Port 5006 (Medical Staff Gateway) validates JWT + role
        ↓
3. Port 5009 (Task Service) receives update
        ↓
4. Update task status to "completed"
        ↓
5. DELETE /api/tasks/:taskId (remove task)
        ↓
6. IMMEDIATELY DELETE correlated appointment:
   DELETE /api/appointments/:appointmentId (Port 5001)
        ↓
7. Query Port 5007 for doctor profile
   GET /api/doctors/:doctorId
        ↓
8. Build new tasks array (filter out completed task_id)
   PUT /api/doctors/:doctorId (update tasks[])
        ↓
9. Query Port 5003 for patient
   GET /api/patients/:patientId
        ↓
10. DELETE cascading from patient appointments:
    DELETE /api/patients/:patientId/appointments/:appointmentId
        ↓
11. Response: "Task deleted successfully"

Result:
- Port 5009: Task deleted
- Port 5001: Appointment deleted
- Port 5007: Doctor.tasks[] updated (removed)
- Port 5003: Patient.appointments[] updated (removed)
```

---

### 4. MEDICAL STAFF PROFILE IMAGE UPLOAD

```
┌──────────────────────────────────────────────────────────────────┐
│ PROFILE IMAGE UPLOAD & FILE STORAGE FLOW                        │
└──────────────────────────────────────────────────────────────────┘

1. Admin POST /api/admins/:adminId/doctors/:doctorId/image
   (with multipart/form-data containing file)
        ↓
2. Port 5011 validates JWT + role
        ↓
3. Forward file to Port 5004 (File Service)
   Headers: Content-Type: multipart/form-data
        ↓
4. Port 5004 receives file stream
        ↓
5. Save to MongoDB GridFS (images bucket)
        ↓
6. GridFS returns file_id
        ↓
7. If doctor already has image: DELETE old file_id from GridFS
        ↓
8. Update doctor profile Port 5007:
   PUT /api/doctors/:doctorId {image: new_file_id}
        ↓
9. Response with success message

Result:
- MongoDB GridFS: New image file stored
- MongoDB Doctor document: image field updated with new_file_id
- Old image file: Deleted from GridFS (if existed)
```

---

### 5. MEDICAL FOLDER & DOCUMENT RETRIEVAL

```
┌──────────────────────────────────────────────────────────────────┐
│ MEDICAL FOLDER DOWNLOAD BY MEDICAL STAFF                        │
└──────────────────────────────────────────────────────────────────┘

1. Medical Staff GET /api/patients/:patientId/medicalFolder
        ↓
2. Port 5006 validates JWT + role
        ↓
3. Port 5006 calls verify_patient middleware:
   GET /api/patients/:patientId (Port 5003)
        ↓
4. Port 5003 returns patient object with medical_folder field
        ↓
5. Port 5006 checks if patient has medical_folder_id
        ↓
6. Query Port 5002 (Medical Folder Service):
   GET /api/medicalFolders/:medical_folder_id
        ↓
7. Port 5002 returns folder with medicalFolder_content_file_id
        ↓
8. Query Port 5004 (File Service) with file_id:
   GET /api/files/medicalFolders/:file_id
   responseType: "stream"
        ↓
9. Port 5004 retrieves file from MongoDB GridFS
        ↓
10. File stream piped to response
        ↓
11. Set headers: 
    Content-Disposition: attachment; filename=...
    Content-Type: application/pdf
        ↓
12. Download file to client

Result:
- PDF file downloaded to medical staff
- No data modification
- File remains in GridFS
```

---

### 6. ADMIN DELETION CASCADING

```
┌──────────────────────────────────────────────────────────────────┐
│ ADMIN MANAGEMENT: CREATE/UPDATE/DELETE                          │
└──────────────────────────────────────────────────────────────────┘

CREATE ADMIN:
1. Super Admin POST /api/admins/:adminId/doctors/:doctorId
   with admin data
        ↓
2. Port 5011 validates JWT + admin role
        ↓
3. Hash password with bcrypt
        ↓
4. Forward POST to Port 5010 (Admin Service)
        ↓
5. Port 5010 creates admin in MongoDB
        ↓
6. Response with new admin object

UPDATE ADMIN (including password change):
1. Admin PUT /api/admins/:adminId (with email, password, etc)
        ↓
2. Port 5011 validates JWT
        ↓
3. If password included: hash with bcrypt
        ↓
4. Forward to Port 5010
        ↓
5. Port 5010 updates MongoDB document
        ↓
6. Response with updated admin

DELETE ADMIN:
1. Super Admin DELETE /api/admins/:adminId
        ↓
2. Port 5011 validates JWT
        ↓
3. Forward to Port 5010
        ↓
4. Port 5010 deletes admin document
```

---

## 🔄 INTER-SERVICE COMMUNICATION PATTERNS

### Pattern 1: Gateway Forwarding
```
Client → Gateway (Port 5000/5011/5006) → Internal Service → MongoDB → Response
```
- Gateway handles authentication & authorization
- Gateway validates JWT tokens
- Gateway logs all requests
- Gateway routes to appropriate service

---

### Pattern 2: Service-to-Service Communication
```
Service A → Axios HTTP Request → Service B → MongoDB → Response
```
Example: When deleting appointment, Auto-delete from patient profile
```javascript
// In Port 5001 (Appointment Service)
DELETE /api/appointments/:appointmentId
  → Service queries MongoDB
  → Finds appointment.patient reference
  → Calls Port 5003 to delete from patient.appointments[]
```

---

### Pattern 3: Cascading Operations
```
DELETE /api/tasks/:taskId triggers:
  1. Delete task (Port 5009)
  2. Auto-delete appointment (Port 5001)
  3. Update medical staff (Port 5007)
  4. Update patient (Port 5003)
  5. Cleanup file references (Port 5004)
```

---

### Pattern 4: File Storage with References
```
File Upload → Port 5004 (GridFS) → Return file_id → 
Store file_id in document (Port 5003/5007) → 
Later: Retrieve file_id → Port 5004 → Download file
```

---

## 📈 DATA PERSISTENCE ARCHITECTURE

### MongoDB Collections by Service

**Patient Module:**
```
Database: (appointments|patients|medicalFolders|reports)
Collections:
- patients (5003)
- appointments (5001)
- appointmentTypes (5001)
- medicalFolders (5002)
- reports (5005)
- files.chunks (5004 - GridFS)
- files.files (5004 - GridFS metadata)
```

**Admin Module:**
```
Database: (admins)
Collections:
- admins (5010)
```

**Medical Staff Module:**
```
Database: (medicalStaff|tasks|absences)
Collections:
- doctors (5007)
- nurses (5007)
- drivers (5007)
- tasks (5009)
- absences (5008)
```

---

## 🔐 SECURITY & AUTHENTICATION FLOW

### JWT Token Management
```
Login:
  1. Verify credentials against MongoDB
  2. Generate accessToken (SHORT-LIVED: 10 minutes)
  3. Generate refreshToken (LONG-LIVED: 24 hours)
  4. Store refreshToken in MongoDB user document
  5. Set refreshToken as HTTP-only cookie
  6. Return accessToken in response body

Token Refresh:
  1. Client sends GET /token with cookie
  2. Extract refreshToken from cookie
  3. Verify refreshToken signature
  4. Generate new accessToken
  5. Optionally rotate refreshToken

Logout:
  1. Remove refreshToken from MongoDB
  2. Clear cookie
  3. Clear local storage (client-side)
```

---

## 🎯 REQUEST/RESPONSE FLOW SUMMARY

### Patient Makes Appointment
```
Client Request:
  PUT /api/patients/:patientId/appointments
  {
    appointment_type: "Consultation",
    date: "2024-05-20",
    time: "10:00"
  }

Gateway (5000):
  ├─ JWT Verification ✓
  ├─ Role Check (patient) ✓
  └─ Forward to Port 5001

Appointment Service (5001):
  ├─ Validate patient exists (call Port 5003)
  ├─ Check appointment type available
  ├─ Check duplicate prevention
  ├─ Create appointment in MongoDB
  └─ Create correlated task (call Port 5009)

Task Service (5009):
  ├─ Create task record
  ├─ Link to appointment
  ├─ Link to assigned medical staff
  └─ Return task_id

Response back to Patient:
  {
    status: 201,
    appointment_id: "...",
    status: "waiting",
    created_at: "2024-05-20..."
  }
```

---

## 🔗 CRITICAL INTEGRATION POINTS

### Must-Work Connections
| From | To | Purpose | Protocol |
|------|----|---------| ---------|
| 5000 | 5001,5002,5003,5004,5005 | Patient operations | HTTP/JSON |
| 5011 | 5001,5007,5009,5010 | Admin operations | HTTP/JSON |
| 5006 | 5001,5002,5003,5004,5005,5007,5008,5009 | Medical staff operations | HTTP/JSON |
| 5001 | 5003 | Appointment-Patient mapping | HTTP/JSON |
| 5009 | 5001,5003,5007 | Task cascading | HTTP/JSON |
| All | 5004 | File storage (GridFS) | Multipart/Streaming |

---

## ⚡ ERROR HANDLING & DATA CONSISTENCY

### Constraints Enforced
1. **Unique Constraints:** Email, phone (per service)
2. **Referential Integrity:** Foreign key-like relationships
3. **Cascade Operations:** Delete task → Delete appointment → Update patient
4. **Transaction Safety:** GridFS operations with file_id tracking
5. **Token Validation:** JWT verification at every gateway

### Error Responses
- 400: Bad request (missing fields, validation errors)
- 401: Unauthorized (invalid credentials, expired token)
- 403: Forbidden (insufficient role/permissions)
- 404: Not found (resource doesn't exist)
- 500: Server error (database, service unavailable)

---

## 📱 CLIENT INTERACTION PATTERNS

### Patient Client
```
1. Login (5000) → Get accessToken
2. Browse appointments structure
3. Create/update appointment
4. View medical folder (5002)
5. Check reports (5005)
6. Upload profile image (5004)
```

### Admin Client  
```
1. Login (5011) → Get accessToken
2. Manage: Admins, Doctors, Nurses, Drivers
3. Create/assign appointments
4. Monitor tasks
5. Manage appointment types
```

### Medical Staff Client
```
1. Login (5006) → Get accessToken
2. View assigned tasks (5009)
3. Complete tasks (cascades delete)
4. View patient profiles (5003)
5. Access medical folders (5002)
6. Create reports (5005)
7. Send/receive data (5004)
```

---

## 🎬 SYSTEM STARTUP SEQUENCE

```
1. Start MongoDB (required by all services)

2. Start Backend Services:
   - Port 5010: Admin Service (database: admins)
   - Port 5007: Medical Staff Service (database: medicalStaff|tasks|absences)
   - Port 5003: Patient Service (database: patients|appointments|reports|medicalFolders)
   - Port 5002: Medical Folder Service (linked to 5003)
   - Port 5001: Appointment Service (linked to 5003, 5009)
   - Port 5004: File Service (GridFS enabled)
   - Port 5005: Report Service (linked to 5003)
   - Port 5009: Task Service (linked to 5001, 5007)
   - Port 5008: Absence Service (linked to 5007)

3. Start Gateway Services:
   - Port 5011: Admin Gateway (requires 5010 online)
   - Port 5000: Patient Gateway (requires 5001-5005 online)
   - Port 5006: Medical Staff Gateway (requires 5007-5009 online)

4. System Ready (all ports responsive)
```

---

## 📊 Key Statistics

- **Total Services:** 12 (3 gateways + 9 microservices)
- **Port Range:** 5000-5011
- **MongoDB Collections:** 15+
- **API Endpoints:** 50+
- **Auth Type:** JWT (access + refresh token)
- **File Storage:** GridFS (3 buckets)
- **Primary Pattern:** Service-to-Service via HTTP/Axios

---

**Document Version:** 1.0  
**Last Updated:** April 2026  
**System Status:** Fully integrated microservices architecture
