// Next Components
import Head from 'next/head'

// React
import { useEffect, useState } from 'react'

// Fonts
import { Inter } from 'next/font/google'

// Styles
import styles from '@/styles/Home.module.css'

// Components
import axios from 'axios'
import HabitsList from '@/components/habits-list/template/habit-list/habitsList'

// Typescript Types
import { Habit, HabitWithProgress, Progress } from '@/types/index'


// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [habitsList, setHabitsList] = useState<Habit[][] | HabitWithProgress[][]>([[], [], [], []]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleRefreshHabitsList();
  }, [currentDate])

  const handleRefreshHabitsList = () => {
    setHabitsList([[], [], [], []]);
    setLoading(true);
    axios.get(`/api/habits?date=${formatDate(currentDate)}`)
      .then((res) => {

        setHabitsList([res.data['goodHabits'], res.data['badHabits'], res.data['doneHabits'], res.data['failHabits']]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      })
  }
  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return (
    <>
      <Head>
        <title>Today Habits</title>
        <meta name="description" content="Habits is the best app you would like to manage your habits" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HabitsList
        title="Today Habits"
        habits={habitsList}
        loading={loading}
        readOnly={false}
        onChangeDate={setCurrentDate}
        refresh={() => handleRefreshHabitsList()}
      />
    </>
  )
}

// export async function getServerSideProps() {
//   const response = await fetch(`${process.env.BASE_URL}/api/today-habits`)
//   const habits = await response.json()
//   return {
//     props: {
//       habits: [
//         habits['goodHabits'], habits['badHabits'], habits['doneHabits'],habits['failHabits']
//       ]
//     }
//   }
// }






