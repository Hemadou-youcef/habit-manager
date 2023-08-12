// React 
import { useState } from 'react';

// Styles
import styles from './habitsGroup.module.css';

// Components
import axios from 'axios';
import Overlay from '@/components/overlay/overlay';
import { BiDotsVertical } from 'react-icons/bi';

// Typescript Types
type Response = {
    message: String;
    data?: any;
}

const HabitsGroup = ({ closeForm }: { closeForm: () => void }) => {
    const [groupInfo, setGroupInfo] = useState({
        name: '',
        icon: ''
    });
    const [loading, setLoading] = useState(false);
    const [cleanUpVariable, setCleanUpVariable] = useState(false)

    const handleSubmit = () => {
        setLoading(true);
        axios.post(`/api/habits-group`, groupInfo)
            .then((res: any) => {
                closeForm();
            })
            .catch((err: any) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <Overlay width="500px" closeOverlay={() => closeForm()}>
            <div className={styles.habitForm}>
                <div className={styles.header}>
                    <p className={styles.title}>New Habits Group</p>
                </div>
                <div className={styles.body}>
                    <form className={styles.form}>
                        <div className={styles.formGroup} style={{ flexDirection: 'row' }}>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Group Name"
                                style={{ width: '100%' }}
                                value={groupInfo.name}
                                onChange={(e) => setGroupInfo({ ...groupInfo, name: e.target.value })}
                            />
                            <input
                                className={styles.input}
                                type="text"
                                value={groupInfo.icon}
                                onChange={(e) => setGroupInfo({ ...groupInfo, icon: e.target.value })}
                            />
                        </div>
                    </form>
                </div>
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={() => closeForm()}>
                        Cancel
                    </button>
                    <input
                        type="submit"
                        value={loading ? 'Loading...' : 'Save'}
                        className={styles.submit}
                        onClick={() => handleSubmit()}
                        disabled={groupInfo.name === '' || groupInfo.icon === '' || loading}
                    />
                </div>
            </div>
        </Overlay>
    );
}

export default HabitsGroup;