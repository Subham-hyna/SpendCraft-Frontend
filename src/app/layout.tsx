import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProviders } from "@/store/Providers";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Config from "@/config";
import AuthLoader from "@/components/composite/AuthLoader";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendCraft",
  description: "SpendCraft is a budget tracking app that helps you track your spending and manage your budget.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/android-chrome-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={Config.GOOGLE_CLIENT_ID as string}>
          <ReduxProviders>
            <AuthLoader>
              {children}
            </AuthLoader>
          </ReduxProviders>
        </GoogleOAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
