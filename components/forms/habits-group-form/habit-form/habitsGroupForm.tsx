// React 
import { useState } from 'react';

// Styles
import styles from './habitsGroupForm.module.css';

// Components
import axios from 'axios';
import { useDataContext } from '@/components/layouts/app-layout/layout';
import Overlay from '@/components/features/overlay/overlay'
import HabitsGroupIcons from '@/components/forms/icons-drop-down/habitsGroupIcons';
import { BiDotsVertical } from 'react-icons/bi';

// Typescript Types
import { HabitsGroup } from '@/types';
import ElementAnimator from '@/components/features/element-animator/elementAnimator';
import Alert from '@/components/features/alert/alert';

type HabitGroupForm = {
    data?: HabitsGroup,
    editMode: boolean
    editHabitsGroup: (habitsGroup: HabitsGroup | null) => void;
    closeForm: () => void;
}
const HabitsGroupForm = ({ data, editMode, editHabitsGroup, closeForm }: HabitGroupForm) => {
    const { habitsGroupList, refreshGroupListData } = useDataContext();
    const [groupInfo, setGroupInfo] = useState({
        name: data?.name || '',
        icon: data?.icon || 'FaFolder'
    });
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
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

    const handleDelete = () => {
        setLoading(true);
        axios.delete(`/api/habits-group/${data?.id}`)
            .then((res) => {
                editHabitsGroup(null);
                closeForm();
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
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
                            <HabitsGroupIcons
                                currentIcon={groupInfo.icon}
                                showOnlyMode={false}
                                type={'group'}
                                onIconChange={(value: string) => { setGroupInfo({ ...groupInfo, icon: value }) }} />
                        </div>
                    </form>
                </div>
                <div className={styles.footer}>
                    <div>
                        {editMode &&
                            <button className={styles.deleteBtn} onClick={() => setShowDeleteConfirmation(true)}>
                                Delete
                            </button>
                        }
                    </div>
                    <div className={styles.mainAction}>
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
            </div>
            <ElementAnimator showElement={showDeleteConfirmation} type={0} duration={300}>
                <Alert
                    text='Are you sure you want to delete this Group?'
                    onCancel={() => { setShowDeleteConfirmation(false) }}
                    onConfirm={handleDelete}
                />
            </ElementAnimator>
        </Overlay>
    );
}

export default HabitsGroupForm;