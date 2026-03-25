# 🛒 ShopApp — Full Stack Spring Boot + React Application

A production-ready full-stack web application with JWT authentication, Google OAuth2 SSO, Role-Based Access Control (RBAC), and a product management system.

---

## 🏗️ Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, React Router 6, Axios, Tailwind CSS   |
| Backend    | Spring Boot 3.2, Spring Security, JWT, OAuth2   |
| Database   | H2 (dev) / MySQL (prod)                         |
| Auth       | BCrypt passwords, JWT tokens, Google OAuth2 SSO |

---

## 📁 Project Structure

```
project/
├── backend/                        # Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/app/
│       ├── controller/             # REST controllers
│       │   ├── AuthController.java
│       │   ├── ProductController.java
│       │   └── UserController.java
│       ├── service/                # Business logic
│       │   ├── AuthService.java
│       │   ├── ProductService.java
│       │   └── UserService.java
│       ├── repository/             # Spring Data JPA
│       │   ├── UserRepository.java
│       │   └── ProductRepository.java
│       ├── entity/                 # JPA entities
│       │   ├── User.java
│       │   ├── Product.java
│       │   └── Role.java
│       ├── dto/                    # Data Transfer Objects
│       │   ├── AuthResponse.java
│       │   ├── LoginRequest.java
│       │   ├── RegisterRequest.java
│       │   ├── UserResponse.java
│       │   ├── ProductRequest.java
│       │   ├── ProductResponse.java
│       │   ├── UpdateProfileRequest.java
│       │   ├── ChangePasswordRequest.java
│       │   └── ApiResponse.java
│       ├── security/               # JWT + OAuth2 security
│       │   ├── JwtTokenProvider.java
│       │   ├── JwtAuthEntryPoint.java
│       │   ├── CustomUserDetailsService.java
│       │   ├── filter/
│       │   │   └── JwtAuthenticationFilter.java
│       │   ├── oauth2/
│       │   │   ├── OAuth2UserInfo.java
│       │   │   ├── GoogleOAuth2UserInfo.java
│       │   │   ├── OAuth2UserInfoFactory.java
│       │   │   └── CustomOAuth2UserService.java
│       │   └── handler/
│       │       ├── OAuth2AuthenticationSuccessHandler.java
│       │       └── OAuth2AuthenticationFailureHandler.java
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   └── DataSeeder.java
│       └── exception/
│           ├── GlobalExceptionHandler.java
│           ├── ResourceNotFoundException.java
│           ├── DuplicateResourceException.java
│           └── BadRequestException.java
│
└── frontend/                       # React application
    ├── package.json
    ├── tailwind.config.js
    ├── .env
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css
        ├── context/
        │   └── AuthContext.js
        ├── services/
        │   ├── api.js              # Axios instance + interceptors
        │   ├── authService.js
        │   └── productService.js
        ├── components/
        │   ├── common/
        │   │   ├── ProtectedRoute.js
        │   │   ├── Spinner.js
        │   │   ├── ProductCard.js
        │   │   └── ProductModal.js
        │   └── layout/
        │       ├── Navbar.js
        │       └── MainLayout.js
        └── pages/
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── DashboardPage.js
            ├── ProfilePage.js
            ├── OAuth2RedirectPage.js
            └── NotFoundPage.js
```

---

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+ and npm

---

### 1. Backend Setup

```bash
cd backend

# Run with H2 in-memory database (zero configuration)
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**  
H2 Console: **http://localhost:8080/h2-console** (JDBC URL: `jdbc:h2:mem:appdb`)

#### Seeded Accounts

| Role  | Email                 | Password   |
|-------|-----------------------|------------|
| ADMIN | admin@example.com     | admin123   |
| USER  | user@example.com      | user123    |

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend starts at: **http://localhost:3000**

---

## 🔐 Google OAuth2 Configuration

### Step 1 — Create Google OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Select **Web application**
6. Add Authorized Redirect URIs:
   ```
   http://localhost:8080/oauth2/callback/google
   ```
7. Copy the **Client ID** and **Client Secret**

### Step 2 — Configure the Backend

Set environment variables before running the backend:

```bash
# Linux / macOS
export GOOGLE_CLIENT_ID=your-client-id-here
export GOOGLE_CLIENT_SECRET=your-client-secret-here
export JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars

# Windows (PowerShell)
$env:GOOGLE_CLIENT_ID="your-client-id-here"
$env:GOOGLE_CLIENT_SECRET="your-client-secret-here"
$env:JWT_SECRET="your-super-secret-jwt-key-at-least-32-chars"
```

Or update `application.yml` directly (not recommended for production):

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: YOUR_GOOGLE_CLIENT_ID
            client-secret: YOUR_GOOGLE_CLIENT_SECRET
```

### Step 3 — Configure Frontend

Update `frontend/.env`:

```env
REACT_APP_GOOGLE_AUTH_URL=http://localhost:8080/oauth2/authorize/google
```

---

## 🗄️ MySQL (Production) Setup

1. Create the database:
   ```sql
   CREATE DATABASE appdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'yourpassword';
   GRANT ALL PRIVILEGES ON appdb.* TO 'appuser'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. Uncomment the MySQL dependency in `pom.xml` and comment out H2.

3. Update `application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/appdb?useSSL=false&serverTimezone=UTC
       driver-class-name: com.mysql.cj.jdbc.Driver
       username: ${DB_USERNAME:appuser}
       password: ${DB_PASSWORD:yourpassword}
     jpa:
       hibernate:
         ddl-auto: update
       properties:
         hibernate:
           dialect: org.hibernate.dialect.MySQL8Dialect
   ```

---

## 📡 API Documentation

### Authentication

| Method | Endpoint               | Auth     | Description           |
|--------|------------------------|----------|-----------------------|
| POST   | `/api/auth/register`   | Public   | Register new user     |
| POST   | `/api/auth/login`      | Public   | Login, get JWT token  |
| GET    | `/oauth2/authorize/google` | Public | Initiate Google SSO  |

### Products

| Method | Endpoint              | Auth          | Description            |
|--------|-----------------------|---------------|------------------------|
| GET    | `/api/products`       | Any user      | List all products      |
| GET    | `/api/products?search=x` | Any user   | Search products        |
| GET    | `/api/products/{id}`  | Any user      | Get product by ID      |
| POST   | `/api/products`       | ADMIN only    | Create product         |
| PUT    | `/api/products/{id}`  | ADMIN only    | Update product         |
| DELETE | `/api/products/{id}`  | ADMIN only    | Delete product         |

### User Profile

| Method | Endpoint                 | Auth       | Description          |
|--------|--------------------------|------------|----------------------|
| GET    | `/api/users/me`          | Logged in  | Get my profile       |
| PUT    | `/api/users/me`          | Logged in  | Update profile       |
| PUT    | `/api/users/me/password` | Logged in  | Change password      |

### Request / Response Examples

**Login**
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN",
      "provider": "LOCAL"
    }
  }
}
```

**Create Product (ADMIN)**
```json
POST /api/products
Authorization: Bearer <token>
{
  "name": "Gaming Mouse",
  "description": "Ergonomic gaming mouse with 16000 DPI",
  "price": 59.99,
  "imageUrl": "https://example.com/mouse.jpg"
}
```

---

## 🔒 Security Architecture

```
Request → JwtAuthenticationFilter
              ↓ (extracts + validates JWT)
         SecurityContextHolder
              ↓ (injects Authentication)
         Spring Security Method Security (@PreAuthorize)
              ↓ (role check)
         Controller
```

- Passwords are hashed with **BCrypt** (strength 10)
- JWT signed with **HS256** (configurable secret)
- JWT expiry: **24 hours** (configurable)
- CORS restricted to the frontend origin
- H2 console disabled in production

---

## 🌐 Frontend Routes

| Route               | Access         | Description                  |
|---------------------|----------------|------------------------------|
| `/login`            | Public         | Login page                   |
| `/register`         | Public         | Register page                |
| `/oauth2/redirect`  | Public         | OAuth2 token landing page    |
| `/dashboard`        | Protected      | Product grid                 |
| `/profile`          | Protected      | User profile management      |

---

## 🛠️ Environment Variables Reference

### Backend

| Variable             | Default            | Description                    |
|----------------------|--------------------|--------------------------------|
| `JWT_SECRET`         | (hardcoded dev key)| JWT signing secret (min 32 chars) |
| `GOOGLE_CLIENT_ID`   | `YOUR_GOOGLE_CLIENT_ID` | Google OAuth2 client ID   |
| `GOOGLE_CLIENT_SECRET` | `YOUR_GOOGLE_CLIENT_SECRET` | Google OAuth2 secret  |
| `DB_USERNAME`        | `sa`               | Database username              |
| `DB_PASSWORD`        | (empty)            | Database password              |
| `FRONTEND_URL`       | `http://localhost:3000` | Allowed CORS origin       |

### Frontend

| Variable                    | Default                                      | Description          |
|-----------------------------|----------------------------------------------|----------------------|
| `REACT_APP_API_URL`         | `http://localhost:8080/api`                  | Backend API base URL |
| `REACT_APP_GOOGLE_AUTH_URL` | `http://localhost:8080/oauth2/authorize/google` | Google OAuth2 URL |
