import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

const prisma = new PrismaClient()
const secret = process.env.JWT_SECRET

// Typescript types
import { HabitsGroup, Session } from '@/types/index'

// catch error type
type ErrorType = {
    statusCode: number;
    message: string;
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })
    try {
        switch (req.method) {
            case 'GET':
                const userGroups = await prisma.habitsGroup.findMany({
                    where: {
                        userId: session?.user?.id || '',
                    }
                })
                return res.status(200).json(userGroups)
            case 'POST':
                // Validation of the request body
                const { name, icon }: { name?: string, icon?: string } = req.body

                if (!name) {
                    return res.status(400).json({ message: 'Missing parameter' })
                }
                const createHabitsGroup: HabitsGroup = await prisma.habitsGroup.create({
                    data: {
                        userId: session?.user?.id || '',
                        name,
                        icon
                    }
                })
                return res.status(201).json({ message: "Group Created", data: createHabitsGroup })
            default:
                return res.status(405).json({ message: 'Method not allowed' })
        }
    } catch (error: any) {
        if (error.statusCode) return res.status(error.statusCode).json({ message: error.message })
        return res.status(500).json({ statusCode: 500, message: error })
    }

}
