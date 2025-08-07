import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.user = { userId: tokenDecode.id }; // ✅ attach to req.user
            next();
        } else {
            return res.status(401).json({ success: false, message: 'Invalid Token Payload' });
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

export default authUser;
