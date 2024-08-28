import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from './route'
import { POST } from '../login/route'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { User } from '../../../model/user'

let mongod: MongoMemoryServer
let testUser: mongoose.HydratedDocument<typeof User>
let token: string

describe('User Read API', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await mongoose.connect(uri)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongod.stop()
  })

  beforeEach(async () => {
    await User.deleteMany({})
    token = await createUserAndLogin({
        email: 'test@example.com',
        password: 'password123',
        profileText: 'Initial profile',
        profilePicture: 'https://example.com/initial.jpg'
    })

  })

  const createUserAndLogin = async (body: any) => {
    testUser = await User.create(body) as mongoose.HydratedDocument<typeof User>
    const req = new NextRequest('http://localhost:3000/api/user/login', {
      method: 'POST',
      body: JSON.stringify({ email: body.email, password: body.password }),
    })
    const res = await POST(req)
    const data = await res.json()
//    console.log(`data: ${JSON.stringify(data)}`)
    return data.token
  }

  const createRequest = (token: string ) => {
    return new NextRequest(`http://localhost:3000/api/user/payload`, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
  }


  it('should correctly read payload', async () => {
//    console.log(`token: ${token}`)
    const req = createRequest(token)
    const res = await GET(req)


    const data = await res.json()
    // console.log(`data.userId: ${JSON.stringify(data.userId)}`)
    // console.log(`testUser._id: ${JSON.stringify(testUser._id)}`)
    expect(res.status).toBe(200)
    
    expect(data.userId.toString()).toBe(testUser._id.toString())
    expect(data.permission).toBe('user')
  })

  it('should return 400 error for incorrect token', async () => {
    const req = createRequest('123456789012345678901234')
    const res = await GET(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Token read error')
  })

  it('should return 401 error for empty id', async () => {
    const req = createRequest('')
    const res = await GET(req)

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Token is missing')
  })
})
