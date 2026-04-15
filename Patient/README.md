# Upload File Service

A microservice for managing file uploads and storage in the CareHouse patient management system. This service uses MongoDB's GridFS to store and retrieve medical documents, images, and other files associated with patients and their medical records.

## Overview

The Upload File Service is a RESTful Node.js/Express microservice that provides APIs for:
- **File Upload**: Upload medical documents, images, and files to MongoDB GridFS
- **File Retrieval**: Download and retrieve stored files by ID
- **File Listing**: View all files in a collection
- **File Deletion**: Remove files from the storage system
- **Dynamic Collections**: Support for multiple document collections (buckets) within GridFS
- **Content-Type Handling**: Support for various file types (images, PDFs, documents)

## Features

✅ File upload with GridFS storage  
✅ File download and retrieval  
✅ File listing and metadata retrieval  
✅ File deletion  
✅ Dynamic bucket/collection support  
✅ Multipart form-data handling  
✅ Automatic filename preservation  
✅ Content-disposition headers for downloads  
✅ MongoDB GridFS integration  
✅ Environment-based configuration  

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Storage**: MongoDB GridFS
- **File Upload Middleware**: Multer + Multer-GridFS-Storage
- **Database**: MongoDB
- **Environment**: dotenv

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB running locally or remote connection
- npm or yarn

### Setup

1. Clone or navigate to the service directory
```bash
cd uplaod_file_service
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory (optional, currently hardcoded)
```env
# MongoDB Connection
DATABASE_URI=mongodb://127.0.0.1:27017/DocAtHome
```

4. Start the service
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The service will listen on `http://localhost:5004`

## Project Structure

```
uplaod_file_service/
├── app.js                           # Express app entry point
├── package.json                     # Dependencies and scripts
├── config/
│   └── engineStorageGridfs.js      # GridFS storage configuration
├── middleware/
│   └── dbConnection.js             # MongoDB connection and GridFS bucket setup
└── test/
    └── request.rest                # API test requests
```

## GridFS Overview

GridFS is a MongoDB specification for storing and retrieving large files that exceed the BSON document size limit (16 MB). This service uses GridFS to:
- Store medical documents and images
- Organize files into logical collections (buckets)
- Provide streaming upload/download capabilities
- Maintain file metadata

## API Endpoints

### Base URL
```
http://localhost:5004
```

### File Operations

#### Upload a file
```
POST /upload/:collectionName
Content-Type: multipart/form-data

Request Body:
- file: [binary file data]

Parameters:
- collectionName: The GridFS bucket name (e.g., "medical_documents", "patient_photos")
```

**Response**: 201 Created
```json
{
  "file": {
    "_id": "507f191e810c19729de860ea",
    "filename": "document.pdf",
    "metadata": {
      "bucketName": "medical_documents",
      "date": 1712000000000
    }
  }
}
```

**Error**: 400 Bad Request - Upload failed

**Use Case:** Upload patient medical documents, lab reports, X-rays, or profile photos

#### List all files in a collection
```
GET /files/:collectionName
```

**Response**: 200 OK - Array of file metadata objects
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "filename": "document.pdf",
    "length": 5242880,
    "chunkSize": 261120,
    "uploadDate": "2026-04-14T10:30:00.000Z"
  },
  {
    "_id": "507f191e810c19729de860eb",
    "filename": "image.png",
    "length": 1048576,
    "chunkSize": 261120,
    "uploadDate": "2026-04-14T10:31:00.000Z"
  }
]
```

**Error**: 404 Not Found - No files exist in collection

**Parameters:**
- `collectionName` (path parameter) - GridFS bucket name

#### Get specific file
```
GET /files/:collectionName/:fileId
```

**Response**: 
- 200 OK - File binary data with attachment header
- Sets `Content-Disposition: attachment; filename="..."`

**Error**: 
- 404 Not Found - File doesn't exist
- 400 Bad Request - Invalid file ID

**Parameters:**
- `collectionName` (path parameter) - GridFS bucket name
- `fileId` (path parameter) - MongoDB ObjectId of the file

**Use Case:** Download a medical document or retrieve file for viewing

#### Delete file
```
DELETE /files/:collectionName/:fileId
```

**Response**: 200 OK
```json
{
  "message": "deleting success."
}
```

**Error**: 400 Bad Request - Deletion failed

**Parameters:**
- `collectionName` (path parameter) - GridFS bucket name
- `fileId` (path parameter) - MongoDB ObjectId of the file

**Use Case:** Remove outdated or incorrect medical documents

## Collection (Bucket) Examples

Common collection names in the CareHouse system:

```
- medical_documents   : Lab reports, prescriptions, clinical notes
- patient_photos      : Patient profile images
- x_rays              : X-ray and imaging scans
- medical_records     : General medical record documents
- appointment_docs    : Appointment-related documents
- test_results        : Test result documents
- prescriptions       : Prescription PDFs
```

## Configuration

### GridFS Storage (engineStorageGridfs.js)

```javascript
{
  url: "mongodb://127.0.0.1:27017/DocAtHome",
  file: (req, file) => {
    return {
      filename: file.originalname,        // Original filename preserved
      bucketName: req.params.collectionName, // Dynamic bucket name
      date: Date.now                      // Upload timestamp
    };
  }
}
```

### Database Connection (dbConnection.js)

```javascript
mongoose.connect(process.env.DATABASE_URI)
  .then((conn) => {
    let db = conn.connection.db;
    let db_collection = req.params.collectionName;
    gridBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: db_collection
    });
  })
```

## Performance Considerations

- **Chunk Size**: Default 261120 bytes (255 KB) for optimal performance
- **Streaming**: Files are streamed during upload/download to minimize memory usage
- **Indexes**: MongoDB automatically creates indexes on files.files and files.chunks collections
- **Large Files**: GridFS handles files larger than 16 MB BSON document limit
- **Scalability**: Service is stateless and can be horizontally scaled

## Error Handling

The service provides JSON error responses:

```json
{
  "message": "Error description"
}
```

or

```json
{
  "err": "Error description"
}
```

Common scenarios:
- Missing file returns 404
- Upload failure returns 400
- Invalid file ID returns 400
- Deletion failure returns 400

## Running Tests

Test files are included in the `test/` directory in REST client format:

- `request.rest`: File upload and retrieval test requests

These can be run using VS Code REST Client extension or similar tools.

## Integration with Other Services

This service integrates with:

- **Patient Service** (Port 5003): Store patient profile images
- **Medical Folder Service** (Port 5002): Store medical documents linked to folders
- **Report Service** (Port 5005): Store report documents and files
- **Patient Interface Backend** (Port 5000): Exposes file APIs to frontend

## Use Cases

### 1. Upload Patient Photo
Patients upload profile images during registration or profile updates.
```
POST /upload/patient_photos
```

### 2. Store Medical Documents
Doctors upload lab reports, prescriptions, and clinical notes.
```
POST /upload/medical_documents
```

### 3. Archive Imaging Scans
Store X-rays, MRI images, and CT scans.
```
POST /upload/x_rays
```

### 4. Retrieve Medical Document
Patient or doctor downloads a previously stored document.
```
GET /files/medical_documents/507f191e810c19729de860ea
```

### 5. List Patient Documents
View all documents associated with a patient.
```
GET /files/medical_documents
```

### 6. Remove Old Documents
Delete outdated or corrupted files from storage.
```
DELETE /files/medical_documents/507f191e810c19729de860ea
```

## File Size Limits

Current implementation uses default Multer limits:
- Single file: ~50MB (configurable in production)
- Field size: ~1MB (configurable in production)

**Recommended Configuration:**
```javascript
multer({
  storage,
  limits: {
    fileSize: 104857600 // 100 MB
  }
})
```

## Advanced Features

### Dynamic Bucket Management
The service uses URL parameters to dynamically select storage buckets:
```
/upload/bucket_name       // Creates files.bucket_name.files
/files/bucket_name        // Searches in files.bucket_name.files
```

### Metadata Storage
Files are stored with metadata:
- `filename`: Original filename
- `bucketName`: Collection/bucket name
- `date`: Upload timestamp
- `chunkSize`: Size of file chunks (255 KB)
- `uploadDate`: MongoDB timestamp

## Future Enhancements

- [ ] File type validation (whitelist allowed extensions)
- [ ] File size restrictions per collection
- [ ] Virus/malware scanning on upload
- [ ] File compression for storage optimization
- [ ] Automatic file expiration/cleanup
- [ ] Version control and file history
- [ ] File sharing and access permissions
- [ ] Thumbnail generation for images
- [ ] Full-text search for file contents
- [ ] Backup and archival automation
- [ ] File encryption at rest
- [ ] CDN integration for faster downloads
- [ ] Batch upload support
- [ ] Progress tracking for large uploads
- [ ] S3/Cloud Storage integration

## Example Workflow

```
1. Patient uploads profile photo:
   POST /upload/patient_photos
   [binary image data]

2. Server stores in GridFS:
   - Collection: patient_photos
   - Filename: profile.jpg
   - File ID: 507f191e810c19729de860ea

3. Patient views photo:
   GET /files/patient_photos/507f191e810c19729de860ea
   
4. Server streams file from GridFS

5. Patient deletes old photo:
   DELETE /files/patient_photos/507f191e810c19729de860ea
```

## Database Collections

GridFS creates two collections per bucket:

```
files.<bucketName>.files   # Metadata of uploaded files
files.<bucketName>.chunks  # Actual file data chunks
```

Example:
```
files.medical_documents.files   # Stores metadata
files.medical_documents.chunks  # Stores file chunks
```

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running on `localhost:27017`
- Check database name matches (`DocAtHome`)
- Verify network connectivity

### Upload Failures
- Check file size limits
- Verify request has `Content-Type: multipart/form-data`
- Ensure file field name is `file`

### Download Issues
- Verify file exists with correct ID
- Check bucket name spelling
- Ensure user has read permissions

## License

apache-2.0 License
