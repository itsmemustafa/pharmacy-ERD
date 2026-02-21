import prisma from "../../lib/prisma.js";

const expired = async (req, res) => {
  const expired_batches = await prisma.mEDICINE_BATCHES.findMany({
    where: { expiry_Date: { lt: new Date() } },
  });
  res.status(200).json({ expired_batches });
};
export default expired;
