# 💊 Pharmacy Management System

A production-ready REST API for managing pharmacy operations, built with **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**.

The system provides secure authentication, inventory management, purchase and sales workflows, supplier management, reporting, and semantic medicine search while following clean architecture principles and role-based access control.

---

## ✨ Features

- 🔐 JWT Authentication with Refresh Tokens
- 👥 Role-Based Access Control (Admin, Pharmacist, Cashier)
- 💊 Medicine & Supplier Management
- 📦 Batch-Based Inventory Tracking
- 🔄 FIFO Stock Management
- 🛒 Purchase Management
- 💰 Sales Processing
- 📊 Inventory & Expiry Reports
- 🔍 Semantic Medicine Search using pgvector
- ✉️ Email Verification
- 🛡️ Secure Password Hashing & HTTP-only Cookies

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt

### Database

- PostgreSQL
- pgvector

### AI & Search

- Supabase Edge Functions
- Vector Embeddings

### Security

- Helmet
- CORS
- HTTP-only Cookies

---

## 📁 Project Structure

```text
src/
 ├── controllers/
 ├── routes/
 ├── middlewares/
 ├── services/
 ├── lib/
 ├── utils/
 └── errors/

prisma/
 ├── schema.prisma
 └── migrations/
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd pharmacy-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file.

```env
DIRECT_URL=
JWT_SECRET=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start the application

```bash
npm start
```

---

## 🔌 API Modules

| Module | Description |
|---------|-------------|
| Authentication | User authentication & email verification |
| Medicines | CRUD operations for medicines |
| Suppliers | Supplier management |
| Purchases | Purchase orders & inventory updates |
| Sales | Sales transactions & stock deduction |
| Reports | Low stock, expired & near expiry reports |
| Search | Semantic medicine search |

---

## 🔐 Authentication

The API supports JWT authentication using secure HTTP-only cookies.

- Access Token (15 minutes)
- Refresh Token (7 days)

Authorization Header is also supported.

```http
Authorization: Bearer <token>
```

---

## 📊 Core Business Logic

### Inventory

- Batch-based stock management
- FIFO batch selection
- Automatic quantity updates
- Expiry validation

### Sales

- Prevent selling expired medicines
- Validate stock availability
- Atomic database transactions

### Purchases

- Automatic batch creation
- Purchase history tracking
- Supplier integration

---

## 🧪 Testing

The project includes automated API and business logic tests using **Jest** and **Supertest**.

Run all tests:

```bash
npm test
```


## 🔒 Security

- JWT Authentication
- Refresh Tokens
- HTTP-only Cookies
- Password Hashing (bcrypt)
- Helmet Security Headers
- CORS Protection
- Prisma SQL Injection Protection
- Input Validation

---

## 📜 Available Scripts

```bash
npm start
npm test
npm run seed
npx prisma studio
npx prisma generate
npx prisma migrate dev
```

---

## 🚀 Deployment

Production deployment requires:

- PostgreSQL Database
- Environment Variables
- Prisma Client Generation
- Database Migration

```bash
npx prisma generate
npx prisma migrate deploy
npm start
```

