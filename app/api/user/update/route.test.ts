import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { PUT } from './route'
import { POST } from '../signin/route'
import { User } from '../../../model/user'  // Userモデルをインポート

let mongod: MongoMemoryServer
let token: string

describe('User Update API', () => {
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
    token = await createUserAndSignin({
        email: 'test@example.com',
        password: 'password123',
        profileText: 'Initial profile',
        profilePicture: 'https://example.com/initial.jpg'
    })
  })

  const createUserAndSignin = async (body: any) => {
    const testUser = await User.create(body)
    const req = new NextRequest('http://localhost:3000/api/user/signin', {
      method: 'POST',
      body: JSON.stringify({ email: body.email, password: body.password }),
    })
    const res = await POST(req)
    const data = await res.json()
    return data.token
  }

  const createRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/user/update', {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  // create -> signin -> update
  it('should correctly update user information', async () => {
    const updateData = {
      email: 'test@example.com',
      profileText: 'Updated profile',
      profilePicture: 'https://example.com/updated.jpg',
      token: token
    }

    const req = createRequest(updateData)
    const res = await PUT(req)

    expect(res.status).toBe(200)
    const data = await res.json()
    
    expect(data.message).toBe('User updated successfully')
    
    const updatedUser = await User.findOne({ email: 'test@example.com' })
    expect(updatedUser).toBeDefined()
    expect(updatedUser?.profileText).toBe('Updated profile')
    expect(updatedUser?.profilePicture).toBe('https://example.com/updated.jpg')
  })

  it('should return 401 error for non-existent user token', async () => {
    // delete the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    await User.findByIdAndDelete((decoded as jwt.JwtPayload).userId);

    const req = createRequest({ token: token, email: 'test@example.com', profileText: 'Deleted user test' })
    const res = await PUT(req)

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized request')
  })

  it('should return 400 error for invalid email', async () => {
    const req = createRequest({ token: token, email: 'invalid-email', profileText: 'Test' })
    const res = await PUT(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email address')
  })

  it('should return 400 error for empty email', async () => {
    const req = createRequest({ token: token, email: '', profileText: 'Test' })
    const res = await PUT(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email address')
  })

  it('should update password when old password matches', async () => {
    const updateData = {
        token: token,
        email: 'test@example.com',
        oldPassword: 'password123',
        newPassword: 'newpassword456',
        profileText: 'Updated profile'
    }

    const req = createRequest(updateData)
    const res = await PUT(req)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.message).toBe('User updated successfully')
    
    const updatedUser = await User.findOne({ email: 'test@example.com' })
    expect(updatedUser).toBeDefined()

    const comparison_old = await updatedUser?.comparePassword('password123')
    expect(comparison_old).toBe(false)
    const comparison_new = await updatedUser?.comparePassword('newpassword456')
    expect(comparison_new).toBe(true)
  })

  it('should not update password when old password does not match', async () => {
    const updateData = {
        token: token,
        email: 'test@example.com',
        oldPassword: 'wrongpassword',
        newPassword: 'newpassword456',
        profileText: 'Updated profile'
    }

    const req = createRequest(updateData)
    const res = await PUT(req)

    // should return 400 error
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Incorrect old password')
    
    // password should not be updated
    const updatedUser = await User.findOne({ email: 'test@example.com' })
    expect(updatedUser).toBeDefined()
    const comparison = await updatedUser.comparePassword('password123')
    expect(comparison).toBe(true)
  })
})