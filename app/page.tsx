import TextDecoratorClient from './components/textDecoratorClient'
import Footer from './components/footer'
import { getSession } from './serverActions'
import { subscribeToConvertKit } from './serverActions'

const Home = async () => {
  const session = await getSession()

  // sessionが有効の場合にconvertkitにsubscribeする
  if (session){
    let subscribedState = ''
    const email = session?.user?.email
    const subscribedResponse=await subscribeToConvertKit(email)
    if( subscribedResponse.state ){
      const subscribedResponseJson=JSON.parse(subscribedResponse.message)
      subscribedState=`Subscription success. Subscriber email: ${email}, ID: ${subscribedResponseJson?.subscription?.subscriber?.id}`
    }
    console.log(subscribedState)
  }

  return(
    <main>
      <TextDecoratorClient session={session} />
      <Footer />
    </main>
  )
}

export default Home