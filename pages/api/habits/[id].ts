import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Typescript types
type Habit = {
    id: number;
    name: string;
    type: string;
    startDate: Date;
    isArchived: boolean;
    accentColor: string;
    icon: string;
    goalsValue: number;
    goalsPeriodicity: string;
    goalsUnit: string;
    goalsPeriodicityValues: string;
    createdAt: Date;
    updatedAt: Date;
    shareLink: string;
}

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
    goalsPeriodicity: string;
    goalsPeriodicityValues: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET':
                const habit: Habit[] = await prisma.habits.findMany({
                    where: {
                        id: parseInt(req.query.id as string),
                    },
                })
                if (habit.length === 0) {
                    return res.status(404).json({ message: 'Habit not found' })
                }
                return res.status(200).json(habit)
            case 'PUT':
                const { habitGroupId, name, startDate, isArchived = false, accentColor, icon, goalsValue, goalsPeriodicity, goalsPeriodicityValues } : HabitEdit = req.body
                if (!name && !startDate && !isArchived && !accentColor && !icon && !goalsValue && !goalsPeriodicity && !goalsPeriodicityValues){
                    return res.status(400).json({ message: 'Missing parameter' });
                }
                console.log(req.method)
                const habitEditedInfo: Habit = await prisma.habits.update({
                    where:{
                        id: parseInt(req.query.id as string)
                    },
                    data:{
                        habitGroupId,
                        name,
                        startDate: new Date(startDate),
                        accentColor,
                        icon,
                        goalsValue,
                        goalsPeriodicity,
                        goalsPeriodicityValues,
                    }
                })

                return res.status(201).json({ message: "Habit Edited successfully", data:habitEditedInfo});
            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error })
    }

}
