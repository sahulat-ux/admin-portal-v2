import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Provider } from "../components/ui/provider";
import { SidebarProvider } from "@/context/SidebarProvider";

const nunito = Nunito({
  variable: "--font-nunito",
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
      <body className={`${nunito.variable} antialiased`}>
        <Provider>
          <SidebarProvider>{children}</SidebarProvider>
        </Provider>
      </body>
    </html>
  );
}
