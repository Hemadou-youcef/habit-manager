import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

// libraries
import { startOfDay, endOfDay } from 'date-fns';

const prisma = new PrismaClient()

// Typescript types
import { Habit, HabitWithProgress, Progress } from '@/types/index'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET':
                // GET TODAY DATE
                const today = new Date();
                const startOfToday = startOfDay(today);
                const endOfToday = endOfDay(today);

                // GET USER HABITS THAT ARE NOT ARCHIVED
                const todayHabits: Habit[] = await prisma.habits.findMany({
                    where: {
                        userId: 1,
                        isArchived: false,
                        startDate: {
                            lte: endOfToday
                        }

                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                })



                // FILTER TODAY HABITS
                // IF GOALS PERIODICITY IS DAILY, THE VALUE LIKE THIS 'mon,tue,wed,thu,fri,sat,sun'
                // IF GOALS PERIODICITY IS MONTHLY, THE VALUE LIKE THIS '1,...,31'
                // IF GOALS PERIODICITY IS YEARLY, THE VALUE LIKE THIS 'jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec'
                // SO WE NEED TO CHECK IF TODAY IS IN THE GOALS PERIODICITY VALUES
                let _todayHabits: Habit[] = todayHabits.filter((habit: Habit) => {
                    const goalsPeriodicityValues = habit.goalsPeriodicityValues.split(',');

                    switch (habit.goalsPeriodicity) {
                        case 'daily':
                            const todayDayName = today.toString().substr(0, 3).toLowerCase();
                            console.log(goalsPeriodicityValues.includes(todayDayName))
                            return goalsPeriodicityValues.includes(todayDayName);
                        case 'monthly':
                            const todayDayNumber = today.getDay();
                            return goalsPeriodicityValues.map((day: string) => parseInt(day)).includes(todayDayNumber);
                        case 'yearly':
                            const todayMonthName = today.toLocaleString('en-US', { month: 'long' }).substr(0, 3).toLowerCase();
                            return goalsPeriodicityValues.includes(todayMonthName);
                        default:
                            return false;
                    }
                })
                console.log(_todayHabits.length)

                // WE NEED TO SEPERATE GOOD HABITS AND BAD HABITS
                const doneHabits: HabitWithProgress[] = [];
                const failHabits: HabitWithProgress[] = [];
                const goodHabits: HabitWithProgress[] = [];
                const badHabits: HabitWithProgress[] = [];

                // GET PROGRESS IF EXISTS, IF NOT CREATE IT
                await Promise.all(_todayHabits.map(async (habit: Habit) => {
                    const progress = await findHabitProgress(habit.type, habit.id, startOfToday, endOfToday);
                    if (!progress) throw new Error('Progress not found');

                    const newHabit: HabitWithProgress = { ...habit, progress };
                    const isProgressDone = (habit.type == 'good') ? habit.goalsValue <= progress.value : false;
                    const isProgressFail = (habit.type == 'bad') ? progress.value == 0 : false;
                    if (isProgressDone) doneHabits.push(newHabit);
                    else if (isProgressFail) failHabits.push(newHabit);
                    else if (habit.type == 'good') goodHabits.push(newHabit);
                    else badHabits.push(newHabit);
                }))

                return res.status(200).json({ doneHabits, failHabits, goodHabits, badHabits })
            default:
                return res.status(405).json({ message: 'Method not allowed' })
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }

}


const findHabitProgress = async (habitType: string, habitId: number, startOfToday: Date, endOfToday: Date) => {
    try {
        // GET PROGRESS IF EXISTS
        const progress: Progress | null = await prisma.progress.findFirst({
            where: {
                habitId: habitId,
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday
                }
            }
        });
        if (progress) return progress;
        else {
            // CREATE PROGRESS IF NOT EXISTS
            const newProgress = await prisma.progress.create({
                data: {
                    habitId: habitId,
                    value: habitType == 'good' ? 0 : 1,
                    createdAt: new Date()
                }
            })
            return newProgress;
        }
    } catch (error) {
        console.log(error);
    }
}

