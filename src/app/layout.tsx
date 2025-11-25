import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoginModalProvider } from "../components/LoginModalContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SSKRU Dormitory System",
  description: "ระบบจัดการหอพักนักศึกษามหาวิทยาลัยราชภัฏศรีสะเกษ อำนวยความสะดวกในการจองห้อง ชำระค่าเช่า และติดตามสถานะหอพักอย่างมีประสิทธิภาพ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={inter.variable}>
        <LoginModalProvider>
          {children}
        </LoginModalProvider>
      </body>
    </html>
  );
}
