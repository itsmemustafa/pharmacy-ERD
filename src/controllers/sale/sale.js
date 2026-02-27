import processSale from "../../services/saleTransaction.js";
import { BadRequestError } from "../../errors/index.js";

const sale = async (req, res, next) => {

    const { payment_method = "cash", items } = req.body || {};
    const userId = 12;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestError("Items array is required and must not be empty");
    }

    const result = await processSale({ userId, payment_method, items });

    res.status(201).json({ success: true, data: result });

};
export default sale;
