const jwt = require("jsonwebtoken");

// decode the token
// JWT_AUTHENCATION middleware.
module.exports = function (req, res, next) {
    try {
        // To extract the Bearer frome the fronted browser localstorage.
        const token = req.headers.authorization.split(" ")[1];
        //To verify token, is correct or not!.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.userId;
        next();

    } catch (error) {
        console.log("Error in JWT middleware:", error);
        res.send({
            message: error.message,
            success: false,
        });
    }
}