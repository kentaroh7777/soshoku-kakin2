import { NextResponse } from 'next/server'
import connectDB from '../../../utils/database'
import { User } from '../../../model/user'
import jwt from "jsonwebtoken"
import nextConfig from '../../../../next.config.mjs'
import { JWT_SECRET } from '../../../../next.config.mjs'

export async function GET(request: Request) {
  try {
    // middlewareは信用できない…
    const token = await request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
        return NextResponse.json({ error: 'Token is missing' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET()) as jwt.JwtPayload
        return NextResponse.json({ message: 'GET success', ...decoded }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Token read error' }, { status: 400 });
    }
  } catch (error) {
    console.error('Token read error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
