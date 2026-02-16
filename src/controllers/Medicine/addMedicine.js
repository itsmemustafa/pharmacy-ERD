import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../../errors/index.js";
import prisma from "../../lib/prisma.js";

const addMedicine=async(req,res)=>{
const {name,generic_name,price_sell,min_quantity}=req.body;

if(!name||!generic_name||!price_sell||!min_quantity)
{
    throw new CustomAPIError("Missing information", StatusCodes.BAD_REQUEST);
}

const Medicine= await prisma.Medicine.create({data:{
name,
generic_name,
price_sell:Number(price_sell),
min_quantity:Number(min_quantity)
}})

res.status(StatusCodes.CREATED).json({data:Medicine});


}
export default addMedicine;