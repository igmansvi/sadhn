# SADHN Client - Frontend Application

Modern React-based frontend for the Skills and Development Hub Network platform. A comprehensive job portal and skill development platform supporting three distinct user roles: Learners, Employers, and Administrators.

## Technology Stack

**Core Framework**

- React 18 with Vite (fast bundler)
- React Router v6 (client-side routing)
- Redux Toolkit (global state management)

**UI & Styling**

- TailwindCSS v4 (utility-first CSS framework)
- shadcn/ui (accessible component library)
- Lucide React (icon library)
- Framer Motion (animations)

**Data & Forms**

- Axios (HTTP client with interceptors)
- React Hook Form (form state management)
- Zod (schema validation)

**Real-time & Notifications**

- Socket.IO Client (real-time communication)
- Sonner (toast notifications)

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (avatar, badge, button, card, dialog, etc)
│   ├── shared/          # Reusable components (Navbar, Footer, ProtectedRoute, LoadingState, EmptyState)
│   └── common/          # Feature-specific components (NewsUpdates, NotificationUpdates)
├── pages/
│   ├── auth/            # Authentication pages (Login, Register, ForgotPassword, ResetPassword, VerifyEmail)
│   ├── common/          # Public pages (Home, Articles, ArticleDetail, Jobs, JobDetail, Programs, ProgramDetail)
│   ├── learner/         # Learner features (Dashboard, Profile, Jobs, JobDetail, Applications, Explore, Onboarding, Programs)
│   ├── employer/        # Employer features (Dashboard, Profile, Jobs, JobForm, Applications, Articles, ArticleForm)
│   └── admin/           # Admin features (Dashboard, News, Programs, Users)
├── routes/
│   ├── index.jsx        # Main route configuration
│   ├── authRoutes.jsx   # Authentication routes
│   ├── publicRoutes.jsx # Public accessible routes
│   ├── learnerRoutes.jsx    # Learner protected routes
│   ├── employerRoutes.jsx   # Employer protected routes
│   └── adminRoutes.jsx  # Admin protected routes
├── layouts/
│   ├── MainLayout.jsx       # Main layout with navbar and footer
│   ├── AuthLayout.jsx       # Centered auth layout
│   ├── DashboardLayout.jsx  # Dashboard with sidebar
│   ├── LearnerLayout.jsx    # Learner specific layout
│   └── AdminLayout.jsx      # Admin specific layout
├── lib/
│   ├── api.js           # Axios instance with interceptors
│   ├── constants.js     # Application constants and enums
│   ├── utils.js         # Utility functions
│   └── services/        # API service layer
│       ├── authService.js
│       ├── profileService.js
│       ├── jobService.js
│       ├── applicationService.js
│       ├── articleService.js
│       ├── newsService.js
│       ├── skillProgramService.js
│       ├── dashboardService.js
│       ├── notificationService.js
│       ├── matchingService.js
│       └── socketService.js
├── store/
│   ├── index.js         # Redux store configuration
│   └── slices/          # Redux slices (authSlice, jobSlice, profileSlice, uiSlice)
├── context/
│   └── SocketContext.jsx    # WebSocket context for real-time features
├── App.jsx              # Root app component
├── main.jsx             # Vite entry point
└── index.css            # Global styles
```

## Core Features

**Authentication & Authorization**

- User registration with role selection
- Email/password login with JWT tokens
- Forgot password and reset workflow
- Email verification with tokens
- Role-based route protection (Learner, Employer, Admin)
- Automatic logout on token expiration (401)

**Learner Experience**

- Interactive dashboard with stats and job recommendations
- Complete profile setup (skills, experience, education, certifications)
- Advanced job search with filters (location, type, salary range)
- One-click job applications with status tracking
- Application management and withdrawal
- Skill program discovery and enrollment
- Personalized job recommendations

**Employer Portal**

- Job posting and management (create, edit, publish, close)
- Application tracking with status updates
- Applicant profile review and evaluation
- Articles/content management for company visibility
- Analytics dashboard with key metrics
- Company profile customization

**Admin Dashboard**

- Platform statistics and insights
- News/announcement management
- Skill program administration
- User management and moderation
- Content moderation

## API Integration

All API communication handled through service modules in `lib/services/`. Each service encapsulates endpoints for a specific feature:

**Service Pattern**

```javascript
export const jobService = {
  getAllJobs: async (filters) => api.get("/jobs", { params: filters }),
  getJobById: async (id) => api.get(`/jobs/${id}`),
  createJob: async (data) => api.post("/jobs", data),
  updateJob: async (id, data) => api.patch(`/jobs/${id}`, data),
  deleteJob: async (id) => api.delete(`/jobs/${id}`),
  getMyJobs: async () => api.get("/jobs/my-jobs"),
};
```

**HTTP Configuration**

- Base URL: `http://localhost:5000/api`
- Bearer token auto-injection in Authorization header
- Global error handling with toast notifications
- Request/response interceptors for logging
- Automatic 401 handling with redirect to login

## State Management

Redux Toolkit manages global state with slice-based architecture:

**authSlice.js** - User authentication state (user object, JWT token, login status)
**profileSlice.js** - Current user profile data
**jobSlice.js** - Job listings, filters, pagination state
**uiSlice.js** - UI state (themes, modals, sidebar)

**Best Practices**

- Redux for authentication and user profile
- Local component state for page-specific data
- Service layer for all API calls
- Async/await pattern with error handling

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn components
│   |── shared/          # Shared components
│   ├── auth/            # Authentication components
│   ├── admin/           # Admin dashboard & features components
│   ├── employer/        # Employer dashboard & features components
│   ├── learner/         # Learner dashboard & features components
├── pages/
│   ├── auth/            # Authentication pages
│   ├── admin/           # Admin dashboard & features
│   ├── employer/        # Employer dashboard & features
│   ├── learner/         # Learner dashboard & features
│   └── common/          # Home, About, Contact
├── lib/
│   ├── api.js           # Axios configuration
│   ├── constants.js     # Constants & enums
│   └── services/        # API service functions
│       ├── authService.js
│       ├── jobService.js
│       ├── profileService.js
│       ├── applicationService.js
│       ├── articleService.js
│       ├── newsService.js
│       ├── skillProgramService.js
│       └── dashboardService.js
├── store/
│   ├── index.js         # Redux store
│   └── slices
├── hooks
├── layouts
└── routes
```

## � API Services

All API interactions are handled through service modules in `lib/services/`:

- **authService.js** - Login, register, forgot password, verify email
- **jobService.js** - Create, read, update, delete jobs; filter and search
- **profileService.js** - Get and update user profiles
- **applicationService.js** - Submit and track job applications
- **articleService.js** - Employer articles management
- **newsService.js** - Admin news and announcements
- **skillProgramService.js** - Skill programs catalog

Each service uses the configured Axios instance (`lib/api.js`) with automatic token injection and 401 handling.

export const jobService = {
getAllJobs: async (filters = {}) => {
const response = await api.get("/jobs", { params: filters });
return response.data;
},
getJobById: async (id) => {
const response = await api.get(`/jobs/${id}`);
return response.data;
},
createJob: async (jobData) => {
const response = await api.post("/jobs", jobData);
return response.data;
},
updateJob: async (id, jobData) => {
const response = await api.patch(`/jobs/${id}`, jobData);
return response.data;
},
deleteJob: async (id) => {
const response = await api.delete(`/jobs/${id}`);
return response.data;
},
searchJobs: async (searchParams) => {
const response = await api.get("/jobs/search", { params: searchParams });
return response.data;
},
getMyJobs: async (filters = {}) => {
const response = await api.get("/jobs/my-jobs", { params: filters });
return response.data;
},
};

````

**Usage in Component**

```jsx
import { useState, useEffect } from "react";
import { jobService } from "@/lib/services/jobService";

function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await jobService.getAllJobs();
        setJobs(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}
````

### Service Modules to Create

All service files in `lib/services/`:

- `authService.js` - Register, login, verify email, reset password
- `profileService.js` - CRUD profile, skills, experience, education
- `jobService.js` - CRUD jobs, search, filters
- `applicationService.js` - Apply, withdraw, update status
- `articleService.js` - CRUD articles, publish
- `newsService.js` - CRUD news/announcements
- `skillProgramService.js` - Browse skill programs
- `dashboardService.js` - Get dashboard data

### API Endpoints Reference

All endpoints tested and documented via backend tests (175 passing tests):

**Auth**: `/api/auth/*`
**Profile**: `/api/profile/*`
**Jobs**: `/api/jobs/*`
**Applications**: `/api/applications/*`
**Articles**: `/api/articles/*`
**News**: `/api/news/*`
**Skill Programs**: `/api/skill-programs/*`
**Dashboard**: `/api/dashboard/*`

---

## 📦 State Management Strategy

**Redux Toolkit (RTK)**

**store/index.js - Store Configuration**

```javascript
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import jobReducer from "./slices/jobSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    job: jobReducer,
  },
});
```

**store/slices/authSlice.js - Example Slice**

```javascript
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
```

**Usage in Component**

```jsx
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { authService } from "@/lib/services/authService";

function LoginPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      dispatch(
        setCredentials({
          user: data.user,
          token: data.token,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
```

**Redux Slices to Create**:

- `authSlice.js` - Authentication state, user, token
- `profileSlice.js` - User profile data
- `jobSlice.js` - Jobs listing, filters, pagination
- `applicationSlice.js` - Applications data (optional)

**Data Fetching Pattern**:

- ✅ Service functions handle API calls
- ✅ Components use useState/useEffect for local data
- ✅ Redux for global state (auth, user profile)
- ✅ Local state for page-specific data (lists, forms)

---

## 🎨 Design Tokens

### Colors (TailwindCSS + shadcn)

- Primary: Blue (Jobs, CTAs)
- Secondary: Purple (Articles, Content)
- Success: Green (Approved, Active)
- Warning: Yellow (Pending, Review)
- Danger: Red (Rejected, Delete)
- Neutral: Gray (Text, Borders)

### Typography

- Headings: font-bold, font-semibold
- Body: font-normal
- Small: text-sm
- Muted: text-muted-foreground

---

## 🧪 Testing Strategy

**Manual Testing Only** (Backend fully tested with 175 tests)

- Click through all features
- Test form validations
- Check API error handling
- Verify role-based access
- Test on different screen sizes
- Cross-browser compatibility

---

## 📝 Development Guidelines

1. **Component Structure**: Functional components with hooks
2. **Naming**: PascalCase for components, camelCase for functions
3. **File Organization**: One component per file
4. **Props**: Use destructuring, add prop validation if needed
5. **API Calls**: Use React Query hooks, handle loading/error states
6. **Forms**: Use react-hook-form for validation
7. **Styling**: TailwindCSS utility classes, shadcn components
8. **Comments**: Only for complex logic, code should be self-documenting

---

## � Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend server running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will run on `http://localhost:3000`

## 📦 Installed Packages

### Core Dependencies

- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing
- `@reduxjs/toolkit` - State management
- `react-redux` - Redux React bindings
- `axios` - HTTP client
- `react-hook-form` - Form handling

### UI & Styling

- `tailwindcss` - Utility-first CSS
- `@radix-ui/*` - Accessible UI primitives (via shadcn)
- `lucide-react` - Icon library
- `sonner` - Toast notifications
- `class-variance-authority` - Component variants
- `tailwind-merge` - Tailwind class merging
- `clsx` - Conditional classes

### Dev Dependencies

- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `eslint` - Code linting
- `autoprefixer` - CSS prefix automation
- `postcss` - CSS transformation

## 🎯 Key Features

### Error Handling

- Axios interceptors for global error handling
- Toast notifications for user feedback
- 401 auto-logout and redirect
- Service layer error handling

### State Management

- Redux Toolkit for global state
- Auth state (user, token, isAuthenticated)
- Profile state management
- Job filters and pagination state

### API Integration

- Service layer architecture
- Consistent error handling across services
- Bearer token authentication
- Request/response interceptors

### UI/UX

- Responsive design (mobile-first)
- Loading states and skeletons
- Empty state components
- Pagination for large datasets
- Debounced search inputs
- CSV export functionality
- Toast notifications
- Consistent color scheme (neutral theme)

## 📝 Development Guidelines

### Code Style

- Functional components with hooks
- PascalCase for components
- camelCase for functions and variables
- Destructure props
- Use named exports for utilities

### Component Structure

```jsx
import statements

export default function ComponentName() {
  const [state, setState] = useState();

  useEffect(() => {

  }, []);

  const handleAction = () => {

  };

  return (

  );
}
```

### API Service Pattern

```javascript
export const serviceName = {
  method: async (params) => {
    try {
      const response = await api.post("/endpoint", params);
      toast.success("Success message");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Error message";
      toast.error(message);
      throw error;
    }
  },
};
```

## 📈 Project Status

**Status**: ✅ Complete

### Completed Phases

- ✅ Phase 1: Setup & Foundation
- ✅ Phase 2: Authentication & Common Pages
- ✅ Phase 3: Learner Features
- ✅ Phase 4: Employer Features
- ✅ Phase 5: Admin Features
- ✅ Phase 6: Polish & Optimization

### Features Checklist

- ✅ Authentication system (login, register, password reset, email verification)
- ✅ Role-based access control (learner, employer, admin)
- ✅ Learner dashboard and profile management
- ✅ Job browsing with filters and search
- ✅ Application submission and tracking
- ✅ Employer job management
- ✅ Application management for employers
- ✅ Article creation and management
- ✅ Admin news management
- ✅ Skill programs management
- ✅ Lazy loading and code splitting
- ✅ Pagination and search optimization
- ✅ Export functionality

## 🔗 Related

- Backend API: `../server/README.md`
- API Documentation: See backend README for endpoints

## 🤝 Contributing

1. Follow the established code style
2. Keep components focused and reusable
3. Add proper error handling
4. Test on multiple screen sizes
5. Ensure accessibility standards
