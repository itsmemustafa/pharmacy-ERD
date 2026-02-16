import {CustomAPIError} from "../../errors/index.js";
import prisma from "../../lib/prisma.js";
import { StatusCodes } from "http-status-codes";

const AddSupplier = async (req, res) => {
  const { name, phone, email, address } = req.body;

  if (!name || !phone || !email || !address) {
    throw new CustomAPIError("Missing information", StatusCodes.BAD_REQUEST);
  }

  const supplier = await prisma.supplier.create({
    data: {
      name,
      phone,
      email,
      address,
    },
  });

  res.status(StatusCodes.CREATED).json({
    msg: "supplier added successfully",
    data:supplier,
  });
};
export default AddSupplier;
