"use client"
import { useEffect, useState } from 'react'
import styled from 'styled-components'

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
                const response = await fetch(`/api/user/read/${id}`, {cache: 'no-cache'})
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
            <div className="user-container">
                <div className="user-element-container">
                    <h3 className="user-head-text">プロフィール画像</h3>
                    {user.profilePicture && <img src={user.profilePicture} alt="プロフィール画像" />}
                </div>
                <div className="user-element-container">
                    <h3 className="user-head-text">メールアドレス</h3>
                    <input className="user-input" type="text" value={user.email} readOnly placeholder="メールアドレス" />
                </div>
                <div className="user-element-container">
                    <h3 className="user-head-text">ニックネーム</h3>
                    <input className="user-input" type="text" value={user.nickname} readOnly placeholder="ニックネーム" />
                </div>
                <div className="user-element-container">
                    <h3 className="user-head-text">プロフィールテキスト</h3>
                    <input className="user-input" type="text" value={user.profileText} readOnly placeholder="プロフィールテキスト" />
                </div>
                <a href={`/user/edit/${id}`}>編集画面へ</a>
                <a href="/"><button className="user-button">戻る</button></a>
            </div>
        </>
    )
}

export default UserProfile
