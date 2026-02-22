/**
 * Role-based access for Pharmacy Management App
 *
 * Access matrix:
 *
 * | Resource           | admin | pharmacist | cashier |
 * |--------------------|-------|------------|---------|
 * | Medicines (list)   | ✓     | ✓          | ✓       |
 * | Medicines (CRUD)   | ✓     | ✓          | ✗       |
 * | Suppliers          | ✓     | ✓          | ✗       |
 * | Create purchase    | ✓     | ✓          | ✗       |
 * | Create sale        | ✓     | ✓          | ✓       |
 * | Reports            | ✓     | ✓          | ✓       |
 * | Search medicines   | ✓     | ✓          | ✓       |
 * | Manage users       | ✓     | ✗          | ✗       |
 * | View all logs      | ✓     | ✗          | ✗       |
 */
export const ROLES = Object.freeze({
  ADMIN: "admin",
  PHARMACIST: "pharmacist",
  CASHIER: "cashier",
});

/** Who can manage medicines (add, edit, delete) */
export const CAN_MANAGE_MEDICINES = [ROLES.ADMIN, ROLES.PHARMACIST];

/** Who can view medicines (list, get by id) */
export const CAN_VIEW_MEDICINES = [
  ROLES.ADMIN,
  ROLES.PHARMACIST,
  ROLES.CASHIER,
];

/** Who can manage suppliers (full CRUD) */
export const CAN_MANAGE_SUPPLIERS = [ROLES.ADMIN, ROLES.PHARMACIST];

/** Who can create purchases */
export const CAN_CREATE_PURCHASE = [ROLES.ADMIN, ROLES.PHARMACIST];

/** Who can create sales */
export const CAN_CREATE_SALE = [ROLES.ADMIN, ROLES.PHARMACIST, ROLES.CASHIER];

/** Who can view reports (low stock, expired, near expiry) */
export const CAN_VIEW_REPORTS = [ROLES.ADMIN, ROLES.PHARMACIST, ROLES.CASHIER];

/** Who can search medicines */
export const CAN_SEARCH_MEDICINES = [
  ROLES.ADMIN,
  ROLES.PHARMACIST,
  ROLES.CASHIER,
];
