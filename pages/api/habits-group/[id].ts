import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

const prisma = new PrismaClient()

// Typescript types
import { HabitsGroup, Habit, Session } from '@/types/index'

// catch error type
type ErrorType = {
    statusCode: number;
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })
    try {
        const { id }: { id?: string } = req.query;
        if (!await checkIfUserOwnsHabitsGroup(parseInt(id as string), session?.user?.id || '')) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        switch (req.method) {
            case 'GET':
                if (!id) {
                    return res.status(400).json({ message: 'Missing parameter' })
                }
                const HabitsGroup: HabitsGroup | null = await prisma.habitsGroup.findFirst({
                    where: {
                        userId: session?.user?.id || '',
                        id: parseInt(id as string)
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
                const { name, icon }: { name: string, icon: string } = req.body;
                if (!name && !icon) {
                    return res.status(400).json({ message: 'At least one parameter' })
                }

                const HabitsGroupeditedInfo: HabitsGroup = await prisma.habitsGroup.update({
                    where: {
                        id: parseInt(id as string)
                    },
                    data: {
                        name,
                        icon
                    }
                })

                return res.status(201).json({ message: "Habits Group Edited successfully", data: HabitsGroupeditedInfo });
            case 'DELETE':
                await prisma.habits.updateMany({
                    where: {
                        habitGroupId: parseInt(id as string)
                    },
                    data: {
                        habitGroupId: null
                    }
                })
                const deletedHabitsGroup: HabitsGroup = await prisma.habitsGroup.delete({
                    where: {
                        id: parseInt(id as string)
                    },
                })
                res.status(205).json({ message: "Habits Group Deleted successfully", data: deletedHabitsGroup });
            default:
                return res.status(405).json({ message: 'Method not allowed' })
        }
    } catch (error: any) {
        res.status(500).json({ message: error })
    }

}


const checkIfUserOwnsHabitsGroup = async (habitsGroupId: number, userId: string) => {
    const habitsGroup = await prisma.habitsGroup.findFirst({
        where: {
            id: habitsGroupId,
            userId: userId
        }
    })
    if (!habitsGroup) throw { statusCode: 401, message: "Unauthorized" }
    return habitsGroup
}