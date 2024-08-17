import { describe, it, expect} from 'vitest'
import nextConfig from '../next.config.mjs'

describe(".env.local",()=>{
    it("MONGODB_URI is existing.", ()=>expect(nextConfig.env.MONGODB_URI).not.toBe(undefined))
})