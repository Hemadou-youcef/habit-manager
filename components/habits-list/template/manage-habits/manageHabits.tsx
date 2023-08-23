// React
import { useEffect, useState } from 'react';

// Styles
import styles from './manageHabits.module.css'
import stylesDarkTheme from './manageHabitsDarkTheme.module.css'

// Components
import { useDataContext } from '@/components/layouts/app-layout/layout';
import HabitsItem from '../../list-item/habits-item/habitsItem';
import ElementAnimator from '@/components/features/element-animator/elementAnimator';
import HabitForm from '@/components/forms/habit-form/habitForm';

// Typescript Types
import { Habit, HabitWithProgress } from '@/types';
import { AiOutlinePlus } from 'react-icons/ai';



const ManageHabits = ({ habits, loading, refresh }: { habits: (Habit | Habit[])[][], loading: boolean, refresh: () => void }) => {
    const { theme }: { theme: string } = useDataContext();
    const stylesTheme = (theme === 'light') ? styles : stylesDarkTheme;

    const [habitList, setHabitList] = useState<(Habit | Habit[])[][]>(habits);

    const [tabIndex, setTabIndex] = useState<number>(0);
    const [currentHabitSection, setCurrentHabitSection] = useState<(Habit[] | string | boolean)[][]>([]);

    const [showHabitForm, setShowHabitForm] = useState<boolean>(false);
    const [habitEditData, setHabitEditData] = useState<Habit | null>(null);
    const [habitEditMode, setHabitEditMode] = useState<boolean>(false);

    useEffect(() => {
        // console.log(habits)
        setHabitList(habits);
        handleTabChange(tabIndex, habits);
    }, [habits]);


    const handleTabChange = (tabNumber: number, _habitList: (Habit | Habit[])[][]) => {
        switch (tabNumber) {
            case 0:
                setCurrentHabitSection([[_habitList[0] as Habit[], 'Good', true]]);
                break;
            case 1:
                setCurrentHabitSection([[_habitList[1] as Habit[], 'Bad', true]]);
                break;
            case 2:
                setCurrentHabitSection([[_habitList[2][0] as Habit[], 'Good', true], [_habitList[2][1] as Habit[], 'Bad', true]]);
                break;
        }
        setTabIndex(tabNumber);
    }
    const handleEditHabit = (habit: Habit): void => {
        setHabitEditData(habit)
        setHabitEditMode(true)
        setShowHabitForm(true)
    }

    return (
        <>
            <div className={stylesTheme.content}>
                <div className={stylesTheme.header}>
                    <div className={stylesTheme.title}>
                        <p>Manage Habits</p>
                        <button className={stylesTheme.addButton} onClick={() => setShowHabitForm(true)}>
                            <AiOutlinePlus size={15} />
                            {/* Add Habits */}
                        </button>
                    </div>

                    <div className={stylesTheme.habitsSections}>
                        <button
                            style={{ color: '#1ec448', borderColor: '#1ec448', }}
                            className={tabIndex == 0 ? stylesTheme.active : undefined}
                            onClick={() => handleTabChange(0, habitList)}
                        >
                            {`Good Habits (${habitList[0].length})`}
                        </button>
                        <button
                            style={{ color: '#ff2828', borderColor: '#ff2828' }}
                            className={tabIndex == 1 ? stylesTheme.active : undefined}
                            onClick={() => handleTabChange(1, habitList)}
                        >
                            {`Bad Habits (${habitList[1].length})`}
                        </button>
                        <button
                            style={{ color: '#757575', borderColor: '#757575' }}
                            className={tabIndex == 2 ? stylesTheme.active : undefined}
                            onClick={() => handleTabChange(2, habitList)}
                        >
                            {`Archived Habits (${(habitList[2][0] as Habit[]).length + (habitList[2][1] as Habit[]).length})`}
                        </button>
                    </div>
                </div>
                <div className={stylesTheme.body}>
                    {loading && <p className={stylesTheme.loading}>Loading...</p>}
                    {!loading && (currentHabitSection).filter((value) => (value[0] as Habit[]).length != 0).length == 0 && <p className={stylesTheme.noHabits}>No Habits Found</p>}
                    {currentHabitSection.map((value, index) => (
                        <HabitsItem
                            title={`${value[1]} Habits`}
                            isOpen={value[2] as boolean}
                            habitList={value[0] as Habit[]}
                            handleEditHabit={handleEditHabit}
                            handleEditHabitProgress={(habit: HabitWithProgress) => { }}
                            readOnly={true}
                            key={index}
                        />
                    ))}
                </div>
            </div>
            <ElementAnimator showElement={showHabitForm} type={0} duration={300}>
                <HabitForm
                    defaulGrouptValues={undefined}
                    data={habitEditData}
                    editMode={habitEditMode}
                    refresh={() => refresh()}
                    closeForm={() => setShowHabitForm(false)}
                />
            </ElementAnimator>
        </>
    );
}

export default ManageHabits;