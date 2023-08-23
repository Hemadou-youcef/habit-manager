// Next
import { useRouter } from 'next/router';

// React 
import { useEffect, useState } from 'react';

// Styles
import styles from './habitsList.module.css';
import stylesDarkTheme from './habitsListDarkTheme.module.css';

// Icons 
import { AiFillEdit, AiOutlinePlus } from 'react-icons/ai';
import { FiCalendar } from 'react-icons/fi';

// Components
import { useDataContext } from '@/components/layouts/app-layout/layout';
import HabitsItem from '../../list-item/habits-item/habitsItem';
import HabitForm from '@/components/forms/habit-form/habitForm';
import HabitsGroupForm from '@/components/forms/habits-group-form/habit-form/habitsGroupForm';
import ElementAnimator from '@/components/features/element-animator/elementAnimator';
import Overlay from '@/components/features/overlay/overlay';
import Calendar from 'react-calendar';

// Typescript Types
import { HabitsGroup, Habit, HabitWithProgress, Progress } from '@/types/index';
type habitList = {
    title: string;
    habitsGroup?: HabitsGroup;
    readOnly: boolean;
    habits: Habit[][] | HabitWithProgress[][];
    loading: boolean;
    onChangeDate: (date: Date) => void;
    refresh: () => void;
}
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];


const HabitsList = ({ title, habitsGroup, readOnly, habits, loading, onChangeDate, refresh }: habitList) => {
    const { theme }: { theme: string } = useDataContext();
    const stylesTheme = (theme === 'light') ? styles : stylesDarkTheme;

    const [habitsGroupInfo, setHabitsGroupInfo] = useState<HabitsGroup | undefined>(habitsGroup)
    const [habitList, setHabitList] = useState<Habit[][] | HabitWithProgress[][]>(habits);

    const [tabIndex, setTabIndex] = useState<number>(0);
    const [currentHabitSection, setCurrentHabitSection] = useState<(Habit[] | string | boolean)[][]>([]);

    const [currentDate, setCurrentDate] = useState<Value>(new Date());

    const [showHabitsGroupForm, setShowHabitsGroupForm] = useState<boolean>(false);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);

    const [showHabitForm, setShowHabitForm] = useState<boolean>(false);
    const [habitEditData, setHabitEditData] = useState<Habit | null>(null);
    const [habitEditMode, setHabitEditMode] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        setHabitList(habits);
        handleTabChange(tabIndex, habits);
    }, [habits]);

    useEffect(() => {
        setHabitsGroupInfo(habitsGroup);
    }, [habitsGroup]);

    function formatDate(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleTabChange = (tabNumber: number, _habitList: (Habit | Habit[])[][]) => {
        switch (tabNumber) {
            case 0:
                setCurrentHabitSection([[_habitList[0] as Habit[], 'Good', true], [_habitList[1] as Habit[], 'Bad', true]]);
                break;
            case 1:
                setCurrentHabitSection([[_habitList[2] as Habit[], 'Done', true]]);
                break;
            case 2:
                setCurrentHabitSection([[_habitList[3] as Habit[], 'Fail', true]]);
                break;
        }
        setTabIndex(tabNumber);
    }

    const handleEditHabitsGroup = (habitsGroup: HabitsGroup | null): void => {
        if (habitsGroup) setHabitsGroupInfo(habitsGroup)
        else router.push("/");
    }

    const handleEditHabit = (habit: Habit): void => {
        setHabitEditData(habit)
        setHabitEditMode(true)
        setShowHabitForm(true)
    }

    const resetValues = (): void => {
        setShowHabitsGroupForm(false)
        setShowCalendar(false)
        setShowHabitForm(false)
        setHabitEditData(null)
        setHabitEditMode(false)
    }

    const handleEditHabitProgress = (section: string, habit: HabitWithProgress): boolean => {

        ['Good', 'Bad', 'Done', 'Fail'].forEach((value, index) => {
            // IF THE HABIT NOT FROM THIS SECTION IGNORE IT
            if (value != section) return;

            // CHECK IF THE HABIT MUST BE REPLACED TO ANOTHER SECTION
            let _mustReplace = false;
            if (habit.type == 'bad') _mustReplace = true
            else _mustReplace = ((habit.progress as Progress).value >= habit.goalsValue && habit.goalsValue > 0) || ((habit.progress as Progress).value == 0 && value == 'Done');

            // SEARCH FOR THE HABIT IN THIS CURRENT SECTION
            const HabitIndex = habitList[index].findIndex((h) => h.id === habit.id);
            if (HabitIndex !== -1) {
                // CREATE NEW HABIT LISTS FOR REPLACING OLDER ONE
                let newHabitLists = [...habitList];
                if (_mustReplace) {
                    // DELETE OLD HABIT FROM THIS SECTION
                    newHabitLists[index] = newHabitLists[index].filter((_, i) => i != HabitIndex)
                    // REPLACE IT INTO ANOTHER SECTION
                    if (habit.type == 'good') newHabitLists[(index == 0) ? 2 : 0].push(habit as HabitWithProgress)
                    else newHabitLists[(index == 1) ? 3 : 1].push(habit as HabitWithProgress)
                } else {
                    // REPLACE THE OLD HABIT BY NEW ONE
                    newHabitLists[0][HabitIndex] = habit;
                }
                setHabitList(newHabitLists);
            }
        })
        resetValues()
        return false;
    }

    return (
        <>
            <div className={stylesTheme.content}>
                <div className={stylesTheme.header}>
                    <p className={stylesTheme.title}>{habitsGroupInfo?.name || title}</p>
                    <div className={stylesTheme.actions}>
                        {habitsGroupInfo?.id ? (
                            <button className={stylesTheme.editHabitButton} onClick={() => setShowHabitsGroupForm(true)}>
                                <AiFillEdit size={15} />
                                {/* Edit Group */}
                            </button>
                        ) : (
                            <button
                                className={stylesTheme.editDateButton}
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                <FiCalendar size={15} />
                                {formatDate(currentDate as Date)}
                            </button>
                        )}
                        <button className={stylesTheme.addButton} onClick={() => setShowHabitForm(true)}>
                            <AiOutlinePlus size={15} />
                            {/* Add Habits */}
                        </button>
                    </div>
                </div>
                <div className={stylesTheme.body}>
                    {!readOnly &&
                        <div className={stylesTheme.habitsSections}>
                            <button
                                style={{
                                    color: theme === 'light' ? '#2a67f4' : '#9ebbff',
                                    borderColor: theme === 'light' ? '#2a67f4' : '#9ebbff'
                                }}
                                className={tabIndex == 0 ? stylesTheme.active : undefined}
                                onClick={() => handleTabChange(0, habitList)}
                            >
                                Pending Habits
                            </button>
                            <button
                                style={{
                                    color: theme === 'light' ? '#1ec448' : '#43df6a',
                                    borderColor: theme === 'light' ? '#1ec448' : '#43df6a'
                                }}
                                className={tabIndex == 1 ? stylesTheme.active : undefined}
                                onClick={() => handleTabChange(1, habitList)}
                            >
                                {`Done Habits (${habitList[2].length})`}
                            </button>
                            <button
                                style={{
                                    color: theme === 'light' ? '#ff2828' : '#f76868',
                                    borderColor: theme === 'light' ? '#ff2828' : '#f76868'
                                }}
                                className={tabIndex == 2 ? stylesTheme.active : undefined}
                                onClick={() => handleTabChange(2, habitList)}
                            >
                                {`Fail Habits (${habitList[3].length})`}
                            </button>
                        </div>
                    }
                    <div className={stylesTheme.habits}>
                        {loading && <p className={stylesTheme.loading}>Loading...</p>}
                        {!loading && (currentHabitSection).filter((value) => (value[0] as Habit[]).length != 0).length == 0 && <p className={stylesTheme.noHabits}>No Habits Found</p>}
                        {currentHabitSection.map((value, index) => (
                            <HabitsItem
                                title={`${value[1]} Habits`}
                                isOpen={value[2] as boolean}
                                habitList={value[0] as Habit[]}
                                handleEditHabit={handleEditHabit}
                                handleEditHabitProgress={(habit: HabitWithProgress) => handleEditHabitProgress(value[1] as string, habit)}
                                readOnly={false}
                                key={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <ElementAnimator showElement={showHabitsGroupForm} type={0} duration={300}>
                <HabitsGroupForm
                    data={habitsGroupInfo as HabitsGroup}
                    editMode={true}
                    editHabitsGroup={handleEditHabitsGroup}
                    closeForm={() => resetValues()}
                />
            </ElementAnimator>
            <ElementAnimator showElement={showHabitForm} type={0} duration={300}>
                <HabitForm
                    defaulGrouptValues={habitsGroup?.id}
                    data={habitEditData}
                    editMode={habitEditMode}
                    refresh={() => refresh()}
                    closeForm={() => resetValues()}
                />
            </ElementAnimator>
            <ElementAnimator showElement={showCalendar} type={0} duration={300}>
                <Overlay closeOverlay={() => setShowCalendar(!showCalendar)} closeOnBackgroundClick>
                    <Calendar onChange={(value) => { setCurrentDate(value); onChangeDate(value as Date); setShowCalendar(!showCalendar) }} value={currentDate} />
                </Overlay>
            </ElementAnimator>
        </>
    );
}

export default HabitsList;
