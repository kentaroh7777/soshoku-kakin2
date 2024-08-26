import { NextResponse } from 'next/server'
import connectDB from '../../../../utils/database'
import { User } from '../../../../model/user'

export async function GET(request: Request, context : { params: { id: string } }) {
  try {
    await connectDB()

    if (!context.params.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    const user = await User.findById( context.params.id ).select('-password')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'GET success', user }, { status: 200 })
  } catch (error) {
    console.error('User read error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
