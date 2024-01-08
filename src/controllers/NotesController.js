import { AppError } from "../utils/AppError.js";
import { orm } from "./../database/knex/index.js";

class NotesController {
    index() {//GET

    }
    async show(req, res) {//GET
        const { id } = req.params

        const note = await orm('notes').where({ id }).first()
        const tags = await orm('tags').where({ note_id: id }).orderBy('name')
        const links = await orm('links').where({ note_id: id }).orderBy('created_at')

        console.log(typeof note)
        return res.status(200).json({
            ...note,
            tags,
            links,
        })
    }
    async create(req, res) {//POST
        const { title, description, tags, links } = req.body; // pega o corpo da requisicao
        const { user_id } = req.params

        const user = await orm("users").where({ id: user_id }).first()
        if (!user)
            throw new AppError('User not found')
        const [note_id] = await orm('notes').insert({ title, description, user_id })

        const tagsToInsert = tags.map(tag => ({ user_id, note_id, name: tag }))
        await orm('tags').insert(tagsToInsert)

        const linksToInsert = links.map(link => ({ note_id, url: link }))
        await orm('links').insert(linksToInsert)

        return res.json({ message: "Note created with success!" })
    }
    async update() { //PUT

    }
    async delete(req, res) {//DELETE
        const { id } = req.params
        const note = await orm('notes').where({ id }).first()
        if (!note)
            throw new AppError("Note not found")
        await orm('notes').where({ id }).delete()
        return res.json({ message: "Note deleted with success!" })
    }
}
export { NotesController }