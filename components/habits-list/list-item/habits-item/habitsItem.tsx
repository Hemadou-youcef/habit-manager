// React
import { useState } from "react";

// styles
import styles from "./habitsItem.module.css"
import stylesDarkTheme from "./habitsItemDarkTheme.module.css"

// Icons
import { BiSolidDownArrow, BiSolidRightArrow, BiSolidUpArrow } from "react-icons/bi";

// Components
import { useDataContext } from "@/components/layouts/app-layout/layout";
import HabitItem from "../habit-item/habitItem";
import ElementAnimator from "@/components/features/element-animator/elementAnimator";


// Types
import { Habit, HabitWithProgress, HabitsGroup } from "@/types";
type HabitsItem = {
    title: string;
    isOpen: boolean;
    habitList: (Habit | HabitWithProgress)[];
    readOnly: boolean;
    handleEditHabit: (habit: Habit) => void;
    handleEditHabitProgress: (habit: HabitWithProgress) => void;
}

const HabitsItem = ({ title, isOpen = true, habitList, readOnly, handleEditHabit, handleEditHabitProgress }: HabitsItem) => {
    const { theme }: { theme: string } = useDataContext();
    const stylesTheme = (theme === 'light') ? styles : stylesDarkTheme;
    const [showHabits, setShowHabits] = useState<boolean>(isOpen);
    // #16ff5033
    return (
        <>
            {habitList.length > 0 &&
                (
                    <button
                        className={stylesTheme.subHabits}


                        onClick={() => setShowHabits(!showHabits)}
                    >
                        {showHabits ? <BiSolidDownArrow /> : <BiSolidRightArrow />}
                        {`${title} (${habitList.length})`}
                    </button>
                )
            }
            <div className={stylesTheme.subHabitsContentContainer}>
                <ElementAnimator showElement={showHabits} type={6} duration={300}>
                    {habitList.map((habit, index) => (
                        <div key={habit.id} className={stylesTheme.subHabitsContent} >
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