# Lab 4 - Users Database

A NodeJS REST API application that manages user data with MongoDB Atlas. This application validates user input according to specific requirements and stores the data in MongoDB.

## Requirements

- Node.js installed
- MongoDB Atlas account (https://account.mongodb.com/account/login)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your MongoDB Atlas connection string:
```
PORT=8081
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/comp3133?retryWrites=true&w=majority
```

3. Start the server:
```bash
npm start
```

The server will run on `http://localhost:8081`

## API Endpoints

### POST /users
Create a new user with validated data.

**Request Body:**
```json
{
  "username": "johnDoe",
  "email": "john@example.com",
  "city": "New York",
  "website": "https://example.com",
  "zipCode": "12345-6789",
  "phone": "1-123-456-7890"
}
```

**Response (Success):**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "...",
    "username": "johnDoe",
    "email": "john@example.com",
    "city": "New York",
    "website": "https://example.com",
    "zipCode": "12345-6789",
    "phone": "1-123-456-7890"
  }
}
```

### GET /users
Retrieve all users from the database.

**Response:**
```json
{
  "message": "Users retrieved successfully",
  "users": [...]
}
```

## Validation Rules

- **Username**: Min length 4, max length 100 characters
- **Email**: Must be unique and valid email format
- **City**: Only alphabets and spaces allowed
- **Website**: Valid HTTP or HTTPS URL
- **Zip Code**: Format DDDDD-DDDD (5 digits, hyphen, 4 digits)
- **Phone**: Format 1-DDD-DDD-DDDD (1-123-456-7890)

All fields are mandatory.

## Project Structure

```
lab4_users_database/
├── models/
│   └── User.js          (Mongoose schema with validations)
├── server.js            (Express server and API routes)
├── .env                 (Environment variables)
├── .gitignore
├── package.json
└── README.md
```
