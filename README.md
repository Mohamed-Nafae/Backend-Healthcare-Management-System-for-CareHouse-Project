# CareHouse Backend - Healthcare Management System

![Version](https://img.shields.io/badge/version-1.0-blue)
![Status](https://img.shields.io/badge/status-Active-brightgreen)
![License](https://img.shields.io/badge/license-Academic-green)
![Type](https://img.shields.io/badge/type-Backend%20Services-orange)

> **Bachelor Final Project (2023) - Backend Services Only**
> 
> A comprehensive, scalable backend architecture for a healthcare management system designed with microservices pattern. CareHouse Backend provides RESTful APIs for patient management, medical staff coordination, and administrative oversight through 12 microservices and 3 API gateways.


## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the System](#-running-the-system)
- [API Documentation](#-api-documentation)
- [Services Guide](#-services-guide)
- [Database Models](#-database-models)
- [Security Features](#-security-features)
- [Development](#-development)
- [Project Team](#-project-team)


## 🎯 Project Overview

**CareHouse Backend** is the microservices backend architecture for a healthcare management system built as a bachelor final project in 2023. It provides RESTful APIs and services for managing:

- 👥 **Patient Management** - Registration, profiles, appointments, medical records
- 👨‍⚕️ **Medical Staff Management** - Doctors, nurses, drivers with task assignments
- 🛠️ **Admin Services** - Appointment management, staff supervision, system administration
- 📋 **Medical Records** - Electronic health records (EHR), medical reports, document storage
- 📅 **Appointment System** - Scheduling, status tracking, QR code verification

The backend is built using **microservices architecture** with 12 independent services organized into three subsystems, connected through 3 API gateways, ensuring scalability, maintainability, and security. This backend exposes RESTful APIs consumed by frontend applications (web and mobile clients).

---

## ✨ Key Features

### 🔐 Authentication & Security
- ✅ JWT-based authentication with access/refresh tokens
- ✅ bcrypt password hashing (10 rounds)
- ✅ Role-based access control (Patient, Admin, Doctor, Nurse, Driver)
- ✅ Secure session management with cookies
- ✅ Request validation middleware
- ✅ CORS configuration for frontend security

### 👥 Patient Features
- ✅ User registration with email/phone validation
- ✅ Personal profile management
- ✅ Appointment booking and tracking
- ✅ Medical records access
- ✅ Document upload (images, PDFs, reports)
- ✅ Report viewing and receipt

### 👨‍⚕️ Medical Staff Features
- ✅ Staff profiles (Doctors, Nurses, Drivers)
- ✅ Task assignment and tracking
- ✅ Appointment management
- ✅ QR code-based task verification
- ✅ Absence/leave management
- ✅ Report creation and documentation
- ✅ Patient information access

### 🛠️ Admin Features
- ✅ Admin dashboard and user management
- ✅ Appointment creation and supervision
- ✅ Staff management (doctors, nurses, drivers)
- ✅ Task allocation and monitoring
- ✅ System-wide reporting
- ✅ Staff absence tracking

### 📁 Data Management
- ✅ MongoDB GridFS for file storage (documents, images)
- ✅ Automatic metadata tracking
- ✅ Comprehensive medical records system
- ✅ Report generation and archiving
- ✅ Geographic location tracking (GPS coordinates)

---

## 🏗️ System Architecture

### Network Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    🌐 EXTERNAL NETWORK                          │
│              (Internet Users - Patients, Staff, Admin)           │
└──────────────────┬──────────────────────────────────────────────┘
                   │
┌──────────────────┼──────────────────────────────────────────────┐
│                  │           🔐 DMZ - FIREWALLS                 │
│   ┌──────────────┴──────────┐                                   │
│   │  🚪 GATEWAYS (Auth)     │                                   │
│   ├──────────────────────────┤                                   │
│   │ 5000: Patient Gateway   │                                   │
│   │ 5006: Medical Gateway   │                                   │
│   │ 5011: Admin Gateway     │                                   │
│   └──────────────────────────┘                                   │
└────────────────────┬─────────────────────────────────────────────┘
                     │
┌────────────────────┼─────────────────────────────────────────────┐
│                    │     🖥️ INTERNAL NETWORK (Private)           │
│                    │                                              │
│  ┌─────────────────┴──────────────┐                              │
│  │   🖥️ SERVER INSTANCES         │                              │
│  │                                │                              │
│  │  ┌──────────────────────────┐  │                              │
│  │  │ PATIENT SERVER           │  │                              │
│  │  │ ├─ 5001: Appointments ✓  │  │                              │
│  │  │ ├─ 5002: Med Folders ✓   │  │                              │
│  │  │ ├─ 5003: Patient Svc ✓   │  │                              │
│  │  │ ├─ 5004: File Service ✓  │  │                              │
│  │  │ └─ 5005: Reports ✓       │  │                              │
│  │  └──────────────────────────┘  │                              │
│  │                                │                              │
│  │  ┌──────────────────────────┐  │                              │
│  │  │ ADMIN SERVER             │  │                              │
│  │  │ └─ 5010: Admin Service ✓ │  │                              │
│  │  └──────────────────────────┘  │                              │
│  │                                │                              │
│  │  ┌──────────────────────────┐  │                              │
│  │  │ MEDICAL SERVER           │  │                              │
│  │  │ ├─ 5007: Staff Profiles ✓│  │                              │
│  │  │ ├─ 5008: Absences ✓      │  │                              │
│  │  │ └─ 5009: Tasks ✓         │  │                              │
│  │  └──────────────────────────┘  │                              │
│  │                                │                              │
│  │  ┌──────────────────────────┐  │                              │
│  │  │ DATABASE LAYER           │  │                              │
│  │  │ └─ MongoDB (Shared)      │  │                              │
│  │  └──────────────────────────┘  │                              │
│  └────────────────────────────────┘                              │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Communication Flow

**External Clients → Gateways → Microservices → MongoDB**

- External clients **can only** access through public gateways with JWT authentication
- Internal services communicate within their server or via respective gateways
- Database access is internal only (no external database connections)

---

## 💻 Technology Stack

### Backend Services
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Language**: JavaScript

### Database
- **Database**: MongoDB
- **ODM**: Mongoose
- **File Storage**: MongoDB GridFS

### Authentication & Security
- **Tokens**: JWT (jsonwebtoken)
- **Password**: bcrypt
- **Session**: cookie-parser

### HTTP & Utilities
- **HTTP Client**: Axios
- **File Upload**: express-fileupload, multer, multer-gridfs-storage
- **Date Handling**: date-fns
- **ID Generation**: uuid
- **Environment**: dotenv
- **CORS**: cors package

### Development Tools
- **Package Manager**: npm / yarn
- **Testing**: .rest files (REST client format)
- **Deployment**: Standard Node.js hosting

---

## 📁 Project Structure

```
CareHouse Project/
│
├── README.md                                  # This file
├── CareHouse_Architecture_Mermaid.md         # System architecture diagrams
├── CareHouse_Architecture.drawio             # Draw.io diagram file
├── COMPLETE_SYSTEM_DATA_FLOW.md              # Detailed data flow documentation
│
├── Admin/                                     # Admin Subsystem
│   ├── admin_service/                        # Port 5010: Admin CRUD & Auth
│   │   ├── app.js
│   │   ├── package.json
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   │
│   └── admin_interface_BackEnd/              # Port 5011: Admin Gateway
│       ├── admin_app.js
│       ├── package.json
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── logs/
│
├── Patient/                                   # Patient Subsystem
│   ├── patient_service/                      # Port 5003: Patient CRUD
│   │   └── [standard structure]
│   │
│   ├── patient_interface_BackEnd/            # Port 5000: Patient Gateway
│   │   ├── patient_app.js
│   │   ├── package.json
│   │   └── [standard structure]
│   │
│   ├── make_appoinment_service/              # Port 5001: Appointments
│   │   └── [standard structure]
│   │
│   ├── medical_folder_service/               # Port 5002: Medical Records
│   │   └── [standard structure]
│   │
│   ├── report_service/                       # Port 5005: Reports
│   │   └── [standard structure]
│   │
│   └── uplaod_file_service/                  # Port 5004: File Storage (GridFS)
│       └── [standard structure]
│
├── medicalStaf/                               # Medical Staff Subsystem
│   ├── medical_staff_interface_BackEnd/      # Port 5006: Medical Gateway
│   │   ├── medical_staff_app.js
│   │   ├── package.json
│   │   └── [standard structure]
│   │
│   ├── medical_staf_service/                 # Port 5007: Staff Profiles
│   │   └── [standard structure]
│   │
│   ├── task_service/                         # Port 5009: Task Management
│   │   └── [standard structure]
│   │
│   └── absence_service/                      # Port 5008: Absence Tracking
│       └── [standard structure]
│
└── DocAtHomePatient/                         # Android Mobile App
    └── [Android project structure]
```

---

## 📋 Prerequisites

### System Requirements
- **OS**: Windows, macOS, or Linux
- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **MongoDB**: v4.4 or higher (local or remote instance)
- **Git**: For version control

### Port Requirements
Ensure the following ports are available:
- `5000` - Patient Gateway
- `5001` - Appointment Service
- `5002` - Medical Folder Service
- `5003` - Patient Service
- `5004` - File Service
- `5005` - Report Service
- `5006` - Medical Staff Gateway
- `5007` - Medical Staff Service
- `5008` - Absence Service
- `5009` - Task Service
- `5010` - Admin Service
- `5011` - Admin Gateway
- `27017` - MongoDB (default)

---

## 🚀 Installation & Setup

### Step 1: Clone the Project

```bash
# Clone or download the project
git clone <repository-url>
cd CareHouse-Backend---Healthcare-Management-System
```

### Step 2: MongoDB Setup

**Option A: Local MongoDB**
```bash
# Windows
mongod

# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: Remote MongoDB Atlas**
1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Use the connection string in `.env` files

### Step 3: Install Dependencies

Run this script in the project root (or manually for each service):

```bash
# Navigate to each service and run:
npm install

# Example for all Patient services:
cd Patient/patient_service && npm install
cd ../patient_interface_BackEnd && npm install
cd ../make_appoinment_service && npm install
cd ../medical_folder_service && npm install
cd ../report_service && npm install
cd ../uplaod_file_service && npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in each service root with:

```env
# MongoDB Connection
DATABASE_URI=mongodb://localhost:27017/[service-name]
# OR for MongoDB Atlas:
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/[service-name]

# JWT Secrets (for Gateways only)
ACCESS_TOKEN_SECRET=your_secure_access_token_secret
REFRESH_TOKEN_SECRET=your_secure_refresh_token_secret

# Optional
PORT=5000  # Service-specific port
NODE_ENV=development
```

### Step 5: Verify Installation

```bash
# Start MongoDB first
# Then test a service:
cd Patient/patient_service
npm start

# Should see: 
# MongoDB connected!
# Server listening on port 5003
```

---

## ▶️ Running the System

### Recommended Startup Order

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Microservices (can run in parallel):**
```bash
# Patient Services
cd Patient/patient_service && npm start
cd Patient/make_appoinment_service && npm start
cd Patient/medical_folder_service && npm start
cd Patient/report_service && npm start
cd Patient/uplaod_file_service && npm start

# Admin Services
cd Admin/admin_service && npm start

# Medical Services
cd medicalStaf/medical_staf_service && npm start
cd medicalStaf/absence_service && npm start
cd medicalStaf/task_service && npm start
```

**Terminal 3 - API Gateways (start last):**
```bash
# Patient Gateway
cd Patient/patient_interface_BackEnd && npm start

# Admin Gateway
cd Admin/admin_interface_BackEnd && npm start

# Medical Staff Gateway
cd medicalStaf/medical_staff_interface_BackEnd && npm start
```

### Quick Start with npm run dev

Each service supports development mode with auto-reload:

```bash
npm run dev  # Development mode (auto-restart on changes)
npm start    # Production mode
```

### Health Check

Test the system:

```bash
# Patient Gateway
curl http://localhost:5000/

# Admin Gateway
curl http://localhost:5011/

# Medical Staff Gateway
curl http://localhost:5006/

# Individual Services
curl http://localhost:5003/  # Patient Service
curl http://localhost:5001/  # Appointments
# ... etc
```

---

## 📚 API Documentation

### Base URLs

| Gateway | URL | Purpose |
|---------|-----|---------|
| Patient | `http://localhost:5000` | Patient access |
| Admin | `http://localhost:5011` | Admin access |
| Medical | `http://localhost:5006` | Medical staff access |

### Authentication

All protected endpoints require:

```
Authorization: Bearer <accessToken>
Or
Cookie: jwt=<accessToken>
```

### Common Endpoints

#### Patient Gateway (5000)
```
POST   /auth/register          # Patient registration
POST   /auth/login             # Patient login
POST   /auth/logout            # Patient logout
GET    /auth/refresh           # Refresh access token
GET    /api/appointments       # Get appointments
GET    /api/medical-records    # Get medical records
```

#### Admin Gateway (5011)
```
POST   /auth/login             # Admin login
POST   /auth/logout            # Admin logout
POST   /api/appointments       # Create appointment
GET    /api/staff              # Get staff list
```

#### Medical Staff Gateway (5006)
```
POST   /auth/login             # Staff login
POST   /auth/logout            # Staff logout
GET    /api/my-tasks           # Get assigned tasks
PUT    /api/tasks/:id          # Complete task
GET    /api/patients           # Get patient list
```

📖 **For complete API documentation, see individual service READMEs in each folder.**

---

## 🏥 Services Guide

### Patient Subsystem (Port 5000)

| Port | Service | Purpose |
|------|---------|---------|
| 5000 | Patient Gateway | Entry point, authentication, routing |
| 5001 | Appointments | Schedule, manage, track appointments |
| 5002 | Medical Folder | Electronic health records (EHR) |
| 5003 | Patient Service | Patient profiles and data |
| 5004 | File Service | Document storage via GridFS |
| 5005 | Report Service | Clinical reports and documentation |

**Key Features:**
- Patient registration with unique email/phone
- Appointment booking and status tracking
- Medical records access and management
- Document upload and download
- Report generation and viewing

### Admin Subsystem (Port 5011)

| Port | Service | Purpose |
|------|---------|---------|
| 5011 | Admin Gateway | Entry point, authentication, routing |
| 5010 | Admin Service | Admin profiles and management |

**Key Features:**
- Admin CRUD operations
- Appointment creation and supervision
- Staff management coordination
- System-wide monitoring

### Medical Staff Subsystem (Port 5006)

| Port | Service | Purpose |
|------|---------|---------|
| 5006 | Medical Gateway | Entry point, authentication, routing |
| 5007 | Medical Staff | Doctor, nurse, driver profiles |
| 5008 | Absence Service | Leave and absence tracking |
| 5009 | Task Service | Task assignment and completion |

**Key Features:**
- Staff role management (Doctor, Nurse, Driver)
- Task assignment with QR verification
- Absence/leave tracking
- Appointment and patient access
- Report creation

### Shared Services

| Port | Service | Purpose |
|------|---------|---------|
| 5004 | File Service | GridFS for all file uploads |
| DB | MongoDB | Central data storage |

---

## 🗄️ Database Models

### Patient Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  address: String,
  city: String,
  country: String,
  coordinates: { lat: Number, lng: Number },
  appointments: [ObjectId],
  medical_folders: [ObjectId],
  refreshTokens: [String],
  profile_image: ObjectId,
  role: 2002,
  createdAt: Date
}
```

### Medical Staff Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  type: String (doctor|nurse|driver),
  specialization: String (for doctors),
  tasks: [ObjectId],
  absences: [ObjectId],
  reports: [ObjectId],
  refreshTokens: [String],
  profile_image: ObjectId,
  role: 1954|2021|2022,
  createdAt: Date
}
```

### Appointment Collection
```javascript
{
  _id: ObjectId,
  patient: ObjectId,
  doctor: ObjectId,
  type: String,
  status: String (waiting|inprogress|done),
  appointmentType: ObjectId,
  date: Date,
  address: String,
  city: String,
  country: String,
  coordinates: { lat: Number, lng: Number },
  notes: String,
  qrCode: String,
  createdAt: Date
}
```

### Task Collection
```javascript
{
  _id: ObjectId,
  medical_staff: ObjectId,
  appointment: ObjectId,
  status: Boolean (finished),
  team: [ObjectId],
  order: Number,
  qr_code: String,
  address: String,
  city: String,
  country: String,
  coordinates: { lat: Number, lng: Number },
  createdAt: Date
}
```

---

## 🔒 Security Features

### Authentication
- ✅ **JWT-based**: Access tokens (10 min) + Refresh tokens (24 hrs)
- ✅ **bcrypt**: Password hashing with 10 salt rounds
- ✅ **Cookie Storage**: Secure token persistence

### Authorization
- ✅ **Role-Based Access Control (RBAC)**: Patient (2002), Admin (5168), Doctor (1954), Nurse (2021), Driver (2022)
- ✅ **Middleware Enforcement**: Token verification on all protected routes
- ✅ **Gateway Protection**: Only gateways exposed to external clients

### Network Security
- ✅ **Firewall Architecture**: DMZ for gateways, private network for services
- ✅ **CORS Configuration**: Restricted cross-origin requests
- ✅ **Input Validation**: Middleware for all endpoints
- ✅ **Environment Variables**: Secrets stored in `.env` (not in code)

### Data Protection
- ✅ **Encrypted Passwords**: bcrypt hashing
- ✅ **Token Expiration**: Regular token refresh required
- ✅ **Unique Constraints**: Email/phone duplication prevention
- ✅ **GridFS for Files**: Secure file storage in MongoDB

---

## 🔧 Development

### Testing Services

Each service includes `.rest` files for testing with REST Client extensions:

```
VS Code Extensions:
- REST Client (by Huachao Mao)
- Thunder Client (or similar)
```

**Example test files:**
```
Patient/patient_service/test/request.rest
Patient/make_appoinment_service/test/test.rest
Admin/admin_service/test/request.rest
# ... etc
```

### Code Structure (Standard for All Services)

```
service-folder/
├── app.js                    # Express app entry point
├── package.json              # Dependencies
├── .env                      # Environment variables
├── config/
│   └── connectDB.js         # Database connection
├── middleware/
│   └── *.js                 # Auth, validation middleware
├── controllers/
│   └── *.js                 # Business logic
├── models/
│   └── *.js                 # Mongoose schemas
├── routes/
│   └── *.js                 # API routes
└── test/
    └── request.rest         # API test requests
```

### Adding New Features

1. **Define Model** (in `models/`)
2. **Create Controller** (in `controllers/`)
3. **Add Routes** (in `routes/`)
4. **Update Middleware** (if needed)
5. **Test with .rest file**

### Environment Setup for Development

```bash
# Install nodemon globally (optional, for auto-reload)
npm install -g nodemon

# Or use npm scripts (already configured)
npm run dev
```

---

## 📱 Frontend Applications

### Web Interfaces (Not Included - Backend Only)
- **Patient Web App** - Consumes Patient Gateway APIs (Port 5000)
- **Admin Dashboard** - Consumes Admin Gateway APIs (Port 5011)
- **Medical Staff Interface** - Consumes Medical Gateway APIs (Port 5006)

### Mobile App (Not Included - Backend Only)
- **DocAtHomePatient** - Android application (located separately)
  - Built with Android Studio/Gradle
  - Connects to Patient Gateway (5000)

> **Note**: This repository contains the backend services only. Frontend applications are developed separately and consume these RESTful APIs.

---

## 📊 System Monitoring

### Logs
- Check `logs/` folder in each gateway for request logs
- Logs include: timestamp, endpoint, method, status, user

### Performance Tips
1. Use MongoDB Atlas for better performance
2. Implement caching for frequently accessed data
3. Monitor database query performance
4. Use load balancing for gateways in production

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change PORT in .env or kill process using the port |
| MongoDB connection fails | Check connection string, MongoDB service status |
| CORS errors | Verify CORS config in gateway files |
| JWT errors | Check token expiration, refresh token | 
| File upload issues | Check GridFS bucket configuration, file size limits |

---

## 👥 Project Team

**Bachelor Final Project - 2023**

This project was developed as part of a bachelor's degree program in computer science/information technology.

### Project Details
- **Duration**: 2023 academic year
- **Type**: Bachelor Final Project (Capstone)
- **Architecture**: Microservices with API Gateways
- **Scale**: 12 microservices + 3 gateways + Mobile app
- **Focus**: Healthcare system design, scalability, security

### Contributors
[Add team members and roles here]

---

## 📄 License

This project is an academic work created as part of bachelor studies. Use in accordance with your institution's policies.

---

## 📞 Support & Documentation

### Additional Resources
- 📖 **Architecture Diagram**: `CareHouse_Architecture_Mermaid.md`
- 📊 **Data Flow**: `COMPLETE_SYSTEM_DATA_FLOW.md`
- 📋 **Individual Service READMEs**: See `README.md` in each service folder
- 🎨 **Draw.io Diagram**: `CareHouse_Architecture.drawio`

### Helpful Commands

```bash
# Check MongoDB status
mongosh  # or mongo

# Verify all services running
netstat -an | findstr "5000 5001 5002 5003 5004 5005 5006 5007 5008 5009 5010 5011"

# View service logs
cat logs/reqLog.txt

# Reset MongoDB (warning: deletes data)
db.dropDatabase()
```

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Microservices architecture design
- ✅ RESTful API development
- ✅ Authentication & authorization implementation
- ✅ Database design with MongoDB
- ✅ File management systems (GridFS)
- ✅ Error handling and logging
- ✅ Role-based access control
- ✅ Gateway and routing patterns
- ✅ Security best practices
- ✅ Scalable system design

---

**Last Updated**: April 2026  
**Project Year**: 2023  
**Status**: Active & Maintained  

---

For questions or issues, please refer to individual service documentation or create an issue in the project repository.
