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
    },
  },
};
