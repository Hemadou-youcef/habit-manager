// Next
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

// React
import { useState } from 'react'

// React Icons
import { FaFolder } from 'react-icons/fa'
import { AiOutlinePlus, AiTwotoneSetting } from 'react-icons/ai'
import { IoLogOutOutline } from 'react-icons/io5'
import { BiSolidArchive } from 'react-icons/bi'
import { MdToday } from 'react-icons/md'

// Styles
import styles from './sidebar.module.css'

// Components
import { useAuth } from '@/components/authProvider';
import Settings from '../settings/settings';
import HabitsGroup from '../forms/habits-group-form/habit-form/habitsGroup';

// Typescript Types
type UserInfo = {
    name: string,
    email: string,
}
type UserLoginInfo = {
    email: string,
    password: string,
}
type HabitsGroups = {
    name: string,
    icon: string,
}



const SideBar = () => {
    const { user, login, logOut }: { user: UserInfo, login: (user: UserLoginInfo) => void, logOut: () => void } = useAuth();
    const habitsGroups: HabitsGroups[] = [{
        name: 'Health',
        icon: 'health',
    },
    {
        name: 'Work',
        icon: 'work',
    },
    {
        name: 'Social',
        icon: 'social',
    }];

    // Hooks
    const currentRoute = usePathname();

    // States
    const [showHabitsGroupForm, setShowHabitsGroupForm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    if (!user) return (
        <>
            <div className={styles.main}>
                <button className={styles.loginBtn}>
                    Login
                </button>
            </div>
        </>
    );
    return (
        <>
            <div className={styles.main}>
                <div className={styles.userCard}>
                    <Image src="https://userprofile.habitify.me/qTR4BX3dkQZOacaXiql0c7uiYQv1%2FprofileImage.jpg?alt=media&token=d336f72d-4af4-4df5-ac9d-390fdb3d2352" alt="Picture of the author" width={26} height={30} />
                    <p>
                        {user.name}
                    </p>
                </div>
                <div className={styles.sections}>
                    <Link href="/">
                        <div className={`${styles.sectionElement} ${currentRoute === '/' ? styles.active : ''}`}>
                            <MdToday size={20} />
                            <p>Today</p>
                        </div>
                    </Link>
                    <Link href="/all-habits">
                        <div className={`${styles.sectionElement} ${currentRoute === '/all-habits' ? styles.active : ''}`}>
                            <BiSolidArchive size={20} />
                            <p>All Habits</p>
                        </div>
                    </Link>
                </div>
                <div className={styles.sections}>
                    <p>
                        Habits Groups
                    </p>
                    {habitsGroups && habitsGroups.map((group, index) => (
                        <Link href={`/habits-group/${group.name}`} key={index}>
                            <div className={`${styles.sectionElement} ${currentRoute === `/habits-group/${group.name}` ? styles.active : ''}`}>
                                <FaFolder size={20} />
                                <p>{group.name}</p>
                            </div>
                        </Link>
                    ))}
                    <div className={styles.sectionElement} onClick={() => setShowHabitsGroupForm(true)}>
                        <AiOutlinePlus size={18} />
                        <p>
                            New Group
                        </p>
                    </div>
                </div>
                <div className={styles.sections}>
                    <p>
                        Preferences
                    </p>
                    <div
                        className={`${styles.sectionElement} ${currentRoute === '/settings' ? styles.active : ''}`}
                        onClick={() => setShowSettings(true)}
                    >
                        <AiTwotoneSetting size={20} />
                        <p>Settings</p>
                    </div>
                    <div className={styles.sectionElement} onClick={() => logOut()}>
                        <IoLogOutOutline size={20} />
                        <p>Logout</p>
                    </div>
                </div>
            </div>
            {showHabitsGroupForm && <HabitsGroup closeForm={() => setShowHabitsGroupForm(false)} />}
            {showSettings && <Settings closeForm={() => setShowSettings(false)} />}
        </>
    );
}

export default SideBar;

