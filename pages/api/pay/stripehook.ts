// ここにStripeのWebhookを受け取る処理を書く
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { buffer } from 'micro';
import Stripe from 'stripe';
import connectDB from '../../../app/utils/database';
import { User } from '../../../app/model/user';
import sendEmail from '../../../app/utils/sendEmail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY||'', {
  apiVersion: '2024-06-20',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const sendEmailToCustomer = async (email: string, customerId: string) => {
    console.log(`sendEmailToCustomer email: ${email}`);
    console.log(`sendEmailToCustomer customerId: ${customerId}`);
    await sendEmail(email,
         '【重要】装飾アプリログイン情報',
         `
         ログイン情報

         以下のURLにアクセスし、Customer IDを入力してログインしてください。
         ---------------
         URL: https://soshoku-kakin2.vercel.app/user/login
         Your Customer ID: ${customerId}
         ---------------
        
         `
        );
}

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
  await connectDB();

//  console.log(`stripehook req.method: ${req.method}`);

  if (req.method === 'POST') {
//    const body = await req.json();
//    console.log(`stripehook body: ${JSON.stringify(body)}`);

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    // console.log(`stripehook bus: ${buf}`);
    // console.log(`stripehook sig: ${sig}`);

    let event;

    if (!sig) {
        console.log(`⚠️  Webhook signature is missing.`);
        return NextResponse.json({error: 'Webhook Error: Webhook signature is missing'}, {status: 400});
    }
    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET||'');
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, (err as Error).message);
      return NextResponse.json({error: `Webhook Error: ${(err as Error).message}`}, {status: 400});
    }

    // Handle the event
//    console.log(`stripehook event.type: ${event.type}`);
    switch (event.type) {

      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object;
        // Then define and call a function to handle the event customer.subscription.created
        // ここでユーザー新規作成。StripeのIDに重複はないとする
        const customer = await stripe.customers.retrieve(subscriptionCreated.customer as string);
        let email: string = "";
        if ( 'email' in customer && customer.email!==null) {
            console.log(`Customer email: ${customer.email}`);
            email = customer.email as string;
        }
        const userCreated = new User({
            customerId: subscriptionCreated.customer, //keyとして使う
            email: email,
            password: 'dummy123',
        })
        await userCreated.save();
        console.log(`Customer ID:${subscriptionCreated.customer} user was created!`);
        // ★ここにemail送信の実装を
        if (email !== "") {
            await sendEmailToCustomer(email, subscriptionCreated.customer as string);
        }
        break;

      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object;
        // Then define and call a function to handle the event customer.subscription.deleted
        // ここでユーザー削除
        const userDeleted = await User.findOne({ customerId: subscriptionDeleted.customer });
        await userDeleted?.deleteOne();
        console.log(`Customer ID:${subscriptionDeleted.customer} user was deleted!`);
        break;

      default:
//        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

