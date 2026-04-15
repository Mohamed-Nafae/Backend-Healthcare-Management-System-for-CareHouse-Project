# Medical Folder Service

A microservice for managing patient medical records and health documentation in the CareHouse patient management system. This service handles creation, retrieval, updating, and deletion of patient medical folders, allowing healthcare providers to maintain comprehensive electronic health records (EHR).

## Overview

The Medical Folder Service is a RESTful Node.js/Express microservice that provides APIs for:
- **Medical Folder Management**: Create, read, update, and delete patient medical folders
- **Medical Records Organization**: Store and retrieve comprehensive medical documentation per patient
- **Report Management**: Attach and manage medical reports within patient folders
- **Patient History Tracking**: Maintain complete patient medical history with timestamps

## Features

✅ Full CRUD operations for medical folders  
✅ Patient-specific medical records  
✅ Report attachment and management  
✅ Duplicate prevention (one folder per patient)  
✅ Automatic timestamp tracking  
✅ MongoDB persistence with Mongoose ODM  
✅ Environment-based configuration  
✅ RESTful API design  

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
cd medical_folder_service
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
# MongoDB Connection
DATABASE_URI=mongodb://localhost:27017/medical_folders
# or for remote MongoDB
DATABASE_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/medical_folders

```

4. Start the service
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The service will listen on `http://localhost:5002`

## Project Structure

```
medical_folder_service/
├── app.js                           # Express app entry point
├── package.json                     # Dependencies and scripts
├── config/
│   └── connectDB.js                # MongoDB connection configuration
├── controller/
│   └── medicalFolderController.js  # Medical folder CRUD handlers
├── model/
│   └── MedicalFolder.js            # MedicalFolder schema
├── route/
│   └── medicalFolders.js           # Medical folder routes
└── test/
    └── request.rest                # API test requests
```

## Database Model

### MedicalFolder

```javascript
{
  createdAt: Date,                   // Creation timestamp (auto-generated)
  patient: ObjectId,                 // Reference to patient (required)
  medicalFolder_content: ObjectId,   // Reference to medical content (required)
  reports: [ObjectId]                // Array of report references
}
```

**Constraints:**
- Each patient can have only one medical folder
- Medical folder content must be unique per patient

## API Endpoints

### Base URL
```
http://localhost:5002/api/medicalFolders
```

### Medical Folders

#### Get all medical folders
```
GET /medicalFolders
```
**Response**: 200 OK - Array of all medical folders
**Error**: 404 Not Found - If no folders exist

#### Get specific medical folder
```
GET /medicalFolders/:folderId
```
**Response**: 200 OK - Medical folder object
**Error**: 404 Not Found - If folder doesn't exist

#### Create new medical folder
```
POST /medicalFolders
Content-Type: application/json

{
  "patient": "patient_id",
  "medicalFolder_content": "content_id"
}
```
**Response**: 201 Created - Medical folder object
**Error**: 
- 400 Bad Request - Missing required fields
- 409 Conflict - Folder already exists for patient

**Required Fields:**
- `patient` (ObjectId) - Patient reference
- `medicalFolder_content` (ObjectId) - Medical content reference

#### Update medical folder
```
PUT /medicalFolders/:folderId
Content-Type: application/json

{
  "medicalFolder_content": "new_content_id",
  ...other fields to update
}
```
**Response**: 200 OK - Updated medical folder object
**Error**: 404 Not Found - If folder doesn't exist

#### Delete medical folder
```
DELETE /medicalFolders/:folderId
```
**Response**: 200 OK - Deletion confirmation
**Error**: 404 Not Found - If folder doesn't exist

#### Delete specific report from medical folder
```
DELETE /medicalFolders/:folderId/reports/:reportId
```
**Response**: 200 OK - Report removed from folder
**Error**: 404 Not Found - If folder or report doesn't exist

**Use Case**: Remove a specific report from a patient's medical folder without deleting the entire folder

## Key Business Logic

### Medical Folder Creation Validation

1. **Required Fields Check**: Validates that both `patient` and `medicalFolder_content` are provided
2. **Duplicate Prevention**: 
   - Prevents duplicate content within the system
   - Ensures one medical folder per patient
3. **Error Handling**: Returns appropriate HTTP status codes and error messages

### Response Codes

- `200 OK`: Successful GET, PUT, or DELETE request
- `201 Created`: Medical folder successfully created
- `400 Bad Request`: Missing required fields (patient, medicalFolder_content)
- `404 Not Found`: Resource doesn't exist or no results found
- `409 Conflict`: Medical folder already exists for that patient/content
- `500 Internal Server Error`: Database or server error

## Running Tests

Test files are included in the `test/` directory in REST client format:

- `request.rest`: Medical folder endpoint tests

These can be run using VS Code REST Client extension or similar tools.

## Environment Configuration

The service requires the following environment variables:

```env
DATABASE_URI    # MongoDB connection string
```

For development, create a `.env` file with these variables.

## Performance Considerations

- **Indexes**: Ensure MongoDB has indexes on:
  - `MedicalFolder.patient` (for fast patient lookups)
  - `MedicalFolder.medicalFolder_content` (for unique constraint checks)
  - `MedicalFolder.reports` (for report queries)

- **Scaling**: This service is stateless and can be horizontally scaled behind a load balancer

- **Data Strategy**: 
  - Consider archiving old medical folders periodically
  - Implement data retention policies for compliance (HIPAA, GDPR)

## Error Handling

The service provides descriptive JSON error responses:

```json
{
  "message": "Error description"
}
```

Common scenarios:
- Missing required fields returns 400
- Medical folder already exists for patient returns 409
- Patient/content not found returns 404
- Database errors return 500

## Integration with Other Services

This service integrates with:

- **Patient Service** (Port 5003): Validates patient references
- **Report Service** (Port 5002): Manages report documents linked to medical folders
- **Upload File Service**: Stores medical documents and files

## Use Cases

### 1. Create Electronic Health Record (EHR)
When a new patient registers, create an initial medical folder to store their health records.

### 2. Update Medical History
As appointments occur and treatments are provided, update the medical folder with new information.

### 3. Attach Medical Reports
Link lab results, imaging reports, and clinical notes to a patient's medical folder.

### 4. Remove Outdated Reports
Delete specific reports from a medical folder when they're no longer relevant.

### 5. Retrieve Patient History
Fetch a patient's complete medical folder to review their healthcare history.

## Future Enhancements

- [ ] Advanced filtering and searching capabilities
- [ ] Medical folder versioning and audit trails
- [ ] Bulk import/export functionality
- [ ] Report generation and formatting
- [ ] Data validation against medical standards
- [ ] Compliance reporting (HIPAA, GDPR)
- [ ] Permission-based folder access
- [ ] Folder sharing and collaboration features
- [ ] Integration with external EHR systems

## License

apache-2.0 License
