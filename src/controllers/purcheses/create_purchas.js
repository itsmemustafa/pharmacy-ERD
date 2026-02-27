import prisma from "../../lib/prisma.js";
import purchaseTransaction from "../../services/purchaseTransaction.js";
const createPurchase = async (req, res) => {
  const user_id = req.user.id;
  const { supplier_id, items } = req.body;

  if (!supplier_id || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "supplier_id and items are required" });
  }
  const purchase = await purchaseTransaction(items, user_id, supplier_id);
  res.status(201).json(purchase);
};

export default createPurchase;
