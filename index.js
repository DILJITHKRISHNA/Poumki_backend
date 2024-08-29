import express from 'express';
import mongoose from 'mongoose'
import cors from 'cors'
import UserRouter from './routes/UserRouter.js'
import AdminRouter from './routes/AdminRoutes.js'
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express()
const port = 3000

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL, 
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    },
});

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/poumki_task";

mongoose.connect(MONGO_URL).then(() => {
    console.log('Database connected')
})

app.use('/', UserRouter)
app.use('/admin', AdminRouter)

io.on('connection', (socket) => {
    // console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        // console.log('User disconnected:', socket.id);
    });
});

server .listen(port, () => {
    console.log(`server listening on port ${port}`)
})

export { io };