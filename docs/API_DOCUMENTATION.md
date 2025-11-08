# API Documentation

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Jobs](#job-endpoints)
  - [Applications](#application-endpoints)
  - [Profiles](#profile-endpoints)
  - [Notifications](#notification-endpoints)
- [Data Models](#data-models)
- [Status Codes](#status-codes)

---

## Overview

The Job Listing API is a RESTful API built with Express.js and MongoDB. It provides endpoints for user authentication, job management, application tracking, and notifications.

### Base URL

```
http://localhost:5000/api
```

For production, replace with your deployed backend URL.

### Authentication

Most endpoints require authentication using JWT (JSON Web Tokens). Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "message": "Error description",
  "error": "Detailed error message (in development mode)"
}
```

### Common Error Responses

| Status Code | Description |
|------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

---

## Endpoints

### Authentication Endpoints

#### 1. Register User

Create a new user account (job seeker or employer).

**Endpoint:** `POST /api/auth/register`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "seeker"
}
```

**Field Requirements:**
- `name` (required): 2-50 characters
- `email` (required): Valid email format, unique
- `password` (required): Minimum 6 characters
- `role` (required): Either "seeker" or "employer"

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "seeker",
    "isActive": true,
    "isVerified": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields or invalid data
- `409` - Email already registered

---

#### 2. Login User

Authenticate existing user and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "seeker",
    "avatar": "https://example.com/avatar.jpg",
    "skills": ["JavaScript", "React", "Node.js"],
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

### Job Endpoints

#### 1. Get All Jobs

Retrieve list of all active jobs with optional filtering.

**Endpoint:** `GET /api/jobs`

**Access:** Public

**Query Parameters:**
- `search` - Search in title and description
- `location` - Filter by city or state
- `type` - Filter by job type (Full-time, Part-time, Contract, etc.)
- `category` - Filter by category
- `minSalary` - Minimum salary
- `maxSalary` - Maximum salary
- `skills` - Comma-separated list of required skills
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example Request:**
```
GET /api/jobs?type=Full-time&location=San Francisco&skills=React,Node.js&page=1&limit=10
```

**Success Response (200):**
```json
{
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Senior Software Engineer",
      "description": "We are looking for an experienced software engineer...",
      "company": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "TechCorp",
        "logo": "https://example.com/logo.png"
      },
      "location": {
        "city": "San Francisco",
        "state": "CA",
        "region": "Bay Area"
      },
      "type": "Full-time",
      "salary": 120000,
      "skills": [
        {
          "name": "React",
          "level": "Advanced"
        },
        {
          "name": "Node.js",
          "level": "Intermediate"
        }
      ],
      "experience": {
        "min": 3,
        "max": 5,
        "level": "Senior"
      },
      "status": "active",
      "views": 150,
      "applications": 25,
      "createdAt": "2024-01-10T08:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalJobs": 48,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

#### 2. Get Job by ID

Retrieve detailed information about a specific job.

**Endpoint:** `GET /api/jobs/:id`

**Access:** Public

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Senior Software Engineer",
  "description": "Detailed job description...",
  "company": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "TechCorp",
    "logo": "https://example.com/logo.png",
    "description": "Leading tech company...",
    "website": "https://techcorp.com"
  },
  "employer": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Jane Smith",
    "email": "jane@techcorp.com"
  },
  "location": {
    "city": "San Francisco",
    "state": "CA",
    "region": "Bay Area"
  },
  "type": "Full-time",
  "salary": 120000,
  "benefits": ["Health Insurance", "401k", "Remote Work"],
  "skills": [
    {
      "name": "React",
      "level": "Advanced"
    }
  ],
  "qualifications": [
    "Bachelor's degree in Computer Science",
    "5+ years of experience"
  ],
  "responsibilities": [
    "Design and develop scalable applications",
    "Lead technical discussions"
  ],
  "applicationDeadline": "2024-02-15T23:59:59.000Z",
  "status": "active",
  "views": 150,
  "applications": 25,
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404` - Job not found

---

#### 3. Create Job

Post a new job listing (employer only).

**Endpoint:** `POST /api/jobs`

**Access:** Protected (Employer only)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Senior Software Engineer",
  "description": "We are looking for an experienced software engineer...",
  "company": "507f1f77bcf86cd799439012",
  "location": {
    "city": "San Francisco",
    "state": "CA",
    "region": "Bay Area"
  },
  "type": "Full-time",
  "salary": 120000,
  "benefits": ["Health Insurance", "401k", "Remote Work"],
  "experience": {
    "min": 3,
    "max": 5,
    "level": "Senior"
  },
  "skills": [
    {
      "name": "React",
      "level": "Advanced"
    },
    {
      "name": "Node.js",
      "level": "Intermediate"
    }
  ],
  "qualifications": [
    "Bachelor's degree in Computer Science",
    "5+ years of experience"
  ],
  "responsibilities": [
    "Design and develop scalable applications"
  ],
  "category": "Technology",
  "applicationDeadline": "2024-02-15T23:59:59.000Z"
}
```

**Success Response (201):**
```json
{
  "message": "Job created successfully",
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Senior Software Engineer",
    // ... full job object
  }
}
```

**Error Responses:**
- `400` - Missing required fields or invalid data
- `401` - Not authenticated
- `403` - Not an employer

---

#### 4. Update Job

Update an existing job posting (employer only, own jobs).

**Endpoint:** `PUT /api/jobs/:id`

**Access:** Protected (Employer only, own jobs)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Job Title",
  "status": "paused",
  "salary": 130000
}
```

**Success Response (200):**
```json
{
  "message": "Job updated successfully",
  "job": {
    // ... updated job object
  }
}
```

**Error Responses:**
- `401` - Not authenticated
- `403` - Not authorized to update this job
- `404` - Job not found

---

#### 5. Delete Job

Delete a job posting (employer only, own jobs).

**Endpoint:** `DELETE /api/jobs/:id`

**Access:** Protected (Employer only, own jobs)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Job deleted successfully"
}
```

**Error Responses:**
- `401` - Not authenticated
- `403` - Not authorized to delete this job
- `404` - Job not found

---

#### 6. Get My Jobs

Get all jobs posted by the authenticated employer.

**Endpoint:** `GET /api/jobs/my-jobs`

**Access:** Protected (Employer only)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status (draft, active, paused, closed, filled)
- `page` - Page number
- `limit` - Items per page

**Success Response (200):**
```json
{
  "jobs": [
    {
      // ... job objects
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalJobs": 25
  }
}
```

---

### Application Endpoints

#### 1. Apply for Job

Submit an application for a job (job seeker only).

**Endpoint:** `POST /api/applications/apply`

**Access:** Protected (Job Seeker only)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "jobId": "507f1f77bcf86cd799439011",
  "coverLetter": "I am very interested in this position because...",
  "resume": "https://example.com/resume.pdf",
  "portfolio": "https://johndoe.com",
  "expectedSalary": {
    "min": 100000,
    "max": 120000
  },
  "availability": "2024-03-01T00:00:00.000Z"
}
```

**Success Response (201):**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "_id": "507f1f77bcf86cd799439014",
    "job": "507f1f77bcf86cd799439011",
    "seeker": "507f1f77bcf86cd799439015",
    "status": "applied",
    "coverLetter": "I am very interested...",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields or invalid job ID
- `401` - Not authenticated
- `403` - Not a job seeker
- `409` - Already applied to this job

---

#### 2. Get My Applications

Get all applications submitted by the authenticated job seeker.

**Endpoint:** `GET /api/applications`

**Access:** Protected (Job Seeker only)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status (applied, review, shortlisted, rejected, accepted)
- `page` - Page number
- `limit` - Items per page

**Success Response (200):**
```json
{
  "applications": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "job": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Senior Software Engineer",
        "company": {
          "name": "TechCorp"
        }
      },
      "status": "review",
      "coverLetter": "I am very interested...",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  ],
  "stats": {
    "total": 10,
    "applied": 3,
    "review": 4,
    "shortlisted": 2,
    "rejected": 0,
    "accepted": 1
  }
}
```

---

#### 3. Get Applications for Job

Get all applications for a specific job (employer only, own jobs).

**Endpoint:** `GET /api/applications/job/:jobId`

**Access:** Protected (Employer only)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "applications": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "seeker": {
        "_id": "507f1f77bcf86cd799439015",
        "name": "John Doe",
        "email": "john@example.com",
        "skills": ["React", "Node.js"],
        "experience": [...]
      },
      "status": "applied",
      "coverLetter": "I am very interested...",
      "resume": "https://example.com/resume.pdf",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### 4. Update Application Status

Update the status of an application (employer only).

**Endpoint:** `PUT /api/applications/:id/status`

**Access:** Protected (Employer only)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "shortlisted"
}
```

**Valid Status Values:**
- `applied` - Initial status
- `review` - Under review
- `shortlisted` - Selected for next round
- `rejected` - Application rejected
- `accepted` - Offer extended

**Success Response (200):**
```json
{
  "message": "Application status updated",
  "application": {
    // ... updated application object
  }
}
```

---

### Profile Endpoints

#### 1. Get My Profile

Get the authenticated user's profile.

**Endpoint:** `GET /api/profiles/me`

**Access:** Protected

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "seeker",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "+1234567890",
    "bio": "Experienced software engineer...",
    "skills": ["React", "Node.js", "MongoDB"],
    "experience": [
      {
        "company": "Previous Corp",
        "position": "Software Engineer",
        "startDate": "2020-01-15",
        "endDate": "2023-12-31",
        "current": false,
        "description": "Developed web applications..."
      }
    ],
    "education": [
      {
        "institution": "University Name",
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "startDate": "2015-09-01",
        "endDate": "2019-05-30"
      }
    ],
    "location": {
      "city": "San Francisco",
      "state": "CA",
      "country": "United States"
    },
    "profileCompleteness": 85
  }
}
```

---

#### 2. Update Profile

Update the authenticated user's profile.

**Endpoint:** `PUT /api/profiles/me`

**Access:** Protected

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (All fields optional)
```json
{
  "name": "John Doe",
  "bio": "Updated bio...",
  "phone": "+1234567890",
  "skills": ["React", "Node.js", "TypeScript"],
  "location": {
    "city": "San Francisco",
    "state": "CA"
  }
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    // ... updated user object
  }
}
```

---

### Notification Endpoints

#### 1. Get My Notifications

Get all notifications for the authenticated user.

**Endpoint:** `GET /api/notifications`

**Access:** Protected

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `unread` - Filter unread notifications (true/false)
- `limit` - Number of notifications to return

**Success Response (200):**
```json
{
  "notifications": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "type": "application_status",
      "title": "Application Status Updated",
      "message": "Your application for Senior Software Engineer has been reviewed",
      "isRead": false,
      "data": {
        "applicationId": "507f1f77bcf86cd799439014",
        "jobId": "507f1f77bcf86cd799439011",
        "status": "review"
      },
      "createdAt": "2024-01-16T14:20:00.000Z"
    }
  ],
  "unreadCount": 5
}
```

---

#### 2. Mark Notification as Read

Mark a specific notification as read.

**Endpoint:** `PUT /api/notifications/:id/read`

**Access:** Protected

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

---

#### 3. Mark All Notifications as Read

Mark all notifications as read.

**Endpoint:** `PUT /api/notifications/read-all`

**Access:** Protected

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "All notifications marked as read",
  "count": 5
}
```

---

## Data Models

### User Model Schema

```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique),
  password: String (required, hashed, min 6 chars),
  role: Enum ['seeker', 'employer', 'admin'],
  avatar: String (URL),
  phone: String,
  bio: String (max 500 chars),
  
  // Job Seeker Fields
  resume: String (URL),
  skills: Array of Strings,
  experience: Array of {
    company, position, startDate, endDate, current, description
  },
  education: Array of {
    institution, degree, field, startDate, endDate, current
  },
  location: {
    city, state, country
  },
  
  // Employer Fields
  company: ObjectId (ref: Company),
  companySize: Enum,
  industry: String,
  website: String (URL),
  companyDescription: String (max 1000 chars),
  
  // Status
  isActive: Boolean,
  isVerified: Boolean,
  lastLogin: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Job Model Schema

```javascript
{
  title: String (required, max 100 chars),
  description: String (required, max 2000 chars),
  company: ObjectId (required, ref: Company),
  employer: ObjectId (required, ref: User),
  location: {
    city, state, region
  },
  salary: Number,
  benefits: Array of Strings,
  type: Enum ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
  experience: {
    min, max, level: Enum
  },
  skills: Array of {
    name, level: Enum
  },
  qualifications: Array of Strings,
  responsibilities: Array of Strings,
  applicationDeadline: Date,
  status: Enum ['draft', 'active', 'paused', 'closed', 'filled'],
  priority: Enum ['low', 'medium', 'high'],
  category: Enum,
  tags: Array of Strings,
  views: Number,
  applications: Number,
  slug: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model Schema

```javascript
{
  job: ObjectId (required, ref: Job),
  seeker: ObjectId (required, ref: User),
  status: Enum ['applied', 'review', 'shortlisted', 'rejected', 'accepted'],
  coverLetter: String,
  resume: String (URL),
  portfolio: String (URL),
  expectedSalary: {
    min, max, currency
  },
  availability: Date,
  notes: String (max 500 chars),
  interviews: Array of {
    type, scheduledAt, duration, location, meetingLink,
    interviewer, notes, status, feedback
  },
  messages: Array of {
    sender, message, timestamp, isRead
  },
  source: Enum,
  viewedByEmployer: Boolean,
  viewedAt: Date,
  lastActivity: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Status Codes

### Success Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |

### Client Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |

### Server Error Codes

| Code | Description |
|------|-------------|
| 500 | Internal Server Error - Something went wrong |
| 503 | Service Unavailable - Server temporarily unavailable |

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider implementing rate limiting using packages like `express-rate-limit`.

---

## Versioning

The API is currently at version 1.0. Future versions will be accessed via `/api/v2/`, etc.

---

## Support

For API support, please create an issue in the repository or contact the development team.
