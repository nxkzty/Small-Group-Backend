import express from "express"
import Post from "../database/post.js"
import { object, string, number } from "yup"

const postCreateSchema = object({
    title: string().required(),
    text: string().required(),
    createdAt: string().optional(),
    updatedAt: string().optional()
}).noUnknown()

const postPutSchema = postCreateSchema.shape({
    id: number().required()
}).noUnknown()

const postPatchSchema = object({
    title: string(),
    text: string()
}).noUnknown().test(value => {
    return Object.keys(value).length > 0
})

async function loadPost(req, res, next) {
    const id = req.params.id
    const post = await Post.findByPk(id)

    if (post === null) {
        const error = new Error(`Could not find entity with id ${id}`)
        error.name = "NotFoundError"
        error.statusCode = 404
        return next(error)
    } else {
        req.post = post
        next()
    }
}

async function validateBody(req, res, next) {
    try {
        if (req.method === "POST") {
            await postCreateSchema.validate(req.body, { abortEarly: false })
        } else if (req.method === "PUT") {
            await postPutSchema.validate(req.body, { abortEarly: false })
        } else if (req.method === "PATCH") {
            await postPatchSchema.validate(req.body, { abortEarly: false })
        }
        delete req.body.createdAt
        delete req.body.updatedAt
        next()
    } catch (e) {
        next(e)
    }
}

const router = new express.Router()

router.get("/posts", async (req, res) => {
    res.send(await Post.findAll({ order: [["id", "DESC"]] }))
})

router.get("/posts/:id", loadPost, async (req, res) => {
    res.send(req.post)
})

router.post("/posts", validateBody, async (req, res) => {
    const post = await Post.create(req.body)
    res.send(post)
})

async function updatePost(req, res, next) {
    if (req.method === "PUT" && req.body.id !== parseInt(req.params.id)) {
        const error = new Error("Ids from path and body do not match")
        error.name = "IdMismatchError"
        error.statusCode = 400
        return next(error)
    }
    const post = await req.post.update(req.body)
    res.send(post)
}

router.put("/posts/:id", validateBody, loadPost, updatePost)
router.patch("/posts/:id", validateBody, loadPost, updatePost)

router.delete("/posts/:id", loadPost, async (req, res) => {
    await req.post.destroy()
    res.send({ message: "Post deleted" })
})

export default router