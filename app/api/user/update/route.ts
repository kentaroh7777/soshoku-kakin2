import { NextResponse } from 'next/server'
import mongoose from "mongoose"
import connectDB from '../../../utils/database'
import { userFindByToken } from '../../../model/user'

export async function PUT(request: Request): Promise<NextResponse> {
    try {
        await connectDB()

        let body;
        try {
            body = await request.json();
        } catch (error) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { token, email, oldPassword, newPassword, nickname, profileText, profilePicture } = body;

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 401 });
        }
        // Verify token
        const user = await userFindByToken(token)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
        }

        if (email !== undefined) {
            const trimmedEmail = email.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
                return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
            }
            user.email = trimmedEmail;
        }

        if (newPassword) {
            if (!oldPassword) {
                return NextResponse.json({ error: 'Old password is required to set new password' }, { status: 400 });
            }
            if (!(await user.comparePassword(oldPassword))) {
                return NextResponse.json({ error: 'Incorrect old password' }, { status: 400 });
            }
            user.password = newPassword;
        }

        if (nickname !== undefined) {
            user.nickname = nickname;
        }

        if (profileText !== undefined) {
            user.profileText = profileText;
        }

        if (profilePicture !== undefined) {
            user.profilePicture = profilePicture;
        }

        await user.save();

        return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            console.error('User update validation error:', error);
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json({ error: validationErrors[0] }, { status: 400 });
        }
        console.error('User update error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

}