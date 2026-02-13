import jwt from "jsonwebtoken"
import env from "dotenv"
env.config()

const token=async(userId,name,email,role)=>
{
const token=jwt.sign({userId,name,email,role}
    , process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME })
    return token;
}
export default token;
