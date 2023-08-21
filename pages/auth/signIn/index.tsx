// Next 
import Image from "next/image";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

// Next Auth
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// React
import { useState } from "react";

// Styles
import styles from "@/styles/signIn.module.css";


export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [loading, setLoading] = useState(false);
    const handleProviderSignIn = (providerId: string) => {
        const providers = ['google', 'facebook', 'github', 'twitter', 'email'];
        const providersStyles = [styles.googleSignInButton, styles.facebookSignInButton, styles.githubSignInButton, styles.twitterSignInButton, styles.emailSignInButton];
        const index = providers.indexOf(providerId.toLowerCase());
        if (index >= 0) {
            return providersStyles[index];
        }
        return styles.emailSignInButton;
    }

    const handleSignIn = (providerId: string) => {
        if (loading) return;
        setLoading(true);
        signIn(providerId, { callbackUrl: '/' });
    }

    return (
        <>
            {Object.values(providers).map((provider) => (
                <div key={provider.name} className={styles.signInButtonContent}>
                    <button onClick={() => handleSignIn(provider.id)} className={`${styles.signInButton} ${handleProviderSignIn(provider.id)}`}>
                        {loading ?
                            (
                                <div className={styles.spinner}></div>
                            ) : (
                                <>

                                    <Image src={`/icons//${provider.name}.svg`} width={30} height={30} alt={provider.name} />
                                    <p>Continue with {provider.name}</p>
                                </>
                            )}
                    </button>
                </div>
            ))}
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
        return { redirect: { destination: "/" } };
    }

    const providers = await getProviders();

    return {
        props: { providers: providers ?? [] },
    }
}