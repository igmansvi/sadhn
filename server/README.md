# Full Stack Job Portal - Backend API

RESTful API backend for the Job Portal application built with Node.js, Express, and MongoDB.

## 🔧 Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Nodemailer** - Email service
- **express-validator** - Request validation
- **Jest** - Testing framework (175 passing tests)

## 📁 Project Structure

```
server/
├── index.js                 # Application entry point
├── package.json            # Dependencies and scripts
├── config/
│   ├── db.js              # MongoDB connection
│   └── env.js             # Environment variables
├── controllers/
│   ├── auth.controller.js        # Authentication logic
│   ├── profile.controller.js     # User profile management
│   ├── job.controller.js         # Job CRUD operations
│   ├── application.controller.js # Application management
│   ├── article.controller.js     # Article management
│   ├── news.controller.js        # News/announcements
│   ├── skillprogram.controller.js # Skill programs
│   └── dashboard.controller.js   # Dashboard statistics
├── models/
│   ├── user.model.js             # User schema
│   ├── profile.model.js          # Profile schema
│   ├── profilesummary.model.js   # Profile summary schema
│   ├── job.model.js              # Job posting schema
│   ├── application.model.js      # Application schema
│   ├── article.model.js          # Article schema
│   ├── news.model.js             # News schema
│   └── skillprogram.model.js     # Skill program schema
├── routes/
│   ├── auth.route.js             # Auth routes
│   ├── profile.route.js          # Profile routes
│   ├── job.route.js              # Job routes
│   ├── application.route.js      # Application routes
│   ├── article.route.js          # Article routes
│   ├── news.route.js             # News routes
│   ├── skillprogram.route.js     # Skill program routes
│   └── dashboard.route.js        # Dashboard routes
├── middlewares/
│   └── auth.middleware.js        # JWT authentication
├── utils/
│   ├── email.js                  # Email utilities
│   └── logger.js                 # Logging utilities
└── tests/                        # Test files (175 tests)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- SMTP credentials for email service

### Installation

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the server directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/job-portal

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@jobportal.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### Development

```bash
# Start development server with nodemon
npm start

# Run tests
npm test
```

The API will run on `http://localhost:5000`

## 🔐 Authentication

### JWT-Based Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

### User Roles

- **learner** - Job seekers
- **employer** - Companies posting jobs
- **admin** - Platform administrators

### Middleware

`auth.middleware.js` provides:

- `protect` - Verify JWT token and attach user to request
- `restrictTo(...roles)` - Role-based access control

## 📡 API Endpoints

### Authentication Routes

**Base URL**: `/api/auth`

| Method | Endpoint                 | Description               | Access |
| ------ | ------------------------ | ------------------------- | ------ |
| POST   | `/register`              | Register new user         | Public |
| POST   | `/login`                 | Login user                | Public |
| POST   | `/forgot-password`       | Request password reset    | Public |
| POST   | `/reset-password/:token` | Reset password            | Public |
| GET    | `/verify-email/:token`   | Verify email              | Public |
| POST   | `/resend-verification`   | Resend verification email | Public |

### Profile Routes

**Base URL**: `/api/profile`

| Method | Endpoint              | Description              | Access              |
| ------ | --------------------- | ------------------------ | ------------------- |
| GET    | `/me`                 | Get current user profile | Protected           |
| GET    | `/:id`                | Get user profile by ID   | Protected           |
| PATCH  | `/`                   | Update profile           | Protected           |
| POST   | `/skills`             | Add skill                | Protected (Learner) |
| PATCH  | `/skills/:id`         | Update skill             | Protected (Learner) |
| DELETE | `/skills/:id`         | Delete skill             | Protected (Learner) |
| POST   | `/experience`         | Add experience           | Protected (Learner) |
| PATCH  | `/experience/:id`     | Update experience        | Protected (Learner) |
| DELETE | `/experience/:id`     | Delete experience        | Protected (Learner) |
| POST   | `/education`          | Add education            | Protected (Learner) |
| PATCH  | `/education/:id`      | Update education         | Protected (Learner) |
| DELETE | `/education/:id`      | Delete education         | Protected (Learner) |
| POST   | `/certifications`     | Add certification        | Protected (Learner) |
| DELETE | `/certifications/:id` | Delete certification     | Protected (Learner) |

### Job Routes

**Base URL**: `/api/jobs`

| Method | Endpoint   | Description                 | Access               |
| ------ | ---------- | --------------------------- | -------------------- |
| GET    | `/`        | Get all jobs (with filters) | Public               |
| GET    | `/:id`     | Get job by ID               | Public               |
| POST   | `/`        | Create new job              | Protected (Employer) |
| PATCH  | `/:id`     | Update job                  | Protected (Employer) |
| DELETE | `/:id`     | Delete job                  | Protected (Employer) |
| GET    | `/my-jobs` | Get employer's jobs         | Protected (Employer) |

**Query Parameters for Filtering**:

- `search` - Search in title/description
- `location` - Filter by location
- `type` - Filter by job type (full-time, part-time, etc.)
- `status` - Filter by status (active, draft, closed)
- `minSalary` / `maxSalary` - Salary range
- `page` / `limit` - Pagination

### Application Routes

**Base URL**: `/api/applications`

| Method | Endpoint           | Description                | Access               |
| ------ | ------------------ | -------------------------- | -------------------- |
| POST   | `/`                | Apply to job               | Protected (Learner)  |
| GET    | `/my-applications` | Get learner's applications | Protected (Learner)  |
| GET    | `/job/:jobId`      | Get applications for job   | Protected (Employer) |
| PATCH  | `/:id/status`      | Update application status  | Protected (Employer) |
| DELETE | `/:id`             | Withdraw application       | Protected (Learner)  |
| GET    | `/:id`             | Get application details    | Protected            |

### Article Routes

**Base URL**: `/api/articles`

| Method | Endpoint       | Description                | Access               |
| ------ | -------------- | -------------------------- | -------------------- |
| GET    | `/`            | Get all published articles | Public               |
| GET    | `/:id`         | Get article by ID          | Public               |
| POST   | `/`            | Create article             | Protected (Employer) |
| PATCH  | `/:id`         | Update article             | Protected (Employer) |
| DELETE | `/:id`         | Delete article             | Protected (Employer) |
| GET    | `/my-articles` | Get employer's articles    | Protected (Employer) |
| PATCH  | `/:id/publish` | Publish/unpublish article  | Protected (Employer) |

### News Routes

**Base URL**: `/api/news`

| Method | Endpoint             | Description              | Access            |
| ------ | -------------------- | ------------------------ | ----------------- |
| GET    | `/`                  | Get all active news      | Public            |
| GET    | `/:id`               | Get news by ID           | Public            |
| POST   | `/`                  | Create news              | Protected (Admin) |
| PATCH  | `/:id`               | Update news              | Protected (Admin) |
| DELETE | `/:id`               | Delete news              | Protected (Admin) |
| PATCH  | `/:id/toggle-status` | Activate/deactivate news | Protected (Admin) |

### Skill Program Routes

**Base URL**: `/api/skill-programs`

| Method | Endpoint             | Description                 | Access            |
| ------ | -------------------- | --------------------------- | ----------------- |
| GET    | `/`                  | Get all active programs     | Public            |
| GET    | `/:id`               | Get program by ID           | Public            |
| POST   | `/`                  | Create skill program        | Protected (Admin) |
| PATCH  | `/:id`               | Update program              | Protected (Admin) |
| DELETE | `/:id`               | Delete program              | Protected (Admin) |
| PATCH  | `/:id/toggle-status` | Activate/deactivate program | Protected (Admin) |

### Dashboard Routes

**Base URL**: `/api/dashboard`

| Method | Endpoint    | Description                 | Access               |
| ------ | ----------- | --------------------------- | -------------------- |
| GET    | `/learner`  | Get learner dashboard data  | Protected (Learner)  |
| GET    | `/employer` | Get employer dashboard data | Protected (Employer) |
| GET    | `/admin`    | Get admin dashboard data    | Protected (Admin)    |

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    ...
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Validation error details"]
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🗃️ Database Models

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (learner/employer/admin),
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Profile Model

```javascript
{
  userId: ObjectId (ref: User),
  phoneNumber: String,
  location: String,
  bio: String,
  linkedIn: String,
  portfolio: String,
  skills: [{ name, level, yearsOfExperience }],
  experience: [{ title, company, location, from, to, current, description }],
  education: [{ degree, institution, from, to, current }],
  certifications: [{ name, issuer, date, url }],
  resume: String (URL),
  profilePicture: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Job Model

```javascript
{
  employerId: ObjectId (ref: User),
  title: String,
  company: String,
  description: String,
  requirements: [String],
  responsibilities: [String],
  location: String,
  type: String (full-time/part-time/contract/internship),
  salaryMin: Number,
  salaryMax: Number,
  status: String (draft/active/closed),
  deadline: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model

```javascript
{
  jobId: ObjectId (ref: Job),
  learnerId: ObjectId (ref: User),
  status: String (pending/reviewed/shortlisted/rejected/accepted),
  coverLetter: String,
  appliedAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 12)
- JWT token-based authentication
- Protected routes with middleware
- Role-based access control
- Email verification for new accounts
- Password reset with secure tokens
- Input validation with express-validator
- MongoDB injection protection with Mongoose

## 📧 Email Service

Nodemailer configured for:

- Email verification on registration
- Password reset emails
- Application status updates (optional)

Email templates are plain text with links to frontend pages.

## 🧪 Testing

Comprehensive test suite with **175 passing tests** covering:

- Authentication flow
- CRUD operations
- Authorization rules
- Input validation
- Error handling
- Edge cases

Run tests:

```bash
npm test
```

## 🐛 Error Handling

Global error handling middleware catches:

- Validation errors
- Database errors
- Authentication errors
- Custom application errors

All errors return consistent JSON format with appropriate status codes.

## 📝 Development Guidelines

### Code Style

- ES6+ syntax with modules
- Async/await for asynchronous operations
- Consistent error handling with try-catch
- Descriptive variable and function names
- Controller-Service-Model architecture

### Controller Pattern

```javascript
export const controllerFunction = async (req, res) => {
  try {
    // Extract data from request
    const { param } = req.body;

    // Business logic
    const result = await Model.find({ param });

    // Send response
    res.status(200).json({
      success: true,
      message: "Success message",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

### Route Pattern

```javascript
import express from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { controller } from "../controllers/example.controller.js";

const router = express.Router();

router.post("/", protect, restrictTo("role"), controller);

export default router;
```

## 📈 Project Status

**Status**: ✅ Complete and Production-Ready

### Features

- ✅ Complete authentication system
- ✅ Role-based access control
- ✅ RESTful API design
- ✅ Comprehensive validation
- ✅ Email functionality
- ✅ Dashboard statistics
- ✅ 175 passing tests
- ✅ Error handling
- ✅ Security best practices

## 🔗 Related

- Frontend Client: `../client/README.md`
- API Base URL: `http://localhost:5000/api`

## 🤝 Contributing

1. Follow the established code style
2. Write tests for new features
3. Validate all inputs
4. Use proper HTTP status codes
5. Document new endpoints
6. Handle errors appropriately

## 📄 License

ISC
