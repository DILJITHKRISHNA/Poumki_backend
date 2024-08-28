import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email) => UserModel.findOne({ email })
export const getUserById = (id) => UserModel.findById(id)
export const createUser = (values) => new UserModel(values).save().then((user) => user.toObject())
export const deleteUserById = (id) => UserModel.findOneAndDelete({ _id: id })
