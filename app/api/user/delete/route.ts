import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../model/user';
import connectDB from '../../../utils/database';

export async function DELETE(req: NextRequest) {
  try {
    // MongoDBに接続
    await connectDB();
   
    // リクエストボディの検証
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // メールアドレスの存在確認
    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // メールアドレスの形式確認
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // ユーザーの検索と削除
    const deletedUser = await User.findOneAndDelete({ email: body.email });

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

} catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

