import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from 'dotenv'
env.config()
import { createUser, getUserByEmail, getUserById } from '../model/UserSchema.js'

export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body
        if (!firstname || !lastname || !email || !password) {
            return res.json({ message: "Please fill in all fields" })
        } else {
            const existingUser = await getUserByEmail(email)
            if (existingUser) {
                return res.json({ message: "User already exist" });
            } else {
                const hashedPass = await bcrypt.hash(password, 10)
                const newUser = await createUser({
                    firstname,
                    lastname,
                    email,
                    password: hashedPass
                });
                const secretKey = process.env.TOKEN_KEY 
                const token = await jwt.sign({ _id: newUser._id }, secretKey, { expiresIn: '24h' })
                res.cookie("usertoken", token, {
                    httpOnly: false,
                })
                return res.json({ success: true, message: "User saved successfully", newUser })
            }
        }
    } catch (error) {
        console.log(error);

    }
}
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.json({ message: "Please fill in all fields" })
        } else {
            const existingUser = await getUserByEmail(email)
            if (existingUser) {
                const isMatch = await bcrypt.compare(password, existingUser.password)
                if (isMatch) {
                    const secretKey = process.env.TOKEN_KEY 
                    const token = await jwt.sign({ _id: existingUser._id }, secretKey, { expiresIn: '24h' })
                    return res.json({ success: true, message: "User login successfull!", existingUser, token })
                } else {
                    return res.json({ message: "Invalid password" })
                }
            } else {
                return res.json({ message: "User not exist" })
            }
        }
    } catch (error) {
        console.log(error);

    }
}
export const GetSingleUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await getUserById(id)
        if (user) {
            return res.json({ success: true, message: "User found", user })
        } else {
            return res.json({ message: "User not found" })
        }
    } catch (error) {
        console.log(error);

    }
}