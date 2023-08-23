// Next Components
import Head from 'next/head'
import { useRouter } from 'next/router';

// Auth
import { useSession, signIn, signOut } from "next-auth/react"

// React Components
import { createContext, use, useContext, useEffect, useState } from 'react';

// Styles
import styles from './layout.module.css';
import stylesDarkTheme from './layoutDarkTheme.module.css';

// Components
import SideBar from '@/components/sidebar/sidebar'
import ProgressBar from '@/components/progress/progress'

// Typescript Types
import { Habit, HabitsGroup } from '@/types';

// Context
const DataContext = createContext<any>(null);


const Layout = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
    const [habitsGroupList, setHabitsGroupList] = useState<HabitsGroup[]>([]);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        setTheme(localStorage.getItem('theme') || 'light');
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated' && router.pathname !== '/auth/signIn') {
            router.push('/auth/signIn');
        }
    }, [status]);

    const selectHabit = (habit: Habit | null) => {
        setSelectedHabit(habit);
    }
    const refreshGroupListData = (groupList: HabitsGroup[]) => {
        setHabitsGroupList(groupList)
    }
    const handleToggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
    }

    const dataContextValue = {
        selectedHabit,
        selectHabit,
        habitsGroupList,
        refreshGroupListData,
        theme,
        handleToggleTheme,
    }


    const stylesTheme = (theme === 'light') ? styles : stylesDarkTheme;

    if (status === 'loading' || (status === 'authenticated' && !session) || (status === 'unauthenticated' && window.location.pathname != '/auth/signIn')) return (
        <>
            <div className={styles.pageLoading}>
                <div className={styles.spinner}>
                </div>
            </div>
        </>
    );
    return (
        <DataContext.Provider value={dataContextValue}>
            <Head>
                <title>Habits</title>
                <meta name="description" content="Habits is the best app you would like to manage your habits" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {(status === 'authenticated') &&
                <main className={`${(status === 'authenticated') ? stylesTheme.app : stylesTheme.notLoggedApp}`}>

                    <div className={stylesTheme.sidebar}>
                        <SideBar session={session} status={status} signOut={signOut} />
                    </div>
                    <div className={stylesTheme.main}>
                        {children}
                    </div>
                    <div className={stylesTheme.progress}>
                        <ProgressBar />
                    </div>
                </main>
            }
            {(status === 'unauthenticated') && window.location.pathname === '/auth/signIn' &&
                <div className={stylesTheme.notLogged}>
                    <div className={stylesTheme.notLoggedContent}>
                        <div className={stylesTheme.notLoggedTitle}>
                            Habits Manager
                        </div>
                        <div className={stylesTheme.notLoggedDescription}>
                            The best app to manage your habits
                        </div>
                        {children}
                    </div>
                </div>
            }
        </DataContext.Provider >
    );
}

export default Layout;
export const useDataContext = () => useContext(DataContext);