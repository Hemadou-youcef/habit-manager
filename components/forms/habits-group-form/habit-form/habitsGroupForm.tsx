// React 
import { useState } from 'react';

// Styles
import styles from './habitsGroupForm.module.css';

// Components
import axios from 'axios';
import { useDataContext } from '@/components/layouts/app-layout/layout';
import Overlay from '@/components/overlay/overlay';
import HabitsGroupIcons from '@/components/forms/icons-drop-down/habitsGroupIcons';
import { BiDotsVertical } from 'react-icons/bi';

// Typescript Types
import { HabitsGroup } from '@/types';

type HabitGroupForm = {
    data?: HabitsGroup,
    editMode: boolean
    editHabitsGroup: (habitsGroup: HabitsGroup) => void;
    closeForm: () => void;
}
const HabitsGroupForm = ({ data, editMode, editHabitsGroup, closeForm }: HabitGroupForm) => {
    const { habitsGroupList, refreshGroupListData } = useDataContext();
    const [groupInfo, setGroupInfo] = useState({
        name: data?.name || '',
        icon: data?.icon || ''
    });
    const [loading, setLoading] = useState(false);
    const [cleanUpVariable, setCleanUpVariable] = useState(false)

    const handleSubmit = () => {
        setLoading(true);

        if (editMode) {
            axios.put(`/api/habits-group/${data?.id}`, groupInfo)
                .then((res: any) => {
                    const data = res.data.data
                    const newHabitsGroup: HabitsGroup[] = habitsGroupList.map((value: HabitsGroup) =>
                        (value.id == data.id) ? data : value)
                    refreshGroupListData(newHabitsGroup);
                    editHabitsGroup(data)
                    closeForm();
                })
                .catch((err: any) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                })
        } else {
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

    }

    return (
        <Overlay width="500px" closeOverlay={() => closeForm()} closeOnBackgroundClick={true}>
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
                            {/* <input
                                className={styles.input}
                                type="text"
                                value={groupInfo.icon}
                                onChange={(e) => setGroupInfo({ ...groupInfo, icon: e.target.value })}
                            /> */}
                            <HabitsGroupIcons currentIcon='folder' onIconChange={(value: string) => { }} type={'group'} />
                        </div>
                    </form>
                </div>
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={() => closeForm()}>
                        Cancel
                    </button>
                    <input
                        type="submit"
                        value={loading ? 'Loading...' : editMode ? 'Edit' : 'Save'}
                        className={`${styles.submit} ${editMode ? styles.bg_green : ""}`}
                        onClick={() => handleSubmit()}
                        disabled={groupInfo.name === '' || groupInfo.icon === '' || loading}
                    />
                </div>
            </div>
        </Overlay>
    );
}

export default HabitsGroupForm;