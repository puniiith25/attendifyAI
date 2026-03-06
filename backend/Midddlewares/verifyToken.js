import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {

        let token;

        // Check Authorization Header
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        //  Check Cookie
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        // If no token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required"
            });
        }

        //  Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //  Attach user data
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }
};
export const authorizeRole = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource"
            });
        }

        next();
    };
};