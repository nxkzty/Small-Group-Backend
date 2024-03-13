import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.SECRET_KEY
const DEFAULT_EXPIRES = "2h"

export function generateToken(data) {
    return jwt.sign({
        data
    }, SECRET_KEY, { expiresIn: DEFAULT_EXPIRES })
}
