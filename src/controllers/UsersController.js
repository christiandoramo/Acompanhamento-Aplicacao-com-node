import { AppError } from "../utils/AppError.js";

class UsersController {
    index() {//GET

    }
    show() {//GET

    }
    create(req, res) {//POST
        const { name, email, password } = req.body; // pega o corpo da requisicao
        if (!name || !email || !password)
            throw new AppError("Bad request: Invalid params", 400)
        res.status(201).json({ name, email, password }) //devolve resposta em json
    }
    update() { //PUT

    }
    delete() {//DELETE

    }
}

export { UsersController }