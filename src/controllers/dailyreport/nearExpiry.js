import prisma from "../../lib/prisma.js";
import { StatusCodes } from "http-status-codes";

const nearExpiry = async (req, res) => {
  const now = new Date();
  const plus7Days  = new Date(Date.now() + 7  * 24 * 60 * 60 * 1000);
  const plus30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const plus90Days = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  const medicines = await prisma.mEDICINE_BATCHES.findMany({
    where: { expiry_Date: { lte: plus90Days } },
    orderBy: { expiry_Date: "asc" },
    include: {
      medicine: { select: { name: true, generic_name: true } },
    },
  });

  const medicinesWithTag = medicines.map((item) => {
    const daysLeft = Math.ceil((item.expiry_Date - now) / (1000 * 60 * 60 * 24));
    return {
    ...item,
    daysLeft: daysLeft < 0 ? 0 : daysLeft,
    status:
      item.expiry_Date < now         ? "expired"        :
      item.expiry_Date <= plus7Days  ? "critical"       :
      item.expiry_Date <= plus30Days ? "actionRequired" :
                                       "expiringSoon",
    };
  });

  res.status(StatusCodes.OK).json({ medicines: medicinesWithTag });
};

export default nearExpiry;