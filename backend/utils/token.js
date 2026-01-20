import jwt from 'jsonwebtoken';

// this function is used to generate a JWT token for the user

const genToken = async (userId) => {
    try {
        const token = await jwt.sign({userId}, process.env.JWT_SECRET,{expiresIn:"7d"});
        return token;
    } catch (error) {
        console.log("Error generating token:", error);
    }
};

export default genToken;