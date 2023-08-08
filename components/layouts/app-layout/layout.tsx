// Next Components
import Head from 'next/head'

// Styles
import styles from './layout.module.css';

// Components
import SideBar from '@/components/sidebar/sidebar'
import ProgressBar from '@/components/progress/progress'
import { useAuth } from '@/components/authProvider';


// Typescript Types
type User = {
    name: string,
    email: string,
    habitsGroups: {
        name: string,
        icon: string,
    }[]
}


const Layout = ({children}: {children: React.ReactNode}) => {
    const { user } : { user: User } = useAuth();
    return (
        <>
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
        </>
    );
}

export default Layout;


// export async function getServerSideProps() {
//     return {
//       props: {
//         user: {
//           name: 'Youcef Hemadou',
//           email: 'youcef.hemadou@hotmail.com',
//           habitsGroups: [
//             {
//               name: 'Health',
//               icon: 'health',
//             },
//             {
//               name: 'Work',
//               icon: 'work',
//             },
//             {
//               name: 'Social',
//               icon: 'social',
//             }
//           ]
//         }
//       }, 
//     }
//   }
