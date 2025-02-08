import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const secureRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            console.log("No token provided");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        console.log("Decoded Token:", decoded);  // Check decoded token

        const userId = decoded.userId || decoded.id;  // Try both userId and id
        console.log("Searching for User ID in DB:", userId);  

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Invalid token structure" });
        }

        const user = await User.findById(userId).select("-password");
        console.log("User found in DB:", user);  // Check if user exists

        if (!user) {
            console.log("User not found in DB. ID:", userId);
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
export default secureRoute;
