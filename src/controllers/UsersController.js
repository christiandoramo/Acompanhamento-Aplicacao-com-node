import { AppError } from "../utils/AppError.js";
import { dbConnection } from "../database/sqlite/index.js";
import pkg from "bcryptjs";

class UsersController {
    index() {//GET

    }
    show() {//GET

    }
    async create(req, res) {//POST
        const { name, email, password } = req.body; // pega o corpo da requisicao
        if (!name || !email || !password)
            throw new AppError("The user needs a name, an email and a password")
        const db = await dbConnection()
        const userAlreadyExist = await db.get(`SELECT * FROM users WHERE email = (?)`, [email])
        if (userAlreadyExist)
            throw new AppError("This email is not available")
        const hashedpassword = await pkg.hash(password, 8)
        await db.run(`INSERT INTO users (name, email, password) VALUES((?), (?), (?))`, [name, email, hashedpassword])
        res.status(201).json("User created with success!") //devolve resposta em json
    }
    async update(req, res) { //PUT
        const { email, name, newPassword, password } = req.body
        const { id } = req.params
        const db = await dbConnection()

        const user = await db.get("SELECT * FROM users WHERE id = (?)", [id])

        if (!user)
            throw new AppError("User not found")
        const userWithUpdatedEmail = await db.get('SELECT * FROM users WHERE email = (?)', [email])
        if (userWithUpdatedEmail)
            throw new AppError("This email is not available")
        if (name === user.name)
            throw new AppError('The name is the same as the one already registered')
        if (email === user.email)
            throw new AppError('The email is the same as the one already registered')
        if (newPassword) {
            if (password) {
                const validatePreviousPassword = await pkg.compare(password, user.password)
                if (!validatePreviousPassword)
                    throw new AppError('To change your password you need to enter your previous one')
                const checkIfEqualsPreviewPassword = await pkg.compare(newPassword, user.password)
                if (checkIfEqualsPreviewPassword)
                    throw new AppError('The new password is the same as the one already registered')
            } else
                throw new AppError('To change your password you need to inform the previous one')
        }

        user.name = name ?? user.name
        user.email = email ?? user.email
        user.password = newPassword ? await pkg.hash(newPassword, 8) : user.password
        await db.run(`UPDATE users SET name = ?, email = ?, password = ?,updated_at = DATETIME('now') WHERE id = ?`,
            [user.name, user.email, user.password, id]
        )
        return res.status(200).json({ message: "User updated with success" })
    }
    delete() {//DELETE

    }
}

export { UsersController }