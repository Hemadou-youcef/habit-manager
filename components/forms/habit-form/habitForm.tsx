

// React
import { useEffect, useState } from 'react';

// Styles
import styles from './habitForm.module.css'

// Components
import axios from 'axios';
import useSWR, { SWRResponse } from "swr";
import Overlay from '@/components/features/overlay/overlay'

// Icons
import { BiDotsVertical } from 'react-icons/bi';

// Typescript Types
import { Habit, HabitsGroup } from '@/types/index'
import HabitsgroupsIcons from '../icons-drop-down/habitsGroupIcons';
import ElementAnimator from '@/components/features/element-animator/elementAnimator';
import Alert from '@/components/features/alert/alert';

// Methods
const getUserHabitsGroups = async () => {
    const response = await fetch('/api/habits-group');
    const data = await response.json();
    return data;
}

const HabitForm = ({ defaulGrouptValues, data = null, editMode = false, refresh, closeForm }: { defaulGrouptValues?: number, data: Habit | null, editMode: boolean, refresh: () => void, closeForm: () => void }) => {
    // Form Data
    const [formData, setFormData] = useState({
        id: data?.id || 0,
        habitGroupId: defaulGrouptValues || data?.habitGroupId || -1,
        name: data?.name || '',
        type: data?.type || 'good',
        isArchived: data?.isArchived || false,
        startDate: data?.startDate ? new Date(data?.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        accentColor: data?.accentColor || "#2a67f4",
        icon: data?.icon || 'BsFillBookFill',
        goalsValue: data?.goalsValue.toString() || '-1',
        goalsPeriodicity: data?.goalsPeriodicity || 'daily',
        goalsUnit: data?.goalsUnit || 'times',
        goalsPeriodicityValues: data?.goalsPeriodicityValues.split(',') || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    })

    // HABITS GROUPS OPTIONS
    const { data: habitsGroups, error } = useSWR('/api/habits-group', getUserHabitsGroups)

    // GOALS PERIODICITY OPTIONS
    const goalsPeriodicityOptions: { label: string, value: (string)[] }[] = [
        { label: 'Daily', value: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
        { label: 'Monthly', value: [...Array.from({ length: 31 }, (_, i) => i + 1)].map((day) => day.toString()) },
        { label: 'Yearly', value: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] },
    ];

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loading || formData.name === '' || formData.startDate === '' || formData.goalsValue == "" || formData.goalsUnit === '' || formData.goalsPeriodicity === '') return
        const data = {
            ...formData,
            habitGroupId: formData.habitGroupId == -1 ? null : formData.habitGroupId,
            goalsValue: parseInt(formData.goalsValue),
            goalsPeriodicityValues: formData.goalsPeriodicityValues.join(',')
        }
        setLoading(true);
        if (editMode) {
            axios.put(`/api/habits/${data.id}`, data)
                .then((res: any) => {
                    refresh();
                    closeForm();
                })
                .catch((err: any) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                })
        } else {
            axios.post(`/api/habits`, data)
                .then((res: any) => {
                    refresh();
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
        axios.delete(`/api/habits/${data?.id}`)
            .then((res) => {
                refresh();
                closeForm();
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }

    const handleGoalsPeriodicity = (goalsPeriodicity: string) => {
        console.log(goalsPeriodicity)
        switch (goalsPeriodicity) {
            case 'daily':
                return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
            case 'monthly':
                return ['1']
            case 'yearly':
                return ['jan']
            default:
                return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        }
    }

    const goalsPeriodicityOptionsItems = () => {
        switch (formData.goalsPeriodicity) {
            case 'daily':
                return goalsPeriodicityOptions[0].value.map((day) => (
                    <div
                        key={day}
                        className={`${styles.option} ${formData.goalsPeriodicityValues.includes((day as string)) ? styles.active : styles.inactive}`}
                        onClick={() => {
                            if (formData.goalsPeriodicityValues.includes((day as string))) {
                                setFormData({ ...formData, goalsPeriodicityValues: formData.goalsPeriodicityValues.filter((d) => d !== day) })
                            } else {
                                setFormData({ ...formData, goalsPeriodicityValues: [...formData.goalsPeriodicityValues, day] })
                            }
                        }}

                    >
                        {day}
                        <br />
                        {formData.goalsPeriodicityValues.includes((day as string)) ? '✓' : ''}
                    </div>
                ));
            case 'monthly':
                // can only choose one day per month
                return goalsPeriodicityOptions[1].value.map((day) => (
                    <div
                        key={day}
                        className={`${styles.option} ${formData.goalsPeriodicityValues.includes((day as string)) ? styles.active : styles.inactive}`}
                        onClick={() => {
                            if (formData.goalsPeriodicityValues.includes((day as string))) {
                                setFormData({ ...formData, goalsPeriodicityValues: [] })
                            } else {
                                setFormData({ ...formData, goalsPeriodicityValues: [day] })
                            }
                        }}
                    >
                        {day}
                        <br />
                        {formData.goalsPeriodicityValues.includes((day as string)) ? '✓' : ''}
                    </div>
                ));

            case 'yearly':
                // can only choose one month per year
                return goalsPeriodicityOptions[2].value.map((month) => (
                    <div
                        key={month}
                        className={`${styles.option} ${formData.goalsPeriodicityValues.includes((month as string)) ? styles.active : styles.inactive}`}
                        onClick={() => {
                            if (formData.goalsPeriodicityValues.includes((month as string))) {
                                setFormData({ ...formData, goalsPeriodicityValues: [] })
                            } else {
                                setFormData({ ...formData, goalsPeriodicityValues: [month] })
                            }
                        }}
                    >
                        {month}
                        <br />
                        {formData.goalsPeriodicityValues.includes((month as string)) ? '✓' : ''}
                    </div>
                ));
        }
    }
    return (
        <Overlay width="500px" closeOverlay={() => closeForm()} closeOnBackgroundClick={true}>
            <div className={styles.habitForm}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className={styles.header}>
                        <p className={styles.title}>New Habit</p>
                    </div>
                    <div className={styles.body}>
                        <div className={styles.form}>
                            <div className={styles.formGroup} style={{ flexDirection: 'row' }}>
                                <input
                                    className={styles.input}
                                    type="text"
                                    placeholder="Habit Name"
                                    style={{ width: '100%' }}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <input
                                    className={styles.input}
                                    style={{ padding: 0, border: 0, height: "auto", overflow: "hidden", cursor: "pointer" }}
                                    type="color"
                                    value={formData.accentColor}
                                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                />
                                <HabitsgroupsIcons
                                    currentIcon={formData.icon}
                                    showOnlyMode={false}
                                    type={'habit'}
                                    onIconChange={(value: string) => { setFormData({ ...formData, icon: value }) }}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Habit Type</label>
                                <select className={styles.select} value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="good">Good Habit</option>
                                    <option value="bad">Bad Habit</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Habits Groups</label>
                                <select className={styles.select} value={formData.habitGroupId} onChange={(e) => setFormData({ ...formData, habitGroupId: parseInt(e.target.value) })}>
                                    <option value={-1}>None</option>
                                    {habitsGroups && (habitsGroups as HabitsGroup[]).map((group: HabitsGroup) => (
                                        <option key={group.id} value={group.id}>{group.name}</option>
                                    ))}
                                </select>
                            </div>
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
                                <input
                                    className={styles.input}
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            {formData.type == "good" &&
                                <>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Goal(-1 is unlimited)</label>
                                        <div className={styles.goal}>
                                            <div className={styles.goalDetails}>
                                                <div className={styles.goalDetailsBody}>

                                                    <div className={styles.goalDetailsBodyGroup} style={{ width: '100%' }}>

                                                        <input
                                                            className={styles.input}
                                                            type="number"
                                                            placeholder="Goal"
                                                            value={parseInt(formData.goalsValue)}
                                                            onChange={(e) => setFormData({ ...formData, goalsValue: e.target.value.toString() })}
                                                        />

                                                    </div>
                                                    <div className={styles.goalDetailsBodyGroup}>
                                                        <select className={styles.select} value={formData.goalsUnit} onChange={(e) => setFormData({ ...formData, goalsUnit: e.target.value })}>
                                                            <option value="times">Times</option>
                                                            <option value="min">Minutes</option>
                                                        </select>
                                                    </div>
                                                    <div className={styles.goalDetailsBodyGroup}>
                                                        <select
                                                            className={styles.select}
                                                            value={formData.goalsPeriodicity}
                                                            onChange={(e) => {
                                                                setFormData({ ...formData, goalsPeriodicity: e.target.value, goalsPeriodicityValues: handleGoalsPeriodicity(e.target.value) });
                                                            }}
                                                        >
                                                            <option value="daily">Daily</option>
                                                            <option value="monthly">Monthly</option>
                                                            <option value="yearly">Yearly</option>
                                                        </select>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Options</label>
                                        <div className={styles.options}>
                                            {goalsPeriodicityOptionsItems()}
                                        </div>
                                    </div>
                                </>
                            }



                        </div>

                    </div>
                    <div className={styles.footer}>
                        <div className={styles.mainAction}  >
                            {editMode && (
                                <>
                                    <button type='button' className={styles.deleteBtn} onClick={() => setShowDeleteConfirmation(true)}>
                                        Delete
                                    </button>
                                    <button type='button' className={styles.archiveBtn} onClick={() => setFormData({ ...formData, isArchived: !formData.isArchived })}>
                                        {formData.isArchived ? 'Unarchive' : 'Archive'}
                                    </button>
                                </>
                            )}

                        </div>
                        <div className={styles.mainAction}>
                            <button type='button' className={styles.cancelBtn} onClick={() => closeForm()}>
                                Cancel
                            </button>
                            <input
                                type="submit"
                                value={loading ? 'Loading...' : editMode ? 'Edit' : 'Save'}
                                className={`${styles.submit} ${editMode ? styles.bg_green : ""}`}
                                disabled={loading || formData.name === '' || formData.startDate === '' || formData.goalsValue == "" || formData.goalsUnit === '' || formData.goalsPeriodicity === ''}
                            />
                        </div>
                    </div>
                </form>
            </div>
            <ElementAnimator showElement={showDeleteConfirmation} type={0} duration={300}>
                <Alert
                    text='Are you sure you want to delete this Habit?'
                    onCancel={() => { setShowDeleteConfirmation(false) }}
                    onConfirm={handleDelete}
                />
            </ElementAnimator>
        </Overlay>
    );
}

export default HabitForm;