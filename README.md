# Job Listing Application

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-8.19+-success.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

A modern, full-stack job listing platform connecting job seekers with employers through an intuitive and feature-rich interface.

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [API Reference](#api-reference) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Database Models](#database-models)
- [Frontend Routes](#frontend-routes)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The **Job Listing Application** is a comprehensive platform designed to streamline the job search and recruitment process. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it offers a seamless experience for both job seekers and employers.

### Key Highlights

- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control
- 💼 **Dual User Roles** - Separate interfaces for job seekers and employers
- 📱 **Responsive Design** - Mobile-first approach using TailwindCSS
- 🔔 **Real-time Notifications** - Keep users informed of application updates
- 🎨 **Modern UI/UX** - Clean, intuitive interface with excellent user experience
- 🚀 **RESTful API** - Well-documented API endpoints for easy integration

---

## ✨ Features

### For Job Seekers

- ✅ **Profile Management**
  - Create and update comprehensive profiles
  - Upload resumes and portfolio links
  - Manage skills, experience, and education
  - Track profile completeness

- 🔍 **Job Search & Discovery**
  - Browse available job listings
  - Advanced filtering (location, type, salary, skills)
  - View detailed job descriptions
  - Track application history

- 📝 **Application Management**
  - Apply to jobs with cover letters
  - Track application status (applied, review, shortlisted, etc.)
  - View application timeline
  - Receive notifications on status changes

### For Employers

- 📊 **Dashboard**
  - Comprehensive overview of job postings
  - Application analytics
  - Quick actions for common tasks

- 💼 **Job Management**
  - Create, edit, and delete job postings
  - Set job requirements and qualifications
  - Manage application deadlines
  - Track job views and applications

- 👥 **Applicant Management**
  - Review incoming applications
  - Update application statuses
  - Communicate with candidates
  - Schedule interviews

- 🏢 **Company Profile**
  - Showcase company information
  - Add company details and culture
  - Build employer brand

### General Features

- 🔔 **Notification System** - Real-time updates on application activities
- 🔒 **Data Security** - Password hashing with bcrypt, secure JWT tokens
- ⚡ **Performance** - Optimized database queries with indexing
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with TailwindCSS for a polished look

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|----------|
| **Node.js** | 14+ | Runtime environment |
| **Express.js** | 5.1.0 | Web application framework |
| **MongoDB** | 8.19+ | NoSQL database |
| **Mongoose** | 8.19.2 | MongoDB object modeling |
| **JWT** | 9.0.2 | Authentication & authorization |
| **bcryptjs** | 3.0.2 | Password hashing |
| **Morgan** | 1.10.1 | HTTP request logger |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **dotenv** | 17.2.3 | Environment variable management |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|----------|
| **React** | 18.3.1 | UI library |
| **React Router** | 7.9.4 | Client-side routing |
| **Axios** | 1.12.2 | HTTP client |
| **TailwindCSS** | 3.4.18 | Utility-first CSS framework |
| **Context API** | Built-in | State management |

### Development Tools

- **Nodemon** - Auto-restart server on changes
- **React Scripts** - Create React App tooling
- **PostCSS** - CSS transformation
- **Autoprefixer** - CSS vendor prefixing

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Local installation OR
  - MongoDB Atlas account (cloud database)
- **npm** (v6.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** - [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version    # Should output v14.0.0 or higher
npm --version     # Should output v6.0.0 or higher
mongo --version   # Should output v4.0 or higher (if using local MongoDB)
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Job Listing"
```

### 2. Environment Configuration

Create a `.env` file in the `Backend` directory:

```bash
cd Backend
touch .env  # On Windows: type nul > .env
```

Add the following environment variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/joblisting
# For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/joblisting

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Install Dependencies

From the **root directory**, run:

```bash
# Install all dependencies (backend + frontend)
npm run install-all

# OR install separately
npm run install-server  # Install backend dependencies
npm run install-client  # Install frontend dependencies
```

### 4. Seed the Database (Optional but Recommended)

Populate the database with sample data for testing:

```bash
npm run seed
```

This creates:
- **8 Job Seekers** with diverse skill sets and experience
- **6 Employers/Companies** across different industries
- **12 Job Postings** with various requirements
- **14 Applications** with different statuses
- **10 Notifications** for testing

**Test Credentials:**

| Role | Email | Password |
|------|-------|----------|
| Job Seeker | alice.johnson@email.com | password123 |
| Job Seeker | bob.smith@email.com | password123 |
| Job Seeker | carol.davis@email.com | password123 |
| Employer | hr@techcorp.com | password123 |
| Employer | jobs@innovatelab.com | password123 |
| Employer | careers@startupxyz.com | password123 |

### 5. Start the Application

#### Option A: Development Mode (Recommended)

Open **two terminal windows**:

**Terminal 1 - Backend Server:**
```bash
npm run server
# Server will start on http://localhost:5000
```

**Terminal 2 - Frontend Client:**
```bash
npm run client
# React app will start on http://localhost:3000
```

#### Option B: Production Mode

```bash
# Build frontend
npm run build

# Start backend server
npm start
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

---

## 📁 Project Structure

```
Job Listing/
├── Backend/                    # Backend server
│   ├── config/                 # Configuration files
│   │   └── db.js              # MongoDB connection
│   ├── controllers/            # Request handlers
│   │   ├── authController.js  # Authentication logic
│   │   ├── jobController.js   # Job CRUD operations
│   │   ├── applicationController.js
│   │   └── profileController.js
│   ├── middleware/             # Custom middleware
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js            # User model
│   │   ├── Job.js             # Job model
│   │   ├── Application.js     # Application model
│   │   ├── Company.js         # Company model
│   │   ├── Notification.js    # Notification model
│   │   └── SeekerProfile.js   # Seeker profile model
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── jobRoutes.js       # Job endpoints
│   │   ├── applicationRoutes.js
│   │   ├── profileRoutes.js
│   │   └── notificationRoutes.js
│   ├── utils/                  # Utility functions
│   │   └── sendNotification.js
│   ├── .env                    # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── seed.js                 # Database seeding script
│   └── server.js              # Entry point
│
├── frontend/                   # React frontend
│   ├── public/                 # Static files
│   │   └── index.html
│   ├── src/
│   │   ├── api/               # API service layer
│   │   │   ├── client.js      # Axios instance
│   │   │   ├── authApi.js     # Auth API calls
│   │   │   ├── jobApi.js      # Job API calls
│   │   │   ├── applicationApi.js
│   │   │   ├── profileApi.js
│   │   │   └── notificationApi.js
│   │   ├── components/         # React components
│   │   │   ├── Auth/          # Login, Register
│   │   │   ├── Jobs/          # Job list, Job card
│   │   │   ├── Profile/       # Profile components
│   │   │   ├── Header.js      # Navigation header
│   │   │   └── ApplicationCard.js
│   │   ├── context/            # React Context
│   │   │   └── AuthContext.js # Auth state management
│   │   ├── hooks/              # Custom hooks
│   │   │   └── useApplications.js
│   │   ├── pages/              # Page components
│   │   │   ├── Home.js
│   │   │   ├── JobDetail.js
│   │   │   ├── EditProfile.js
│   │   │   ├── ApplicationTracking.js
│   │   │   ├── EmployerDashboard.js
│   │   │   ├── AuthStatus.js
│   │   │   └── NotFound.js
│   │   ├── utils/              # Utility functions
│   │   │   └── formatLocation.js
│   │   ├── App.js             # Main app component
│   │   ├── index.js           # Entry point
│   │   └── index.css          # Global styles
│   ├── .gitignore
│   ├── package.json
│   ├── postcss.config.js      # PostCSS configuration
│   └── tailwind.config.js     # TailwindCSS configuration
│
├── .gitignore                  # Root gitignore
├── package.json                # Root package.json
├── package-lock.json
└── README.md                   # This file
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `Backend` directory:

```env
# Required
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>

# Optional
PORT=5000
NODE_ENV=development
JWT_EXPIRE=7d
```

### Frontend Configuration

The frontend API base URL is configured in `frontend/src/api/client.js`:

```javascript
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

To change the API URL, create `.env` in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔌 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "seeker" // or "employer"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "seeker"
  }
}
```

### Job Endpoints

#### Get All Jobs
```http
GET /api/jobs
```

#### Get Job by ID
```http
GET /api/jobs/:id
```

#### Create Job (Protected - Employer only)
```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Software Engineer",
  "description": "We are looking for...",
  "company": "<company-id>",
  "location": {
    "city": "San Francisco",
    "state": "CA"
  },
  "type": "Full-time",
  "salary": 120000,
  "skills": ["JavaScript", "React", "Node.js"]
}
```

#### Update Job (Protected - Employer only)
```http
PUT /api/jobs/:id
Authorization: Bearer <token>
```

#### Delete Job (Protected - Employer only)
```http
DELETE /api/jobs/:id
Authorization: Bearer <token>
```

#### Get My Jobs (Protected - Employer only)
```http
GET /api/jobs/my-jobs
Authorization: Bearer <token>
```

### Application Endpoints

#### Apply for Job (Protected)
```http
POST /api/applications/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "<job-id>",
  "coverLetter": "I am interested in...",
  "resume": "<resume-url>"
}
```

#### Get My Applications (Protected)
```http
GET /api/applications
Authorization: Bearer <token>
```

### Profile Endpoints

#### Get My Profile (Protected)
```http
GET /api/profiles/me
Authorization: Bearer <token>
```

#### Update Profile (Protected)
```http
PUT /api/profiles/me
Authorization: Bearer <token>
Content-Type: application/json
```

### Notification Endpoints

#### Get My Notifications (Protected)
```http
GET /api/notifications
Authorization: Bearer <token>
```

#### Mark Notification as Read (Protected)
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

For complete API documentation with request/response examples, see [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

---

## 🗄️ Database Models

### User Model
- Basic info (name, email, password, role)
- Profile data (avatar, phone, bio)
- Job seeker fields (resume, skills, experience, education)
- Employer fields (company, industry, website)
- Account status (active, verified, lastLogin)

### Job Model
- Job details (title, description, company, location)
- Compensation (salary, benefits)
- Requirements (type, experience, skills, qualifications)
- Application details (deadline, process)
- Status and metadata (status, priority, category, tags)
- Analytics (views, applications)

### Application Model
- References (job, seeker)
- Status tracking
- Application details (cover letter, resume, portfolio)
- Interview process
- Communication history
- Tracking metadata

### Company Model
- Company information
- Contact details
- Social media links

### Notification Model
- Notification type and content
- User references
- Read status

---

## 🛣️ Frontend Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Home | Public | Landing page |
| `/jobs` | JobList | Public | Browse all jobs |
| `/jobs/:id` | JobDetail | Public | View job details |
| `/login` | Login | Public | User login |
| `/register` | Register | Public | User registration |
| `/profile` | Profile | Protected | View profile |
| `/profile/edit` | EditProfile | Protected | Edit profile |
| `/applications` | ApplicationTracking | Protected (Seeker) | Track applications |
| `/employer-dashboard` | EmployerDashboard | Protected (Employer) | Manage jobs & applications |
| `/auth-status` | AuthStatus | Protected | Check auth status |

---

## 🧪 Testing

### Manual Testing with Seed Data

1. Seed the database:
   ```bash
   npm run seed
   ```

2. Login with test accounts (password: `password123`):
   - **Job Seeker**: alice.johnson@email.com
   - **Employer**: hr@techcorp.com

3. Test key workflows:
   - Browse and search jobs
   - Apply for jobs (as seeker)
   - Post new jobs (as employer)
   - Manage applications (as employer)
   - Update profile information

---

## 🚀 Deployment

### Backend Deployment (Heroku Example)

1. Install Heroku CLI
2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create new app:
   ```bash
   cd Backend
   heroku create your-app-name
   ```

4. Set environment variables:
   ```bash
   heroku config:set MONGO_URI=<your-mongodb-atlas-uri>
   heroku config:set JWT_SECRET=<your-secret>
   ```

5. Deploy:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Netlify/Vercel)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `build` folder to your hosting service

3. Set environment variable:
   ```
   REACT_APP_API_URL=<your-backend-url>
   ```

### Database (MongoDB Atlas)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in your environment variables

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- Follow existing code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 👥 Authors

- Likhitha Pogaku

---

## 🙏 Acknowledgments

- MongoDB for excellent documentation
- React team for the amazing library
- TailwindCSS for the utility-first CSS framework
- All contributors who help improve this project

---

<div align="center">

**Made with ❤️ using the MERN Stack**

⭐ Star this repo if you find it helpful!

</div>
