import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        console.log('JWT missing')
        return res.sendStatus(401)
    }
    const token = authHeader.split(' ')[1]//Bearer token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {

            if (err){ 
                console.error(err)
                return res.sendStatus(403) //"forbidden" - invalid token
            }

            req.user = decoded.UserInfo.username
            req.roles = decoded.UserInfo.roles
            req._id = decoded.UserInfo._id
            next()
        }
    )
}
export default verifyJWT