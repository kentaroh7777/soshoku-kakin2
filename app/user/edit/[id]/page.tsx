"use client"
import { useEffect, useState } from 'react'
import { StyledInput, SignContainer, StyledButton } from '../../../styles/standardComponents'
import styled from 'styled-components'
import useAuth from '../../../utils/useAuth'
import { PayloadFromTokenClient } from '../../../utils/useAuth'
import { useRouter } from 'next/navigation'

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


const UserEdit = (context: { params: { id: string } }) => {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
//    const [operator,setOperator] = useState<any>(null)
    const operator = useAuth()

    const targetId = context.params.id
    const operatorId = operator.id
    const operatorPermission = operator.permission
 
    // operatorはuseAuth内のuseEffectが実行されるまで未設定のものが返される。つまりレンダリングが始まるまでは使えない。これを確認するためのコードがこちら。
    // console.log(`operator ID: ${operatorId}`)
    // console.log(`operator permission: ${operatorPermission}`)


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/user/read/${targetId}`, {cache: 'no-cache'})
                const data = await response.json()
                if (data.error) {
                    throw new Error(data.error)
                }
                setUser({...data.user, oldPassword: "", newPassword: ""})
            } catch (error: any) {
                setError(error.message)
            }
        }

        if (targetId) {
            fetchUser()
        }
    }, [targetId])

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!user) {
        return <div>Loading...</div>
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const token = localStorage.getItem("token") || ""
        // console.log(`targetId: ${targetId}`)
        // console.log(`token: ${token}`)
        // console.log(`body: ${JSON.stringify(user)}`)
        try{
            const response = await fetch(`/api/user/update/${targetId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            })
            const jsonData = await response.json()
            if (jsonData.error === undefined) {
                alert("ユーザー情報を更新しました。")
            } else {
                alert(`更新できませんでした。${jsonData.error}`)
            }
            router.push(`/user/profile/${targetId}`)
        }catch(error){
            alert(`エラーが発生しました。${error}`)
        }
 
    }
    if(operator && ( operatorId === targetId || operatorPermission === "admin" ) ){
        return (
            <>
                <h2>ユーザープロフィール編集</h2>

                <form onSubmit={handleSubmit}>
                <div className="sign-container">
                    <div className="sign-element-container">
                        <h3 className="sign-head-text">プロフィール画像</h3>
                        {user.profilePicture && <img src={user.profilePicture} alt="プロフィール画像" />}
                    </div>
                    <div className="sign-element-container">
                        <h3 className="sign-head-text">メールアドレス</h3>
                        <input type="text" name="email" value={user.email} onChange={handleChange} placeholder="メールアドレス" />
                    </div>
                    <div className="sign-element-container">
                        <h3 className="sign-head-text">ニックネーム</h3>
                        <input type="text" name="nickname" value={user.nickname} onChange={handleChange} placeholder="ニックネーム" />
                    </div>
                    <div className="sign-element-container">
                        <h3 className="sign-head-text">プロフィールテキスト</h3>
                        <input type="text" name="profileText" value={user.profileText} onChange={handleChange} placeholder="プロフィールテキスト" />
                    </div>
                    <div className="sign-element-container">
                        <h3 className="sign-head-text">旧パスワード（変更希望時のみ）</h3>
                        <input type="password" name="oldPassword" value={user.oldPassword} onChange={handleChange} placeholder="旧パスワード" />
                    </div>
                    <div className="sign-element-container">
                        <h3 className="sign-head-text">新パスワード（変更希望時のみ）</h3>
                        <input type="password" name="newPassword" value={user.newPassword} onChange={handleChange} placeholder="新パスワード" />
                    </div>
                    <button type="submit">更新</button>
                </div>
                </form>
            </>
        )
    } else {
        return <div>You are not authorized to edit this user.</div>
    }
}

export default UserEdit