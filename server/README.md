# SADHN Server - Backend API

RESTful API backend for the Skills and Development Hub Network platform. Built with Node.js, Express, and MongoDB. Provides comprehensive endpoints for user authentication, job management, applications, articles, and real-time notifications.

## Technology Stack

**Runtime & Framework**

- Node.js (JavaScript runtime)
- Express 5.1.0 (web framework)
- Nodemon (development auto-reload)

**Database**

- MongoDB (NoSQL database)
- Mongoose 8.19.3 (MongoDB ODM)

**Authentication & Security**

- JWT (JSON Web Tokens)
- bcrypt (password hashing with 12 salt rounds)
- cors (Cross-Origin Resource Sharing)

**Validation & Data**

- express-validator (input validation)
- dotenv (environment variables)

**Communication**

- Nodemailer (email service)
- Socket.IO 4.8.1 (real-time communication)

**Testing**

- Jest (unit and integration tests)
- Supertest (HTTP assertion library)
- MongoDB Memory Server (in-memory testing)

## Project Structure

```
server/
├── index.js                 # Application entry point and server initialization
├── config/
│   ├── db.js              # MongoDB connection with Mongoose
│   └── env.js             # Environment variable validation
├── middlewares/
│   └── auth.middleware.js  # JWT verification and role-based access control
├── controllers/           # Business logic layer
│   ├── auth.controller.js        # Registration, login, password reset
│   ├── profile.controller.js     # User profile and credentials
│   ├── job.controller.js         # Job CRUD and filtering
│   ├── application.controller.js # Job applications management
│   ├── article.controller.js     # Article publication
│   ├── news.controller.js        # News and announcements with search
│   ├── notification.controller.js # User notifications
│   ├── skillprogram.controller.js # Skill programs
│   ├── matching.controller.js    # Job recommendations
│   ├── dashboard.controller.js   # Analytics and statistics
│   └── contact.controller.js     # Contact form and admin replies
├── models/               # Mongoose schemas
│   ├── user.model.js             # User authentication and role
│   ├── profile.model.js          # Extended profile data
│   ├── profilesummary.model.js   # Profile overview cache
│   ├── job.model.js              # Job postings
│   ├── application.model.js      # Job applications
│   ├── article.model.js          # Company articles
│   ├── news.model.js             # Platform news with 30-day expiry
│   ├── notification.model.js     # User notifications with 7-day expiry
│   ├── skillprogram.model.js     # Training programs
│   └── contact.model.js          # Contact form submissions with 90-day expiry
├── routes/              # API endpoint definitions
│   ├── auth.route.js             # /api/auth/*
│   ├── profile.route.js          # /api/profile/*
│   ├── job.route.js              # /api/jobs/*
│   ├── application.route.js      # /api/applications/*
│   ├── article.route.js          # /api/articles/*
│   ├── news.route.js             # /api/news/*
│   ├── notification.route.js     # /api/notifications/*
│   ├── skillprogram.route.js     # /api/skill-programs/*
│   ├── matching.route.js         # /api/matching/*
│   ├── dashboard.route.js        # /api/dashboard/*
│   └── contact.route.js          # /api/contact/*
├── utils/
│   ├── email.js                  # Email template and sending logic
│   ├── logger.js                 # Request and error logging
│   └── cleanup.js                # Automated cleanup scheduler
└── tests/                        # Test suite covering all endpoints
    ├── auth.test.js
    ├── profile.test.js
    ├── job.test.js
    ├── application.test.js
    ├── article.test.js
    ├── news.test.js
    ├── notification.test.js
    ├── skillprogram.test.js
    ├── matching.test.js
    ├── dashboard.test.js
    └── contact.test.js
```

## Database Schema Overview

**User Model** - Authentication and basic profile

```
{
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: String (learner|employer|admin),
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Profile Model** - Extended learner/employer details

```
{
  userId: ObjectId (ref: User),
  phoneNumber: String,
  location: String,
  bio: String,
  linkedIn: String,
  portfolio: String,
  skills: [{ name, level, yearsOfExperience }],
  experience: [{ title, company, location, from, to, current, description }],
  education: [{ degree, institution, from, to }],
  certifications: [{ name, issuer, date, url }],
  resume: String (file URL),
  profilePicture: String (file URL)
}
```

**Job Model** - Job postings

```
{
  employerId: ObjectId (ref: User),
  title: String,
  company: String,
  description: String,
  requirements: [String],
  responsibilities: [String],
  location: String,
  type: String (full-time|part-time|contract|internship),
  salaryMin: Number,
  salaryMax: Number,
  currency: String,
  status: String (draft|active|closed),
  deadline: Date,
  applicantCount: Number
}
```

**Application Model** - Job applications

```
{
  jobId: ObjectId (ref: Job),
  learnerId: ObjectId (ref: User),
  status: String (pending|reviewed|shortlisted|rejected|accepted),
  coverLetter: String,
  appliedAt: Date,
  reviewedAt: Date,
  feedback: String
}
```

## API Endpoints

### Authentication Routes - `/api/auth`

| Method | Endpoint                 | Description                         | Access |
| ------ | ------------------------ | ----------------------------------- | ------ |
| POST   | `/register`              | Register new user with role         | Public |
| POST   | `/login`                 | Authenticate user, return JWT token | Public |
| POST   | `/forgot-password`       | Request password reset token        | Public |
| POST   | `/reset-password/:token` | Set new password with reset token   | Public |
| GET    | `/verify-email/:token`   | Verify email address                | Public |
| POST   | `/resend-verification`   | Resend email verification           | Public |

### Profile Routes - `/api/profile`

| Method | Endpoint              | Description                      | Access              |
| ------ | --------------------- | -------------------------------- | ------------------- |
| GET    | `/me`                 | Get authenticated user's profile | Protected           |
| GET    | `/:id`                | Get user profile by ID           | Protected           |
| PATCH  | `/`                   | Update user profile              | Protected           |
| POST   | `/skills`             | Add skill to profile             | Protected (Learner) |
| PATCH  | `/skills/:id`         | Update skill                     | Protected (Learner) |
| DELETE | `/skills/:id`         | Remove skill                     | Protected (Learner) |
| POST   | `/experience`         | Add work experience              | Protected (Learner) |
| PATCH  | `/experience/:id`     | Update experience                | Protected (Learner) |
| DELETE | `/experience/:id`     | Remove experience                | Protected (Learner) |
| POST   | `/education`          | Add education                    | Protected (Learner) |
| PATCH  | `/education/:id`      | Update education                 | Protected (Learner) |
| DELETE | `/education/:id`      | Remove education                 | Protected (Learner) |
| POST   | `/certifications`     | Add certification                | Protected (Learner) |
| DELETE | `/certifications/:id` | Remove certification             | Protected (Learner) |

### Job Routes - `/api/jobs`

Query Parameters: `search`, `location`, `type`, `status`, `minSalary`, `maxSalary`, `page`, `limit`

| Method | Endpoint   | Description                              | Access               |
| ------ | ---------- | ---------------------------------------- | -------------------- |
| GET    | `/`        | Get all jobs with filters and pagination | Public               |
| GET    | `/:id`     | Get job details by ID                    | Public               |
| POST   | `/`        | Create new job posting                   | Protected (Employer) |
| PATCH  | `/:id`     | Update job details                       | Protected (Employer) |
| DELETE | `/:id`     | Delete job posting                       | Protected (Employer) |
| GET    | `/my-jobs` | Get employer's posted jobs               | Protected (Employer) |

### Application Routes - `/api/applications`

| Method | Endpoint           | Description                | Access               |
| ------ | ------------------ | -------------------------- | -------------------- |
| POST   | `/`                | Submit job application     | Protected (Learner)  |
| GET    | `/my-applications` | Get learner's applications | Protected (Learner)  |
| GET    | `/job/:jobId`      | Get applicants for a job   | Protected (Employer) |
| PATCH  | `/:id/status`      | Update application status  | Protected (Employer) |
| DELETE | `/:id`             | Withdraw application       | Protected (Learner)  |
| GET    | `/:id`             | Get application details    | Protected            |

### Article Routes - `/api/articles`

| Method | Endpoint       | Description                | Access               |
| ------ | -------------- | -------------------------- | -------------------- |
| GET    | `/`            | Get all published articles | Public               |
| GET    | `/:id`         | Get article by ID          | Public               |
| POST   | `/`            | Create article             | Protected (Employer) |
| PATCH  | `/:id`         | Update article             | Protected (Employer) |
| DELETE | `/:id`         | Delete article             | Protected (Employer) |
| GET    | `/my-articles` | Get employer's articles    | Protected (Employer) |
| PATCH  | `/:id/publish` | Publish/unpublish article  | Protected (Employer) |

Query Parameters: `search`, `category`, `includeInactive`, `page`, `limit`

| Method | Endpoint            | Description                   | Access            |
| ------ | ------------------- | ----------------------------- | ----------------- |
| GET    | `/`                 | Get active news with search   | Public            |
| GET    | `/:id`              | Get news by ID                | Public            |
| POST   | `/`                 | Create news post              | Protected (Admin) |
| PUT    | `/:id`              | Update news                   | Protected (Admin) |
| DELETE | `/:id`              | Delete news                   | Protected (Admin) |
| PATCH  | `/:id/deactivate`   | Activate/deactivate news      | Protected (Admin) |

### Contact Routes - `/api/contact`

Query Parameters: `status`, `search`, `page`, `limit`

| Method | Endpoint       | Description                  | Access            |
| ------ | -------------- | ---------------------------- | ----------------- |
| POST   | `/`            | Submit contact form          | Public            |
| GET    | `/all`         | Get all contact submissions  | Protected (Admin) |
| GET    | `/:id`         | Get contact by ID            | Protected (Admin) |
| PATCH  | `/:id`         | Update contact status        | Protected (Admin) |
| DELETE | `/:id`         | Delete contact submission    | Protected (Admin) |
| POST   | `/:id/reply`   | Reply to contact submission  | Protected (Admin) |
| DELETE | `/:id`               | Delete news                   | Protected (Admin) |
| PATCH  | `/:id/toggle-status` | Activate/deactivate news      | Protected (Admin) |

### Notification Routes - `/api/notifications`

| Method | Endpoint    | Description               | Access    |
| ------ | ----------- | ------------------------- | --------- |
| GET    | `/`         | Get user notifications    | Protected |
| GET    | `/:id`      | Get notification details  | Protected |
| PATCH  | `/:id/read` | Mark notification as read | Protected |
| DELETE | `/:id`      | Delete notification       | Protected |

### Skill Program Routes - `/api/skill-programs`

| Method | Endpoint             | Description                 | Access            |
| ------ | -------------------- | --------------------------- | ----------------- |
| GET    | `/`                  | Get active skill programs   | Public            |
| GET    | `/:id`               | Get program details         | Public            |
| POST   | `/`                  | Create skill program        | Protected (Admin) |
| PATCH  | `/:id`               | Update program              | Protected (Admin) |
| DELETE | `/:id`               | Delete program              | Protected (Admin) |
| PATCH  | `/:id/toggle-status` | Activate/deactivate program | Protected (Admin) |

### Matching Routes - `/api/matching`

| Method | Endpoint             | Description                         | Access               |
| ------ | -------------------- | ----------------------------------- | -------------------- |
| GET    | `/recommendations`   | Get job recommendations for learner | Protected (Learner)  |
| GET    | `/candidates/:jobId` | Get matched candidates for job      | Protected (Employer) |

### Dashboard Routes - `/api/dashboard`

| Method | Endpoint    | Description                  | Access               |
| ------ | ----------- | ---------------------------- | -------------------- |
| GET    | `/learner`  | Get learner dashboard stats  | Protected (Learner)  |
| GET    | `/employer` | Get employer dashboard stats | Protected (Employer) |
| GET    | `/admin`    | Get admin dashboard stats    | Protected (Admin)    |

## Response Format

**Success Response**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

**Error Response**

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

**HTTP Status Codes**

- `200` - OK (GET, PATCH, PUT successful)
- `201` - Created (POST successful)
- `400` - Bad Request (validation failed)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error

## Getting Started

**Prerequisites**

- Node.js 18+
- MongoDB 4.4+ (local or cloud)
- SMTP credentials (Gmail, Mailgun, etc.)

**Installation**

```bash
npm install
```

**Environment Setup**
Create `.env` file:

```
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/job-portal

JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@jobportal.com

FRONTEND_URL=http://localhost:3000

SOCKET_URL=http://localhost:5000
```

**Running the Server**

```bash
npm start      # Start with nodemon (auto-reload on changes)
npm run dev    # Alternative dev command
npm test       # Run 175 tests
```

API runs on `http://localhost:5000`

## Authentication

**JWT Flow**

1. User registers/logs in → receives JWT token
2. Token stored in localStorage on client
3. All protected requests include `Authorization: Bearer <token>`
4. Server validates token before processing request
5. Expired tokens trigger logout on frontend

**Roles & Permissions**

- `learner` - Browse jobs, apply, manage profile
- `employer` - Post jobs, manage applications, write articles
- `admin` - Manage content, users, platform features

**Middleware Usage**

```javascript
import { protect, restrictTo } from "./middlewares/auth.middleware.js";

router.post("/create", protect, restrictTo("employer"), controllerFunction);
```

## Testing

**Test Coverage**

- Authentication: registration, login, password reset, email verification
- Authorization: role-based access control
- CRUD Operations: all models and endpoints
- Validation: input validation and error handling
- Integration: database operations, email sending

**Running Tests**

```bash
npm test              # Run all tests
npm test -- --watch  # Run tests in watch mode
```

**Test Results**: 175 passing tests covering all major functionality

## Security Features

**Password Security**

- Bcrypt hashing with 12 salt rounds
- Passwords never stored in plain text
- Reset tokens expire after 10 minutes

**JWT Security**

- Token expiration (7 days default)
- Refresh token rotation
- Secure secret key (must change in production)

**Data Protection**

- Mongoose prevents MongoDB injection
- Input validation with express-validator
- CORS configuration for frontend origin
- Environment variables for sensitive data

**Request Handling**

- Rate limiting recommended for production
- HTTPS enforced in production
- Contact form replies
- Secure headers with Helmet middleware

## Email Configuration
Automated Data Cleanup

**Cleanup Scheduler** (`utils/cleanup.js`)

- Runs daily at midnight
- Deletes expired notifications (7 days)
- Deactivates expired news (30 days)
- Archives expired contacts (90 days)
- Automatic cleanup on server startup

**Expiry Configuration**

- Notifications: 7 days from creation
- News: 30 days from creation (configurable)
- Contacts: 90 days from submission

## Logging & Monitoring

**Logger Utility**

- Request logging (method, path, duration)
- Error logging with stack traces
- Database operation tracking
- Cleanup operation logging

**Production Recommendations**

- Implement error tracking (Sentry)
- Set up application monitoring (New Relic, DataDog)
- Enable request logging
- Monitor database performance
- Track cleanup job execution
**Template System**
Plain text templates with dynamic links to frontend.

## Logging & Monitoring

**Logger Utility**

- Request logging (method, path, duration)
- Error logging with stack traces
- Database operation tracking

**Production Recommendations**

- Implement error tracking (Sentry)
- Set up application monitoring (New Relic, DataDog)
- Enable request logging
- Monitor database performance

## Error Handling

All API requests return consistent error format:

- Client errors (4xx) provide clear messages
- Validation errors list all issues
- Server errors (5xx) logged for debugging
- No sensitive data exposed in error messages

## Performance Considerations

**Database Optimization**

- Indexes on frequently queried fields
- Pagination for large result sets (default limit: 10)
- Aggregation pipelines for dashboard data

**API Optimization**

- Select only needed fields from database
- Cache frequently accessed data
- Compress responses with gzip

**Scalability**

- Stateless API design for horizontal scaling
- Session storage can use Redis
- Consider database sharding for large datasets

## Deployment Checklist

- [ ] Set secure JWT_SECRET
- [ ] Configure production MONGODB_URI
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for frontend domain
- [ ] Set FRONTEND_URL for email links
- [ ] Use environment variables from secure vault
- [ ] Enable HTTPS
- [ ] Set up error tracking
- [ ] Configure database backups
- [ ] Set up monitoring and logging
- [ ] Run full test suite
- [ ] Performance testing
- [ ] Security audit

## Resources

- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [JWT Introduction](https://jwt.io)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
