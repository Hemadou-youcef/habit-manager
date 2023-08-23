import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// libraries
import { startOfDay, endOfDay } from 'date-fns';


// Typescript types
import { Habit, HabitWithProgress, Progress, Session } from '@/types/index'

// catch error type
type ErrorType = {
    statusCode: number;
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })
    try {
        switch (req.method) {
            case 'GET':
                const { date, withProgressSeparator = true, withArchived = false, archived = false } = req.query;

                // CONVERT STRING "DATE" TO DATE TYPE
                const choosenDate = new Date(date as string);
                const startOfChoosenDate = startOfDay(choosenDate);
                const endOfChoosenDate = endOfDay(choosenDate);

                // Create Where Clause
                const WhereClause = {};

                Object.assign(WhereClause, { userId: session?.user?.id || '' })
                if (date) {
                    Object.assign(WhereClause, {
                        startDate: {
                            lte: endOfChoosenDate
                        }
                    })
                }

                if (!withArchived) Object.assign(WhereClause, { isArchived: archived });
                // GET USER HABITS THAT ARE NOT ARCHIVED
                const habitList: Habit[] = await prisma.habits.findMany({
                    where: WhereClause,
                    orderBy: {
                        createdAt: 'desc'
                    }
                })

                // SEPERATE GOOD HABITS AND BAD HABITS
                const doneHabits: (Habit | HabitWithProgress)[] = [];
                const failHabits: (Habit | HabitWithProgress)[] = [];
                const goodHabits: (Habit | HabitWithProgress)[] = [];
                const badHabits: (Habit | HabitWithProgress)[] = [];
                const archivedHabits: Habit[][] = [[], []];

                if (withArchived) {
                    habitList.forEach((value) => {
                        const isGoodHabit = value.type == 'good';
                        if (value.isArchived) {
                            archivedHabits[isGoodHabit ? 0 : 1].push(value);
                        } else if (isGoodHabit) {
                            goodHabits.push(value);
                        } else if (!isGoodHabit) {
                            badHabits.push(value)
                        }
                    })
                    return res.status(200).json({ goodHabits, badHabits, archivedHabits })
                }

                // FILTER TODAY HABITS
                // IF GOALS PERIODICITY IS DAILY, THE VALUE LIKE THIS 'mon,tue,wed,thu,fri,sat,sun'
                // IF GOALS PERIODICITY IS MONTHLY, THE VALUE LIKE THIS '1,...,31'
                // IF GOALS PERIODICITY IS YEARLY, THE VALUE LIKE THIS 'jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec'
                // SO WE NEED TO CHECK IF TODAY IS IN THE GOALS PERIODICITY VALUES
                let filteredhabitList: Habit[] = habitList.filter((habit: Habit) => {
                    const goalsPeriodicityValues = habit.goalsPeriodicityValues.split(',');

                    switch (habit.goalsPeriodicity) {
                        case 'daily':
                            const dayName = choosenDate.toString().substr(0, 3).toLowerCase();
                            return goalsPeriodicityValues.includes(dayName);
                        case 'monthly':
                            const dayNumber = choosenDate.getDay();
                            return goalsPeriodicityValues.map((day: string) => parseInt(day)).includes(dayNumber);
                        case 'yearly':
                            const monthName = choosenDate.toLocaleString('en-US', { month: 'long' }).substr(0, 3).toLowerCase();
                            return goalsPeriodicityValues.includes(monthName);
                        default:
                            return false;
                    }
                })




                // GET PROGRESS IF EXISTS, IF NOT CREATE IT
                await Promise.all(filteredhabitList.map(async (habit: Habit) => {
                    const progress = await findHabitProgress(habit.type, habit.id, startOfChoosenDate, endOfChoosenDate);
                    if (!progress) throw new Error('Progress not found');

                    const newHabit: HabitWithProgress = { ...habit, progress };

                    const isProgressDone = Boolean(withProgressSeparator) && (habit.type == 'good') ? habit.goalsValue > 0 ? habit.goalsValue <= progress.value : false : false;
                    const isProgressFail = Boolean(withProgressSeparator) && (habit.type == 'bad') ? progress.value == 0 : false;

                    if (isProgressDone) doneHabits.push(newHabit);
                    else if (isProgressFail) failHabits.push(newHabit);
                    else if (habit.type == 'good') goodHabits.push(newHabit);
                    else badHabits.push(newHabit);
                }))

                return res.status(200).json({ doneHabits, failHabits, goodHabits, badHabits })

                break;
            case 'POST':
                // Validation of the request body
                const { habitGroupId, name, type, startDate, accentColor, icon, goalsValue, goalsPeriodicity, goalsUnit, goalsPeriodicityValues }: { habitGroupId: number, name: string, type: string, startDate: Date, accentColor: string, icon: string, goalsValue: number, goalsPeriodicity: string, goalsUnit: string, goalsPeriodicityValues: string } = req.body
                if (!name || !type || !startDate || !accentColor || !icon || !goalsValue || !goalsPeriodicity || !goalsUnit || !goalsPeriodicityValues) {
                    return res.status(400).json({ message: 'Missing parameter' });
                }

                const habit = await prisma.habits.create({
                    data: {
                        userId: session?.user?.id || '',
                        habitGroupId,
                        isArchived: false,
                        name,
                        type,
                        startDate: new Date(startDate),
                        accentColor,
                        icon,
                        goalsValue: type === "good" ? goalsValue : 1,
                        goalsPeriodicity: type === "good" ? goalsPeriodicity : "daily",
                        goalsUnit: type === "good" ? goalsUnit : "times",
                        goalsPeriodicityValues: type === "good" ? goalsPeriodicityValues : "mon,tue,wed,thu,fri,sat,sun",
                        shareLink: ""
                    }
                })

                return res.status(201).json(habit);
            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error: any) {
        if (error.statusCode) return res.status(error.statusCode).json({ message: error.message })
        return res.status(500).json({ statusCode: 500, message: error })
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
                    createdAt: startOfToday
                }
            })
            return newProgress;
        }
    } catch (error) {
        console.log(error);
    }
}
