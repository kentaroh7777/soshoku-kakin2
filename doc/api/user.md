# ユーザー管理の仕様
ユーザーを作成、読み出し、変更、削除できる。既存ユーザーはログインできる。
変更、削除は権限のあるもののみ。

## API
### api/user/signup
emailとpasswordでユーザー作成。誰でも出来る。

### api/user/signin
emailとpasswordを照合する。一致するユーザーが存在した場合、当該ユーザーのIDを含むトークンを返す。以後このトークンを利用してログイン状態を実現できる。ログアウトする場合はトークンを破棄する。

### api/user/read
idまたはemailに一致するユーザー情報を返す。トークン不要。

### api/user/update
権限が必要。権限は、トークン内のIDと一致するユーザーデータ、またはadminがもつ。
パスワードを変更する場合は旧パスワードが一致すること。

### api/user/delete
IDまたはemailアドレスに一致するユーザーをDBから削除する。権限が必要。

### Userエンティティ
```mermaid
erDiagram
    User {
    String id PK 
        String email PK "一意,変更可"
        String password
        String nickname "最長32文字,初期値 User"
        String profileText "プロフィール文"
        String profilePicture "プロフィール画像URL"
        String permission "user(初期値) または admin"
        Date createdAt
        Date updatedAt
    }
```

### ユーザーの状態遷移

```mermaid
stateDiagram-v2
    direction LR
    s1 : 未登録(閲覧者)
    s2 : ログアウト(閲覧者)
    s3 : ログイン(update可能)
    s1 --> s2 : signup(ユーザー作成)
    s2 --> s3 : signin(トークン発行)
    s3 --> s2 : トークン破棄
    s3 --> s1 : delete(ユーザー削除)
```