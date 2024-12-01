# Multilingual File Manager API

The Multilingual File Manager API is a robust solution for managing files with multilingual support. It offers secure user authentication, file uploading, retrieval, and deletion. Built with flexibility in mind, this API supports multiple languages and provides CRUD operations for file management.

## Features

- **User Authentication**: Securely register and log in users with hashed passwords.
- **File Management**:
  - Upload, retrieve, and delete files.
  - Validate file types and handle metadata.
- **Multilingual Support**: Manage file operations and metadata in multiple languages.
- **Queuing System**: Asynchronous file processing with status tracking.
- **CRUD Operations**: Full support for creating, reading, updating, and deleting files.
- **Interactive API Documentation**: Powered by Swagger for easy exploration of API endpoints.

## API Endpoints

### Authentication

#### Register a User
- **POST** `/api/auth/register`
- **Request Body** (JSON):
  ```json
  {
    "username": "john_doe",
    "password": "securepassword123",
    "email": "john@example.com"
  }
