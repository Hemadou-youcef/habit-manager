
// Styles
import styles from './habitForm.module.css'

// Components
import Overlay from '@/components/overlay/overlay';
import { BiDotsVertical } from 'react-icons/bi';

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

const HabitForm = ({ closeForm }: { closeForm: () => void }) => {
    return (
        <Overlay width="500px" closeOverlay={() => closeForm()}>
            <div className={styles.habitForm}>
                <div className={styles.header}>
                    <p className={styles.title}>New Habit</p>
                </div>
                <div className={styles.body}>
                    <div className={styles.form}>
                        <div className={styles.formGroup} style={{ flexDirection: 'row' }}>
                            <input className={styles.input} type="text" placeholder="Habit Name" style={{ width: '100%' }} />
                            <input className={styles.input} type="color" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Habit Type</label>
                            <select className={styles.select}>
                                <option value="1">Good Habit</option>
                                <option value="2">Bad Habit</option>
                            </select>
                        </div>
                        {/* <div className={styles.formGroup}>
                            <label className={styles.label}>Habit Priority</label>
                            <select className={styles.select}>
                                <option value="1">Low</option>
                                <option value="2">Medium</option>
                                <option value="3">High</option>
                            </select>
                        </div> */}
                        {/* <div className={styles.formGroup}>
                            <label className={styles.label}>Habit Group</label>
                            <select className={styles.select}>
                                <option value="1">Health</option>
                                <option value="2">Wealth</option>
                                <option value="3">Relationships</option>
                                <option value="4">Personal Growth</option>
                                <option value="5">Career</option>
                                <option value="6">Spirituality</option>
                            </select>
                        </div> */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Habit Start Date</label>
                            <input className={styles.input} type="date" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Goal</label>
                            <div className={styles.goal}>
                                <div className={styles.goalDetails}>
                                    <div className={styles.goalDetailsBody}>

                                        <div className={styles.goalDetailsBodyGroup} style={{ width: '100%' }}>

                                            <input className={styles.input} type="number" />

                                        </div>
                                        <div className={styles.goalDetailsBodyGroup}>
                                            <select className={styles.select}>
                                                <option value="3">Times</option>
                                                <option value="2">Minutes</option>
                                            </select>
                                        </div>
                                        <div className={styles.goalDetailsBodyGroup}>
                                            <select className={styles.select}>
                                                <option value="1">Daily</option>
                                                <option value="2">Weekly</option>
                                                <option value="3">Monthly</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className={styles.formGroup}>
                            <label className={styles.label}>Habit Regularly</label>
                            <select className={styles.select}>
                                <option value="1">Daily</option>
                                <option value="2">Weekly</option>
                                <option value="3">Monthly</option>
                            </select>
                        </div> */}
                        <div className={styles.formGroup}>

                        </div>

                    </div>

                </div>
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={() => closeForm()}>
                        Cancel
                    </button>
                    <input type="submit" value="Save" className={styles.submit} />

                </div>
            </div>
        </Overlay>
    );
}

export default HabitForm;