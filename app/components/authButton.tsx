'use client'

import { signIn, signOut } from 'next-auth/react'
import { RiLoginBoxLine, RiLogoutBoxRLine } from 'react-icons/ri'

export function LoginButton (): JSX.Element {

  const handleLogin = async (): Promise<void> => {
    await signIn()
  }

  return (
    <>
      <button className="user-button" onClick={handleLogin}>
        <RiLoginBoxLine className="header-navi-icon" />
        Googleでログイン
      </button>
    </>
  )
}

export function LogoutButton (): JSX.Element {
  const handleLogout = async (): Promise<void> => {
    await signOut()
  }

  return (
    <>
      <button className="user-button" onClick={handleLogout}>
        <RiLogoutBoxRLine className="header-navi-icon" />
        ログアウト
      </button>
    </>
  )
}