Multilingual File Manager API<br>
Description<br>
The Multilingual File Manager API is a robust solution for managing files with multilingual support. It offers secure user authentication, file uploading, retrieval, and deletion. Built with flexibility in mind, this API supports multiple languages and provides CRUD operations for file management.<br>

Features<br>
User Authentication: Securely register and log in users with hashed passwords.<br>
File Management:<br>
Upload, retrieve, and delete files.<br>
Validate file types and handle metadata.<br>
Multilingual Support: Manage file operations and metadata in multiple languages.<br>
Queuing System: Asynchronous file processing with status tracking.<br>
CRUD Operations: Full support for creating, reading, updating, and deleting files.<br>
Interactive API Documentation: Powered by Swagger for easy exploration of API endpoints.<br>
API Endpoints<br>
Authentication<br>
Register a User<br>
POST /api/auth/register<br>
Request Body:<br>
json<br>
Copy code<br>
{<br>
  "username": "john_doe",<br>
  "password": "securepassword123",<br>
  "email": "john@example.com"<br>
}<br>
Log In a User<br>
POST /api/auth/login<br>
Request Body:<br>
json<br>
Copy code<br>
{<br>
  "username": "john_doe",<br>
  "password": "securepassword123"<br>
}<br>
File Management<br>
Get All Files<br>
GET /api/files<br>
Description: Retrieves a list of all files uploaded by users.<br>
Upload a File<br>
POST /api/files/upload<br>
Request Body:<br>
Accepts multipart/form-data format.<br>
Example:<br>
bash<br>
Copy code<br>
curl -X POST http://localhost:5000/api/files/upload \<br>
     -F "file=@path_to_file" \<br>
     -F "description=Sample file upload"<br>
Delete a File<br>
DELETE /api/files/{id}<br>
Path Parameter: id - The unique ID of the file to delete.<br>
Queuing System<br>
Queue a File for Processing<br>
POST /api/files/queue<br>
Request Body:<br>
json<br>
Copy code<br>
{<br>
  "fileId": "file123",<br>
  "filePath": "/path/to/file",<br>
  "description": "Processing this file"<br>
}<br>
Get Queue Status<br>
GET /api/files/queue/status<br>
Description: Retrieves the status of the file processing queue.<br>
Status Options:<br>
waiting: Files waiting to be processed.<br>
active: Files currently being processed.<br>
completed: Files successfully processed.<br>
failed: Files that failed during processing.<br>
Example Usage<br>
Registering a User<br>
bash<br>
Copy code<br>
curl -X POST http://localhost:5000/api/auth/register \<br>
     -H "Content-Type: application/json" \<br>
     -d '{<br>
           "username": "john_doe",<br>
           "password": "securepassword123",<br>
           "email": "john@example.com"<br>
         }'<br>
Logging In<br>
bash<br>
Copy code<br>
curl -X POST http://localhost:5000/api/auth/login \<br>
     -H "Content-Type: application/json" \<br>
     -d '{<br>
           "username": "john_doe",<br>
           "password": "securepassword123"<br>
         }'<br>
Uploading a File<br>
bash<br>
Copy code<br>
curl -X POST http://localhost:5000/api/files/upload \<br>
     -F "file=@path_to_file" \<br>
     -F "description=Sample file upload"<br>
Deleting a File<br>
bash<br>
Copy code<br>
curl -X DELETE http://localhost:5000/api/files/{file_id}<br>
Setup Instructions<br>
Prerequisites<br>
Node.js (v14+ recommended)<br>
MongoDB<br>
Redis<br>
Installation<br>
Clone the repository:<br>

bash<br>
Copy code<br>
git clone https://github.com/Josuejosue1999/Multilingual-File-Manager-Application<br>
cd multilingual-file-manager-api<br>
Install dependencies:<br>

bash<br>
Copy code<br>
npm install<br>
Set up environment variables: Create a .env file in the root directory:<br>

bash<br>
Copy code<br>
PORT=5000<br>
MONGO_URI=mongodb://localhost:27017/multilingual-file-manager<br>
REDIS_HOST=127.0.0.1<br>
REDIS_PORT=6379<br>
JWT_SECRET=your_secret_key<br>
Start the server:<br>

bash<br>
Copy code<br>
npm start<br>
For development mode with live reload:<br>

bash<br>
Copy code<br>
npm run dev<br>
Technologies Used<br>
Backend: Node.js with Express.js<br>
Database: MongoDB<br>
Authentication: bcrypt for secure password hashing<br>
Queue System: Bull and Redis<br>
File Uploading: Multer<br>
Testing: Jest and Supertest<br>
API Documentation: Swagger http://localhost:5000/api-docs/<br>
Testing<br>
Run the test suite<br>
To run the test suite, use the following command:<br>

bash<br>
Copy code<br>
npm test<br>
Tests are located in the tests folder and cover:<br>

User Authentication: Registration, login, and security.<br>
File Management: CRUD operations.<br>
Queuing System: Processing and status tracking.<br>
Project Structure<br>
bash <br>
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
