import { NextResponse } from 'next/server'
import mongoose from "mongoose"
import connectDB from '../../../utils/database'
import { User } from '../../../model/user'

export async function POST(request: Request) {
    try {
        await connectDB()

        let body
        try {
            body = await request.json()
        } catch (error) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
        }

        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        const trimmedEmail = email.trim()

        const existingUser = await User.findOne({ email: trimmedEmail })
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 })
        }

        const user = new User({
            email: trimmedEmail,
            password: password,
        })

        await user.save()

        return NextResponse.json({ message: 'User created successfully', userId: user._id }, { status: 201 })
 
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors = Object.values(error.errors).map(err => err.message)
            return NextResponse.json({ error: validationErrors[0] }, { status: 400 })
        }
        console.error('Signup error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}