"use client"
import { useState } from 'react'


const Login = () => {
    const [customerId, setCustomerId] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            console.log(`Login credentials: ${customerId}, dummy123`)
            const response = await fetch('/api/user/login', {
                method: 'POST',
                body: JSON.stringify({ customerId: customerId, password: 'dummy123' }),
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
                     <div className="user-element-container">
                        <h3 className="user-head-text">Your Customer ID</h3>
                        <input className="user-input" type="text" name="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="cus_xxxxxxxxxxxxxx" />
                    </div>
                    <button className="user-button" type="submit">ログイン</button>
                </div>
            </form>
            <a href="/"><button className="user-button">戻る</button></a>
        </>
    )
}

export default Login