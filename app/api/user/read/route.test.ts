import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from './route'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { User } from '../../../model/user'

let mongod: MongoMemoryServer

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
  })

  const createRequest = ({email}: {email:string}) => {
    return new NextRequest(`http://localhost:3000/api/user/read?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    })
  }


  it('should correctly read user information', async () => {
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      profileText: 'Test profile',
      profilePicture: 'https://example.com/profile.jpg'
    })

    const req = createRequest({ email: 'test@example.com' })
    const res = await GET(req)

    expect(res.status).toBe(200)
    const data = await res.json()
    
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe('test@example.com')
    expect(data.user.profileText).toBe('Test profile')
    expect(data.user.profilePicture).toBe('https://example.com/profile.jpg')
    expect(data.user.password).toBeUndefined()
  })

  it('should return 404 error for non-existent email', async () => {
    const req = createRequest({ email: 'nonexistent@example.com' })
    const res = await GET(req)

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toBe('User not found')
  })

  it('should return 400 error for invalid email', async () => {
    const req = createRequest({ email: 'invalid-email' })
    const res = await GET(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email address')
  })

  it('should return 400 error for empty email', async () => {
    const req = createRequest({ email: '' })
    const res = await GET(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Email is required')
  })

  it('should return 400 error for email with special characters', async () => {
    const req = createRequest({ email: 'test!@#$%^&*()@example.com' })
    const res = await GET(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email address')
  })

  it('should return 400 error for email without domain', async () => {
    const req = createRequest({ email: 'test@' })
    const res = await GET(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email address')
  })
})
