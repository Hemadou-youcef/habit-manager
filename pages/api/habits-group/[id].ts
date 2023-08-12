import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Typescript types
import { HabitsGroup, Habit } from '@/types/index'

// catch error type
type ErrorType = {
    statusCode: number;
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET':
                const { id }: { id?: string } = req.query;
                if (!id) {
                    return res.status(400).json({ message: 'Missing parameter' })
                }
                const userGroup: HabitsGroup | null = await prisma.habitsGroup.findFirst({
                    where: {
                        userId: 1,
                        id: parseInt(id)
                    },
                })
                
                if (userGroup) {
                    const habitsList: Habit[] = await prisma.habits.findMany({
                        where: {
                            habitGroupId: userGroup?.id
                        }
                    })
                    userGroup.habits = habitsList
                }
                console.log(userGroup)
                return res.status(200).json(userGroup);
            default:
                return res.status(405).json({ message: 'Method not allowed' })
        }
    } catch (error: any) {
        res.status(500).json({ message: error })
    }

}
