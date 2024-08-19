import { NextRequest, NextResponse } from 'next/server';
import { User, userFindByToken } from '../../../../model/user';
import connectDB from '../../../../utils/database';

export async function DELETE(request: Request, context: {params: {id: string}}): Promise<NextResponse> {
  const targetUserId = context.params.id;

  try {
    // MongoDBに接続
    await connectDB();
   
    // リクエストボディの検証
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const token = body.token;
    if (!token) {
        return NextResponse.json({ error: 'Token is required' }, { status: 401 });
    }
    // Verify token
    const targetUser = await User.findById(targetUserId)
    const operationUser = await userFindByToken(token)

    if (!targetUser) {
        return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
    }
    // permissionがadminでない場合、URLに記載されているIDとトークンに含まれるIDが一致しているかを確認
    if (operationUser.permission !== 'admin') {
        if (operationUser.id !== targetUserId) {
            return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
        }
    }

    // ユーザーの検索と削除
    const deletedUser = await User.findByIdAndDelete(targetUserId);

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

} catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

