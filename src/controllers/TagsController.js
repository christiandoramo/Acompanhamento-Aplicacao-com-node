import { AppError } from "../utils/AppError.js";
import { orm } from "./../database/knex/index.js";

class TagsController {
    async index(req, res) {//GET
        const { user_id } = req.params
        const tags = await orm('tags').where({ user_id })
        console.log(user_id)
        // console.log(tags)
        return res.json(tags)
    }
}
export { TagsController }