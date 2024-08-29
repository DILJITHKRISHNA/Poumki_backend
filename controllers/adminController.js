import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from 'dotenv'
env.config()
import { getUserByEmail, UserModel, getUsers, deleteUserById } from '../model/UserSchema.js'
import { io } from '../index.js';


export const AdminloginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.json({ message: "Please fill in all fields" })
        } else {
            const existingUser = await getUserByEmail(email)
            const CheckAdmin = await UserModel.findOne({ isAdmin: true })
            if (existingUser && CheckAdmin) {
                const isMatch = await bcrypt.compare(password, existingUser.password)
                if (isMatch) {
                    const secretKey = process.env.TOKEN_KEY 
                    const token = await jwt.sign({ _id: existingUser._id }, secretKey, { expiresIn: '24h' })
                    return res.status(200).json({ success: true, message: "Admin login successfull!", existingUser, token })
                } else {
                    return res.json({ message: "Invalid password" })
                }
            } else {
                return res.json({ message: "admin not exist" })
            }
        }
    } catch (error) {
        console.log(error);

    }
}

export const GetAllUsers = async (req, res) => {
    try {
        const Allusers = await UserModel.find({ isAdmin: false });

        if (Allusers) {
            io.emit('updateUserList', Allusers);
            return res.status(200).json({ success: true, message: "All users fetched successfully", Allusers })
        } else {
            return res.json({ message: "No users found" })
        }
    } catch (error) {
        console.log(error);

    }
}
export const DeleteAllUsers = async (req, res) => {

    try {
        const deleteAllusers = await UserModel.deleteMany({ isAdmin: false })

        if (deleteAllusers) {
            const remainingUsers = await UserModel.find({ isAdmin: false });
            io.emit('updateUserList', remainingUsers); 
            return res.status(200).json({ success: true, message: "All users Deleted successfully", deleteAllusers })
        } else {
            return res.json({ message: "Failed to delete users" })
        }
    } catch (error) {
        console.log(error);

    }
}
export const DeleteUserByid = async (req, res) => {
    console.log("Hiiiddd");
    
    try {
        const { id } = req.params
        const deleteuser = await UserModel.findOneAndDelete({ _id: id })
        if (deleteuser) {
            const remainingUsers = await UserModel.find({ isAdmin: false });
            io.emit('updateUserList', remainingUsers); 
            return res.status(200).json({ success: true, message: "User Deleted successfully", deleteuser })
        } else {
            return res.json({ message: "Failed to delete user" })
        }
    } catch (error) {
        console.log(error);

    }
}