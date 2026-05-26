import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mudinha — plante hábitos, colha sequências",
  description:
    "O app brasileiro de hábitos onde você não falha — só esquece de regar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={cn(
        "h-full antialiased",
        fraunces.variable,
        dmSans.variable
      )}
    >
      <body className="min-h-full flex flex-col font-sans text-stone-800">
        {children}
      </body>
    </html>
  );
}
