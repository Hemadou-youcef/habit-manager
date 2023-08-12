// Next Components
import Head from 'next/head'

// React
import { useState } from 'react'

// Fonts
import { Inter } from 'next/font/google'

// Styles
import styles from '@/styles/Home.module.css'

// Components
import axios from 'axios'
import HabitsList from '@/components/habits-list/template/habitsList'

// Typescript Types
import { Habit, HabitWithProgress, Progress } from '@/types/index'


// const inter = Inter({ subsets: ['latin'] })

export default function Home({ habits }: { habits: Habit[][] | HabitWithProgress[][] }) {
  const [habitsList, setHabitsList] = useState<Habit[][] | HabitWithProgress[][]>(habits);
  const [loading, setLoading] = useState(false);

  const handleRefreshHabitsList = () => {
    axios.get(`/api/today-habits`)
      .then((res) => {
        console.log(res.data)
        setHabitsList([res.data['goodHabits'], res.data['badHabits']]);
      })
      .catch((err) => {
        console.log(err);
      })
  }
  return (
    <>
      <Head>
        <title>Manage Habits</title>
        <meta name="description" content="Habits is the best app you would like to manage your habits" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HabitsList
        title="Today Habits"
        habits={habitsList}
        loading={loading}
        readOnly={false}
        refresh={() => handleRefreshHabitsList()}
      />
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(`${process.env.BASE_URL}/api/today-habits`)
  const habits = await response.json()
  return {
    props: {
      habits: [
        habits['goodHabits'], habits['badHabits']
      ]
    }
  }
}






