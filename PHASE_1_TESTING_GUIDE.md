# 🧪 Phase 1 Testing Guide (Postman / Thunder Client)
### Testing Error Handling & Input Validation for VitalSync Backend

**Base URL:** `http://localhost:3001/api`  
**Header for POST/PUT requests:** `Content-Type: application/json`

---

## 🎯 What We Are Testing in Phase 1

1. **Global Exception Filter (`AllExceptionsFilter`):** Every error, whether it's a `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, or `409 Conflict`, **must** return this exact JSON shape:
   ```json
   {
     "success": false,
     "statusCode": 400,
     "message": "...",
     "path": "/api/...",
     "timestamp": "2026-08-08T10:00:00.000Z"
   }
   ```
2. **Strict Input Validation (`forbidNonWhitelisted: true`):** Requests sending fields **not defined in the DTO** are rejected with a `400 Bad Request`.

---

## 🧪 Step-by-Step Test Cases

---

### Test Case 1: Reject Extra / Unknown Fields (`forbidNonWhitelisted`)
Tests that sneaky or accidental extra fields (e.g. `isAdmin: true`) are rejected outright instead of being passed through.

- **Method:** `POST`
- **URL:** `http://localhost:3001/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "email": "test1@vitalsync.dev",
    "name": "Test User",
    "password": "Password@123",
    "role": "patient",
    "isAdmin": true
  }
  ```
- **Expected Status Code:** `400 Bad Request`
- **Expected JSON Response:**
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": [
      "property isAdmin should not exist"
    ],
    "path": "/api/auth/register",
    "timestamp": "2026-08-08T..."
  }
  ```

---

### Test Case 2: Invalid Field Format & Enum Validation
Tests that `class-validator` rules catch malformed data (invalid email, invalid role).

- **Method:** `POST`
- **URL:** `http://localhost:3001/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "email": "not-an-email",
    "name": "Alex",
    "role": "superuser"
  }
  ```
- **Expected Status Code:** `400 Bad Request`
- **Expected JSON Response:**
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": [
      "email must be an email",
      "role must be one of the following values: doctor, patient"
    ],
    "path": "/api/auth/register",
    "timestamp": "2026-08-08T..."
  }
  ```

---

### Test Case 3: Missing Required Fields
Tests that missing required DTO properties produce clean validation errors.

- **Method:** `POST`
- **URL:** `http://localhost:3001/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "email": "sarah.miller@vitalsync.dev"
  }
  ```
- **Expected Status Code:** `400 Bad Request`
- **Expected JSON Response:**
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": [
      "password must be longer than or equal to 1 characters",
      "password must be a string"
    ],
    "path": "/api/auth/login",
    "timestamp": "2026-08-08T..."
  }
  ```

---

### Test Case 4: Invalid Credentials (`UnauthorizedException`)
Tests that NestJS built-in exceptions (`UnauthorizedException`) are caught by the filter and formatted correctly.

- **Method:** `POST`
- **URL:** `http://localhost:3001/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "email": "sarah.miller@vitalsync.dev",
    "password": "WrongPassword123"
  }
  ```
- **Expected Status Code:** `401 Unauthorized`
- **Expected JSON Response:**
  ```json
  {
    "success": false,
    "statusCode": 401,
    "message": "Invalid email or password",
    "path": "/api/auth/login",
    "timestamp": "2026-08-08T..."
  }
  ```

---

### Test Case 5: Non-existent Route (404 Error Filter)
Tests that requests to non-existent endpoints are caught by `AllExceptionsFilter` and returned in the unified shape without crashing.

- **Method:** `GET`
- **URL:** `http://localhost:3001/api/non-existent-route`
- **Expected Status Code:** `404 Not Found`
- **Expected JSON Response:**
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "Cannot GET /api/non-existent-route",
    "path": "/api/non-existent-route",
    "timestamp": "2026-08-08T..."
  }
  ```

---

### Test Case 6: Duplicate Email Registration (`ConflictException`)
Tests domain exception handling (`409 Conflict`).

- **Method:** `POST`
- **URL:** `http://localhost:3001/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "email": "sarah.miller@vitalsync.dev",
    "name": "Sarah Miller",
    "role": "doctor"
  }
  ```
- **Expected Status Code:** `409 Conflict`
- **Expected JSON Response:**
  ```json
  {
    "success": false,
    "statusCode": 409,
    "message": "Email already registered",
    "path": "/api/auth/register",
    "timestamp": "2026-08-08T..."
  }
  ```

---

### Test Case 7: Rate Limit Exceeded (`429 Too Many Requests`)
Tests that sending too many rapid requests triggers `@nestjs/throttler` rate limiting, caught by `AllExceptionsFilter` and returned in the unified JSON shape.

- **Method:** `POST`
- **URL:** `http://localhost:3001/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "email": "sarah.miller@vitalsync.dev",
    "password": "WrongPassword123"
  }
  ```
- **How to Trigger:** Click **Send** 6 times within 60 seconds.
- **Requests 1–5:** Returns `401 Unauthorized`.
- **Request 6+:**
  - **Expected Status Code:** `429 Too Many Requests`
  - **Expected JSON Response:**
    ```json
    {
      "success": false,
      "statusCode": 429,
      "message": "ThrottlerException: Too Many Requests",
      "path": "/api/auth/login",
      "timestamp": "2026-08-08T..."
    }
    ```

---

## ⚡ How to Import / Set Up in Postman or Thunder Client

1. Ensure the backend server is running (`npm run dev:backend` or `npm run dev`).
2. Open **Postman** or **Thunder Client** (VS Code Extension).
3. Create a **New Collection** named `VitalSync - Phase 1 Validation Tests`.
4. Set up an environment variable (optional):
   - `BASE_URL`: `http://localhost:3001/api`
5. Create requests corresponding to Test Cases 1 through 7 above.
6. Verify that **every error response** includes:
   - `success`: `false`
   - `statusCode`: matching the HTTP status (400, 401, 404, 409, etc.)
   - `message`: human-readable message or array of validation errors
   - `path`: request URL
   - `timestamp`: ISO date string
