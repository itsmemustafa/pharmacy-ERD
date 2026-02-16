
import prisma from "../../lib/prisma.js";

import { CustomAPIError } from "../../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { STATUS_CODES } from "http";

const getMedicine=async(req,res)=>{
const {id}=req.params;

const medicine=await prisma.medicine.findUnique({where:{id:Number(id)}});

if(!medicine)
{
    throw new CustomAPIError(`can't find Medicine with this id ${id}`,StatusCodes.NOT_FOUND);
}

res.status(StatusCodes.OK).json({data:medicine});
}
export default getMedicine