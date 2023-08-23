
// React
import { useState, useRef, useEffect } from 'react';

// Styles
import styles from '../../template/habit-list/habitsList.module.css';
import stylesDarkTheme from '../../template/habit-list/habitsListDarkTheme.module.css';

// Components
import axios from 'axios';
import Timer from '@/components/features/timer/timer'
import { useDataContext } from '@/components/layouts/app-layout/layout';
import HabitsgroupsIcons from '@/components/forms/icons-drop-down/habitsGroupIcons';

// Icons 
import { BiDotsVertical, BiReset } from 'react-icons/bi';
import { BsFillBookFill, BsCheckLg, BsXLg } from 'react-icons/bs';
import { LuTimer } from 'react-icons/lu';
import { AiOutlinePlus, AiFillEdit } from 'react-icons/ai';
import { IoStatsChartSharp } from 'react-icons/io5';

// Typescript Types
import { Habit, HabitWithProgress, Progress } from '@/types/index'
type HabitItem = {
    habit: Habit | HabitWithProgress;
    readOnly: boolean;
    editHabit: (habit: Habit) => void;
    editHabitProgress: (habit: HabitWithProgress) => void;
}

// SUPPLY METHODS
const isProgressEnd = (habit: HabitWithProgress): boolean => {
    const _habitProgress: Progress = (habit.progress as Progress);
    if (habit.type == 'good') {
        if (habit.goalsValue > 0) {
            return habit.goalsValue <= _habitProgress.value;
        } else {
            return false;
        }
    } else if (habit.type == 'bad') {
        return _habitProgress.value == 0;
    }
    return false;
}

const HabitItem = ({ habit, readOnly = true, editHabit, editHabitProgress }: HabitItem) => {
    const [progressEnd, setProgressEnd] = useState<boolean | undefined>(readOnly ? undefined : isProgressEnd(habit as HabitWithProgress));
    const [options, setOptions] = useState(false);
    const [progress, setProgress] = useState<Progress | undefined>(readOnly ? undefined : (habit as HabitWithProgress).progress as Progress);
    const { selectHabit, theme }: { selectHabit(habit: Habit): void, theme: string } = useDataContext();
    const stylesTheme = (theme === 'light') ? styles : stylesDarkTheme;

    const [showTimer, setShowTimer] = useState<boolean>(false);

    const optionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // FOR OPTION DROP DOWN
        if (options) {
            window.addEventListener('click', handleClickOutsideElement);
        }
        return () => {
            window.removeEventListener('click', handleClickOutsideElement);
        }
    }, [options]);

    const handleEditProgress = () => {
        // EDIT PROGRESS OF HABIT
        axios.put(`/api/progress/${(progress as Progress).id}`, {
            value: (progress as Progress).value,
        })
            .then((res) => {
                const data = res.data.data
                setProgress(data);
                editHabitProgress({ ...(habit as HabitWithProgress), progress: data });
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
        if ((progress as Progress).value >= habit.goalsValue && habit.goalsValue > 0) {
            handleMarkAsDone();
        } else {
            handleEditProgress();
        }
    }

    const handleProgressTimer = (minutes: number) => {
        console.log('add progress timer');
        (progress as Progress).value += minutes;
        if ((progress as Progress).value >= habit.goalsValue && habit.goalsValue > 0) {
            handleEditProgress();
        } else {
            handleEditProgress();
        }
        setShowTimer(false);
    }

    const handleMarkAsDone = () => {
        console.log('mark as done');
        if ((progress as Progress).value < habit.goalsValue) (progress as Progress).value = habit.goalsValue;
        setProgressEnd(true);
        setOptions(false);
        handleEditProgress();
    }

    const handleFail = () => {
        console.log('fail');
        (progress as Progress).value = 0;
        handleEditProgress()
        setProgressEnd(true);
        setOptions(false);
    }

    const handleEdit = () => {
        console.log('edit');
        editHabit(habit as Habit);
        setOptions(false);
    }

    const handleReturnToDefaulValue = () => {
        console.log('reset to default value');
        if (habit.type == 'good') (progress as Progress).value = 0;
        else (progress as Progress).value = 1;
        setProgressEnd(false);
        handleEditProgress()
        setOptions(false);
    }

    const handleSelectHabit = () => {
        selectHabit(habit as Habit);
        setOptions(false);
    }

    return (
        <>
            <div className={`${stylesTheme.habit} ${progressEnd ? stylesTheme.done : ''}`} >
                <div className={stylesTheme.habitDone} ></div>

                <div className={stylesTheme.habitDetails}>
                    <div className={stylesTheme.habitInfo}>
                        <div className={stylesTheme.habitIcon} style={{ backgroundColor: habit.accentColor }}>
                            <HabitsgroupsIcons
                                currentIcon={habit.icon}
                                showOnlyMode={true}
                                type={'habit'}
                                onIconChange={(value: string) => { }}
                            />
                        </div>
                        <div className={stylesTheme.habitNameContainer} style={{ textDecoration: progressEnd && habit?.type == 'good' ? 'line-through' : 'none' }}>
                            <p className={stylesTheme.habitName}>
                                {habit.name}
                            </p>
                            <p className={stylesTheme.habitProgressText}>
                                {readOnly ? `${habit.goalsValue > 0 ? habit.goalsValue : "∞"} ${habit.goalsUnit}` : (habit.type == 'good') ? `[${(progress as Progress)?.value}/${habit.goalsValue > 0 ? habit.goalsValue : "∞"} ${habit.goalsUnit}]` : null}
                            </p>
                        </div>

                    </div>
                    {!readOnly && !progressEnd && habit.goalsValue > 0 && habit.type == 'good' && (
                        <div className={stylesTheme.habitProgress}>
                            <div className={stylesTheme.progress}>
                                <div className={stylesTheme.progressDone} style={{ width: `${(progress as Progress)?.value * 100 / habit.goalsValue}%`, backgroundColor: habit.accentColor }}></div>
                            </div>
                            {/* <p className={stylesTheme.progressText}>{habit.progress * 100}%</p> */}
                        </div>
                    )}
                    <div className={stylesTheme.habitActions}>

                        <div className={stylesTheme.habitFillButton}>
                            {!readOnly && !progressEnd && (
                                <>
                                    {habit.goalsUnit === 'min' &&
                                        (
                                            <button onClick={() => setShowTimer(true)}>
                                                <LuTimer size={18} />
                                                Timer
                                            </button>
                                        )}
                                    {habit.goalsUnit === "times" && habit.type == 'good' &&
                                        (
                                            <button onClick={handleAddProgressOneTime}>
                                                <AiOutlinePlus size={18} />
                                                1
                                            </button>
                                        )
                                    }
                                </>
                            )}
                            {!readOnly && !progressEnd && habit.goalsUnit === "times" && habit.type == 'bad' &&
                                (
                                    <button onClick={handleFail}>
                                        <BsXLg size={18} />
                                        Fail
                                    </button>
                                )
                            }

                        </div>

                        <div className={stylesTheme.habitActionButton} ref={optionsRef}>
                            <div className={stylesTheme.habitActionButtonIcon} onClick={() => setOptions(!options)}>
                                <BiDotsVertical />
                            </div>
                            <div
                                className={stylesTheme.habitActionDropDown}
                                style={{ display: options ? 'block' : 'none' }}

                            >

                                {!readOnly && !progressEnd && (
                                    <div className={stylesTheme.habitActionDropDownItem} onClick={handleMarkAsDone}>
                                        <BsCheckLg />
                                        Mark as Done
                                    </div>
                                )}
                                {!readOnly && (
                                    <div className={stylesTheme.habitActionDropDownItem} onClick={handleReturnToDefaulValue}>
                                        <BiReset />
                                        Reset Value
                                    </div>
                                )}
                                <div className={stylesTheme.habitActionDropDownItem} onClick={handleSelectHabit}>
                                    <IoStatsChartSharp />
                                    View Statistics
                                </div>
                                <div className={stylesTheme.habitActionDropDownItem} onClick={handleEdit}>
                                    <AiFillEdit />
                                    Edit
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {showTimer && <Timer data={progress as Progress} saveProgressTime={handleProgressTimer} closeTimer={() => setShowTimer(false)} />}

        </>
    );
}

export default HabitItem;