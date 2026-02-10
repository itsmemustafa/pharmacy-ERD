import crypto from "crypto";

const generateRefreshToken = () => {
  
  const refreshToken = crypto.randomBytes(40).toString("hex");

  
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const refreshTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;

  return {
    refreshToken,        
    hashedToken,        
    refreshTokenExpiry
  };
};

export default generateRefreshToken;
