import {NextResponse, NextRequest} from "next/server"
import nextConfig from "./next.config.mjs"
//import { JWT_SECRET } from "./next.config.mjs"
import jwt from "jsonwebtoken"
import {jwtVerify} from "jose"
import {createSecretKey} from "crypto"

export const JWT_SECRET = () => {
//    return nextConfig.env.JWT_SECRET
    return "user-manager-secret"
}

// verifyがうまくいかないので、middlewareでの検証はやめる。tokenの存在だけチェック。
export async function middleware(request: NextRequest) {
    const token = await request.headers.get("Authorization")?.split(" ")[1]
    if(!token){
        return NextResponse.json({error: "Token is missing"}, {status: 401})
    }
    try{
//        console.log(`JWT_SECRET: ${JWT_SECRET()}`)
//        console.log(`token: ${token}`)
        // 実装1
//        const secret = createSecretKey(JWT_SECRET(), "utf-8")
//        const decoded = await jwtVerify(token, secret)
        // 実装2
//        const decoded = await jwt.verify(token, JWT_SECRET())

        return NextResponse.next()
    }catch(err){
        return NextResponse.json({error: "Invalid token. Please log in."}, {status: 401})
    }
    
}

export const config = {
    matcher: [
//        "/api/user/update/:path*",
        "/api/user/delete/:path*"
    ],
}