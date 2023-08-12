
// React
import { useState, useRef, useEffect } from 'react';

// Styles
import styles from '../../template/habitsList.module.css';

// Components
import axios from 'axios';

// Icons 
import { BiDotsVertical } from 'react-icons/bi';
import { BsFillBookFill, BsCheckLg, BsXLg } from 'react-icons/bs';
import { LuTimer } from 'react-icons/lu';
import { AiOutlinePlus, AiFillEdit } from 'react-icons/ai';

// Typescript Types
import { Habit, HabitWithProgress, Progress } from '@/types/index'

const GoodHabit = ({ habit, readOnly = true, editHabit }: { habit: Habit | HabitWithProgress, readOnly: boolean, editHabit: (habit: HabitWithProgress) => void }) => {
    const [Done, setDone] = useState(habit.goalsValue <= (habit as HabitWithProgress).progress.value);
    const [options, setOptions] = useState(false);
    const [progress, setProgress] = useState<Progress | undefined>((habit as HabitWithProgress).progress);

    const optionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (options) {
            window.addEventListener('click', handleClickOutsideElement);
        }
        return () => {
            window.removeEventListener('click', handleClickOutsideElement);
        }
    }, [options]);

    const handleEditProgress =  () => {
        axios.put(`/api/progress/${(progress as Progress).id}`, {
            value: (progress as Progress).value,
        })
            .then((res) => {
                setProgress(res.data.data);
                editHabit({ ...(habit as HabitWithProgress), progress: res.data });
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handleClickOutsideElement = (event: any) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
            // if he click outside the element, close the dropdown of this element if it's open
            setOptions(false);
        }
    };

    const handleAddProgressOneTime = () => {
        console.log('add progress one time');

        (progress as Progress).value += 1;
        if ((progress as Progress).value >= habit.goalsValue) {
            handleMarkAsDone();
        } else {
            handleEditProgress();
        }
    }

    const handleAddProgressTimer = () => {
        console.log('add progress timer');
        (progress as Progress).value += 1;
        if ((progress as Progress).value >= habit.goalsValue) {
            handleMarkAsDone();
        } else {
            handleEditProgress();
        }

    }

    const handleMarkAsDone = () => {
        console.log('mark as done');
        (progress as Progress).value = habit.goalsValue;
        setDone(true);
        setOptions(false);
        handleEditProgress();
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
                            {!readOnly && <p className={styles.habitProgressText}>
                                {`[${(progress as Progress).value}/${habit.goalsValue} ${habit.goalsUnit}]`}
                            </p>}
                        </div>

                    </div>

                    <div className={styles.habitActions}>
                        <div className={styles.habitFillButton}>
                            {habit.goalsUnit === 'min' ?
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

                                <div className={styles.habitActionDropDownItem} onClick={handleEdit}>
                                    <AiFillEdit />
                                    Edit
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {!readOnly && (
                    <div className={styles.habitProgress}>
                        <div className={styles.progress}>
                            <div className={styles.progressDone} style={{ width: `${(progress as Progress).value * 100 / habit.goalsValue}%`, backgroundColor: habit.accentColor }}></div>
                        </div>
                        {/* <p className={styles.progressText}>{habit.progress * 100}%</p> */}
                    </div>
                )}
            </div>
        </>
    );
}

export default GoodHabit;