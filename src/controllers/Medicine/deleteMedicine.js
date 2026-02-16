import prisma from "../../lib/prisma.js";
import { CustomAPIError } from "../../errors/index.js";
import { StatusCodes } from "http-status-codes";
const deleteMedicine=async(req,res)=>
{
const {id}=req.params;

const existingMedicine= await prisma.medicine.findUnique({where:{id:Number(id)}});

if(!existingMedicine)
{
    throw new CustomAPIError(
        "Can't find medicine with this id",
        StatusCodes.NOT_FOUND, )
}
await prisma.medicine.delete({where:{id:Number(id)}});

res.status(StatusCodes.OK).json({msg:"medicine deleted successfully "})


}
export default deleteMedicine