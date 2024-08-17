import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { NextRequest } from 'next/server'
import { POST } from './route'
import { User } from '../../../model/user'  // Userモデルをインポート

let mongod: MongoMemoryServer

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

describe('/api/auth/signup', () => {
  const createRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  it('creates a new user successfully', async () => {
    const req = createRequest({ email: 'test@example.com', password: 'StrongPass1!' })
    const res = await POST(req)
    
    //ユーザーが正常に作成できるか
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.message).toBe('User created successfully')
    expect(data.userId).toBeTruthy()

    // ユーザーが見つかるか
    const user = await User.findOne({ email: 'test@example.com' })
    expect(user).toBeTruthy()
    expect(user?.email).toBe('test@example.com')

    // パスワードが正しく記録されているか
    const password_challenge = await user.comparePassword('StrongPass1!')
    expect(password_challenge).toBe(true)

    // プロフィールテキストが空か
    expect(user.profileText).toBe("")

    // プロフィール画像のURLが空か
    expect(user.profilePicture).toBe("")

    // should permission be normal user
    expect(user.permission).toBe("user")
  })

  it('returns 400 for missing email', async () => {
    const req = createRequest({ password: 'StrongPass1!' })
    const res = await POST(req)
    
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Email and password are required')
  })

  it('returns 400 for missing password', async () => {
    const req = createRequest({ email: 'test@example.com' })
    const res = await POST(req)
    
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Email and password are required')
  })

  it('returns 400 for invalid email format', async () => {
    const req = createRequest({ email: 'invalidemail', password: 'StrongPass1!' })
    const res = await POST(req)
    
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error.includes('not a valid email address')).toBe(true)
  })

  it('returns 400 for short password', async () => {
    const req = createRequest({ email: 'test@example.com', password: '1' })
    const res = await POST(req)
    
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error.includes('shorter')).toBe(true)
  })

  it('returns 400 for not allowed character password', async () => {
    const req = createRequest({ email: 'test@example.com', password: '¥' })
    const res = await POST(req)
    
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error.includes('invalid password')).toBe(true)
  })

  it('returns 200 for long password', async () => {
    const req1024 = createRequest({ email: '1024@example.com', password: '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' })
    const res1024 = await POST(req1024)
    expect(res1024.status).toBe(201)

    const req1023 = createRequest({ email: '1023@example.com', password: '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' })
    const res1023 = await POST(req1023)
    expect(res1023.status).toBe(201)
  })

  it('returns 400 for long password', async () => {   
    const req1025 = createRequest({ email: '1025@example.com', password: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' })
    const res1025 = await POST(req1025)

    expect(res1025.status).toBe(400)
    const data = await res1025.json()
    expect(data.error.includes('longer')).toBe(true)
  })

  // より強力なパスワードを受け付ける
  // it('returns 400 for weak password', async () => {
  //   const req = createRequest({ email: 'test@example.com', password: 'Example#####' })
  //   const res = await POST(req)
    
  //   expect(res.status).toBe(400)
  //   const data = await res.json()
  //   console.log(data)
  //   expect(data.error.includes('shorter')).toBe(true)
  // })

  it('returns 409 for existing user', async () => {
    await User.create({ email: 'existing@example.com', password: 'hashedpassword' })
    
    const req = createRequest({ email: 'existing@example.com', password: 'StrongPass1!' })
    const res = await POST(req)
    
    expect(res.status).toBe(409)
    const data = await res.json()
    expect(data.error).toBe('User already exists')
  })

  it('handles empty request body', async () => {
    const req = createRequest({})
    const res = await POST(req)
    
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Email and password are required')
  })

  it('handles malformed JSON in request body', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: 'malformed json',
    })
    const res = await POST(req)
    
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid request body')
  })

  it('trims whitespace from email', async () => {
    const req = createRequest({ email: '  test@example.com  ', password: 'StrongPass1!' })
    const res = await POST(req)
    
    expect(res.status).toBe(201)
    const user = await User.findOne({ email: 'test@example.com' })
    expect(user).toBeTruthy()
  })
})