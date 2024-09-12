import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/global.css";
import Header from "./components/header";
import { getSession } from "./serverActions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Xテキスト装飾ジェネレーター',
  description: 'テキスト装飾ジェネレーターアプリケーション',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()
  // console.log(`session(server/RootLayout): ${JSON.stringify(session)}`)

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header session={session} />
        {children}
      </body>
    </html>
  );
}
