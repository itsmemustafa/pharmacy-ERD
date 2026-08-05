import jwt from "jsonwebtoken";

const signJwt = (userId, name, email, role) => {
  const token = jwt.sign(
    { id: userId, name, email, role }, 
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME },
  );
  return token;
};

export default signJwt;
