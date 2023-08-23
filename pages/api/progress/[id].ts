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
        if (isNaN(parseInt(id as string))) throw { statusCode: 400, message: "Invalid Progress ID" }
        await checkIfUserOwnsProgress(parseInt(id as string), session?.user?.id || '')

        switch (req.method) {
            case 'PUT':
                // Validation of the request body
                const { value } = req.body;
                
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
        if (error.statusCode) return res.status(error.statusCode).json({ message: error.message })
        return res.status(500).json({ statusCode: 500, message: error })
    }

}
const checkIfUserOwnsProgress = async (progressId: number, userId: string) => {
    const progress = await prisma.progress.findFirst({
        where: {
            id: progressId,
        },
        include: {
            habit: {
                select: {
                    userId: true
                }
            }
        }
    })
    if (!progress) throw { statusCode: 404, message: "Progress not found" }
    if (userId != progress?.habit?.userId) throw { statusCode: 401, message: "Unauthorized" }
    return true
}
