# 🕉️ Chinmaya Mission, Adoni — Official Web Portal

> **"To give maximum happiness to the maximum number of people for the maximum time."**  
> — *Pujya Gurudev Swami Chinmayananda Saraswati*

The official full-stack web application for **Chinmaya Mission, Adoni** (Andhra Pradesh, India). Built on the **MERN Stack** (MongoDB Atlas, Express.js, React, Node.js), this platform serves as a modern digital sanctuary connecting seekers, devotees, and the local community with spiritual teachings, sacred temple services, cultural activities, and noble welfare initiatives.

---

## 📌 Portal Overview & Key Features

### 🏛️ Sacred Temples & Sanctuaries
- **Shri Shantamalleshwara Swami Temple**: An ancient hilltop sanctum of Lord Shiva atop Navarantanagiri, Shanta Mallappa Konda. Originally constructed by the Kakatiyas in the 12th century, restored by the Vijayanagara rulers in the 16th century, and continuously preserved and developed by Chinmaya Mission since 1996.
- **Sri Chinmaya Sanjeevaraya Swamy Devasthanam**: Consecrated in 2006 under the divine inspiration of Pujya Swamini Shyamananda and Pujya Swami Pranavananda, nurturing spiritual solace and daily rituals.

### 🙏 Devotional Seva Bookings
- Interactive Seva booking system for traditional pujas, abhishekams, and special observances (Laghu Rudra Abhishekam, Karthika Deeparadhana, Shiva-Parvati Kalyana Mahotsavam, Hanuman Jayanti, and daily archanas).
- Digital receipt generation, unique Seva Reference tracking, and automated records management.

### 💖 Support Our Mission & Donations
- Dedicated giving platform enabling devotees to support:
  - **Annadanam (Nitya Anna Daana)** — community meals and feeding pilgrims.
  - **Temple Maintenance & Renovation** — infrastructure and heritage preservation.
  - **Spiritual & Vedic Education** — Bala Vihar, Geeta classes, study groups, and satsangs.
  - **Community & Youth Development** — youth empowerment and social welfare.
- Direct UPI and bank transfer workflows with receipt reconciliation.

### 🤝 Youth & Volunteer Engagement (CHYK)
- Volunteer registration and coordination for Chinmaya Yuva Kendra (CHYK) and local sevaks.
- Opportunities to serve in temple administration, community festivities, educational programs, and social initiatives.

### 🖼️ Sacred Visual Archive & Image Gallery
- High-resolution gallery featuring the presiding deities, sanctum sanctorum, hilltop vistas, Maha Kumbhabhishekam rituals, and annual festivals.
- Filterable categories, modal darshanam viewing, and authentic architectural descriptions.

### 👤 Devotee Account & Dashboard
- Secure authentication (Sign up, Login, Password encryption).
- Personalized devotee profile to manage personal details, track past and upcoming Seva bookings, and review contribution histories.

### ⚙️ Centralized Administrative CMS
- Secure role-based administration dashboard (`/admin`).
- Dynamic content management for Homepage, About, Leadership, Activities, and Footer.
- Full Seva Bookings & Donations management with export options.
- Volunteer applications review and approval.
- Integrated Cloudinary media library for uploading and organizing banners, festival posters, and temple imagery.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, TailwindCSS, Lucide Icons, Axios, React Router |
| **Backend** | Node.js, Express.js, Mongoose (ODM) |
| **Database** | MongoDB Atlas Cloud Database |
| **Media Cloud Storage** | Cloudinary API |
| **Authentication & Security** | JWT (JSON Web Tokens), Bcrypt.js, CORS, Helmet |
| **Deployment Ready** | Vercel (Frontend), Render / Railway / AWS / PM2 (Backend) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB Atlas** database connection URI
- **Cloudinary Account** (for dynamic image and banner management)

### 2. Repository Setup

```bash
# Clone the repository
git clone https://github.com/prabodh2/chinmaya_mission_adoni.git
cd chinmaya_mission_adoni
```

### 3. Server Configuration & Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5176
```

Start the backend server:

```bash
npm run dev
```
> The API will start on `http://localhost:5000`.

### 4. Client Configuration & Setup

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend application:

```bash
npm run dev
```
> The website will be available at `http://localhost:5176`.

---

## 📂 Project Structure

```text
chinmaya_mission_adoni/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets, logos, and icons
│   ├── src/
│   │   ├── components/         # Reusable UI components, Navbar, Footer, Modals
│   │   │   ├── admin/          # Admin panels and management modals
│   │   │   └── auth/           # Login, Signup, ProtectedRoute components
│   │   ├── context/            # Global state (AuthContext, ThemeContext)
│   │   ├── pages/              # Main public and admin pages
│   │   │   ├── admin/          # Admin Dashboard tabs (CMS, Sevas, Users, Banners)
│   │   │   ├── HomePage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── SriShanthaMamleshwaraSwamiTemplePage.jsx
│   │   │   ├── ChinmayaSanjeevarayaTemplePage.jsx
│   │   │   ├── ActivitiesPage.jsx
│   │   │   ├── WhoAreWePage.jsx
│   │   │   ├── SupportOurMissionPage.jsx
│   │   │   ├── GalleryPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/           # Axios API service instances and interceptors
│   │   └── styles/             # Global design tokens and component styling
│   └── package.json
│
├── server/                     # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/             # Database connection, Cloudinary, auth configs
│   │   ├── controllers/        # Business logic for Sevas, CMS, Auth, Media, Volunteers
│   │   ├── middleware/         # Authentication, authorization, file upload validators
│   │   ├── models/             # Mongoose schemas (User, SevaBooking, WebContent, Media, etc.)
│   │   ├── routes/             # Express API endpoints
│   │   └── utils/              # Data seeding, ID generation, and helper utilities
│   └── package.json
│
└── README.md
```

---

## 👥 Roles & Access Control

- **Public Visitors / Seekers**: Explore heritage, read about Gurudev's teachings, view the temple gallery, book Sevas, make contributions, and submit volunteer inquiries.
- **Registered Devotees**: Track personal Seva bookings, download puja receipts, and maintain profile details.
- **Administrators**: Access the administrative suite (`/admin/login`) to manage website content, review Seva records, approve volunteer applications, update banners, and oversee community donations.

---

## 📜 Vision & Dedication

**Chinmaya Mission, Adoni** is committed to fostering spiritual growth, Vedantic education, and selfless community service across the region. Under the inspiration of Pujya Gurudev Swami Chinmayananda, the mission stands as a beacon of Sanatana Dharma, love, and service.

---

## ⚖️ License & Credits

© 2026 **Chinmaya Mission, Adoni**. All Rights Reserved.
