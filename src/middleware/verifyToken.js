import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {

    const token = req.headers.authorization
    if (token) {
        const decoded = jwt.decode(token, process.env.JWT_SECRET)
        req.user = decoded
        next();
    } else {
        res.status(401).json({ message: 'Inválid Token' })
    }
}

export default verifyToken 