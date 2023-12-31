import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

const prisma = new PrismaClient()

// Typescript types
import { Habit, HabitWithProgress, Progress, Session } from '@/types'

// catch error type
type ErrorType = {
    statusCode: number;
    message: string;
}
type HabitEdit = {
    habitGroupId: number;
    name: string;
    startDate: Date;
    isArchived: boolean;
    accentColor: string;
    icon: string;
    goalsValue: number;
    goalsUnit: string;
    goalsPeriodicity: string;
    goalsPeriodicityValues: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })
    try {
        const { id }: { id?: string } = req.query;
        if (isNaN(parseInt(id as string))) throw { statusCode: 400, message: "Invalid Habit ID" }
        const habit = await checkIfUserOwnsHabit(parseInt(id as string), session?.user?.id || '')

        switch (req.method) {
            case 'GET':
                const { withProgress = 'false' } = req.query;
                const habit = await prisma.habits.findFirst({
                    where: {
                        id: parseInt(id as string),
                    },
                })
                if (!habit) {
                    return res.status(404).json({ message: 'Habit not found' })
                }
                if (Boolean(withProgress)) {
                    const progress: Progress[] | null = await prisma.progress.findMany({
                        where: {
                            habitId: parseInt(id as string),
                        }
                    });
                    return res.status(200).json({ ...habit, progress: progress })
                }
                return res.status(200).json(habit)
            case 'PUT':
                const { habitGroupId, name, startDate, isArchived = false, accentColor, icon, goalsValue, goalsUnit, goalsPeriodicity, goalsPeriodicityValues }: HabitEdit = req.body

                if (!name && !startDate && !isArchived && !accentColor && !icon && !goalsValue && !goalsUnit && !goalsPeriodicity && !goalsPeriodicityValues) {
                    return res.status(400).json({ message: 'Missing parameter' });
                }

                const habitEditedInfo: Habit = await prisma.habits.update({
                    where: {
                        id: parseInt(id as string)
                    },
                    data: {
                        habitGroupId,
                        name,
                        isArchived,
                        startDate: new Date(startDate),
                        accentColor,
                        icon,
                        goalsValue,
                        goalsUnit,
                        goalsPeriodicity,
                        goalsPeriodicityValues,
                    }
                })



                return res.status(201).json({ message: "Habit Edited successfully", data: habitEditedInfo });
            case "DELETE":

                await prisma.progress.deleteMany({
                    where: {
                        habitId: parseInt(id as string)
                    }
                })
                const deletedHabit: Habit = await prisma.habits.delete({
                    where: {
                        id: parseInt(id as string)
                    }
                })
                return res.status(205).json({ message: "Habit Deleted successfully", data: deletedHabit });
            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error: any) {
        if (error.statusCode) return res.status(error.statusCode).json({ message: error.message })
        return res.status(500).json({ statusCode: 500, message: error })
    }

}

const checkIfUserOwnsHabit = async (habitId: number, userId: string) => {
    const habit = await prisma.habits.findFirst({
        where: {
            id: habitId,
        }
    })
    if (!habit) throw { statusCode: 404, message: "Habit not found" }
    if (userId !== habit.userId) throw { statusCode: 401, message: "Unauthorized" }
    return habit;
}