import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "./globals.css";
import {SessionProvider} from "next-auth/react";

const robotoSans = Roboto({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MDT",
    description: "MDT de la Police, EMS et Justice",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${robotoSans.variable} antialiased min-h-screen h-screen`}
        >
        <SessionProvider>
            {children}
        </SessionProvider>
        </body>
        </html>
    );
}
