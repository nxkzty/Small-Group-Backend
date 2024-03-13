import compression from "compression"
import cors from "cors"
import express from "express"
import { expressjwt } from "express-jwt"
import logger from "morgan"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import { ValidationError } from "yup"
import { setupDatabase } from "./database/index.js"
import authenticationRoutes from "./routes/authentication.js"
import postRoutes from "./routes/posts.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const SECRET_KEY = process.env.SECRET_KEY
const PORT = process.env.PORT
const DISABLE_AUTH = process.env.DISABLE_AUTH

const app = express()

app.use(logger("dev"))
app.use(cors())
app.use(express.static(path.join(__dirname, "public")))

if (!DISABLE_AUTH) {
    app.use("/api", expressjwt({
        secret: SECRET_KEY,
        algorithms: ["HS256"]
    }).unless({
        method: "GET",
        path: "/api/authenticate"
    }))
}

app.use(express.json())
app.use("/api", authenticationRoutes)
app.use("/api", postRoutes)
app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
        const statusCode = 400
        const errors = {}
        for (let error of err.inner) {
            errors[error.path] = error.errors.join(", ")
        }
        return res.status(statusCode).send({
            name: err.name,
            statusCode,
            message: err.message,
            errors
        })
    } else if (err.name === "UnauthorizedError" || err.name === "TokenExpiredError") {
        return res.status(401).send({
            statusCode: 401,
            name: err.name,
            message: err.message,
            errors: {}
        })
    } else {
        const statusCode = err.statusCode || 500
        const message = err.message
        return res.status(statusCode).send({ statusCode, name: err.name, message, errors: {} })
    }
})
app.use(compression())
await setupDatabase()

app.listen(PORT, () => {
    console.log(`Server listening on: http://localhost:${PORT}`)
    console.log(`Authenticate: http://localhost:${PORT}/api/authenticate`)
    console.log(`Post resource: http://localhost:${PORT}/api/posts`)
})
