"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "recipe",
//   description: "random recipe app",
// };

const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" type="image/png" href="favicon.png" />
        <meta name="theme-color" content="#fff" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <ApolloProvider client={client}>{children}</ApolloProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
