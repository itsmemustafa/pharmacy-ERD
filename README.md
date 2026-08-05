# Pharmacy Management System

A comprehensive REST API for managing pharmacy operations including medicine inventory, suppliers, purchases, and sales. Built with Node.js, Express, and PostgreSQL using Prisma ORM.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Email verification system
  - Role-based access control
  - Secure password hashing with bcrypt

- **Medicine Management**
  - CRUD operations for medicines
  - Track generic names, selling prices, and minimum quantities
  - Prescription requirement tracking

- **Supplier Management**
  - Complete supplier CRUD operations
  - Track supplier contact information

- **Inventory Management**
  - Batch-based inventory tracking
  - FIFO (First In First Out) batch selection
  - Expiry date tracking
  - Automatic stock level management

- **Daily Reports**
  - Low-stock medicines based on configurable `min_quantity`
  - Near-expiry and expired batches

- **Semantic Search**
  - Vector-based search over medicine names and generic names
  - pgvector in PostgreSQL with embeddings generated via Supabase Edge Function

- **Purchase Management**
  - Create purchase orders from suppliers
  - Automatic batch creation
  - Track purchase history

- **Sales Management**
  - Process sales transactions
  - Automatic stock deduction
  - Multiple payment methods support
  - Prevents selling expired medicines
  - Stock availability validation

- **Role-Based Access Control (RBAC)**
  - Roles: **admin**, **pharmacist**, **cashier**
  - Admin: full access to inventory, suppliers, purchases, sales, reports
  - Pharmacist: manage medicines/suppliers, create purchases & sales, view reports
  - Cashier: create sales, view medicines and reports

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd managment-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   # Database
   DIRECT_URL=postgresql://username:password@localhost:5432/pharmacy_db

   # Server
   PORT=3000
   NODE_ENV=development

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Email Configuration (for verification emails)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password

   # Optional: Supabase semantic search
   SUPABASE_URL=
   SUPABASE_SERVICE_KEY=
   ```

   If you do not set `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`, the API will still start, but semantic search endpoints will fail if called.

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npm run seed
   ```

5. **Start the server**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 📁 Project Structure

```
managment-project/
├── src/
│   ├── controllers/       # Request handlers
│   │   ├── auth/         # Authentication controllers
│   │   ├── Medicine/     # Medicine CRUD controllers
│   │   ├── purcheses/    # Purchase controllers
│   │   ├── sale/         # Sale controllers
│   │   └── suppliers/    # Supplier controllers
│   ├── errors/           # Custom error classes
│   ├── lib/              # Database client (Prisma)
│   ├── middlewares/      # Express middlewares
│   │   ├── auth.js       # Authentication middleware
│   │   ├── autherization.js  # Role-based authorization
│   │   ├── error-handler.js  # Error handling middleware
│   │   └── not-found.js      # 404 handler
│   ├── routes/           # API routes
│   ├── services/         # Business logic layer
│   └── utils/            # Utility functions
│       ├── email.js              # Email sending utilities
│       ├── fulfillFromBatches.js # Batch fulfillment logic
│       ├── jwt-sign.js           # JWT token generation
│       └── refresh-token.js      # Refresh token generation
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── generated/            # Generated Prisma Client
├── app.js               # Application entry point
├── seed.js              # Database seeding script
└── package.json         # Project dependencies
```

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint        | Description          | Auth Required |
| ------ | --------------- | -------------------- | ------------- |
| POST   | `/sign-up`      | Register a new user  | No            |
| POST   | `/login`        | Login user           | No            |
| POST   | `/logout`       | Logout user          | Yes           |
| GET    | `/verify-email` | Verify email address | No            |

### Suppliers (`/api/v1/suppliers`)

| Method | Endpoint | Description           | Auth Required |
| ------ | -------- | --------------------- | ------------- |
| GET    | `/`      | Get all suppliers     | Yes           |
| POST   | `/`      | Create a new supplier | Yes           |
| GET    | `/:id`   | Get supplier by ID    | Yes           |
| PATCH  | `/:id`   | Update supplier       | Yes           |
| DELETE | `/:id`   | Delete supplier       | Yes           |

### Medicines (`/api/v1/medicine`)

| Method | Endpoint | Description           | Auth Required |
| ------ | -------- | --------------------- | ------------- |
| GET    | `/`      | Get all medicines     | Yes           |
| POST   | `/`      | Create a new medicine | Yes           |
| GET    | `/:id`   | Get medicine by ID    | Yes           |
| PATCH  | `/:id`   | Update medicine       | Yes           |
| DELETE | `/:id`   | Delete medicine       | Yes           |

### Purchases (`/api/v1/purchase`)

| Method | Endpoint | Description             | Auth Required |
| ------ | -------- | ----------------------- | ------------- |
| POST   | `/`      | Create a purchase order | Yes           |

**Request Body:**

```json
{
  "supplier_id": 1,
  "items": [
    {
      "medicine_id": 1,
      "batch_number": "BATCH001",
      "quantity": 100,
      "unit_price": 10.5,
      "expiry_Date": "2025-12-31T00:00:00.000Z"
    }
  ]
}
```

### Sales (`/api/v1/sale`)

| Method | Endpoint | Description    | Auth Required |
| ------ | -------- | -------------- | ------------- |
| POST   | `/`      | Process a sale | Yes           |

**Request Body:**

```json
{
  "payment_method": "cash",
  "items": [
    {
      "medicine_id": 1,
      "quantity": 5,
      "unit_price": 15.0
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "total_amount": 75.0,
    "payment_method": "cash",
    "created_at": "2025-02-20T10:00:00.000Z"
  }
}
```

### Reports (`/api/v1/reports`)

| Method | Endpoint        | Description                                                  | Auth Required (Role)             |
| ------ | --------------- | ------------------------------------------------------------ | -------------------------------- |
| GET    | `/low_quantity` | List medicines where available stock is below `min_quantity` | Yes (admin, pharmacist, cashier) |
| GET    | `/expired`      | List fully expired medicine batches                          | Yes (admin, pharmacist, cashier) |
| GET    | `/nearExpiry`   | List batches that are close to expiring                      | Yes (admin, pharmacist, cashier) |

### Search (`/api/v1/search`)

| Method | Endpoint | Description                                            | Auth Required (Role)             |
| ------ | -------- | ------------------------------------------------------ | -------------------------------- |
| GET    | `/`      | Semantic search over medicines using vector similarity | Yes (admin, pharmacist, cashier) |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login, the access token is stored in an HTTP-only cookie.

### Using Authentication

**Option 1: Cookie-based (Recommended)**

- Cookies are automatically sent with requests
- Access token: `accessToken` cookie
- Refresh token: `refreshToken` cookie

**Option 2: Authorization Header**

```http
Authorization: Bearer <access_token>
```

### Token Expiration

- Access Token: 15 minutes
- Refresh Token: 7 days

## 📊 Database Schema

### Key Models

- **User**: System users with authentication
- **Medicine**: Medicine catalog with pricing and prescription requirements
- **Supplier**: Supplier information
- **MEDICINE_BATCHES**: Inventory batches with expiry dates
- **PURCHASES**: Purchase orders from suppliers
- **PURCHASE_ITEMS**: Items in purchase orders
- **SALE**: Sales transactions
- **SALE_ITEMS**: Items in sales transactions
- **Token**: Refresh tokens for users

### Relationships

- Users can create purchases and sales
- Medicines have multiple batches
- Batches belong to suppliers
- Sales and purchases reference batches for inventory tracking

## 🔄 Business Logic

### Purchase Flow

1. User creates a purchase order with items
2. System creates medicine batches for each item
3. Purchase items are linked to batches
4. Inventory is automatically updated

### Sale Flow

1. User creates a sale with items
2. System validates:
   - Medicine exists
   - Sufficient stock available
   - No expired batches
3. System uses FIFO (First In First Out) to select batches
4. Stock is deducted from batches
5. Sale items are created with batch references
6. Transaction is committed atomically

### Inventory Management

- Batches are ordered by expiry date (FIFO)
- Only non-expired batches are used for sales
- Stock levels are checked before fulfillment
- Concurrent sales are handled safely with database transactions

## 🧪 Testing

Currently, no test suite is configured. To add tests:

```bash
npm install --save-dev jest supertest
```

## 🐛 Error Handling

The API uses custom error classes:

- `CustomAPIError`: Base error class
- `BadRequestError`: 400 Bad Request
- `UnauthenticatedError`: 401 Unauthorized
- `NotFoundError`: 404 Not Found

All errors are handled by the error handler middleware and return consistent JSON responses:

```json
{
  "msg": "Error message",
  "statusCode": 400
}
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **bcrypt**: Password hashing
- **JWT**: Secure token-based authentication
- **HTTP-only cookies**: Prevents XSS attacks
- **Input validation**: Prevents invalid data
- **SQL injection protection**: Prisma ORM handles parameterized queries

## 📝 Environment Variables

| Variable         | Description                          | Required                     |
| ---------------- | ------------------------------------ | ---------------------------- |
| `DIRECT_URL`     | PostgreSQL connection string         | Yes                          |
| `PORT`           | Server port                          | No (default: 3000)           |
| `NODE_ENV`       | Environment (development/production) | No                           |
| `JWT_SECRET`     | Secret key for JWT signing           | Yes                          |
| `EMAIL_HOST`     | SMTP server host                     | Yes (for email verification) |
| `EMAIL_PORT`     | SMTP server port                     | Yes                          |
| `EMAIL_USER`     | Email account username               | Yes                          |
| `EMAIL_PASSWORD` | Email account password/app password  | Yes                          |

## 🚀 Deployment

1. **Set production environment variables**
2. **Build Prisma Client**
   ```bash
   npx prisma generate
   ```
3. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```
4. **Start the server**
   ```bash
   npm start
   ```

## 📚 Scripts

- `npm start`: Start the development server with nodemon
- `npm run seed`: Seed the database with sample data
- `npx prisma generate`: Generate Prisma Client
- `npx prisma migrate dev`: Create and apply migrations
- `npx prisma studio`: Open Prisma Studio (database GUI)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- Express.js community
- Prisma team
- All contributors

---

**Note**: Make sure to update the JWT_SECRET and other sensitive values in production environments. Never commit `.env` files to version control.
