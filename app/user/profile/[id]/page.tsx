"use client"
import { useEffect, useState } from 'react'
import { StyledInput, SignContainer } from '../../../styles/standardComponents'
import styled from 'styled-components'
import Link from 'next/link'

const StyledHeadText = styled.h3`
    font-size: 0.8rem;
    font-weight: bold;
    margin: 1rem 0 0 0;
`
const StyledElementContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: left;
    width: 100%;
    max-width: 300px;
`


const UserProfile = (context: { params: { id: string } }) => {
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const { id } = context.params

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/user/read/${id}`, {cache: 'no-cache'})
                const data = await response.json()
                if (data.error) {
                    throw new Error(data.error)
                }
                setUser(data.user)
            } catch (error: any) {
                setError(error.message)
            }
        }

        if (id) {
            fetchUser()
        }
    }, [id])

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <>
            <h2>ユーザープロフィール</h2>
            <div className="sign-container">
                <div className="sign-element-container">
                    <h3 className="sign-head-text">プロフィール画像</h3>
                    {user.profilePicture && <img src={user.profilePicture} alt="プロフィール画像" />}
                </div>
                <div className="sign-element-container">
                    <h3 className="sign-head-text">メールアドレス</h3>
                    <StyledInput type="text" value={user.email} readOnly placeholder="メールアドレス" />
                </div>
                <div className="sign-element-container">
                    <h3 className="sign-head-text">ニックネーム</h3>
                    <StyledInput type="text" value={user.nickname} readOnly placeholder="ニックネーム" />
                </div>
                <div className="sign-element-container">
                    <h3 className="sign-head-text">プロフィールテキスト</h3>
                    <StyledInput type="text" value={user.profileText} readOnly placeholder="プロフィールテキスト" />
                </div>
                <a href={`/user/edit/${id}`}>編集画面へ</a>
            </div>
        </>
    )
}

export default UserProfile
