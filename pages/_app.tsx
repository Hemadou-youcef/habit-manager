import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import AuthProvider from '@/components/layouts/auth-layout/authProvider';
import Layout from '@/components/layouts/app-layout/layout';

export default function App({ Component, pageProps:{ session, ...pageProps } }: AppProps) {
  return (
    // <AuthProvider>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    // </AuthProvider>

  )
}
