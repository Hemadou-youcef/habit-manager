
// Components
import HabitsList from "@/components/habits-list/template/habitsList";

// Typescript Types
type HabitGroup = {
    id: string;
    name: string;
    createdAt: string;
    isArchived: boolean;
    accentColor: string;
}


const habitsGroup = ({habitGroup}: {habitGroup: HabitGroup}) => {
    return ( 
        <>
            <HabitsList title={habitGroup.name} habits={[[],[]]} />
        </>
     );
}
 
export default habitsGroup;

export async function getServerSideProps(context: any) {
    const { id } = context.params;
    return {
        props: {
            habitGroup:{
                id: id,
                name: id,
                createdAt: "2021-08-01T00:00:00.000Z",
                isArchived: false,
                accentColor: "#000000"
            }
        }
    }
}