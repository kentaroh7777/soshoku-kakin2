"use client"
import { useState } from 'react'

const Signup = () => {
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
            window.location.href = '/'
        } catch (error: any) {
            alert(`${error}`)
            console.error('Error signing up:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">新規登録</button>
        </form>
    )
}

export default Signup