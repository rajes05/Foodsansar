import jwt from 'jsonwebtoken';

// this middleware is used to check if the user is authenticated

const isAuth = (req, res, next) => {
    try {
        const token = req.cookies.token; // Assuming the token is stored in cookies
        if(!token){
            return res.status(400).json({ message: 'token not found' });
        }
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET); // verify the token using the secret key
        if(!decodeToken){
            return res.status(400).json({ message: 'invalid token' });
        }
        req.userId = decodeToken.userId; // attach userId to request object for further use
        next(); // proceed to the next middleware or route handler
    } catch (error) {
        return res.status(500).json({ message: `IsAuth Error : ${error.message}` });
    }
}

export default isAuth;