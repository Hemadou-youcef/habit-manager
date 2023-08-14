
// React 
import { useEffect, useState } from "react";

// Components
import axios from "axios";
import HabitsList from "@/components/habits-list/template/habitsList";

// Typescript Types
import { Habit, HabitWithProgress, HabitsGroup } from "@/types";


const habitsGroup = ({ habitsGroup, habits }: { habitsGroup: HabitsGroup, habits: Habit[][] }) => {
    const [habitsList, setHabitsList] = useState<Habit[][] | HabitWithProgress[][]>(habits);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHabitsList(habits);
    }, [habits])

    const handleRefreshHabitsList = () => {
        setLoading(true);
        axios.get(`/api/habits-group/${habitsGroup.id}`)
            .then((res) => {
                const data = res.data;
                console.log(data)
                const goodHabits = data.habits.filter((habit: Habit) => habit.type === 'good');
                const badHabits = data.habits.filter((habit: Habit) => habit.type === 'bad');
                setHabitsList([goodHabits, badHabits, [], []]);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <>
            <HabitsList
                title={habitsGroup.name}
                habits={habitsList}
                habitsGroup={habitsGroup}
                readOnly={true}
                refresh={() => handleRefreshHabitsList()}
                loading={loading}
            />
        </>
    );
}

export default habitsGroup;

export async function getServerSideProps(context: any) {
    const { id } = context.params;
    const response = await fetch(`${process.env.BASE_URL}/api/habits-group/${id}`);
    const habitsGroup = await response.json();
    if (!habitsGroup) {
        return {
            notFound: true,
        }
    }
    const goodHabits = habitsGroup.habits.filter((habit: Habit) => habit.type === 'good');
    const badHabits = habitsGroup.habits.filter((habit: Habit) => habit.type === 'bad');
    return {
        props: {
            habitsGroup,
            habits: [
                goodHabits, badHabits, [], []
            ]
        }
    }
}