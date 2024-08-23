import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import nextConfig from '../../../../../next.config.mjs'
import { NextRequest } from 'next/server'
import { PUT } from './route'
import { POST } from '../../signin/route'
import { User, userFindByToken } from '../../../../model/user'  // Userモデルをインポート
import { middleware } from '../../../../../middleware'

let mongod: MongoMemoryServer
let token: string
let context: {params: {id: string}}

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
    const decoded = jwt.verify(token, nextConfig.env.JWT_SECRET!)
    const userId = (decoded as jwt.JwtPayload).userId
    context = {params: {id: userId}}
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

  const createRequest = (body: any, token: string, targetUserId: string | null = null) => {
    const decoded = jwt.verify(token, nextConfig.env.JWT_SECRET!)
    const userId = targetUserId ? targetUserId : (decoded as jwt.JwtPayload).userId
    return new NextRequest(`http://localhost:3000/api/user/update/${userId}`, {
      method: 'PUT',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body),
    })
  }

  // create -> signin -> update
  it('should correctly update user information', async () => {
    const updateData = {
      email: 'test@example.com',
      profileText: 'Updated profile',
      profilePicture: 'https://example.com/updated.jpg',
//      token: token
    }

    const req = createRequest(updateData, token)
    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)

    const res = await PUT(req, context)

    expect(res.status).toBe(200)
    const data = await res.json()
    
    expect(data.message).toBe('User updated successfully')
    
    const updatedUser = await User.findOne({ email: 'test@example.com' })
    expect(updatedUser).toBeDefined()
    expect(updatedUser?.profileText).toBe('Updated profile')
    expect(updatedUser?.profilePicture).toBe('https://example.com/updated.jpg')
  })

  // ログインしない状態でのアクセステスト
  it('should return 401 error when trying to update without logging in', async () => {
    const updateData = {
      email: 'test@example.com',
      profileText: 'Updated profile without login',
      profilePicture: 'https://example.com/updated.jpg'
    }

    const req = new NextRequest(`http://localhost:3000/api/user/update/${context.params.id}`, {
      method: 'PUT',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateData),
    })

    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(401)
    const data = await auth_res.json()
    expect(data.error).toBe('Token is missing')
  })

  it('should return 401 error for non-existent user token', async () => {
    // delete the user
    const decoded = jwt.verify(token, nextConfig.env.JWT_SECRET!);
    await User.findByIdAndDelete((decoded as jwt.JwtPayload).userId);

    const req = createRequest({ email: 'test@example.com', profileText: 'Deleted user test' }, token)

    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)

    const res = await PUT(req,context)

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized request')
  })

  it('should return 400 error for invalid email', async () => {
    const req = createRequest({ email: 'invalid-email', profileText: 'Test' }, token)

    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)
    
    const res = await PUT(req,context)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email address')
  })

  it('should return 400 error for empty email', async () => {
    const req = createRequest({ email: '', profileText: 'Test' }, token)

    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)

    const res = await PUT(req,context)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email address')
  })

  it('should update password when old password matches', async () => {
    const updateData = {
        email: 'test@example.com',
        oldPassword: 'password123',
        newPassword: 'newpassword456',
        profileText: 'Updated profile'
    }

    const req = createRequest(updateData, token)

    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)

    const res = await PUT(req,context)

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
        email: 'test@example.com',
        oldPassword: 'wrongpassword',
        newPassword: 'newpassword456',
        profileText: 'Updated profile'
    }

    const req = createRequest(updateData, token)

    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)

    const res = await PUT(req,context)

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

  it('should not allow non-admin user to update permission', async () => {
    const updateData = {
        permission: 'admin',
        profileText: 'Updated profile'
    }

    const req = createRequest(updateData, token)

    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)

    const res = await PUT(req, context)

    // should return 401 error
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized request')
    
    // permission should not be updated
    const updatedUser = await userFindByToken(token)
    expect(updatedUser).toBeDefined()
    expect(updatedUser.permission).toBe('user')
  })

  it('should not allow non-admin user to update another user', async () => {
    // Create a second regular user
    const secondUser = new User({
      email: 'second@example.com',
      password: 'secondpassword123',
      permission: 'user'
    })
    await secondUser.save()

    // Update data by the first regular user
    const updateData = {
      email: 'updatedsecond@example.com',
      profileText: 'User updated profile',
      permission: 'admin'
    }
    const req = createRequest(updateData, token, secondUser._id.toString())
    const context = { params: { id: secondUser._id.toString() } }

    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)
    
    const res = await PUT(req, context)

    // should return 401 error
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized request')

    // second user's data should not be updated
    const updatedUser = await User.findById(secondUser._id)
    expect(updatedUser.email).toBe('second@example.com')
    expect(await updatedUser.comparePassword('secondpassword123')).toBe(true)
    expect(updatedUser.permission).toBe('user')
  })

  // test for admin
  it('should allow admin to update another user', async () => {
    // Create an admin user
    const adminUser = new User({
      email: 'admin@example.com',
      password: 'adminpassword123',
      permission: 'admin'
    })
    await adminUser.save()

    // Generate token for admin user
    const adminToken = jwt.sign({ userId: adminUser._id }, nextConfig.env.JWT_SECRET!)

    // Create a regular user
    const regularUser = new User({
      email: 'regular@example.com',
      password: 'regularpassword123',
      permission: 'user'
    })
    await regularUser.save()

    // Update data by admin
    const updateData = {
      email: 'updated@example.com',
      profileText: 'Admin updated profile',
      permission: 'admin'
    }
    const req = createRequest(updateData, adminToken, regularUser._id.toString())
    const context = { params: { id: regularUser._id.toString() } }

    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)
    
    const res = await PUT(req, context)


    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.message).toBe('User updated successfully')

    const updatedUser = await User.findById(regularUser._id)
    expect(updatedUser.email).toBe('updated@example.com')
    expect(updatedUser.profileText).toBe('Admin updated profile')
    expect(updatedUser.permission).toBe('admin')
  })

})