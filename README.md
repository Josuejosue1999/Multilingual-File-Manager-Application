Multilingual File Manager API
Description
The Multilingual File Manager API is a robust solution for managing files with multilingual support. It offers secure user authentication, file uploading, retrieval, and deletion. Built with flexibility in mind, this API supports multiple languages and provides CRUD operations for file management.

Features
User Authentication: Securely register and log in users with hashed passwords.
File Management:
Upload, retrieve, and delete files.
Validate file types and handle metadata.
Multilingual Support: Manage file operations and metadata in multiple languages.
Queuing System: Asynchronous file processing with status tracking.
CRUD Operations: Full support for creating, reading, updating, and deleting files.
Interactive API Documentation: Powered by Swagger for easy exploration of API endpoints.
API Endpoints
Authentication
Register a User
POST /api/auth/register
Request Body:
json
Copy code
{
  "username": "john_doe",
  "password": "securepassword123",
  "email": "john@example.com"
}
Log In a User
POST /api/auth/login
Request Body:
json
Copy code
{
  "username": "john_doe",
  "password": "securepassword123"
}
File Management
Get All Files
GET /api/files
Description: Retrieves a list of all files uploaded by users.
Upload a File
POST /api/files/upload
Request Body:
Accepts multipart/form-data format.
Example:
bash
Copy code
curl -X POST http://localhost:5000/api/files/upload \
     -F "file=@path_to_file" \
     -F "description=Sample file upload"
Delete a File
DELETE /api/files/{id}
Path Parameter: id - The unique ID of the file to delete.
Queuing System
Queue a File for Processing
POST /api/files/queue
Request Body:
json
Copy code
{
  "fileId": "file123",
  "filePath": "/path/to/file",
  "description": "Processing this file"
}
Get Queue Status
GET /api/files/queue/status
Description: Retrieves the status of the file processing queue.
Status Options:
waiting: Files waiting to be processed.
active: Files currently being processed.
completed: Files successfully processed.
failed: Files that failed during processing.
Example Usage
Registering a User
bash
Copy code
curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
           "username": "john_doe",
           "password": "securepassword123",
           "email": "john@example.com"
         }'
Logging In
bash
Copy code
curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
           "username": "john_doe",
           "password": "securepassword123"
         }'
Uploading a File
bash
Copy code
curl -X POST http://localhost:5000/api/files/upload \
     -F "file=@path_to_file" \
     -F "description=Sample file upload"
Deleting a File
bash
Copy code
curl -X DELETE http://localhost:5000/api/files/{file_id}
Setup Instructions
Prerequisites
Node.js (v14+ recommended)
MongoDB
Redis
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/Josuejosue1999/Multilingual-File-Manager-Application
cd multilingual-file-manager-api
Install dependencies:

bash
Copy code
npm install
Set up environment variables: Create a .env file in the root directory:

bash
Copy code
PORT=5000
MONGO_URI=mongodb://localhost:27017/multilingual-file-manager
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=your_secret_key
Start the server:

bash
Copy code
npm start
For development mode with live reload:

bash
Copy code
npm run dev
Technologies Used
Backend: Node.js with Express.js
Database: MongoDB
Authentication: bcrypt for secure password hashing
Queue System: Bull and Redis
File Uploading: Multer
Testing: Jest and Supertest
API Documentation: Swagger http://localhost:5000/api-docs/
Testing
Run the test suite
To run the test suite, use the following command:

bash
Copy code
npm test
Tests are located in the tests folder and cover:

User Authentication: Registration, login, and security.
File Management: CRUD operations.
Queuing System: Processing and status tracking.
Project Structure
bash
Copy code <br>
project/  <br>
├── src/  <br>
│   ├── app.js           # Entry point  <br>
│   ├── controllers/     # Business logic  <br>
│   ├── models/          # MongoDB schemas  <br>
│   ├── routes/          # API endpoints  <br>
│   ├── queues/          # Queue logic  <br>
│   ├── middleware/      # Custom middleware  <br>
├── tests/               # Unit tests  <br>
├── uploads/             # Uploaded files  <br>
├── .env                 # Environment variables  <br>
├── package.json         # Project metadata and dependencies  <br>
├── README.md            # Documentation  <br>
Future Improvements
Two-factor Authentication for enhanced security.
Cloud Storage Integration (e.g., AWS S3, Google Cloud Storage).
Rate Limiting to prevent abuse of API endpoints.
File Preview Support: Enable thumbnail generation for images or PDFs.
