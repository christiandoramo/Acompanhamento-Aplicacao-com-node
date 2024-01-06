import 'express-async-errors';
import express from 'express';
import { AppError } from './utils/AppError.js';
import { routes } from './routes/index.js'
import { dbConnection } from './database/sqlite/index.js';

const app = express()

app.use(express.json())

app.use(routes)
dbConnection()

app.use((error, req, res, next) => {
    if (error instanceof AppError) { // Error de REQUISICAO(front)
        return res.status(error.statusCode).json({
            message: error.message,
            status: "Error",
        })
    }

    console.error(error)
    return res.status(500).json({ // ERROR NO BACKEND
        status: "Error",
        message: "Internal server error",
    })
})


const PORT = 3333
app.listen(PORT, () => console.log('Server is running on PORT ', PORT))