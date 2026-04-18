# JobBoard - CSC350 Final Project

A full-stack **Job Board** web application where employers can post job listings and employees can browse and apply for positions. Built as the final project for **CSC350**.

## Features

- **User Authentication** — Register and login with secure JWT-based authentication (httpOnly cookies, bcrypt password hashing)
- **Role-Based Access** — Two user roles:
  - **Employer**: Can post, view, and manage job listings
  - **Employee**: Can browse and view job listings
- **Job Listings** — Browse all posted jobs on the home page, sorted by newest first
- **Job Details** — Click on any job to see full description, location, salary, type, and contact info
- **Post Jobs** — Employers can create new job postings with title, company, location, salary, type, description, and contact details
- **Responsive UI** — Clean, modern interface with smooth animations, built with Tailwind CSS
- **About Page** — Information about the platform and how it works

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Frontend | React 19, Tailwind CSS v4 |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| Font | Geist (via next/font) |

## Project Structure

```
app/
├── page.tsx                  # Home page — lists all jobs
├── layout.tsx                # Root layout with Navbar
├── globals.css               # Global styles and animations
├── about/page.tsx            # About page
├── login/page.tsx            # Login page
├── register/page.tsx         # Registration page
├── post-job/page.tsx         # Post job form (employers only)
├── jobs/[id]/page.tsx        # Job detail page (dynamic route)
├── components/
│   └── Navbar.tsx            # Navigation bar with auth state
└── api/
    ├── auth/
    │   ├── login/route.ts    # POST — login user
    │   ├── register/route.ts # POST — register user
    │   ├── logout/route.ts   # POST — logout user
    │   └── me/route.ts       # GET  — get current session
    └── jobs/
        ├── route.ts          # GET all jobs, POST new job
        └── [id]/route.ts     # GET single job by ID

lib/
├── mongodb.ts                # MongoDB connection with caching
├── auth.ts                   # JWT helpers (sign, verify, session)
└── models/
    ├── User.ts               # User schema (name, email, password, role)
    └── Job.ts                # Job schema (title, company, location, salary, etc.)
```

## API Routes

| Method | Route | Description | Auth |
| ------ | ----- | ----------- | ---- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and set JWT cookie | No |
| `POST` | `/api/auth/logout` | Clear JWT cookie | No |
| `GET` | `/api/auth/me` | Get current logged-in user | No |
| `GET` | `/api/jobs` | Get all jobs (sorted by newest) | No |
| `POST` | `/api/jobs` | Create a new job | Employer |
| `GET` | `/api/jobs/[id]` | Get a single job by ID | No |

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas connection string)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd job-borad-final-project-of-CSC350-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/jobboard
   JWT_SECRET=your-secret-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. Users register as either an **Employer** or **Employee**
2. Passwords are hashed with **bcrypt** before storing in MongoDB
3. On login, a **JWT token** is issued and stored in an httpOnly cookie
4. The **home page** (server-rendered) displays all jobs from the database
5. **Employers** can access the Post Job page to create new listings
6. **Employees** can browse and click on jobs to view full details and contact info
7. The **Navbar** dynamically shows login/register buttons or user info based on auth state

## Course Info

- **Course**: CSC350
- **Project**: Final Project — Job Board Web Application
