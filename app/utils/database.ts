import mongoose from "mongoose"
import nextConfig from '../../next.config.mjs'

const MONGODB_URI = nextConfig.env.MONGODB_URI
// console.log(`process.env.MONGODB_URI: ${process.env.MONGODB_URI}`)
// console.log(`MONGODB_URI: ${MONGODB_URI}`)

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

const connectDB = async() => {
    try{
        if(!mongoose.connections[0].readyState){
            await mongoose.connect(MONGODB_URI)
        }
    }catch(err){
        console.log("Failure: Unconnected to MongoDB")
        throw new Error()
    }
}

export default connectDB