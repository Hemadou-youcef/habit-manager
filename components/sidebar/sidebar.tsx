// Next
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

// React
import { useEffect, useState } from 'react'

// React Icons
import { FaFolder } from 'react-icons/fa'
import { AiOutlinePlus, AiTwotoneSetting } from 'react-icons/ai'
import { IoLogOutOutline } from 'react-icons/io5'
import { BiSolidArchive } from 'react-icons/bi'
import { MdToday } from 'react-icons/md'

// Styles
import styles from './sidebar.module.css'

// Components
import useSWR, { mutate } from 'swr';
// import { useAuth } from '@/components/layouts/auth-layout/authProvider';
import { useDataContext } from '../layouts/app-layout/layout';
import Settings from '../settings/settings';
import HabitsGroupForm from '../forms/habits-group-form/habit-form/habitsGroupForm';
import ElementAnimator from '../features/element-animator/elementAnimator';
import HabitsgroupsIcons from '../forms/icons-drop-down/habitsGroupIcons';

// Typescript Types
import { HabitsGroup } from '@prisma/client';


type UserInfo = {
    name: string,
    email: string,
}
type UserLoginInfo = {
    email: string,
    password: string,
}
const getUserHabitsGroups = async () => {

    const response = await fetch('/api/habits-group');
    if (response.status != 200) return [];
    const data = await response.json();
    // setHabitsGroups(data)
    return data;
}

const SideBar = ({ session, status, signOut }: { session: any, status: string, signOut: () => void }) => {
    // const { user, login, logOut }: { user: UserInfo, login: (user: UserLoginInfo) => void, logOut: () => void } = useAuth();
    const { habitsGroupList, refreshGroupListData }: { habitsGroupList: HabitsGroup[], refreshGroupListData: (hb: HabitsGroup) => void } = useDataContext()
    const { data: habitsGroups, error } = useSWR('/api/habits-group', getUserHabitsGroups);

    // Hooks
    const currentRoute = usePathname();

    // States
    const [showHabitsGroupForm, setShowHabitsGroupForm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        mutate('/api/habits-group').then((res) => {
            refreshGroupListData(res);
        })
    }, [habitsGroups])

    if (status === 'loading') {
        return (
            <div className={styles.skeletonSideBar}>
                <div className={styles.user}></div>
                <div className={styles.sections}>

                </div>
            </div>
        )
    }
    if (status === "authenticated") return (
        <>
            <div className={styles.main}>
                <div className={styles.userCard}>
                    <Image src={session?.user?.image || '#'} alt="Picture of the author" width={26} height={26} />
                    <p>
                        {session?.user?.name}
                    </p>
                </div>
                <div className={styles.sections}>
                    <Link href="/">
                        <div className={`${styles.sectionElement} ${currentRoute === '/' ? styles.active : ''}`}>
                            <MdToday size={18} />
                            <p>Today Habits</p>
                        </div>
                    </Link>
                    <Link href="/manage-habits">
                        <div className={`${styles.sectionElement} ${currentRoute === '/manage-habits' ? styles.active : ''}`}>
                            <BiSolidArchive size={18} />
                            <p>Manage Habits</p>
                        </div>
                    </Link>
                </div>
                <div className={styles.sections}>
                    <p>
                        Habits Groups
                    </p>
                    {habitsGroupList && (habitsGroupList as HabitsGroup[]).map((group, index) => (
                        <Link href={`/habits-group/${group.id}`} key={index}>
                            <div className={`${styles.sectionElement} ${currentRoute === `/habits-group/${group.id}` ? styles.active : ''}`}>
                                <HabitsgroupsIcons
                                    currentIcon={group.icon}
                                    showOnlyMode={true}
                                    type={'group'}
                                    onIconChange={(value: string) => { }}
                                />
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
                        <AiTwotoneSetting size={18} />
                        <p>Settings</p>
                    </div>
                    <div className={styles.sectionElement} onClick={() => signOut()}>
                        <IoLogOutOutline size={18} />
                        <p>Logout</p>
                    </div>
                </div>
            </div>
            <ElementAnimator showElement={showHabitsGroupForm} type={0} duration={300}>
                <HabitsGroupForm
                    editMode={false}
                    editHabitsGroup={() => { }}
                    closeForm={() => { setShowHabitsGroupForm(false); mutate('/api/habits-group') }}
                />
            </ElementAnimator>
            <ElementAnimator showElement={showSettings} type={0} duration={300}>
                <Settings closeForm={() => setShowSettings(false)} />
            </ElementAnimator>
        </>
    );
}

export default SideBar;

