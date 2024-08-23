import {NextResponse, NextRequest} from "next/server"
import nextConfig from "./next.config.mjs"
import jwt from "jsonwebtoken"

export async function middleware(request: NextRequest) {
    const token = await request.headers.get("Authorization")?.split(" ")[1]
    if(!token){
        return NextResponse.json({error: "Token is missing"}, {status: 401})
    }
    try{
        const decoded = await jwt.verify(token, nextConfig.env.JWT_SECRET!)

        return NextResponse.next()
    }catch(err){
        return NextResponse.json({error: "Invalid token. Please log in."}, {status: 401})
    }
    
}

export const config = {
    matcher: [
        "/api/user/update/:path*",
        "/api/user/delete/:path*"
    ],
}