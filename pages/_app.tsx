import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head'

import { SessionProvider } from "next-auth/react"
import Layout from '@/components/layouts/app-layout/layout';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Habits Manager</title>
        <meta name="description" content="Habits is the best app you would like to manage your habits" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>


  )
}
