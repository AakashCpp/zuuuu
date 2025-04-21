import jwt from "jsonwebtoken";

export const checkAuthToken = (req, res, next) => {
    const token = req.cookies.token;
    const reffreshToken = req.cookies.reffreshToken;

    if (!token || !reffreshToken) {
        return res.status(401).json({ message: "Authorization denied" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            jwt.verify(reffreshToken , process.env.REFFRESH_JWT_SECRET , (reffreshErr , reffreshDecoded)=>{
                if(reffreshErr){
                    return res.status(401).json({ message: "Authentication failed : Both tokens are expired User must login" , ok:false });
                }else{
                    const token = jwt.sign({ userId: reffreshDecoded.userId }, process.env.JWT_SECRET, { expiresIn: "10m" });
                    const reffreshToken = jwt.sign({ userId: reffreshDecoded.userId }, process.env.REFFRESH_JWT_SECRET, { expiresIn: "1d" });
                    res.cookie("token", token, { httpOnly: true , secure: process.env.NODE_ENV !== "development" });
                    res.cookie("reffreshToken", reffreshToken, { httpOnly: true , secure: process.env.NODE_ENV !== "development" });
                    
                    req.user = { userId: reffreshDecoded.userId };
                    res.ok = true;
                    next();
                }
                }
            )
        }else{
            req.user = { userId: decoded.userId };
            next();
        }
    });
};