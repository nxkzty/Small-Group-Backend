import { Sequelize } from "sequelize"
import { dirname } from "path"
import { fileURLToPath } from "url"
import path from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "blog-database.sqlite")
})

async function loadModule(path) {
    return import(path).then(module => module.default)
}

export async function setupDatabase() {
    try {
        const Post = await loadModule(path.join(`file://${__dirname}`, "post.js"))
        const User = await loadModule(path.join(`file://${__dirname}`, "user.js"))

        await sequelize.authenticate()
        await sequelize.sync()

        const postCount = await Post.count()

        if (postCount === 0) {
            const posts = await loadModule(path.join(`file://${__dirname}`, "data", "posts.js"))
            await Post.bulkCreate(posts)
            const users = await loadModule(path.join(`file://${__dirname}`, "data", "users.js"))
            await User.bulkCreate(users, { individualHooks: true })
        }
        console.log("Database ready")
    } catch (e) {
        console.error("Could not connect to database")
        console.error(e)
        process.exit(-1)
    }
}

export default sequelize