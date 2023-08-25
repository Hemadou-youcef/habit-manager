// Next 
import Image from "next/image";
import Link from "next/link";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

// Next Auth
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// React
import { useState } from "react";
import { useDataContext } from "@/components/layouts/app-layout/layout";

// Components
import Spinner from "@/components/features/spinner/spinner";

// Styles
import styles from "@/styles/signIn.module.css";


export default function SignIn({ providers, errorValue }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { theme }: { theme: string } = useDataContext();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const handleProviderSignIn = (providerId: string) => {
        const providers = ['google', 'facebook', 'github', 'twitter', 'email'];
        const providersStyles = [styles.googleSignInButton, styles.facebookSignInButton, styles.githubSignInButton, styles.twitterSignInButton, styles.emailSignInButton];
        const index = providers.indexOf(providerId.toLowerCase());
        if (index >= 0) {
            return providersStyles[index];
        }
        return styles.emailSignInButton;
    }
    const [error, setError] = useState(errorValue || '');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignIn = (providerId: string) => {
        if (loading) return;
        setLoading(true);
        signIn(providerId, { callbackUrl: '/' })
        .finally(() => {
            setLoading(false);
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginLoading(true);
        signIn('credentials', { username: formData.username, password: formData.password, callbackUrl: '/' })
    }

    return (
        <>
            <form method="post" className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.errorMessage}>
                    {error}
                </div>
                <label className={styles.formLabel}>
                    <p className={theme == 'light' ? undefined : styles.text_white}>
                        Username
                    </p>
                    <input type="text" id="Username" name="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                </label>
                <label className={styles.formLabel}>
                    <p className={theme == 'light' ? undefined : styles.text_white}>
                        Password
                    </p>
                    <input type="password" id="Password" name="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </label>
                <button type="submit" className={styles.formSubmit}>
                    {loginLoading ? <Spinner width="14px" height="14px" border="2px" color="white" /> : "Login"}
                </button>
            </form>
            <div className={`${styles.formFooter} ${theme == 'light' ? '' : styles.text_white}`}>
                Don't have an account?&nbsp;
                <Link href="/auth/register">Register</Link>
            </div>
            <div className={`${styles.splitter} ${theme == 'light' ? '' : styles.text_white}`}>
                OR
            </div>
            {Object.values(providers).map((provider) => {
                if (provider.id === 'google') {
                    return (
                        <div key={provider.name} className={styles.signInButtonContent}>
                            <button onClick={() => handleSignIn(provider.id)} className={`${styles.signInButton} ${handleProviderSignIn(provider.id)}`}>
                                {loading ?
                                    (
                                        <div className={styles.spinner}></div>
                                    ) : (
                                        <>

                                            <Image src={`/icons/${provider.name}.svg`} width={30} height={30} alt={provider.name} />
                                            <p>Continue with {provider.name}</p>
                                        </>
                                    )}
                            </button>
                        </div>
                    )
                }
                return null;
            })}
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    // GET ERROR FROM QUERY PARAMS
    const error = context.query.error;

    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
        return { redirect: { destination: "/" } };
    }

    const providers = await getProviders();

    return {
        props: {
            providers: providers ?? [],
            errorValue: error ?? '',
        },
    }
}