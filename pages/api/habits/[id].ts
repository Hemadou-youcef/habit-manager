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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method == 'GET') {
            const habit: Habit[] = await prisma.habits.findMany({
                where: {
                    id: parseInt(req.query.id as string),
                },
            })
            if (habit.length === 0) {
                return res.status(404).json({ statusCode: 404, message: 'Habit not found' })
            }
            res.status(200).json(habit)
        } else {
            throw { statusCode: 405, message: 'Method not allowed' }
        }
    } catch (error: any) {
        res.status(500).json({ statusCode: 500, message: error })
    }

}
