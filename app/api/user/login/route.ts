import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../model/user';
import connectDB from '../../../utils/database';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../next.config.mjs'

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  try {

    const { customerId, password } = body;

    if (!customerId || !password) {
      return NextResponse.json({ error: 'Customer ID and password are required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ customerId: customerId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id, permission: user.permission }, JWT_SECRET(), { expiresIn: '1d' });

    return NextResponse.json({ message: 'User logged in successfully', token }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
