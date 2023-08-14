

// React
import { useEffect, useState } from 'react';

// Styles
import styles from './habitForm.module.css'

// Components
import axios from 'axios';
import useSWR, { SWRResponse } from "swr";
import Overlay from '@/components/overlay/overlay';

// Icons
import { BiDotsVertical } from 'react-icons/bi';

// Typescript Types
import { Habit, HabitsGroup } from '@/types/index'

// Methods
const getUserHabitsGroups = async () => {
    const response = await fetch('/api/habits-group');
    const data = await response.json();
    return data;
}

const HabitForm = ({ defaulGrouptValues, data = null, editMode = false, refresh , closeForm }: { defaulGrouptValues?: number, data: Habit | null, editMode: boolean, refresh: () => void, closeForm: () => void }) => {
    // Form Data
    const [formData, setFormData] = useState({
        id: data?.id || 0,
        habitGroupId: defaulGrouptValues || data?.habitGroupId || -1,
        name: data?.name || '',
        type: data?.type || 'good',
        startDate: data?.startDate ? new Date(data?.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        accentColor: data?.accentColor || "#FF5722",
        icon: data?.icon || 'book',
        goalsValue: data?.goalsValue.toString() || '1',
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
        { label: 'Yearly', value: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'nov', 'dec'] },
    ];

    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        const data = {
            ...formData,
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
                                type="color"
                                value={formData.accentColor}
                                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
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
                                    <label className={styles.label}>Goal</label>
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
                    <button className={styles.cancelBtn} onClick={() => closeForm()}>
                        Cancel
                    </button>
                    <input
                        type="submit"
                        value={loading ? 'Loading...' : editMode ? 'Edit' : 'Save'}
                        className={`${styles.submit} ${editMode ? styles.bg_green : ""}`}
                        disabled={loading || formData.name === '' || formData.startDate === '' || formData.goalsValue == "" ||  formData.goalsUnit === '' || formData.goalsPeriodicity === ''}
                        onClick={() => handleSubmit()}
                    />

                </div>
            </div>
        </Overlay>
    );
}

export default HabitForm;