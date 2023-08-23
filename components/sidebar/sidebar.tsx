// Next
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

// React
import { useEffect, useState } from 'react'

// React Icons
import { AiOutlinePlus } from 'react-icons/ai'
import { IoLogOutOutline } from 'react-icons/io5'
import { BiSolidArchive } from 'react-icons/bi'
import { MdToday,MdDarkMode } from 'react-icons/md'
import { BsFillSunFill } from 'react-icons/bs'

// Styles
import styles from './sidebar.module.css'
import stylesDarkTheme from './sidebarDarkTheme.module.css'

// Components
import useSWR, { mutate } from 'swr';
import { useDataContext } from '../layouts/app-layout/layout';
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
    const { habitsGroupList, refreshGroupListData, theme, handleToggleTheme }: { habitsGroupList: HabitsGroup[], refreshGroupListData: (hb: HabitsGroup) => void, theme: string, handleToggleTheme: () => void } = useDataContext()
    const { data: habitsGroups, error } = useSWR('/api/habits-group', getUserHabitsGroups);

    // Hooks
    const currentRoute = usePathname();

    // States
    const [showHabitsGroupForm, setShowHabitsGroupForm] = useState(false);
    const stylesTheme = (theme === 'light') ? styles : stylesDarkTheme;

    useEffect(() => {
        mutate('/api/habits-group').then((res) => {
            if (res) refreshGroupListData(res);
        })
    }, [habitsGroups])


    if (status === 'loading') {
        return (
            <div className={stylesTheme.skeletonSideBar}>
                <div className={stylesTheme.user}></div>
                <div className={stylesTheme.sections}>

                </div>
            </div>
        )
    }
    if (status === "authenticated") return (
        <>
            <div className={stylesTheme.main}>
                <div className={stylesTheme.userCard}>
                    <Image src={session?.user?.image || '#'} alt="Picture of the author" width={26} height={26} />
                    <p>
                        {session?.user?.name}
                    </p>
                </div>
                <div className={stylesTheme.sections}>
                    <Link href="/">
                        <div className={`${stylesTheme.sectionElement} ${currentRoute === '/' ? stylesTheme.active : ''}`}>
                            <MdToday size={18} />
                            <p>Today Habits</p>
                        </div>
                    </Link>
                    <Link href="/manage-habits">
                        <div className={`${stylesTheme.sectionElement} ${currentRoute === '/manage-habits' ? stylesTheme.active : ''}`}>
                            <BiSolidArchive size={18} />
                            <p>Manage Habits</p>
                        </div>
                    </Link>
                </div>
                <div className={stylesTheme.sections}>
                    <p>
                        Habits Groups
                    </p>
                    {habitsGroupList && (habitsGroupList as HabitsGroup[]).map((group, index) => (
                        <Link href={`/habits-group/${group.id}`} key={index}>
                            <div className={`${stylesTheme.sectionElement} ${currentRoute === `/habits-group/${group.id}` ? stylesTheme.active : ''}`}>
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
                    <div className={stylesTheme.sectionElement} onClick={() => setShowHabitsGroupForm(true)}>
                        <AiOutlinePlus size={18} />
                        <p>
                            New Group
                        </p>
                    </div>
                </div>
                <div className={stylesTheme.sections}>
                    <p>
                        Preferences
                    </p>
                    <div
                        className={stylesTheme.sectionElement}
                        onClick={() => handleToggleTheme()}
                    >
                        {/* <TbSunMoon size={18} /> */}
                        {theme === 'dark' ? <BsFillSunFill size={18} /> : <MdDarkMode size={18} />}
                        <p>
                            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                        </p>
                    </div>
                    <div className={stylesTheme.sectionElement} onClick={() => signOut()}>
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
        </>
    );
}

export default SideBar;

