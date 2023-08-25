import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

const prisma = new PrismaClient()

// libraries
import { startOfDay, endOfDay, formatDistance, subDays } from 'date-fns';

// Typescript types
import { Habit, Progress, Session } from '@/types';
import { get } from 'http'

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
                const { startOfChoosenDate, endOfChoosenDate } = getStartingAndEndingDate(type as string, new Date(date as string));

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

                //  GET DATE LABELS
                const dateLabel = getDatesInRange(startOfChoosenDate, endOfChoosenDate, type as string);
                // GET DATA
                const data = getbarChartData(habit, progress, type as string, startOfChoosenDate, endOfChoosenDate);


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

function getStartingAndEndingDate(type: string, date: Date) {
    const choosenDate = new Date(date);
    const endOfChoosenDate = endOfDay(choosenDate);
    let startOfChoosenDate;
    switch (type) {
        case 'day':
            startOfChoosenDate = startOfDay(choosenDate);
            break;
        case 'week':
            startOfChoosenDate = startOfDay(subDays(choosenDate, 7));
            break;
        case 'month':
            startOfChoosenDate = startOfDay(subDays(choosenDate, 30));
            break;
        case 'year':
            startOfChoosenDate = startOfDay(subDays(choosenDate, 365));
            break;
        default:
            throw { statusCode: 400, message: "Invalid type" }
    }
    return { startOfChoosenDate, endOfChoosenDate };
}

function getbarChartData(habit: Habit, progress: Progress[], type: string, startOfChoosenDate: Date, endOfChoosenDate: Date) {
    const startDate = new Date(habit.startDate).getTime();

    const daysInRange = getDatesInRange(
        new Date(Math.max(startDate, startOfChoosenDate.getTime())),
        endOfChoosenDate,
        'yyyy-mm-dd',
        true
    );
    // console.log(daysInRange)

    const datesInRange = getDatesInRange(startOfChoosenDate, endOfChoosenDate, type, true);

    return datesInRange.map((date) => {
        let progressValue = habit?.type === 'good' || new Date(date).getTime() < startDate ? 0 : 1;

        const progressOfThisDate = progress.filter(
            (value: any) => formatDate(value.createdAt, type) === formatDate(new Date(date), type)
        );

        if (progressOfThisDate.length > 0) {
            if (type === 'year' && habit?.type === 'bad') {
                const daysInThisMonth = daysInRange.filter(
                    (value) => formatDate(new Date(value), type) === formatDate(new Date(date), type)
                ).length;
                progressValue = progressOfThisDate.reduce((acc, value) => (value.value ? acc : acc - 1), daysInThisMonth);
            } else {
                progressValue = progressOfThisDate.reduce((acc, value) => acc + value.value, 0);
            }
        }

        return progressValue;
    });
}


function getbarCdhartData(habit: Habit, progress: Progress[], type: string, startOfChoosenDate: Date, endOfChoosenDate: Date) {
    const startDate = new Date(progress[0].createdAt).getTime();

    const daysOfThisStatistiques = getDatesInRange(startDate > startOfChoosenDate.getTime() ? new Date(startDate) : startOfChoosenDate, endOfChoosenDate, 'yyyy-mm-dd', true)

    const datesOfThisStatistiques = getDatesInRange(startOfChoosenDate, endOfChoosenDate, type, true)

    return datesOfThisStatistiques.map((date) => {
        let progressDefaultValues = habit?.type == 'good' || new Date(date).getTime() < startDate ? 0 : 1;

        const progressOfThisDate = progress.filter((value) => formatDate(value.createdAt, type) == formatDate(new Date(date), type));

        if (progressOfThisDate.length > 0) {
            if (type == 'year' && habit?.type == 'bad') {
                const numberOfDaysOfThisMonth = daysOfThisStatistiques.filter((value) => formatDate(new Date(value), type) == formatDate(new Date(date), type)).length;

                progressDefaultValues = progressOfThisDate.reduce((acc, value) => value ? acc - 1 : acc, numberOfDaysOfThisMonth);
            } else {
                progressDefaultValues = progressOfThisDate.reduce((acc, value) => acc + value.value, 0);
            }
        }

        return progressDefaultValues;
    });
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


function getDatesInRange(startDate: Date, endDate: Date, type: string, fullDate = false) {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(formatDate(currentDate, fullDate ? 'yyyy-mm-dd' : type));
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