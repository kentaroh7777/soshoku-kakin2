'use server'

import { authOptions } from '@/config/auth'
import { getServerSession } from 'next-auth'
import { Session } from 'next-auth'

export async function getSession (): Promise<Session | null> {
  try {
    const session = await getServerSession(authOptions)
    return session
  } catch (error) {
    return null
  }
}

interface SubscriptionData {
  api_key: string;
  email: string;
}
interface SubscriptionResult {
  state: boolean;
  message: string;
}

export async function subscribeToConvertKit(email: string|null|undefined): Promise<SubscriptionResult> {
  if(email===null||email===undefined){
    return { state: false, message: JSON.stringify({error: 'email is required' }) };
  }

  const formId = process.env.CONVERTKIT_FORM_ID!;
  const url = `https://api.convertkit.com/v3/forms/${formId}/subscribe`;

  const data: SubscriptionData = {
    api_key: process.env.CONVERTKIT_API_KEY!,
    email: email
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8'
      },
      body: JSON.stringify(data),
    });
  
    const responseJson = await response?.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(responseJson));
    }

    return { state: true, message: JSON.stringify(responseJson) };
  } catch (error) {
    return { state: false, message: `${error}` };
  }
}

