import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import nextConfig from '../../../../../next.config.mjs'
import { NextRequest } from 'next/server'
import { DELETE } from './route'
import { POST } from '../../signin/route'
import { User } from '../../../../model/user'
import { middleware } from '../../../../../middleware'

let mongod: MongoMemoryServer
let token: string
let context: {params: {id: string}}
let testUser: InstanceType<typeof User>


describe('User Delete API', () => {
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
    testUser = await User.create(body)
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
    return new NextRequest(`http://localhost:3000/api/user/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body),
    })
  }

  it('should successfully delete a user', async () => {
    const req = createRequest({ email: 'test@example.com' },token)
    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)

    const res = await DELETE(req, context)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.message).toBe('User deleted successfully')

    const deletedUser = await User.findOne({ email: 'test@example.com' })
    expect(deletedUser).toBeNull()
  })

  it('should return 400 error for invalid request body', async () => {
    const decoded = jwt.verify(token, nextConfig.env.JWT_SECRET!)
    const userId = (decoded as jwt.JwtPayload).userId
    const req = new NextRequest(`http://localhost:3000/api/user/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: 'invalid json',
    })
    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)

    const res = await DELETE(req, context)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid request body')
  })

  it('should return 404 error for non-existent ID', async () => {
    const tokenForNonExistentUser = jwt.sign({ userId: '123456789012345678901234' }, nextConfig.env.JWT_SECRET!)
    const req = createRequest({ email: 'nonexistent@example.com'}, tokenForNonExistentUser, 'nonexistentID' )
    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)

    const res = await DELETE(req, {params: {id: '123456789012345678901234'}})

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized request')
  })

  // for admin permission
  it('should return 401 error for non-admin user deletes another user', async () => {
    // Create a test2 user
    const test2User = new User({
      email: 'test2@example.com',
      password: 'password123',
      permission: 'user'
    })
    await test2User.save()

    // Create a request with test2 user target id
    const req = createRequest({}, token, test2User._id.toString())
    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)
    const res = await DELETE(req, { params: { id: test2User._id.toString() } })

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized request')
  })

  it('should return 201 for admin user deletes another user', async () => {
    // Create a test2 user
    const adminUser = new User({
      email: 'admin@example.com',
      password: 'password123',
      permission: 'admin'
    })
    await adminUser.save()
    // Generate token for admin user
    const adminToken = jwt.sign({ userId: adminUser._id }, nextConfig.env.JWT_SECRET!)

    const req = createRequest({}, adminToken, testUser._id.toString())
    const auth_res = await middleware(req)
    expect(auth_res.status).toBe(200)
    const res = await DELETE(req, { params: { id: testUser._id.toString() } })
    expect(res.status).toBe(200)
  })
})
