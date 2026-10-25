# 🏨 HotelPro – Hotel Booking and Management System (MERN Stack)

A complete, production-grade, beginner-friendly **Hotel Booking and Management System** built with the **MERN** stack (**MongoDB, Express.js, React.js, Node.js**) with **JWT Authentication**, real-time room availability, interactive date-conflict prevention, digital reservation vouchers, and a full-featured **Admin Dashboard**.

---

## 🌟 Key Features

1. **User Registration & Login**:
   - Secure account registration with input validation.
   - Password encryption using **bcryptjs**.
   - Stateless session management with **JSON Web Tokens (JWT)**.
   - Built-in **1-click quick demo accounts** for effortless evaluation.

2. **Room Catalog & Real-Time Availability**:
   - Browse luxury rooms, ocean suites, penthouses, and family residences.
   - Multi-photo high-resolution image galleries with thumbnail switcher.
   - Specifications: Max guests, bed count, bathrooms, square footage, views, floor number.
   - Amenity pills: Balcony, Wi-Fi, Jacuzzi, Pool Access, Breakfast, Butler Service.

3. **Multi-Criteria Search & Filtering**:
   - Live keyword search by title, room number, or description.
   - Category filtering (Deluxe Suites, Presidential Villas, Executive, Family, Standard).
   - Price slider (₹2,000 – ₹30,000+/night).
   - Capacity / Guest party size selector.
   - Amenities checklist.
   - Sorting: Featured, Price (Low to High), Price (High to Low), and Guest Rating.

4. **Booking & Reservation Engine**:
   - Dynamic stay length (nights) and price calculator.
   - Transparent price breakdown: (Nightly Rate × Nights) + 12% GST Tax + ₹750 Concierge & Cleaning Fee.
   - **Overlapping date conflict prevention**: Automatically rejects double-booking attempts for the same room.
   - Payment simulation: Instant Online Guarantee (Credit Card) or Pay at Reception upon Check-in.
   - Celebratory booking confirmation with confetti and unique reference code (`HP-XXXXXX`).

5. **Guest Itinerary & Digital Vouchers**:
   - View active, completed, and cancelled reservations.
   - Printable official hotel reservation voucher with QR / barcode simulation and check-in instructions.
   - Self-service reservation cancellation with confirmation safeguards.

6. **General Manager Admin Dashboard**:
   - **Executive KPI Metrics**: Gross Revenue (₹ INR), Total Bookings, Active Rooms, Total Users, and Real-Time Occupancy Rate (%).
   - **Room Inventory Manager**: Add new rooms with custom photo URLs, pricing, and specs; Edit existing rooms; Toggle availability; Delete rooms.
   - **Reservation Operations**: View all reservations across the property, search by guest name or reference code, filter by status, and change status (Confirmed, Completed, Cancelled).
   - **User Permissions**: Manage user accounts and grant or revoke Administrator privileges.

7. **Database Storage & Architecture**:
   - Pre-configured standard **Mongoose Models** for `User`, `Room`, and `Booking`.
   - Connects to **MongoDB Atlas** or local `mongod` instance via `MONGODB_URI`.
   - **Zero-Config Resilient Fallback**: Automatically initializes an embedded persistent store if no external database credentials are configured yet, ensuring zero downtime and immediate live demo functionality!

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS | High-performance reactive UI with luxury aesthetics |
| **Icons & Effects** | Lucide React, Canvas Confetti | Visual symbols & celebratory booking animations |
| **Backend** | Node.js, Express.js | RESTful API server (`/api/auth`, `/api/rooms`, `/api/bookings`, `/api/admin`) |
| **Database** | MongoDB & Mongoose | Document database with schemas for Users, Rooms, and Bookings |
| **Authentication** | JWT (`jsonwebtoken`) & `bcryptjs` | Bearer token authentication & password hashing |
| **Build Tool** | Vite, `tsx` | Ultra-fast bundling and development server |

---

## 🚀 Quick Start Guide (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn`

### 1. Clone the repository
```bash
git clone https://github.com/your-username/hotelpro.git
cd hotelpro
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Your `.env` file contains:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/hotelpro?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```
> **Note**: If you leave `MONGODB_URI` empty or with the placeholder, HotelPro will automatically use its built-in local store so you can test everything right away with zero setup!

### 4. Run the Full-Stack Application
```bash
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🔑 Demo Credentials

HotelPro comes pre-seeded with two demo accounts for fast testing:

| Role | Email | Password | Access |
|---|---|---|---|
| **Hotel General Manager** | `admin@hotelpro.com` | `admin123` | Full Admin Dashboard, Room Inventory, All Bookings, User Roles |
| **Guest Member** | `guest@hotelpro.com` | `guest123` | Room booking, Reservation history, Digital voucher printing |

*Tip: You can also click the **"Demo Guest"** or **"Demo Admin"** buttons directly inside the Sign-In modal to log in with a single click!*

---

## ☁️ Connecting to MongoDB Atlas (Production Database)

1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Create a free **M0 Sandbox Cluster**.
3. Under **Security > Database Access**, add a database user (e.g. `hoteladmin` with a secure password).
4. Under **Security > Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere (`0.0.0.0/0`)** (required for cloud hosting like Render/Cloud Run).
5. Under **Database > Clusters**, click **Connect** > **Drivers** > **Node.js** and copy the connection string.
6. Paste the string into your `.env` as `MONGODB_URI`, replacing `<password>` with your database user password:
   ```env
   MONGODB_URI=mongodb+srv://hoteladmin:MyPassword123@cluster0.abcde.mongodb.net/hotelpro?retryWrites=true&w=majority
   ```
7. Restart the server (`npm run dev`). HotelPro will connect to MongoDB Atlas and automatically seed your initial rooms and collections.

---

## 🚢 How to Deploy to GitHub & the Cloud

### Pushing to GitHub
```bash
git init
git add .
git commit -m "Initial commit: HotelPro MERN stack hotel booking application"
git branch -M main
git remote add origin https://github.com/your-username/hotelpro.git
git push -u origin main
```

### Deploying to Render / Railway / Cloud Run
1. Go to [Render.com](https://render.com) or [Railway.app](https://railway.app).
2. Create a new **Web Service** connected to your GitHub repository.
3. Configure the build parameters:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `MONGODB_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (A secure random string)
   - `NODE_ENV`: `production`
5. Click **Deploy**. Your live hotel booking application will be active with a public URL!

---

## 📡 REST API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` – Register a new user account.
- `POST /api/auth/login` – Authenticate user and receive a 7-day JWT token.
- `POST /api/auth/demo-login` – 1-click test login for guest or admin.
- `GET /api/auth/me` – Retrieve currently authenticated user profile (Bearer token required).

### Rooms (`/api/rooms`)
- `GET /api/rooms` – Fetch all rooms with query filters (`search`, `type`, `minPrice`, `maxPrice`, `guests`, `amenity`, `checkIn`, `checkOut`, `sort`).
- `GET /api/rooms/:id` – Fetch room details and date availability.
- `POST /api/rooms` – Create new room (Admin only).
- `PUT /api/rooms/:id` – Update existing room (Admin only).
- `DELETE /api/rooms/:id` – Remove room from inventory (Admin only).
- `PATCH /api/rooms/:id/toggle` – Toggle room availability (Admin only).

### Bookings (`/api/bookings`)
- `POST /api/bookings` – Reserve a room with date validation, conflict checking, and price calculation.
- `GET /api/bookings/my` – Retrieve logged-in user's reservations.
- `GET /api/bookings/:id` – View specific booking voucher.
- `PATCH /api/bookings/:id/cancel` – Cancel an existing booking.
- `GET /api/bookings/admin/all` – Fetch all hotel bookings with search & status filters (Admin only).
- `PATCH /api/bookings/admin/:id/status` – Update booking status (Admin only).

### Admin & System (`/api/admin` & `/api/system`)
- `GET /api/admin/stats` – Property performance metrics, occupancy, and revenue.
- `GET /api/admin/users` – List registered user accounts.
- `PATCH /api/admin/users/:id/role` – Change user role (`user` / `admin`).
- `POST /api/admin/seed-reset` – Reset inventory to initial demo suites.
- `GET /api/system/status` – Live database health and connection diagnostics.

---

## 📄 License
This project is open-source under the MIT License.
