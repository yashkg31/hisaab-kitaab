import type { Metadata } from "next";
import Script from "next/script"
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hisaab-Kitaab",
  description: "Welcome to Hisaab-Kitaab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en"
         className="dark"
         style={{
          colorScheme: 'dark'
         }}
      >
        <head>
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-7XPZY0V15C"></Script>
          <Script id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-7XPZY0V15C');
            `}
          </Script>
        </head>
        <body className={inter.className}>
          <Toaster richColors position="bottom-right" />
            <RootProviders>
              {children}
            </RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
