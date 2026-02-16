import prisma from "../../lib/prisma.js";

import { CustomAPIError } from "../../errors/index.js";
import { StatusCodes } from "http-status-codes";

const updateMedicine = async (req, res) => {
  const { id } = req.params;

  const existingMedicine = await prisma.medicine.findUnique({
    where: { id: Number(id) },
  });

  if (!existingMedicine) {
    throw new CustomAPIError(`can't find medicine with this ${id}`);
  }

  const updateMedicine = await prisma.medicine.update({
    where: { id: Number(id) },
    data:{...req.body}
  });

  res.status(StatusCodes.OK).json({msg:"medicine Updated successfully",data:{updateMedicine}
  })
};
export default updateMedicine;
