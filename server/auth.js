const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = (request, response, next) => {
    try {
        // Check if the Authorization header is present
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            return response.status(401).json({
                error: new Error("Authorization header missing!")
            });
        }

        // Extract the token from the Authorization header (Bearer <token>)
        const token = authorizationHeader.split(" ")[1];
        if (!token) {
            return response.status(401).json({
                error: new Error("Token missing!")
            });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "RANDOM-TOKEN");

        // Attach the user data to the request object
        request.user = decodedToken;

        // Proceed to the next middleware or endpoint
        next();
    } catch (error) {
        console.error("Authorization error:", error); // Log the error for debugging purposes
        return response.status(401).json({
            error: new Error("Invalid or expired token!")
        });
    }
};
