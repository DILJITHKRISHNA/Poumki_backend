import express from 'express'
const AdminRouter = express.Router()
import {AdminloginUser, DeleteAllUsers, DeleteUserByid, GetAllUsers} from '../controllers/adminController.js'

AdminRouter.post('/login', AdminloginUser)
AdminRouter.get('/getallusers', GetAllUsers)
AdminRouter.delete('/deleteallusers', DeleteAllUsers)
AdminRouter.delete('/deleteuserbyid/:id', DeleteUserByid)

export default AdminRouter