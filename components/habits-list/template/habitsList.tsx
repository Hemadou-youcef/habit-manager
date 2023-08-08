// React Components
import { useState } from 'react'

// Styles
import styles from './habitsList.module.css'

// Icons 
import { BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi'

// Components
import GoodHabit from '../list-item/good-habit/goodHabit'
import BadHabit from '../list-item/bad-habit/badHabit'
import HabitForm from '@/components/forms/habit-form/habitForm'


// Typescript Types
type Habit = {
    id: string;
    name: string;
    createdAt: string;
    isArchived: boolean;
    accentColor: string;
    goals: {
        createdAt: string;
        periodicity: string;
        unit: {
            symbol: string;
            type: string;
        };
        value: number;
    };
    regularly?: string;
    startDate: number;
    habitType: {
        rawValue: number;
        habitType: string;
    };
    priority: number;
    priorityByArea: string;
    shareLink: string;
    progress: {
        id: string;
        value: number;
        createdAt: string;
    }
};

const HabitsList = ({ title, habits }: { title: string, habits: Habit[][] }) => {
    const [habitsList, setHabitsList] = useState<Habit[][]>(habits);
    const [showBadHabits, setShowBadHabits] = useState<boolean>(true);
    const [showHabitForm, setShowHabitForm] = useState<boolean>(false);

    const handleEditHabit = (habit: Habit): boolean => {
        // Search for habit in goodHabits
        const goodHabitIndex = habitsList[0].findIndex((h) => h.id === habit.id);
        if (goodHabitIndex !== -1) {
            // Update habit in habitsList
            const newHabitsList = [...habitsList];
            newHabitsList[0][goodHabitIndex] = habit;
            setHabitsList(newHabitsList);
            return true;
        } else {
            // Search for habit in badHabits
            const badHabitIndex = habitsList[1].findIndex((h) => h.id === habit.id);
            if (badHabitIndex !== -1) {
                // Update habit in habitsList
                const newHabitsList = [...habitsList];
                newHabitsList[1][badHabitIndex] = habit;
                setHabitsList(newHabitsList);
                return true;
            }
        }
        return false;
    }
    return (
        <>
            <div className={styles.content}>
                <div className={styles.header}>
                    <p className={styles.title}>{title}</p>
                    <div className={styles.actions}>
                        <button className={styles.addButton} onClick={() => setShowHabitForm(true)}>
                            Add Habits
                        </button>
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.habits}>
                        {habitsList[0].length === 0 && habitsList[1].length === 0 && <p className={styles.noHabits}>No Habits Found</p>}
                        {habitsList[0].map((habit, index) => (
                            <div key={habit.id}>
                                <GoodHabit habit={habit} editHabit={handleEditHabit} />
                                <hr />
                            </div>
                        ))}
                        {habitsList[1].length > 0 &&
                            (
                                <div className={styles.badHabits} onClick={() => setShowBadHabits(!showBadHabits)}>
                                    {showBadHabits ? <BiSolidDownArrow /> : <BiSolidUpArrow />}
                                    {`Bad Habits (${habitsList[1].length})`}
                                </div>
                            )
                        }
                        {showBadHabits && habitsList[1].map((habit, index) => (
                            <div key={habit.id}>
                                <BadHabit habit={habit} />
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showHabitForm && <HabitForm closeForm={() => setShowHabitForm(false)} />}
        </>
    );
}

export default HabitsList;