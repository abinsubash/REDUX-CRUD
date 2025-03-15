import mongoose from "mongoose"

const MONGO_URI ="mongodb://127.0.0.1:27017/CRUD-3";
export async function connectDb(){
    try {
        await mongoose.connect(MONGO_URI)
        console.log('Connected to mongodb 🚀')
    } catch (error) {
        console.log('Mongo Error, ',error)
    }
}