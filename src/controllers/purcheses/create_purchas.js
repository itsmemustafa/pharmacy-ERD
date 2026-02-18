import prisma from "../../lib/prisma.js";

const createPurchase = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { supplier_id, items } = req.body;

    if (!supplier_id || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "supplier_id and items are required" });
    }

    const itemsWithSubtotal = items.map((item) => ({
      ...item,
      subtotal: item.quantity * item.unit_price,
    }));

    const total_amount = itemsWithSubtotal.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    const purchase = await prisma.$transaction(async (tx) => {
      const newPurchase = await tx.pURCHASES.create({
        data: { user_id, supplier_id, total_amount },
      });

      const purchaseItems = [];

      for (const item of itemsWithSubtotal) {
        const batch = await tx.mEDICINE_BATCHES.create({
          data: {
            medicine_id: item.medicine_id,
            supplier_id,
            batch_number: item.batch_number,
            quantity: item.quantity,
            price_buy: item.unit_price,
            expiry_Date: item.expiry_Date,
          },
        });

        const purchaseItem = await tx.pURCHASE_ITEMS.create({
          data: {
            purchase_id: newPurchase.id,
            medicine_id: item.medicine_id,
            batch_id: batch.id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal,
          },
        });

        purchaseItems.push(purchaseItem);
      }

      return { ...newPurchase, items: purchaseItems };
    });

    res.status(201).json(purchase);
  } catch (error) {
    console.error("Purchase error:", error);
    res
      .status(500)
      .json({ message: "Failed to create purchase", error: error.message });
  }
};

export default createPurchase;
