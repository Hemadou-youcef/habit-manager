// React Components
import { useEffect, useState } from 'react'

// Styles
import styles from './habitsList.module.css'

// Icons 
import { BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi'

// Components
import GoodHabit from '../list-item/good-habit/goodHabit'
import BadHabit from '../list-item/bad-habit/badHabit'
import HabitForm from '@/components/forms/habit-form/habitForm'


// Typescript Types
import { Habit, HabitWithProgress, Progress } from '@/types/index'

const HabitsList = ({ title, readOnly, habits, loading, refresh }: { title: string, readOnly: boolean, habits: Habit[][] | HabitWithProgress[][], loading: boolean, refresh: () => void }) => {
    const [habitsList, setHabitsList] = useState<Habit[][] | HabitWithProgress[][]>(habits);
    const [showBadHabits, setShowBadHabits] = useState<boolean>(true);
    const [showHabitForm, setShowHabitForm] = useState<boolean>(false);

    useEffect(() => {
        setHabitsList(habits);
    }, [habits]);

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
                    {loading ? <p className={styles.loading}>Loading...</p> :
                        <div className={styles.habits}>
                            {habitsList[0].length === 0 && habitsList[1].length === 0 && <p className={styles.noHabits}>No Habits Found</p>}
                            {habitsList[0].map((habit, index) => (
                                <div key={habit.id}>
                                    {/* CHECK IF HABIT IS TYPE OF HabitWithProgress */}
                                    <GoodHabit habit={habit} editHabit={handleEditHabit} readOnly={readOnly} />
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
                    }
                </div>
            </div>
            {showHabitForm && <HabitForm data={null} editMode={false} refresh={() => refresh()} closeForm={() => setShowHabitForm(false)} />}
        </>
    );
}

export default HabitsList;
