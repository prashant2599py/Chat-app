import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if(!token){
            return res.status(401).json({error: "Unauthorized - No Token Provided."})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({error: "Unauthorized - Invalid Token."})

        }

        const user = await User.findById(decoded.userId).select("-password"); 

        if(!user){
            return res.status(404).json({error : "Not Found"});
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in protected route "+ error.message);
        res.status(500).json({Message: 'Internal Server Error'})
    }
}

export default protectRoute;