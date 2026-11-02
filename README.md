# Automated Poultry Farm Management System (APFMS)

> Final-Year Computer Science Project — Full-Stack Web Application

A complete, functional, and responsive **Automated Poultry Farm Management System** built with **Node.js, Express.js, Supabase PostgreSQL, HTML5, CSS3, and Vanilla JavaScript**.

---

## 🐔 System Overview

APFMS replaces manual farm record keeping with a digital web platform enabling:

- **Administrators, Managers, Workers, and Finance Officers** to log and monitor all poultry operations
- Real-time dashboard with KPI metrics and Chart.js visualizations
- Full CRUD operations across 20+ farm modules
- Automated calculations: Bird population, mortality rate %, marketable eggs, net profit
- Role-Based Access Control (RBAC) with JWT authentication
- Nigerian Naira (₦) financial calculations
- Offline-capable local in-memory database (zero setup for demo)
- Supabase PostgreSQL cloud database (production-ready)

---

## 🚀 Quick Start

### 1. Install Node.js Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and edit with your Supabase credentials:

```bash
copy .env.example .env
```

If you do **not** have Supabase credentials yet, the system automatically uses its built-in **embedded local data store** — no database setup required.

### 3. Start the Development Server

```bash
cd backend
npm start
```

### 4. Open in Browser

```
http://localhost:5000
```

The frontend is served automatically from the `frontend/` folder.

---

## 🔐 Demo User Accounts

All demo accounts use the password: **`Password123!`**

| Role | Email | Access Level |
|---|---|---|
| **Administrator** | admin@farm.com | Full system access |
| **Farm Manager** | manager@farm.com | Farm operations + reporting |
| **Farm Worker** | worker@farm.com | Daily logs (mortality, eggs, feed) |
| **Finance Officer** | finance@farm.com | Sales, expenses, financial reports |

---

## 📁 Project Structure

```
poultry-farm-management/
│
├── frontend/              ← HTML5 / CSS3 / JavaScript UI
│   ├── index.html         ← Public landing page
│   ├── login.html         ← User authentication
│   ├── dashboard.html     ← Main control panel
│   ├── flocks.html        ← Flock/batch management
│   ├── houses.html        ← Poultry house management
│   ├── activities.html    ← Daily farm activity log
│   ├── mortality.html     ← Bird mortality tracking
│   ├── eggs.html          ← Egg production records
│   ├── feed.html          ← Feed inventory & usage
│   ├── medications.html   ← Medication management
│   ├── vaccinations.html  ← Vaccination schedules
│   ├── inventory.html     ← General inventory
│   ├── equipment.html     ← Equipment assets
│   ├── customers.html     ← Customer management
│   ├── suppliers.html     ← Supplier directory
│   ├── sales.html         ← Bird & egg sales
│   ├── expenses.html      ← Farm expense tracking
│   ├── reports.html       ← Reports & CSV export
│   ├── notifications.html ← System alert feed
│   ├── users.html         ← Admin: User management
│   ├── profile.html       ← User profile
│   ├── css/
│   │   ├── style.css      ← Core design system
│   │   ├── dashboard.css  ← Dashboard & KPI charts
│   │   └── responsive.css ← Mobile responsiveness
│   └── js/
│       ├── config.js      ← API base URL
│       ├── auth.js        ← JWT authentication helper
│       ├── main.js        ← Global UI helpers
│       └── dashboard.js   ← Chart.js visualizations
│
├── backend/               ← Node.js + Express REST API
│   ├── server.js          ← Express application entry
│   ├── package.json
│   ├── .env               ← Environment variables (not committed)
│   ├── .env.example       ← Template for environment setup
│   ├── config/
│   │   └── supabase.js    ← Database client + embedded mock DB
│   ├── middleware/
│   │   ├── auth.js        ← JWT verification
│   │   ├── role.js        ← Role-based authorization
│   │   └── errorHandler.js
│   ├── controllers/       ← Business logic per module
│   ├── routes/            ← REST endpoint definitions
│   └── tests/
│       └── run_tests.js   ← Automated unit tests
│
├── database/
│   ├── schema.sql         ← PostgreSQL DDL (tables, constraints, indexes)
│   ├── policies.sql       ← Supabase Row Level Security policies
│   └── seed.sql           ← Nigerian farm demo data
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. In the **SQL Editor**, run:
   - `database/schema.sql` — Creates all tables
   - `database/policies.sql` — Applies Row Level Security
   - `database/seed.sql` — Inserts realistic demo data
3. Copy your project URL and API keys to `.env`

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

Verifies: bcrypt hashing, JWT auth, mortality rate %, marketable eggs formula, net profit calculation, and flock population arithmetic.

---

## 📊 Key Features

| Module | Features |
|---|---|
| **Dashboard** | 9 KPI cards, 4 Chart.js charts (line, bar, doughnut, grouped bar) |
| **Flock Management** | Auto age calculation, population formula |
| **Mortality Tracking** | Rate %, cause of death, cumulative logs |
| **Egg Production** | Marketable eggs = Total − (Broken + Damaged) |
| **Feed Inventory** | Auto stock deduction, low-stock alerts |
| **Financial** | Net Profit = Revenue − Expenses in ₦ |
| **Reports** | 6 report types with CSV export and print |

---

## 🏫 Academic Information

> **Project Type:** Undergraduate Computer Science Final-Year Project  
> **Technology Stack:** HTML5, CSS3, Vanilla JavaScript, Node.js, Express.js, Supabase PostgreSQL  
> **Paradigm:** RESTful API, MVC Architecture, Role-Based Access Control  
> **Currency:** Nigerian Naira (₦)
