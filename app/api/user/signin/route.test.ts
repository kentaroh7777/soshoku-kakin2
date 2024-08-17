import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { NextRequest } from 'next/server'
import { POST } from './route'
import { User } from '../../../model/user'
import connectDB from '../../../utils/database'

let mongod: MongoMemoryServer

describe('User Signin API', () => {
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
  })

  const createRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/user/signin', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  it('should successfully sign in a user with correct credentials', async () => {
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
    })

    const req = createRequest({
      email: 'test@example.com',
      password: 'password123',
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.message).toBe('User signed in successfully')
    expect(data).toHaveProperty('token')
    console.log(data);
  })

  it('should return 400 error for invalid request body', async () => {
    const req = new NextRequest('http://localhost:3000/api/user/signin', {
      method: 'POST',
      body: 'invalid json',
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid request body')
  })

  it('should return 400 error for missing email or password', async () => {
    const req = createRequest({ email: 'test@example.com' })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Email and password are required')
  })

  it('should return 401 error for incorrect password', async () => {
    await User.create({
      email: 'test@example.com',
      password: 'password123',
    })

    const req = createRequest({
      email: 'test@example.com',
      password: 'wrongpassword',
    })
    const res = await POST(req)

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Invalid credentials')
  })

  it('should return 404 error for non-existent user', async () => {
    const req = createRequest({
      email: 'nonexistent@example.com',
      password: 'password123',
    })
    const res = await POST(req)

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toBe('User not found')
  })
})

