// Components 
import { useDataContext } from "../layouts/app-layout/layout";

type HabitStatitics = {
    id: string;
    value: number;
    createdAt: string;
}


const ProgressBar = () => {
    const { selectedHabit } = useDataContext();
    return (
        <>
            
        </>
    );
}

export default ProgressBar;