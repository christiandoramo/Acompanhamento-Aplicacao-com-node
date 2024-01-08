import 'express-async-errors';
import express from 'express';
import { AppError } from './utils/AppError.js';
import { routes } from './routes/index.js'
import { migrationsRun } from './database/sqlite/migrations/index.js';

const app = express()

app.use(express.json())

app.use(routes)
await migrationsRun()

app.use((error, req, res, next) => {
    console.error(error)
    if (error instanceof AppError) { // Error de REQUISICAO(front)
        console.log(error)
        return res.status(error.statusCode).json({
            message: error.message,
            status: "Error",
        })
    }
    return res.status(500).json({ // ERROR NO BACKEND
        status: "Error",
        message: "Internal server error",
    })
})


const PORT = 3333
app.listen(PORT, () => console.log('Server is running on PORT ', PORT))