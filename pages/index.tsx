// Next Components
import Head from 'next/head'

// React
import { useState } from 'react'

// Fonts
import { Inter } from 'next/font/google'

// Styles
import styles from '@/styles/Home.module.css'

// Components
import HabitsList from '@/components/habits-list/template/habitsList'

// Typescript Types
type Habit = {
  id: string;
  name: string;
  createdAt: string;
  isArchived: boolean;
  accentColor: string;
  goals: {
    createdAt: string;
    periodicity: string;
    unit: {
      symbol: string;
      type: string;
    };
    value: number;
  };
  regularly?: string;
  startDate: number;
  habitType: {
    rawValue: number;
    habitType: string;
  };
  priority: number;
  priorityByArea: string;
  shareLink: string;
  progress: {
    id: string;
    value: number;
    createdAt: string;
  }
};


// const inter = Inter({ subsets: ['latin'] })

export default function Home({ habits }: { habits: Habit[][]}) {
  
  return (
    <>
      <Head>
        <title>Manage Habits</title>
        <meta name="description" content="Habits is the best app you would like to manage your habits" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HabitsList title="Today Habits" habits={habits} />
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      habits: [
        [
          {
            id: "-example-id-001",
            name: "Learn",
            createdAt: "2023-07-07T22:11:35.539Z",
            isArchived: false,
            accentColor: "#2AA8D0",
            goals: {
              createdAt: "2023-07-08T22:07:59.713Z",
              periodicity: "daily",
              unit: {
                symbol: "min",
                type: "DURATION"
              },
              value: 240

            },
            startDate: 1688854079713,
            habitType: {
              rawValue: 1,
              habitType: "good"
            },
            priority: 0,
            priorityByArea: "U",
            shareLink: "https://share.example.com/habit",
            progress: {
              id: "-example-progress-id",
              value: 180,
              createdAt: "2023-07-08T22:07:59.713Z"
            },
          },
          {
            id: "-example-good-id",
            name: "Exercise",
            createdAt: "2023-07-15T10:00:00.000Z",
            isArchived: false,
            accentColor: "#4CAF50",
            goals: {
              createdAt: "2023-07-15T10:00:00.000Z",
              periodicity: "daily",
              unit: {
                symbol: "times",
                type: "TRIES"
              },
              value: 30
            },
            startDate: 1689350400000,
            habitType: {
              rawValue: 1,
              habitType: "good"
            },
            priority: 2,
            priorityByArea: "A",
            shareLink: "https://share.example.com/exercise",
            progress: {
              id: "-example-good-progress-id",
              value: 10,
              createdAt: "2023-07-15T10:00:00.000Z"
            },
          },
        ],
        [{
          id: "-example-bad-id",
          name: "Smoking",
          createdAt: "2023-07-20T15:30:00.000Z",
          isArchived: false,
          accentColor: "#FF5722",
          goals: {
            createdAt: "2023-07-20T15:30:00.000Z",
            periodicity: "daily",
            unit: {
              symbol: "break",
              type: "DURATION"
            },
            value: 15
          },
          startDate: 1690038600000,
          habitType: {
            rawValue: 2,
            habitType: "bad"
          },
          priority: -1,
          priorityByArea: "B",
          shareLink: "https://share.example.com/smoking",
          progress: {
            id: "-example-bad-progress-id",
            value: 5,
            createdAt: "2023-07-20T15:30:00.000Z"
          },
        }
        ]
      ]
    }
  }
}







