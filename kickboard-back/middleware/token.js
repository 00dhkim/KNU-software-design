import jwt from 'jsonwebtoken'

function verifyToken(req, res, next) {
    try {
        req.decoded = jwt.verify(req.query.authorization, global.JWT_SECRET)
        return next()
    }
    catch (error) {
        if(error.name === 'TokenExpireError') {
            return res.status(419).json({
                code: 419,
                message: '만료된 토큰입니다.'
            })
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.'
        })
    }
}

export default verifyToken