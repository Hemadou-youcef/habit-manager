
// React 
import { useState } from "react";

// Components
import HabitsList from "@/components/habits-list/template/habitsList";

// Typescript Types
import { Habit, HabitWithProgress, HabitsGroup } from "@/types";


const habitsGroup = ({habitsGroup}: {habitsGroup: HabitsGroup}) => {
    // const [habitsList, setHabitsList] = useState<Habit[][] | HabitWithProgress[][]>(habitsGroup.habits);
    const [loading, setLoading] = useState(false);

    return ( 
        <>
            <HabitsList title={habitsGroup.name} habits={[[],[]]} readOnly={true} refresh={() => {}} loading={loading} />
        </>
     );
}
 
export default habitsGroup;

export async function getServerSideProps(context: any) {
    const { id } = context.params;
    const response = await fetch(`${process.env.BASE_URL}/api/habits-group/${id}`);
    const habitsGroup = await response.json();
    return {
        props: {
            habitsGroup
        }
    }
}