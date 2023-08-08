import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import AuthProvider from '@/components/authProvider';
import Layout from '@/components/layouts/app-layout/layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>

  )
}
