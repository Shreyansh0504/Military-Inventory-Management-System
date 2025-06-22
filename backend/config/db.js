import mongoose from "mongoose"

export const conn = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`db connected successfully`.bgMagenta)
    } catch (error) {
        console.log(`Error occured while connecting to DB ${error}`.bgRed)
    }
}