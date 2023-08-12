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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method == 'GET') {
            const allHabits: Habit[] = await prisma.habits.findMany({
                where: {
                    userId: 1,
                    isArchived: false,
                },
            })
            res.status(200).json(allHabits)
        }
        throw new Error('Method not allowed')

    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error })
    }

}