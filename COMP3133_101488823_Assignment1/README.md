# COMP3133 - Assignment 1
## Employee Management System - GraphQL API

**Student ID:** 101488823
**Course:** COMP 3133 - Full Stack Development II

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **GraphQL:** Apollo Server 4
- **Database:** MongoDB (Mongoose ODM)
- **Image Storage:** Cloudinary
- **Authentication:** JWT (JSON Web Tokens)
- **Password Encryption:** bcryptjs

---

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/vyn175/COMP3133_101488823_Assignment1.git
cd COMP3133_101488823_Assignment1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/comp3133_101488823_Assigment1
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:4000/graphql`

---

## Database Schema

### Users Collection (`comp3133_101488823_Assigment1`)

| Field | Type | Constraints |
|-------|------|-------------|
| _id | ObjectID | Auto-generated |
| username | String | Required, Unique (Primary Key) |
| email | String | Required, Unique |
| password | String | Required, Encrypted (bcrypt) |
| created_at | Date | Auto-generated |
| updated_at | Date | Auto-updated |

### Employees Collection

| Field | Type | Constraints |
|-------|------|-------------|
| _id | ObjectID | Auto-generated |
| first_name | String | Required |
| last_name | String | Required |
| email | String | Required, Unique |
| gender | String | Male / Female / Other |
| designation | String | Required |
| salary | Float | Required, >= 1000 |
| date_of_joining | Date | Required |
| department | String | Required |
| employee_photo | String | Cloudinary URL |
| created_at | Date | Auto-generated |
| updated_at | Date | Auto-updated |

---

## GraphQL API Reference

### Mutations

#### 1. Signup
Create a new user account.

```graphql
mutation {
  signup(
    username: "johndoe"
    email: "john@example.com"
    password: "password123"
  ) {
    _id
    username
    email
    created_at
  }
}
```

#### 4. Add Employee
Create a new employee (employee_photo can be a Cloudinary URL or base64 string).

```graphql
mutation {
  addEmployee(
    first_name: "Jane"
    last_name: "Smith"
    email: "jane.smith@company.com"
    gender: "Female"
    designation: "Software Engineer"
    salary: 75000
    date_of_joining: "2024-01-15"
    department: "Engineering"
    employee_photo: "https://res.cloudinary.com/..."
  ) {
    _id
    first_name
    last_name
    email
    designation
    department
    salary
    employee_photo
  }
}
```

#### 6. Update Employee
Update employee details by employee ID.

```graphql
mutation {
  updateEmployee(
    eid: "60f1b2c3d4e5f6a7b8c9d0e1"
    designation: "Senior Software Engineer"
    salary: 90000
    department: "Engineering"
  ) {
    _id
    first_name
    last_name
    designation
    salary
    updated_at
  }
}
```

#### 7. Delete Employee
Delete an employee by employee ID.

```graphql
mutation {
  deleteEmployee(eid: "60f1b2c3d4e5f6a7b8c9d0e1")
}
```

---

### Queries

#### 2. Login
Authenticate with username or email and password.

```graphql
query {
  login(
    usernameOrEmail: "johndoe"
    password: "password123"
  ) {
    token
    user {
      _id
      username
      email
    }
  }
}
```

#### 3. Get All Employees

```graphql
query {
  getAllEmployees {
    _id
    first_name
    last_name
    email
    designation
    department
    salary
    employee_photo
  }
}
```

#### 5. Search Employee by ID

```graphql
query {
  searchEmployeeById(eid: "60f1b2c3d4e5f6a7b8c9d0e1") {
    _id
    first_name
    last_name
    email
    gender
    designation
    salary
    date_of_joining
    department
    employee_photo
  }
}
```

#### 8. Search Employee by Designation or Department

```graphql
query {
  searchEmployeeByDesignationOrDepartment(
    designation: "Software Engineer"
  ) {
    _id
    first_name
    last_name
    designation
    department
  }
}
```

---

## Sample Test User

```
Username: admin
Email: admin@comp3133.com
Password: Admin@123
```

---

## Postman Collection

Import the Postman collection from the `/postman` folder to test all API endpoints.

---


