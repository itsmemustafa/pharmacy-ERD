import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../../errors/index.js";
import prisma from "../../lib/prisma.js";

const deleteSupplier = async (req, res) => {
  const { id } = req.params;

  const existingSupplier = await prisma.supplier.findUnique({
    where: { id: Number(id) },
  });
  if (!existingSupplier) {
    throw new CustomAPIError(
      "Can't find supplier with this id",
      StatusCodes.NOT_FOUND,
    );
  }

  await prisma.supplier.delete({ where: { id: Number(id) } });

  res.status(StatusCodes.OK).json({
    msg: "Supplier deleted successfully",
  });
};

export default deleteSupplier;
