const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

async function authMiddleware(req: any, res: any, next: any) {
  console.log("🔐 authMiddleware hit!");
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Access Token from headers inside middleware:",token);
    if (!token) {
      return res.status(401).json({ message: "No access token provided" });
    }
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err:any, decoded:any) => {
            if (err) return res.status(403).json({ message: "Invalid or expired access token" }); //invalid token
            req.user = decoded;
            console.log("Returning from auth middleware (req.user): ", req.user)
            console.log("Returning from auth middleware (decoded): ", decoded
            )
            next();
        }
    );
}

export { authMiddleware };
