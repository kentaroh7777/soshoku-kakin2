import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GlobalStyle from "./styles/globalStyles";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "User Manager",
  description: "User management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalStyle />
        {children}
      </body>
    </html>
  );
}
