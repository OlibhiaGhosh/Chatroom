import { verifyAccessToken } from "../utils/jwt_auth";
const dotenv = require("dotenv");
dotenv.config();

async function authMiddleware(req: any, res: any, next: any) {
  console.log("🔐 authMiddleware hit!");
  console.log("   req.cookies =", req.cookies);
  console.log("   accessToken =", req.cookies.accessToken);
  try {
    console.log("authMiddleware called");
    const token = req.cookies.accessToken;
    console.log("Access Token from cookies inside middleware:", token);
    if (!token) {
      throw new Error("No token provided");
    }
    const decoded = await verifyAccessToken(token);
    req.user = decoded;
    next();
    return;
  } catch (error) {
    console.error("Error in authMiddleware, access token might be expired:", error);
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      req.refreshToken = null;
      return res.status(401).json({ message: "No refresh token provided" , refreshToken: null});
    }
    req.refreshToken = refreshToken;
    console.log("refreshToken set in body:", refreshToken); 
    return res
      .status(401)
      .json({ message: "Authentication failed. Invalid or expired token.", refreshToken: refreshToken });
  }
}

export { authMiddleware };
