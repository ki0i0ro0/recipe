import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { UserProvider } from '@auth0/nextjs-auth0'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" type="image/png" href="favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicon.png" />
      </Head>
      <UserProvider>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </UserProvider>
    </>
  )
}

export default MyApp
