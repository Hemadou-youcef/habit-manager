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
                const userGroups = await prisma.habitsGroup.findMany({
                    where:{
                        userId:1
                    }
                })
                return res.status(200).json(userGroups)
            case 'POST':
                // Validation of the request body
                const { name, icon }: { name?: string, icon?: string } = req.body
                
                if (!name) {
                    return res.status(400).json({message: 'Missing parameter' })
                }
                const createHabitsGroup: HabitsGroup = await prisma.habitsGroup.create({
                    data: {
                        userId: 1,
                        name,
                        icon
                    }
                })
                return res.status(201).json({ message: "Group Created", data: createHabitsGroup})
            default:
                return res.status(405).json({message: 'Method not allowed' })
        }
    } catch (error: any) {
        res.status(500).json({message: error})
    }

}
