import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

const bcrypt = require('bcryptjs');
const prisma = new PrismaClient()

// Typescript types


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'POST':
                const { username, password, name } = req.body
                if (!username || !password || !name) return res.status(400).json({ message: 'Missing parameter' })
                const user = await prisma.user.findUnique({
                    where:{
                        username
                    }
                })
                if(user) return res.status(400).json({ message: 'Username already exists' })

                const hashedPassword = hashPass(password);
                const newUser = await prisma.user.create({
                    data: {
                        name,
                        username,
                        password: hashedPassword
                    }
                })
                return res.status(200).json(newUser)
            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error: any) {
        if (error.statusCode) return res.status(error.statusCode).json({ message: error.message })
        return res.status(500).json({ statusCode: 500, message: error })
    }

}


const hashPass = (Password: string) => {
    return bcrypt.hashSync(Password, 10);
}