import express from "express"
import User from "../database/user.js"
import bcrypt from "bcrypt"
import { generateToken } from "../lib/jwt.js"

const router = new express.Router()

router.post("/authenticate", async (req, res, next) => {
    const { email, password } = req.body

    if(!email || !password) {
        const error = new Error("Bad request: Authenticate needs valid email and password")
        error.statusCode = 400
        return next(error)
    }

    const user = await User.findOne({
        where: { email }
    })

    const passwordsMatch = await bcrypt.compare(password, user?.password || "")

    if (user === null || !passwordsMatch) {
        const error = new Error("Unauthorized")
        error.statusCode = 401
        return next(error)
    } 

    const data = { name: user.name }
    const token = generateToken(data)

    res.send({ token, user: data })
})

export default router