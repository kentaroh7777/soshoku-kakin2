import { describe, it, expect, beforeAll} from 'vitest'
import connectDB from "./database"
import nextConfig from '../../next.config.mjs'

let MONGODB_URI: string|undefined

beforeAll(() => {
//    MONGODB_URI=process.env.MONGODB_URI
    MONGODB_URI=nextConfig.env.MONGODB_URI
    console.log(`MONGODB_URI: ${MONGODB_URI}`)
})
describe("mongoose",()=>{
    it("MONGODB_URI is defined.", ()=>{
        expect(MONGODB_URI).not.toBe(undefined)
    })

    it("Mongo DB is live.", ()=>{
        connectDB()
    })
})