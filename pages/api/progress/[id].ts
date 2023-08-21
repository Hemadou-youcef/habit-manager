import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

const prisma = new PrismaClient()

// Typescript types
import { Session } from '@/types/index'

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
        if (!await checkIfUserOwnsProgress(parseInt(id as string), session?.user?.id || '')) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        switch (req.method) {
            case 'PUT':
                // Validation of the request body
                const { value } = req.body;
                // if (!value) {
                //     return res.status(400).json({ message: 'Missing parameter' })
                // }
                // EDIT PROGRESS
                const updateProgress = await prisma.progress.update({
                    where: {
                        id: parseInt(id as string)
                    },
                    data: {
                        value: parseInt(value)
                    }
                })
                return res.status(201).json({ message: "Progress Updated", data: updateProgress })
            default:
                return res.status(405).json({ message: 'Method not allowed' })
        }
    } catch (error: any) {
        res.status(500).json({ message: error })
    }

}
const checkIfUserOwnsProgress = async (progressId: number, userId: string) => {
    const progress = await prisma.progress.findFirst({
        where: {
            id: progressId,
            habit: {
                userId: userId
            }
        }
    })
    if (progress) return true
    return false
}
