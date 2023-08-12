// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Typescript types
type UserData = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

type Data = {
  message: string;
  data: UserData;
}


export default async  function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const createUser = await prisma.users.create({
    data: {
      name: 'Youcef Hemadou',
      email: 'youcef.hemadou@hotmail.com',
      password: '123456',
    }
  })

  res.status(200).json({ message: 'User created', data: createUser })
}
