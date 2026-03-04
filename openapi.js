export const openApiDocument = {
  openapi: "3.0.0",
  info: {
    title: "Management API",
    version: "1.0.0",
    description: "API documentation for the management project",
  },
  servers: [
    {
      url: "/api/v1",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterUser: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 50 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8, maxLength: 50 },
          role: {
            type: "string",
            enum: ["admin", "pharmacist", "cashier"],
          },
        },
      },
      LoginUser: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      ForgotPassword: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
      ResetPassword: {
        type: "object",
        required: ["password", "confirmPassword"],
        properties: {
          password: { type: "string", minLength: 8, maxLength: 50 },
          confirmPassword: { type: "string", minLength: 8, maxLength: 50 },
        },
      },
      MedicineCreate: {
        type: "object",
        required: ["name", "generic_name", "price_sell", "min_quantity"],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 100 },
          generic_name: { type: "string", minLength: 3, maxLength: 100 },
          price_sell: { type: "number", minimum: 0 },
          min_quantity: { type: "integer", minimum: 0 },
          requires_prescription: { type: "boolean" },
        },
      },
      MedicineUpdate: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 3, maxLength: 100 },
          generic_name: { type: "string", minLength: 3, maxLength: 100 },
          price_sell: { type: "number", minimum: 0 },
          min_quantity: { type: "integer", minimum: 0 },
          requires_prescription: { type: "boolean" },
        },
      },
      SupplierCreate: {
        type: "object",
        required: ["name", "phone", "email", "address"],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 100 },
          phone: { type: "string", minLength: 5, maxLength: 30 },
          email: { type: "string", format: "email" },
          address: { type: "string", minLength: 3, maxLength: 200 },
        },
      },
      SupplierUpdate: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 3, maxLength: 100 },
          phone: { type: "string", minLength: 5, maxLength: 30 },
          email: { type: "string", format: "email" },
          address: { type: "string", minLength: 3, maxLength: 200 },
        },
      },
      PurchaseCreate: {
        type: "object",
        required: ["supplier_id", "items"],
        properties: {
          supplier_id: { type: "integer", minimum: 1 },
          items: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: [
                "medicine_id",
                "batch_number",
                "quantity",
                "unit_price",
                "expiry_Date",
              ],
              properties: {
                medicine_id: { type: "integer", minimum: 1 },
                batch_number: { type: "string", minLength: 1 },
                quantity: { type: "integer", minimum: 1 },
                unit_price: { type: "number", minimum: 0 },
                expiry_Date: { type: "string", minLength: 4 },
              },
            },
          },
        },
      },
      SaleCreate: {
        type: "object",
        required: ["items"],
        properties: {
          payment_method: {
            type: "string",
            enum: ["cash", "credit_card", "debit_card", "insurance"],
            default: "cash",
          },
          items: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["medicine_id", "quantity", "unit_price"],
              properties: {
                medicine_id: { type: "integer", minimum: 1 },
                quantity: { type: "integer", minimum: 1 },
                unit_price: { type: "number", minimum: 0 },
              },
            },
          },
        },
      },
      SearchQuery: {
        type: "object",
        required: ["query"],
        properties: {
          query: { type: "string", minLength: 1 },
        },
      },
    },
  },
  paths: {
    "/auth/sign-up": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterUser",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginUser",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Logged in successfully",
          },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Send password reset email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ForgotPassword",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password reset email sent",
          },
        },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset user password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResetPassword",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password reset successfully",
          },
        },
      },
    },
    "/medicine": {
      get: {
        tags: ["Medicines"],
        summary: "Get all medicines",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of medicines",
          },
        },
      },
      post: {
        tags: ["Medicines"],
        summary: "Create a medicine",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MedicineCreate",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Medicine created",
          },
        },
      },
    },
    "/medicine/{id}": {
      patch: {
        tags: ["Medicines"],
        summary: "Update a medicine",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MedicineUpdate",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Medicine updated",
          },
        },
      },
    },
    "/suppliers": {
      get: {
        tags: ["Suppliers"],
        summary: "Get all suppliers",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of suppliers",
          },
        },
      },
      post: {
        tags: ["Suppliers"],
        summary: "Create a supplier",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SupplierCreate",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Supplier created",
          },
        },
      },
    },
    "/suppliers/{id}": {
      get: {
        tags: ["Suppliers"],
        summary: "Get supplier by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Supplier data",
          },
          404: {
            description: "Supplier not found",
          },
        },
      },
      patch: {
        tags: ["Suppliers"],
        summary: "Update a supplier",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SupplierUpdate",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Supplier updated",
          },
        },
      },
      delete: {
        tags: ["Suppliers"],
        summary: "Delete a supplier",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          204: {
            description: "Supplier deleted",
          },
        },
      },
    },
    "/purchase": {
      post: {
        tags: ["Purchases"],
        summary: "Create a purchase",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PurchaseCreate",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Purchase created",
          },
        },
      },
    },
    "/sale": {
      post: {
        tags: ["Sales"],
        summary: "Create a sale",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SaleCreate",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Sale created",
          },
        },
      },
    },
    "/reports/low_quantity": {
      get: {
        tags: ["Reports"],
        summary: "Get low stock report",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Low stock items",
          },
        },
      },
    },
    "/reports/expired": {
      get: {
        tags: ["Reports"],
        summary: "Get expired medicines report",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Expired medicines",
          },
        },
      },
    },
    "/reports/nearExpiry": {
      get: {
        tags: ["Reports"],
        summary: "Get near expiry medicines report",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Near expiry medicines",
          },
        },
      },
    },
    "/search": {
      get: {
        tags: ["Search"],
        summary: "Search medicines",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "query",
            required: true,
            schema: { type: "string" },
            description: "Search query text",
          },
        ],
        responses: {
          200: {
            description: "Search results",
          },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users (admin only)",
        description:
          "Returns a paginated list of users. Only administrators can access this endpoint.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1 },
            description: "Page number (default: 1)",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1, maximum: 100 },
            description: "Page size (default: 10)",
          },
          {
            in: "query",
            name: "role",
            schema: {
              type: "string",
              enum: ["admin", "pharmacist", "cashier"],
            },
            description: "Filter by role",
          },
          {
            in: "query",
            name: "email",
            schema: { type: "string", format: "email" },
            description: "Filter by partial email match",
          },
          {
            in: "query",
            name: "name",
            schema: { type: "string" },
            description: "Filter by partial name match",
          },
          {
            in: "query",
            name: "isActive",
            schema: { type: "boolean" },
            description: "Filter by active status",
          },
        ],
        responses: {
          200: {
            description: "List of users",
          },
          403: {
            description: "Forbidden - admin only",
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "User data",
          },
          404: {
            description: "User not found",
          },
          403: {
            description: "Forbidden - admin only",
          },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update a user (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AdminUpdateUser",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User updated",
          },
          404: {
            description: "User not found",
          },
          403: {
            description: "Forbidden - admin only",
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Deactivate a user (admin only)",
        description:
          "Soft-deactivates a user account by setting isActive to false and revoking refresh tokens.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "User deactivated",
          },
          404: {
            description: "User not found",
          },
          403: {
            description: "Forbidden - admin only",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      RegisterUser: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 50 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8, maxLength: 50 },
          role: {
            type: "string",
            enum: ["admin", "pharmacist", "cashier"],
          },
        },
      },
      LoginUser: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      ForgotPassword: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
      ResetPassword: {
        type: "object",
        required: ["password", "confirmPassword"],
        properties: {
          password: { type: "string", minLength: 8, maxLength: 50 },
          confirmPassword: { type: "string", minLength: 8, maxLength: 50 },
        },
      },
      MedicineCreate: {
        type: "object",
        required: ["name", "generic_name", "price_sell", "min_quantity"],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 100 },
          generic_name: { type: "string", minLength: 3, maxLength: 100 },
          price_sell: { type: "number", minimum: 0 },
          min_quantity: { type: "integer", minimum: 0 },
          requires_prescription: { type: "boolean" },
        },
      },
      MedicineUpdate: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 3, maxLength: 100 },
          generic_name: { type: "string", minLength: 3, maxLength: 100 },
          price_sell: { type: "number", minimum: 0 },
          min_quantity: { type: "integer", minimum: 0 },
          requires_prescription: { type: "boolean" },
        },
      },
      SupplierCreate: {
        type: "object",
        required: ["name", "phone", "email", "address"],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 100 },
          phone: { type: "string", minLength: 5, maxLength: 30 },
          email: { type: "string", format: "email" },
          address: { type: "string", minLength: 3, maxLength: 200 },
        },
      },
      SupplierUpdate: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 3, maxLength: 100 },
          phone: { type: "string", minLength: 5, maxLength: 30 },
          email: { type: "string", format: "email" },
          address: { type: "string", minLength: 3, maxLength: 200 },
        },
      },
      PurchaseCreate: {
        type: "object",
        required: ["supplier_id", "items"],
        properties: {
          supplier_id: { type: "integer", minimum: 1 },
          items: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: [
                "medicine_id",
                "batch_number",
                "quantity",
                "unit_price",
                "expiry_Date",
              ],
              properties: {
                medicine_id: { type: "integer", minimum: 1 },
                batch_number: { type: "string", minLength: 1 },
                quantity: { type: "integer", minimum: 1 },
                unit_price: { type: "number", minimum: 0 },
                expiry_Date: { type: "string", minLength: 4 },
              },
            },
          },
        },
      },
      SaleCreate: {
        type: "object",
        required: ["items"],
        properties: {
          payment_method: {
            type: "string",
            enum: ["cash", "credit_card", "debit_card", "insurance"],
            default: "cash",
          },
          items: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["medicine_id", "quantity", "unit_price"],
              properties: {
                medicine_id: { type: "integer", minimum: 1 },
                quantity: { type: "integer", minimum: 1 },
                unit_price: { type: "number", minimum: 0 },
              },
            },
          },
        },
      },
      SearchQuery: {
        type: "object",
        required: ["query"],
        properties: {
          query: { type: "string", minLength: 1 },
        },
      },
      UserSummary: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: {
            type: "string",
            enum: ["admin", "pharmacist", "cashier"],
          },
          isVerified: { type: "boolean" },
          isActive: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      AdminUpdateUser: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 3, maxLength: 50 },
          email: { type: "string", format: "email" },
          role: {
            type: "string",
            enum: ["admin", "pharmacist", "cashier"],
          },
          isVerified: { type: "boolean" },
          isActive: { type: "boolean" },
        },
      },
    },
  },
};
