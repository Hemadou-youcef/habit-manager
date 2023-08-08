// React 
import { useState } from 'react';

// Styles
import styles from './habitsGroup.module.css';

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

const HabitsGroup = ({ closeForm }: { closeForm: () => void }) => {
    const [GroupInfo, setGroupInfo] = useState({
        name: '',
        color: ''
    });

    const handleSubmit = () => {
        console.log(GroupInfo);
    }

    return (
        <Overlay width="500px" closeOverlay={() => closeForm()}>
            <div className={styles.habitForm}>
                <div className={styles.header}>
                    <p className={styles.title}>New Habits Group</p>
                </div>
                <div className={styles.body}>
                    <div className={styles.form}>
                        <div className={styles.formGroup} style={{ flexDirection: 'row' }}>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Group Name"
                                style={{ width: '100%' }}
                                value={GroupInfo.name}
                                onChange={(e) => setGroupInfo({ ...GroupInfo, name: e.target.value })}
                            />
                            <input
                                className={styles.input}
                                type="color"
                                value={GroupInfo.color}
                                onChange={(e) => setGroupInfo({ ...GroupInfo, color: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={() => closeForm()}>
                        Cancel
                    </button>
                    <input
                        type="submit"
                        value="Save"
                        className={styles.submit}
                        onClick={() => handleSubmit()}
                        disabled={GroupInfo.name === '' || GroupInfo.color === ''}
                    />
                </div>
            </div>
        </Overlay>
    );
}

export default HabitsGroup;