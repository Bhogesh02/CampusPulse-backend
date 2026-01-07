# 🚀 CampusPulse - Backend (API)

The robust backend engine powering the Hostel Management System, built with Node.js, Express, and MongoDB.

---

## 🛠 Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local or Atlas)
- **NPM**

## ⚙️ Environment Configuration

Create a `.env` file in the `backend/` root directory.

### 🏠 Local Development `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostel_management
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-google-app-password
EMAIL_FROM="CampusPulse Support" <no-reply@campus-pulse.com>
```

### 🌍 Production (MongoDB Atlas)
To use MongoDB Atlas in production, update your `MONGODB_URI` in the `.env` file on your server or deployment platform:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.com/hostel_management?retryWrites=true&w=majority
```

## 🏃‍♂️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development Mode (Nodemon)**:
   ```bash
   npm run dev
   ```

3. **Run in Production Mode**:
   ```bash
   npm start
   ```

## 🏗 Project Architecture (Clean Design)
- **Controllers**: Handle HTTP requests/responses.
- **Services**: Contain all business logic & validation.
- **Repositories**: Direct database interaction (Abstraction Layer).
- **Models**: Mongoose schemas.
- **Utils**: Circular dependency-safe Dependency Injection (DI) container.

## 📡 API Endpoints
- `POST /api/auth/register` - User registration (Roles: student, warden, admin)
- `POST /api/auth/login` - Authenticate and get token
- `POST /api/schedule/upload` - Publish weekly mess menu
- `GET /api/meals/stats/today` - Real-time headcount (Veg/Non-Veg)
- `POST /api/complaints` - Raise maintenance/mess tickets
