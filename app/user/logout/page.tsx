"use client"
import { useEffect } from 'react'

const Logout = () => {
    useEffect(() => {
        if (localStorage.getItem('token')) {
            // トークンをローカルストレージから削除
            localStorage.removeItem('token')
            alert('ログアウトしました')
            // トップページにリダイレクト(セッションクリア)
            window.location.href = '/'
        } 
    }, [])
    return null
}

export default Logout
