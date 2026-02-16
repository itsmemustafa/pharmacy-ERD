import {CustomAPIError} from "../../errors/index.js";
import prisma from "../../lib/prisma.js";


  const getSupplier = async (req, res) => {
    const { id } = req.params;

    const supplier = await prisma.supplier.findUnique({
      where: { id: Number(id) },
    });

    if (!supplier) {
      throw new CustomAPIError("Supplier not found", 404);
    }

    res.status(200).json({data:supplier});
  };

export default getSupplier;