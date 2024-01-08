import { Router } from 'express'
import { UsersController } from '../controllers/UsersController.js';

const usersRoutes = Router();
const usersControler = new UsersController()
usersRoutes.post("/", usersControler.create)
usersRoutes.put("/:id",usersControler.update)

export { usersRoutes }