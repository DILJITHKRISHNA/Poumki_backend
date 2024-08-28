import express from 'express'
const UserRouter = express.Router()
import { GetSingleUser, loginUser, register } from '../controllers/userController.js'

UserRouter.post('/register', register)
UserRouter.post('/login', loginUser)
UserRouter.get('/getsingleuser/:id', GetSingleUser)

export default UserRouter