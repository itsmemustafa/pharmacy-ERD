import prisma from "../../lib/prisma.js";
import { CustomAPIError } from "../../errors/index.js";
import { StatusCodes } from "http-status-codes";

const updateMedicine = async (req, res) => {
  const { id } = req.params;

  // Validate that there's data to update
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new CustomAPIError(
      "No data provided for update",
      StatusCodes.BAD_REQUEST
    );
  }

  const existingMedicine = await prisma.medicine.findUnique({
    where: { id: Number(id) },
  });

  if (!existingMedicine) {
    throw new CustomAPIError(
      `Can't find medicine with id ${id}`,
      StatusCodes.NOT_FOUND
    );
  }

  // Remove id from body if present to prevent updating it
  const { id: _, ...updateData } = req.body;

  const updatedMedicine = await prisma.medicine.update({
    where: { id: Number(id) },
    data: updateData,
  });

  res.status(StatusCodes.OK).json({
    msg: "Medicine updated successfully",
    medicine: updatedMedicine
  });
};

export default updateMedicine;