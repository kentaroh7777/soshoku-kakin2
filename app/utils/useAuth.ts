"use client"
import {useState, useEffect} from "react"
import {useRouter} from "next/navigation"

export const GetPayload = async (token: string) => {
    // クライアントサイドの処理
    try{
        const res = await fetch("/api/user/payload", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        const data = await res.json()
        return data
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
                const data = await GetPayload(token)
                await setUserID(data.userId as string)
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
                const data = await GetPayload(token)
                setLoginUserID(data.userId as string)
                setLoginUserPermission(data.permission as string)
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