
// React Components
import { useState, useRef, useEffect } from 'react'

// Styles
import styles from '../../template/habitsList.module.css'

// Icons 
import { BiDotsVertical } from 'react-icons/bi'
import { BsFillBookFill, BsCheckLg, BsXLg } from 'react-icons/bs'
import { LuTimer } from 'react-icons/lu'
import { AiOutlinePlus, AiFillEdit } from 'react-icons/ai'

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

const GoodHabit = ({ habit, editHabit }: { habit: Habit, editHabit: (habit: Habit) => void }) => {
    const [Done, setDone] = useState(false); // [TODO] change this to habit.progress.value >= habit.goals.value
    const [options, setOptions] = useState(false);

    const optionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (options) {
            window.addEventListener('click', handleClickOutsideElement);
        }
        return () => {
            window.removeEventListener('click', handleClickOutsideElement);
        }
    }, [options]);

    const handleClickOutsideElement = (event: any) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
            // if he click outside the element, close the dropdown of this element if it's open
            setOptions(false);
        }
    };

    const handleAddProgressOneTime = () => {
        console.log('add progress one time');
        const newHabit = { ...habit };
        newHabit.progress.value += 1;
        if (newHabit.progress.value >= newHabit.goals.value) {
            handleMarkAsDone();
        } else {
            editHabit(newHabit);
        }
    }

    const handleAddProgressTimer = () => {
        console.log('add progress timer');
        const newHabit = { ...habit };
        newHabit.progress.value += 1;
        if (newHabit.progress.value >= newHabit.goals.value) {
            handleMarkAsDone();
        } else {
            editHabit(newHabit);
        }

    }

    const handleMarkAsDone = () => {
        console.log('mark as done');
        const newHabit = { ...habit };
        newHabit.progress.value = newHabit.goals.value;
        setDone(true);
        setOptions(false);
        editHabit(newHabit);
    }

    const handleFail = () => {
        console.log('fail');
        setOptions(false);
    }

    const handleEdit = () => {
        console.log('edit');
        setOptions(false);
    }


    return (
        <>
            <div className={styles.habit} style={{ backgroundColor: Done ? '#e6e6e6' : 'white' }}>
                <div className={styles.habitDone} ></div>

                <div className={styles.habitDetails}>
                    <div className={styles.habitInfo}>
                        <div className={styles.habitIcon} style={{ backgroundColor: habit.accentColor }}>
                            <BsFillBookFill />
                        </div>
                        <div className={styles.habitNameContainer} style={{ textDecoration: Done ? 'line-through' : 'none' }}>
                            <p className={styles.habitName}>
                                {habit.name}
                            </p>
                            <p className={styles.habitProgressText}>
                                {`[${habit.progress.value}/${habit.goals.value} ${habit.goals.unit.symbol}]`}
                            </p>
                        </div>

                    </div>

                    <div className={styles.habitActions}>
                        <div className={styles.habitFillButton}>
                            {habit.goals.unit.symbol === 'min' ?
                                (
                                    <button onClick={handleAddProgressTimer}>
                                        <LuTimer size={18} />
                                        Timer
                                    </button>
                                ) : (
                                    <button onClick={handleAddProgressOneTime}>
                                        <AiOutlinePlus size={18} />
                                        1
                                    </button>
                                )
                            }

                        </div>
                        <div className={styles.habitActionButton} ref={optionsRef}>
                            <div className={styles.habitActionButtonIcon} onClick={() => setOptions(!options)}>
                                <BiDotsVertical />
                            </div>
                            <div
                                className={styles.habitActionDropDown}
                                style={{ display: options ? 'block' : 'none' }}

                            >
                                <div className={styles.habitActionDropDownItem} onClick={handleMarkAsDone}>
                                    <BsCheckLg />
                                    Mark as Done
                                </div>
                                <div className={styles.habitActionDropDownItem} onClick={handleFail}>
                                    <BsXLg />
                                    Fail
                                </div>
                                <div className={styles.habitActionDropDownItem} onClick={handleEdit}>
                                    <AiFillEdit />
                                    Edit
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.habitProgress}>
                    <div className={styles.progress}>
                        <div className={styles.progressDone} style={{ width: `${habit.progress.value * 100 / habit.goals.value}%`, backgroundColor: habit.accentColor }}></div>
                    </div>
                    {/* <p className={styles.progressText}>{habit.progress * 100}%</p> */}
                </div>
            </div>
        </>
    );
}

export default GoodHabit;