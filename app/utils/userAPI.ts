import { NextResponse } from 'next/server'

export async function userSignupAPI(email: string, password: string) {
    try {
        const response = await fetch('/api/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to sign up')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error calling signup API:', error)
        throw error
    }
}

export async function userDeleteAPI(userId: string) {
    try {
        const response = await fetch(`/api/user/${userId}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to delete user')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error calling delete user API:', error)
        throw error
    }
}
