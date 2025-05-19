import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Provider } from "../components/ui/provider";
import { SidebarProvider } from "@/context/SidebarProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SahulatPay - Your Gateway to Convenience",
  description: "SahulatPay - Your Gateway to Convenience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <Provider>
          <SidebarProvider>{children}</SidebarProvider>
        </Provider>
      </body>
    </html>
  );
}
