# 🏃 Anti-Drug Movement Marathon Run 2026

> **Organized by:** Chinmaya Mission Adoni & Chinmaya Yuva Kendra (CHYK) Adoni  
> **Slogan:** *"YOUR LIFE. YOUR CHOICE."*  
> **Location:** Adoni, Andhra Pradesh, India  

---

## 📌 Project Overview

This is the official production web application for the **Anti-Drug Movement Marathon Run 2026** in Adoni, Andhra Pradesh. Built on the **MERN Stack** (MongoDB Atlas, Express.js, React, Node.js), it provides a centralized platform for:

- 🏃 **Individual & Bulk School/College Marathon Registrations**
- 🎨 **Dynamic Centralized Media & Image Library CMS**
- 📱 **Fully Responsive User Panel** (Home, About, Activities, What We Do, Let's Connect)
- ⚙️ **Admin Management System** (Registrations management, Excel parse, Banner uploads, Activities CMS, FAQ manager, Theme & Homepage visibility control)

---

## 🛠️ Technology Stack

- **Frontend:** React (Vite), TailwindCSS, Lucide Icons, Axios, React Router v6
- **Backend:** Node.js, Express.js, Mongoose (MongoDB Atlas Cloud)
- **Image Cloud Storage:** Cloudinary
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing
- **Deployment & Production:** Ready for Vercel, Render, AWS, Docker, PM2

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI
- Cloudinary Credentials (Optional for image uploads)

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/prabodh2/chinmaya_mission_adoni.git
cd chinmaya_mission_adoni

# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install
```

### 3. Environment Variables Setup

Create a `.env` file in `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Locally

```bash
# Start Backend (from /server)
npm run dev

# Start Frontend (from /client)
npm run dev
```

---

## 🏛️ Project Structure

```text
├── client/                 # React Frontend Application (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI Components & Navbars
│   │   ├── pages/          # User Pages & Admin Control Dashboard
│   │   ├── services/       # Axios API Client & Interceptors
│   │   └── styles/         # Global Poster Theme CSS Variables
├── server/                 # Express.js REST API Backend
│   ├── src/
│   │   ├── config/         # MongoDB Atlas Connection & Cloudinary
│   │   ├── controllers/    # API Request Handlers & Business Logic
│   │   ├── middleware/     # Auth, Admin & File Upload Middleware
│   │   ├── models/         # Mongoose Schemas (Media, User, Registration, etc.)
│   │   ├── routes/         # Express Route Definitions
│   │   └── utils/          # Auto-Seeding & Data Helpers
└── README.md
```

---

## 📜 License & Acknowledgments

© 2026 **Chinmaya Mission Adoni & Chinmaya Yuva Kendra Adoni**. All Rights Reserved.
