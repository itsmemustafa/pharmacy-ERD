import jwt from "jsonwebtoken"
import env from "dotenv"
env.config()

const token=async(name,email)=>
{
const token=jwt.sign({name,email}
    , process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME })
    return token;
}
export default token;
