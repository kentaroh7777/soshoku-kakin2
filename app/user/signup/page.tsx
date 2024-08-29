"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const Signup = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const response = await fetch('/api/user/signup', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            })
            const data = await response.json()
            if (data.error) {
                throw new Error(data.error)
            }
            alert('新規登録が完了しました') 
            router.push('/user/login')
        } catch (error: any) {
            alert(`${error}`)
            console.error('Error logging in:', error)
        }
    }

    return (
        <>
            <h2>ユーザー登録</h2>
            <form onSubmit={handleSubmit}>
                <div className="user-container">
                    <input className="user-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレス" />
                    <input className="user-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" />
                    <button className="user-button" type="submit">登録する</button>
                </div>
            </form>
        </>
    )
}

export default Signup