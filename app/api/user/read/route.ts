import { NextResponse } from 'next/server'
import connectDB from '../../../utils/database'
import { User } from '../../../model/user'

export async function GET(request: Request) {
  try {
    await connectDB()

    const url = new URL(request.url)
    const email = url.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (email === '') {
      return NextResponse.json({ error: 'Email parameter is empty' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const user = await User.findOne({ email }).select('-password')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'GET success', user }, { status: 200 })
  } catch (error) {
    console.error('User read error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
