// Next
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

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

// Typescript Types
type UserInfo = {
    name: string,
    email: string,
    habitsGroups: {
        name: string,
        icon: string,
    }[]
}
type UserLoginInfo = {
    email: string,
    password: string,
}



const SideBar = () => {
    const { user, login, logOut }: { user: UserInfo, login: (user: UserLoginInfo) => void, logOut: () => void } = useAuth();
    const currentRoute = usePathname();

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
                    {user.habitsGroups.map((group, index) => (
                        <Link href={`/habits-group/${group.name}`} key={index}>
                            <div className={`${styles.sectionElement} ${currentRoute === `/habits-group/${group.name}` ? styles.active : ''}`}>
                                <FaFolder size={20} />
                                <p>{group.name}</p>
                            </div>
                        </Link>
                    ))}
                    <div className={styles.sectionElement}>
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
                    <Link href="/settings">
                        <div className={`${styles.sectionElement} ${currentRoute === '/settings' ? styles.active : ''}`}>
                            <AiTwotoneSetting size={20} />
                            <p>Settings</p>
                        </div>
                    </Link>
                    <div className={styles.sectionElement} onClick={() => logOut()}>
                        <IoLogOutOutline size={20} />
                        <p>Logout</p>
                    </div>
                </div>
            </div>

        </>
    );
}

export default SideBar;