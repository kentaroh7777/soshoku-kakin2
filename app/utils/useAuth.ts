"use client"
import {useState, useEffect} from "react"
import {useRouter} from "next/navigation"
import jwt from "jsonwebtoken"
import { jwtVerify } from "jose"
import nextConfig from "../../next.config.mjs"
import { JWT_SECRET } from "../../next.config.mjs"

export const PayloadFromTokenServer = async (token: string) => {
    // サーバーサイドの処理
    try{
        const decoded = jwt.verify(token, JWT_SECRET()) as jwt.JwtPayload;
        return decoded;
    }catch(err){
        return null
    }
}
export const PayloadFromTokenClient = async (token: string) => {
    // クライアントサイドの処理
    try{
        const secret = new TextEncoder().encode(JWT_SECRET())
        const decoded = await jwtVerify(token, secret)
        return decoded.payload
    }catch(err){
        return null
    }
}

// ログインユーザーのIDを取得する。呼び出しの初期またはログインしていない場合は、""を返す。
export const loginUserID = (): string =>{
    const [userID,setUserID] = useState("")

    useEffect(()=>{
        const checkToken = async()=>{
            const token =await localStorage.getItem("token") || ""

            if(!token){
                return ""
            }
        
            try{
                // ClientではjwtVerifyを使用しないとうまくいかない？
                const secret = new TextEncoder().encode(JWT_SECRET())
                const decoded = await jwtVerify(token, secret)
                setUserID(decoded.payload.userId as string)
            }catch(err){
                return ""
            }    
        }
        checkToken()
    })

//    return {id: loginUserID, permission: loginUserPermission}
//    return true
    return userID
}

const useAuth = (): {id: string, permission: string} => {
    const [loginUserID,setLoginUserID] = useState("unset")
    const [loginUserPermission,setLoginUserPermission] = useState("unset")
    const router = useRouter()

    useEffect(()=>{
        const checkToken = async()=>{
            const token =await localStorage.getItem("token") || ""

            if(!token){
                console.log("useAuth(): token is null")
                router.push("/user/login")
                return {id: "", permission: ""}
            }
        
            try{
                // ClientではjwtVerifyを使用しないとうまくいかない？
                const secret = new TextEncoder().encode(JWT_SECRET())
                const decoded = await jwtVerify(token, secret)
                setLoginUserID(decoded.payload.userId as string)
                setLoginUserPermission(decoded.payload.permission as string)
            }catch(err){
                console.log("useAuth(): verification error")
                router.push("/user/login")
                return {id: "", permission: ""}
            }    
        }
        checkToken()
    },[router])

//    return {id: loginUserID, permission: loginUserPermission}
//    return true
    return {id: loginUserID, permission: loginUserPermission}
}

export default useAuth