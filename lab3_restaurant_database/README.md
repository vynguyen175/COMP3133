# Lab 3 - MongoDB & Mongoose Restaurant Database

A NodeJS + Express + MongoDB + Mongoose application for managing restaurant data.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MongoDB Connection
Update the `.env` file with your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant_db
PORT=3000
```

### 3. Import Sample Data
Use the seed data from the Google Drive link to populate the restaurants collection in MongoDB Atlas.

### 4. Start the Server
```bash
npm start
```

The server will run on `http://localhost:3000`

## REST API Endpoints

### 1. Get All Restaurants
```
GET http://localhost:3000/restaurants
```
Returns all restaurant details with all columns.

### 2. Get Restaurants by Cuisine
```
GET http://localhost:3000/restaurants/cuisine/{cuisine}
```
Examples:
- `GET http://localhost:3000/restaurants/cuisine/Japanese`
- `GET http://localhost:3000/restaurants/cuisine/Bakery`
- `GET http://localhost:3000/restaurants/cuisine/Italian`

### 3. Get All Restaurants with Sorting
```
GET http://localhost:3000/restaurants?sortBy=ASC
GET http://localhost:3000/restaurants?sortBy=DESC
```
Returns: id, cuisines, name, city, restaurant_id (sorted by restaurant_id)

### 4. Get Delicatessen Restaurants (Not in Brooklyn)
```
GET http://localhost:3000/restaurants/Delicatessen
```
Returns: cuisines, name, city (excludes _id, sorted by name ascending)

## Project Structure
```
lab3_restaurant_database/
├── server.js           # Main server file
├── models/
│   └── Restaurant.js   # Restaurant Schema
├── routes/
│   └── restaurants.js  # Restaurant API endpoints
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Dependencies
└── README.md          # This file
```
