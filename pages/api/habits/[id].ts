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
        switch (req.method) {
            case 'GET':
                const { withProgress = 'false' } = req.query;
                const habit: Habit | null = await prisma.habits.findFirst({
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
                console.log(deletedHabit)
                res.status(205).json({ message: "Habit Deleted successfully", data: deletedHabit });
            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error })
    }

}
