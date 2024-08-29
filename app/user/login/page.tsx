"use client"
import { useState } from 'react'


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            })
            const data = await response.json()
            if (data.error) {
                throw new Error(data.error)
            }
            // トークンをローカルストレージに保存
            localStorage.setItem('token', data.token)
            alert('ログインしました') 
            window.location.href = '/'
        } catch (error: any) {
            alert(`${error}`)
            console.error('Error logging in:', error)
        }
    }

    return (
        <>
            <h2>ログイン</h2>
            <form onSubmit={handleSubmit}>
                <div className="user-container">
                    <input className="user-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレス" />
                    <input className="user-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" />
                    <button className="user-button" type="submit">ログイン</button>
                </div>
            </form>
            <a href="/"><button className="user-button">戻る</button></a>
        </>
    )
}

export default Login