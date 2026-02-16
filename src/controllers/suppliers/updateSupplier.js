import prisma from "../../lib/prisma.js";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../../errors/index.js";
const updateSupplier = async (req, res) => {
  const { id } = req.params;

  const existingSupplier = await prisma.supplier.findUnique({
    where: { id: Number(id) },
  });
  if (!existingSupplier) {
    throw new CustomAPIError(
      "can't find Supplier with this id",
      StatusCodes.NOT_FOUND,
    );
  }

  const updatedSupplier = await prisma.supplier.update({
    where: { id: Number(id) },
    data: { ...req.body },
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "supplier updated successfully ", data: updateSupplier });
};
export default updateSupplier;
