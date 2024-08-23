"use client"
import { useState } from 'react'
import styled from 'styled-components'

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const StyledInput = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
`

const StyledButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
  font-size: 1.0rem;

  &:hover {
    background-color: #45a049;
  }
`

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
        <>
            <h2>ユーザー登録</h2>
            <form onSubmit={handleSubmit}>
                <SignupContainer>
                    <StyledInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレス" />
                    <StyledInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" />
                    <StyledButton type="submit">登録する</StyledButton>
                </SignupContainer>
            </form>
        </>
    )
}

export default Signup