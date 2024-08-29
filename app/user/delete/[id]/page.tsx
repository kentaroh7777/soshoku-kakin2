"use client"
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useAuth from '../../../utils/useAuth'

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


const UserDelete = (context: { params: { id: string } }) => {
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const { id } = context.params
    const { id: operatorID, permission } = useAuth()

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
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (window.confirm("本当に削除しますか？")) {
            const token = localStorage.getItem("token") || ""
            // console.log(`targetId: ${targetId}`)
            // console.log(`token: ${token}`)
            // console.log(`body: ${JSON.stringify(user)}`)
            try{
                const response = await fetch(`/api/user/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(user)
                })
                const jsonData = await response.json()
                localStorage.removeItem("token")
                alert("ユーザーを削除しました")
                window.location.href = "/"
            }catch(error){
                alert(`エラーが発生しました。${error}`)
            }
        }
    }
    if (operatorID !== id && permission !== "admin") {
        return <div>権限がありません</div>
    }else{
        return (
            <>
                <h2>ユーザー削除</h2>
    
                <form onSubmit={handleSubmit}>
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
                    <button className="user-button" type="submit">削除</button>
                </div>
                </form>
            </>
        )
    }
}

export default UserDelete
