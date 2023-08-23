import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

const prisma = new PrismaClient()

// libraries
import { startOfDay, endOfDay, formatDistance, subDays } from 'date-fns';

// Typescript types
import { Progress, Session } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session: Session | null = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })
    try {
        switch (req.method) {
            case 'GET':
                // GET STATISTICS OF A HABIT
                const { id, type = 'week', date } = req.query;
                if (!date) return res.status(400).json({ message: 'Missing parameter' });
                const habit = await checkIfUserOwnsHabit(parseInt(id as string), session?.user?.id || '')

                // SET STARTING DATE AND ENDING DATE
                const choosenDate = new Date(date as string);
                const endOfChoosenDate = endOfDay(choosenDate);
                let startOfChoosenDate;
                if (type == 'day') { startOfChoosenDate = startOfDay(choosenDate); }
                else if (type == 'week') { startOfChoosenDate = startOfDay(subDays(choosenDate, 7)); }
                else if (type == 'month') { startOfChoosenDate = startOfDay(subDays(choosenDate, 30)); }
                else if (type == 'year') { startOfChoosenDate = startOfDay(subDays(choosenDate, 365)); }
                else return res.status(400).json({ message: 'Invalid request' });

                // GET PROGRESS BETWEEN THIS DATES
                const progress: Progress[] = await prisma.progress.findMany({
                    where: {
                        habitId: parseInt(id as string),
                        createdAt: {
                            gt: startOfChoosenDate,
                            lt: endOfChoosenDate
                        }
                    }
                })

                // FILL THE EMPTY PROGRESS TO USE IT IN CHART JS
                const dateLabel = getDatesInRange(startOfChoosenDate, endOfChoosenDate, type);
                const startDate = new Date(habit.startDate).getTime();
                let data = getDatesInRange(startOfChoosenDate, endOfChoosenDate, 'yyyy-mm-dd').map((date) => {
                    const progressOfThisDate = progress.filter((value) => formatDate(value.createdAt, type) == formatDate(new Date(date), type));
                    
                    let progressDefaultValues = habit.type == 'good' || new Date(date).getTime() < startDate ? 0 : 1;
                    if (habit.type == 'good') {
                        if (progressOfThisDate.length > 0) progressDefaultValues = progressOfThisDate[0].value;
                    } else {
                        if (progressOfThisDate.length > 0) progressDefaultValues = progressOfThisDate[0].value;
                    }
                    return progressDefaultValues;
                });


                // FILL THE BARCHART
                const barChart = {
                    labels: dateLabel,
                    datasets: [
                        {
                            label: 'Progress',
                            data: data,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                };

                return res.status(200).json(barChart);
            default:
                return res.status(405).json({ message: 'Method not allowed' })
        }
    } catch (error: any) {
        res.status(500).json({ message: error })
    }

}

function formatDate(date: Date, type: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (type == 'yyyy-mm-dd') return `${year}-${month}-${day}`;
    else if (type === 'year') return `${months[parseInt(month) - 1]}-${year}`;

    return `${day}-${months[parseInt(month) - 1]}`;
}


function getDatesInRange(startDate: Date, endDate: Date, type: string) {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(formatDate(currentDate, type));

        if (type === 'year') {
            currentDate.setMonth(currentDate.getMonth() + 1); // Increment by one month
        } else {
            currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
        }
    }

    return dates;
}


const checkIfUserOwnsHabit = async (habitId: number, userId: string) => {
    const habit = await prisma.habits.findFirst({
        where: {
            id: habitId,
        }
    })
    if (!habit) throw { statusCode: 404, message: "Habit not found" }
    if (userId !== habit.userId) throw { statusCode: 401, message: "Unauthorized" }
    return habit;
}