// Next Components
import Head from 'next/head'

// React Components
import { createContext, useContext, useState } from 'react';

// Styles
import styles from './layout.module.css';

// Components
import SideBar from '@/components/sidebar/sidebar'
import ProgressBar from '@/components/progress/progress'


// Typescript Types
// type User = {
//     name: string,
//     email: string,
//     habitsGroups: {
//         name: string,
//         icon: string,
//     }[]
// }

// Context
const DataContext = createContext<any>(null);


const Layout = ({ children }: { children: React.ReactNode }) => {
    const [selectedHabit, setSelectedHabit] = useState(null);

    const selectHabit = (habit: any) => {
        setSelectedHabit(habit);
    }
    const dataContextValue = {
        selectedHabit,
        selectHabit,
    }
    return (
        <DataContext.Provider value={dataContextValue}>
            <Head>
                <title>Habits</title>
                <meta name="description" content="Habits is the best app you would like to manage your habits" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={`${styles.app}`}>
                <div className={styles.sidebar}>
                    <SideBar />
                </div>
                <div className={styles.main}>
                    {children}
                </div>
                <div className={styles.progress}>
                    <ProgressBar />
                </div>
            </main>
        </DataContext.Provider>
    );
}

export default Layout;
export const useDataContext = () => useContext(DataContext);