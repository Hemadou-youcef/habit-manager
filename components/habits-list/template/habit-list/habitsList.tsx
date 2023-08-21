// React Components
import { useEffect, useState } from 'react';

// Styles
import styles from './habitsList.module.css';

// Icons 
import { AiFillEdit, AiOutlinePlus } from 'react-icons/ai';
import { FiCalendar } from 'react-icons/fi';

// Components
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

// Configuration
const habitSectionConfiguration = [
    [0, 'Good', true],
    [1, 'Bad', true],
    [2, 'Done', true],
    [3, 'Fail', true],
]// [Section Index, Title, Background Color, Is Open or No]

const HabitsList = ({ title, habitsGroup, readOnly, habits, loading, onChangeDate, refresh }: habitList) => {
    const [habitsGroupInfo, setHabitsGroupInfo] = useState<HabitsGroup | undefined>(habitsGroup)
    const [habitList, setHabitList] = useState<Habit[][] | HabitWithProgress[][]>(habits);
    const [currentHabitSection, setCurrentHabitSection] = useState([habitSectionConfiguration[0], habitSectionConfiguration[1]]);
    const [currentDate, setCurrentDate] = useState<Value>(new Date());

    const [showHabitsGroupForm, setShowHabitsGroupForm] = useState<boolean>(false);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);

    const [showHabitForm, setShowHabitForm] = useState<boolean>(false);
    const [habitEditData, setHabitEditData] = useState<Habit | null>(null);
    const [habitEditMode, setHabitEditMode] = useState<boolean>(false);

    // const redirect = usedi

    useEffect(() => {
        setHabitList(habits);
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

    const handleEditHabitsGroup = (habitsGroup: HabitsGroup | null): void => {
        if (habitsGroup) setHabitsGroupInfo(habitsGroup)
        // else redirect()
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
            <div className={styles.content}>
                <div className={styles.header}>
                    <p className={styles.title}>{habitsGroupInfo?.name || title}</p>
                    <div className={styles.actions}>
                        {habitsGroupInfo?.id ? (
                            <button className={styles.editHabitButton} onClick={() => setShowHabitsGroupForm(true)}>
                                <AiFillEdit size={15} />
                                {/* Edit Group */}
                            </button>
                        ) : (
                            <button
                                className={styles.editDateButton}
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                <FiCalendar size={15} />
                                {formatDate(currentDate as Date)}
                            </button>
                        )}
                        <button className={styles.addButton} onClick={() => setShowHabitForm(true)}>
                            <AiOutlinePlus size={15} />
                            {/* Add Habits */}
                        </button>
                    </div>
                </div>
                <div className={styles.body}>
                    {loading ? <p className={styles.loading}>Loading...</p> :
                        <>
                            {!readOnly &&
                                <div className={styles.habitsSections}>
                                    <button
                                        style={{ color: '#2a67f4', borderColor: '#2a67f4', }}
                                        className={currentHabitSection.length > 1 ? styles.active : undefined}
                                        onClick={() => setCurrentHabitSection([habitSectionConfiguration[0], habitSectionConfiguration[1]])}
                                    >
                                        Pending Habits
                                    </button>
                                    <button
                                        style={{ color: '#1ec448', borderColor: '#1ec448' }}
                                        className={currentHabitSection[0][0] == 2 ? styles.active : undefined}
                                        onClick={() => setCurrentHabitSection([habitSectionConfiguration[2]])}
                                    >
                                        {`Done Habits (${habitList[2].length})`}
                                    </button>
                                    <button
                                        style={{ color: '#ff2828', borderColor: '#ff2828' }}
                                        className={currentHabitSection[0][0] == 3 ? styles.active : undefined}
                                        onClick={() => setCurrentHabitSection([habitSectionConfiguration[3]])}
                                    >
                                        {`Fail Habits (${habitList[3].length})`}
                                    </button>
                                </div>
                            }
                            <div className={styles.habits}>
                                {habitList[0].length === 0 && habitList[1].length === 0 && <p className={styles.noHabits}>No Habits Found</p>}
                                {currentHabitSection.map((value, index) => (

                                    <HabitsItem
                                        title={`${value[1]} Habits`}
                                        isOpen={value[2] as boolean}
                                        habitList={habitList[value[0] as number]}
                                        handleEditHabit={handleEditHabit}
                                        handleEditHabitProgress={(habit: HabitWithProgress) => handleEditHabitProgress(value[1] as string, habit)}
                                        readOnly={readOnly}
                                        key={index}
                                    />
                                ))}
                            </div>
                        </>
                    }
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
