// React
import { useState } from "react";

// styles
import styles from "./habitsItem.module.css"

// Icons
import { BiSolidDownArrow, BiSolidRightArrow, BiSolidUpArrow } from "react-icons/bi";

// Components
import HabitItem from "../habit-item/habitItem";
import ElementAnimator from "@/components/features/element-animator/elementAnimator";


// Types
import { Habit, HabitWithProgress, HabitsGroup } from "@/types";
type HabitsItem = {
    title: string;
    backgroundColor: string;
    isOpen: boolean;
    habitList: HabitsGroup[];
    readOnly: boolean;
    handleEditHabit: (habit: Habit) => void;
    handleEditHabitProgress: (habit: HabitWithProgress, _mustReplace: boolean) => void;
}

const HabitsItem = ({ title, backgroundColor, isOpen = true, habitList, readOnly, handleEditHabit, handleEditHabitProgress }: HabitsItem) => {
    const [showHabits, setShowHabits] = useState<boolean>(isOpen);
    // #16ff5033
    return (
        <>
            {habitList.length > 0 &&
                (
                    <button
                        className={styles.subHabits}


                        onClick={() => setShowHabits(!showHabits)}
                    >
                        {showHabits ? <BiSolidDownArrow /> : <BiSolidRightArrow />}
                        {`${title} (${habitList.length})`}
                    </button>
                )
            }
            <div className={styles.subHabitsContentContainer}>
                <ElementAnimator showElement={showHabits} type={6} duration={300}>
                    {habitList.map((habit, index) => (
                        <div key={habit.id} className={styles.subHabitsContent} >
                            <HabitItem
                                habit={habit as (Habit | HabitWithProgress)}
                                editHabit={handleEditHabit}
                                editHabitProgress={handleEditHabitProgress}
                                readOnly={readOnly}
                            />
                        </div >
                    ))}
                </ElementAnimator>
            </div>
        </>
    );
}

export default HabitsItem;

// style={{borderColor: backgroundColor}}
// style={{ backgroundColor,borderTopLeftRadius:"5px",borderTopRightRadius:"5px" }}