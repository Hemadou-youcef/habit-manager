// Next
import { useRouter } from "next/router";
import Head from 'next/head'

// React 
import { useEffect, useState } from "react";

// Components
import axios from "axios";
import HabitsList from "@/components/habits-list/template/habit-list/habitsList";

// Typescript Types
import { Habit, HabitWithProgress, HabitsGroup } from "@/types";
import Spinner from "@/components/features/spinner/spinner";



const habitsGroup = () => {
    const router = useRouter();
    const { id } = router.query;

    const [habitsGroup, setHabitsGroup] = useState<HabitsGroup>();
    const [habitsList, setHabitsList] = useState<Habit[][] | HabitWithProgress[][]>([[], [], [], []]);
    const [loading, setLoading] = useState(true);
    const [Error, setError] = useState('');

    useEffect(() => {
        if (!router.isReady) return;
        handleRefreshHabitsList();
    }, [router.isReady, id])

    const handleRefreshHabitsList = () => {
        setHabitsList([[], [], [], []]);
        setLoading(true);
        axios.get(`/api/habits-group/${id}`)
            .then((res) => {
                const data = res.data;
                const goodHabits = data.habits.filter((habit: Habit) => habit.type === 'good');
                const badHabits = data.habits.filter((habit: Habit) => habit.type === 'bad');
                setHabitsGroup(data);
                setHabitsList([goodHabits, badHabits, [], []]);
                setError('');
            })
            .catch((err) => {
                setError(err.response.data.message);
            })
            .finally(() => {
                setLoading(false);
            })
    }
    if (loading) return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}>
                <Spinner width="40px" height="40px" border="5px" color='#000' />
            </div>
        </>
    );
    if (Error || !habitsGroup) return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                color: '#2a67f4'
            }}>
                <h1>{Error}</h1>
            </div>
        </>
    )
    return (
        <>
            <Head>
                <title>{habitsGroup?.name}</title>
                <meta name="description" content="Habits is the best app you would like to manage your habits" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <HabitsList
                title={habitsGroup?.name}
                habits={habitsList}
                habitsGroup={habitsGroup}
                readOnly={true}
                onChangeDate={(date) => { }}
                refresh={() => handleRefreshHabitsList()}
                loading={loading}
            />
        </>
    );
}

export default habitsGroup;
