// Next
import { useRouter } from "next/router";

// React 
import { useEffect, useState } from "react";

// Components
import axios from "axios";
import HabitsList from "@/components/habits-list/template/habit-list/habitsList";

// Typescript Types
import { Habit, HabitWithProgress, HabitsGroup } from "@/types";



const habitsGroup = () => {
    const router = useRouter();
    const { id } = router.query;

    const [habitsGroup, setHabitsGroup] = useState<HabitsGroup>();
    const [habitsList, setHabitsList] = useState<Habit[][] | HabitWithProgress[][]>([[], [], [], []]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!router.isReady) return;
        handleRefreshHabitsList();
    }, [router.isReady])

    const handleRefreshHabitsList = () => {
        setLoading(true);
        axios.get(`/api/habits-group/${id}`)
            .then((res) => {
                const data = res.data;
                const goodHabits = data.habits.filter((habit: Habit) => habit.type === 'good');
                const badHabits = data.habits.filter((habit: Habit) => habit.type === 'bad');
                setHabitsGroup(data);
                setHabitsList([goodHabits, badHabits, [], []]);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            })
    }
    if (!habitsGroup) return <></>;
    return (
        <>
            <HabitsList
                title={habitsGroup.name}
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
