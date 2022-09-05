import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { UserProvider } from '@auth0/nextjs-auth0'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { RecoilRoot } from 'recoil'
import '../styles/globals.css'

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Recipe App</title>
      </Head>
      <RecoilRoot>
        <UserProvider>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </UserProvider>
      </RecoilRoot>
    </>
  )
}

export default MyApp
