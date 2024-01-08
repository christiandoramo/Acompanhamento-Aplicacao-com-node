import { AppError } from "../utils/AppError.js";
import { orm } from "./../database/knex/index.js";

class NotesController {
    async index(req, res) {//GET
        const { title, user_id, tags } = req.query

        let notes
        const user = await orm('users').where({ id: user_id }).first()
        if (!user)
            throw new AppError("User not found")

        if (tags || title) {
            if (tags && title) {
                const filterTags = tags.split(',').map(tag => tag.trim())

                notes = await orm("tags")
                    .select(["notes.*"
                    ])
                    .where("notes.user_id", user_id)
                    .whereLike("notes.title", `%${title}%`)
                    .whereIn("name", filterTags)
                    .innerJoin("notes", "notes.id", "tags.note_id")
                    .orderBy("notes.title")
            } else if (title) {
                notes = await orm("notes")
                    .where({ user_id })
                    .whereLike("title", `%${title}%`)
                    .orderBy("title")
            } else {
                const filterTags = tags.split(',').map(tag => tag.trim())
                notes = await orm("tags")
                    .select(["notes.*"
                    ])
                    .where("notes.user_id", user_id)
                    .whereIn("name", filterTags)
                    .innerJoin("notes", "notes.id", "tags.note_id")
                    .orderBy("notes.title")
            }
        } else {
            notes = await orm("notes")
                .where({ user_id })
                .orderBy("title")
        }

        const userTags = await orm("tags").where({ user_id })
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)
            const noteWithTag = {
                ...note,
                tags: noteTags
            }
            return noteWithTag
        })

        return res.json(notesWithTags)
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