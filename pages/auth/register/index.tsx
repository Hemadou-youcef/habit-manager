// Next
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from 'next/router';

// React
import { useState } from "react";

// Next Auth
import { getCsrfToken } from "next-auth/react"

// Components
import axios from "axios";
import { useDataContext } from "@/components/layouts/app-layout/layout";

// Styles
import styles from "@/styles/register.module.css";
import Spinner from "@/components/features/spinner/spinner";

const Register = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { theme }: { theme: string } = useDataContext();

    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        axios.post('/api/auth/register', formData)
            .then((res) => {
                router.push('/auth/signIn');
            })
            .catch((err) => {
                setError(err.response.data.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    return (
        <>
            <form method="post" className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.errorMessage}>
                    {error}
                </div>
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <label className={styles.formLabel}>
                    <p className={theme == 'light' ? undefined : styles.text_white}>
                        Name
                    </p>
                    <input type="text" id="Name" name="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </label>
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
                <label className={styles.formLabel}>
                    <p className={theme == 'light' ? undefined : styles.text_white}>
                        Confirm Password
                    </p>
                    <input type="password" id="Password" name="Password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                </label>
                <button
                    type="submit"
                    className={styles.formSubmit}
                    disabled={loading || formData.username.length < 4 || formData.password.length < 4 || formData.name.length < 4 || formData.confirmPassword.length < 4|| formData.password != formData.confirmPassword}
                >
                    {loading ? <Spinner width="14px" height="14px" border="2px" color="white" /> : "Register"}
                </button>
            </form>
            <div className={`${styles.formFooter} ${theme == 'light' ? '' : styles.text_white}`}>
                Already have an account?
                <Link href="/auth/signIn">Sign In</Link>
            </div>
        </>
    );
}

export default Register;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const csrfToken = await getCsrfToken(context)
    return {
        props: { csrfToken },
    }
}