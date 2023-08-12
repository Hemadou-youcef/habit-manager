import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Typescript types
import { Habit, Progress } from '@/types/index'

// catch error type
type ErrorType = {
    statusCode: number;
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'POST':
                // Validation of the request body
                const { name, type, startDate, accentColor, icon, goalsValue, goalsPeriodicity, goalsUnit, goalsPeriodicityValues } : { name: string, type: string, startDate: Date, accentColor: string, icon: string, goalsValue: number, goalsPeriodicity: string, goalsUnit: string, goalsPeriodicityValues: string } = req.body
                
                if (!name || !type || !startDate || !accentColor || !icon || !goalsValue || !goalsPeriodicity || !goalsUnit || !goalsPeriodicityValues) {
                    return res.status(400).json({ statusCode: 400, message: 'Missing parameter' });
                }
                
                const habit = await prisma.habits.create({
                    data: {
                        userId: 1,
                        isArchived: false,
                        name,
                        type,
                        startDate: new Date(startDate),
                        accentColor,
                        icon,
                        goalsValue,
                        goalsPeriodicity,
                        goalsUnit,
                        goalsPeriodicityValues,
                        shareLink: ""
                    }
                })
                
                return res.status(201).json(habit);
            default:
                return res.status(405).json({ statusCode: 405, message: 'Method not allowed' });
        }
    } catch (error: any) {
        res.status(500).json({ statusCode: 500, message: error });
    }

}
