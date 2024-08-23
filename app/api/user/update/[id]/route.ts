import { NextResponse } from 'next/server'
import mongoose from "mongoose"
import connectDB from '../../../../utils/database'
import { User, userFindByToken } from '../../../../model/user'
import nextConfig from '../../../../../next.config.mjs'
import jwt from "jsonwebtoken"


export async function PUT(request: Request, context: {params: {id: string}}): Promise<NextResponse> {
    const targetUserId = context.params.id;

    try {
        await connectDB()

        let body;
        try {
            body = await request.json();
        } catch (error) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { email, oldPassword, newPassword, nickname, profileText, profilePicture, permission } = body;

        // middleware(auth)を通過してるので、headerにtokenは必ず存在する
        const token = await request.headers.get("Authorization")?.split(" ")[1]
        if (!token) {
            return NextResponse.json({ error: 'Token is missing' }, { status: 401 });
        }
        // const secretKey = new TextEncoder().encode(nextConfig.env.JWT_SECRET);
        // const decodedJwt = await jwtVerify(token, secretKey, {algorithms: ['HS256']});

        const decoded = jwt.verify(token, nextConfig.env.JWT_SECRET!)
        const operationUserId = (decoded as jwt.JwtPayload).userId;

        // Verify token
        const targetUser = await User.findById(targetUserId)
        const operationUser = await User.findById(operationUserId)
 

        if (!targetUser) {
            return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
        }
        // permissionがadminでない場合、URLに記載されているIDとトークンに含まれるIDが一致しているかを確認
        if (operationUser.permission !== 'admin') {
            if (operationUser.id !== targetUserId) {
                return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
            }
        }

        if (email !== undefined) {
            const trimmedEmail = email.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
                return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
            }
            targetUser.email = trimmedEmail;
        }

        if (newPassword) {
            if (!oldPassword) {
                return NextResponse.json({ error: 'Old password is required to set new password' }, { status: 400 });
            }
            if (!(await targetUser.comparePassword(oldPassword))) {
                return NextResponse.json({ error: 'Incorrect old password' }, { status: 400 });
            }
            targetUser.password = newPassword;
        }

        if (nickname !== undefined) {
            targetUser.nickname = nickname;
        }
    
        if (profileText !== undefined) {
            targetUser.profileText = profileText;
        }

        if (profilePicture !== undefined) {
            targetUser.profilePicture = profilePicture;
        }

        if (permission !== undefined) {
            if (operationUser.permission !== 'admin') {
                return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
            }
            if (permission !== 'user' && permission !== 'admin') {
                return NextResponse.json({ error: 'Invalid permission' }, { status: 400 });
            }
            targetUser.permission = permission;
        }
        await targetUser.save();

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