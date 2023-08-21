// Next Components
import Head from 'next/head'

// React
import { useEffect, useState } from "react";

// Components
import axios from 'axios'
import ManageHabits from "@/components/habits-list/template/manage-habits/manageHabits";

// Typescript Types
import { Habit } from "@/types";


const AllHabits = () => {
    const [habitsList, setHabitsList] = useState<Habit[][][]>([[], [], [[],[]]]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleRefreshHabitsList();
    }, [])

    const handleRefreshHabitsList = () => {
        setLoading(true);
        axios.get(`/api/habits?withArchived=true`)
            .then((res) => {
                setHabitsList([res.data['goodHabits'], res.data['badHabits'], res.data['archivedHabits']]);
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
            <Head>
                <title>Manage Habits</title>
                <meta name="description" content="Habits is the great app you would like to manage your habits" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ManageHabits
                habits={habitsList}
                loading={loading}
                refresh={() => handleRefreshHabitsList()}
            />
        </>
    );
}

export default AllHabits;