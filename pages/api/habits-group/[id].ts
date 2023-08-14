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
                const HabitsGroup: HabitsGroup | null = await prisma.habitsGroup.findFirst({
                    where: {
                        userId: 1,
                        id: parseInt(id)
                    },
                })
                
                if (HabitsGroup) {
                    const habitsList: Habit[] = await prisma.habits.findMany({
                        where: {
                            habitGroupId: HabitsGroup?.id
                        }
                    })
                    HabitsGroup.habits = habitsList
                }
                return res.status(200).json(HabitsGroup);
            case 'PUT':
                const {name,icon}:{name:string,icon:string} = req.body;
                if(!name && !icon){
                    return res.status(400).json({ message: 'At least one parameter' })
                }

                const HabitsGroupeditedInfo : HabitsGroup = await prisma.habitsGroup.update({
                    where:{
                        id: parseInt(req.query.id as string)
                    },
                    data:{
                        name,
                        icon
                    }
                })

                return res.status(201).json({ message: "Habits Group Edited successfully", data:HabitsGroupeditedInfo});
            default:
                return res.status(405).json({ message: 'Method not allowed' })
        }
    } catch (error: any) {
        res.status(500).json({ message: error })
    }

}
