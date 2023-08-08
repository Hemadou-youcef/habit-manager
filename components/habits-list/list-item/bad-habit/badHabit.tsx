// React Components
import { useState, useRef, useEffect } from 'react'

// Styles
import styles from '../../template/habitsList.module.css'

// Icons 
import { BiDotsVertical } from 'react-icons/bi'
import { BsFillBookFill, BsCheckLg, BsXLg } from 'react-icons/bs'
import { AiFillEdit } from 'react-icons/ai'


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

const BadHabit = ({ habit }: { habit: Habit }) => {
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

    const handleSucceed = () => {
        console.log('succeed');
    }

    const handleMarkAsDone = () => {
        console.log('mark as done');
    }

    const handleFail = () => {
        console.log('fail');
    }

    const handleEdit = () => {
        console.log('edit');
    }
    return (
        <>

            <div className={styles.habit}>
                <div className={styles.habitDetails}>
                    <div className={styles.habitInfo}>
                        <div className={styles.habitIcon} style={{ backgroundColor: habit.accentColor }}>
                            <BsFillBookFill />
                        </div>
                        <div className={styles.habitNameContainer}>
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
                            <button onClick={handleSucceed}>
                                <BsCheckLg size={18} />
                                Succeed
                            </button>
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
            </div>
        </>
    );
}

export default BadHabit;