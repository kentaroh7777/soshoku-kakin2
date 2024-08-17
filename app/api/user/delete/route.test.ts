import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { NextRequest } from 'next/server'
import { DELETE } from './route'
import { User } from '../../../model/user'

let mongod: MongoMemoryServer

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
  })

  const createRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/user/delete', {
      method: 'DELETE',
      body: JSON.stringify(body),
    })
  }

  it('should successfully delete a user', async () => {
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      profileText: 'Test profile',
    })

    const req = createRequest({ email: 'test@example.com' })
    const res = await DELETE(req)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.message).toBe('User deleted successfully')

    const deletedUser = await User.findOne({ email: 'test@example.com' })
    expect(deletedUser).toBeNull()
  })

  it('should return 400 error for invalid request body', async () => {
    const req = new NextRequest('http://localhost:3000/api/user/delete', {
      method: 'DELETE',
      body: 'invalid json',
    })
    const res = await DELETE(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid request body')
  })

  it('should return 400 error for missing email in request body', async () => {
    const req = createRequest({name: 'test'})
    const res = await DELETE(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Email is required')
  })

  it('should return 404 error for non-existent email', async () => {
    const req = createRequest({ email: 'nonexistent@example.com' })
    const res = await DELETE(req)

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toBe('User not found')
  })

  it('should return 400 error for invalid email', async () => {
    const req = createRequest({ email: 'invalid-email' })
    const res = await DELETE(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email address')
  })

  it('should return 400 error for empty email', async () => {
    const req = createRequest({ email: '' })
    const res = await DELETE(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Email is required')
  })
})
