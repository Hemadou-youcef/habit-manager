// React
import { useState, useEffect } from 'react';

// Styles
import styles from './statisticsDrawer.module.css'
import stylesDarkTheme from './statisticsDrawerDarkTheme.module.css'

// Components
import { useDataContext } from '@/components/layouts/app-layout/layout';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import ElementAnimator from '../element-animator/elementAnimator';
import Overlay from '../overlay/overlay';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    ArcElement,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// Icons
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { AiOutlineReload } from 'react-icons/ai';


// Typescript Types
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
type barChart = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
}

// Configuration
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

const StatisticsDrawer = ({ data, setStatisticsType, setStatisticsDate }: { data: barChart, setStatisticsType: (value: string) => void, setStatisticsDate: (value: Date) => void }) => {
    const { theme }: { theme: string } = useDataContext();
    const stylesTheme = (theme === 'light') ? styles : stylesDarkTheme;

    const [currentDate, setCurrentDate] = useState<Value>(new Date())

    const [showCalendar, setShowCalendar] = useState(false)

    const [currentStatisticsType, setCurrentStatisticsType] = useState<string>('week')
    const statisticsType = ['day', 'week', 'month', 'year'];

    function formatDate(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const setDateToday = () => {
        setCurrentDate(new Date());
        setStatisticsDate(new Date());
    }

    const handleChangeType = (type: string) => {
        setCurrentStatisticsType(type);
        setStatisticsType(type)
    }

    const handleChangeDate = (date: Date) => {
        setCurrentDate(date);
        setStatisticsDate(date);
    }

    const handleNavigateDate = (isNextDate: boolean) => {
        if (!currentDate || !(currentDate instanceof Date)) return;
        const newDateValues = []
        if (isNextDate) newDateValues.push(...[currentDate.getDate() + 1, currentDate.getDate() + 8, currentDate.getMonth() + 1, currentDate.getFullYear() + 1])
        else newDateValues.push(...[currentDate.getDate() - 1, currentDate.getDate() - 8, currentDate.getMonth() - 1, currentDate.getFullYear() - 1])

        let _currentDate = new Date();
        switch (currentStatisticsType) {
            case "day":
                _currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), newDateValues[0]);
                break;
            case 'week':
                _currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), newDateValues[1]);
                break;
            case 'month':
                _currentDate = new Date(currentDate.getFullYear(), newDateValues[2], currentDate.getDate());
                break;
            case 'year':
                _currentDate = new Date(newDateValues[3], currentDate.getMonth(), currentDate.getDate());
                break;
        }
        setCurrentDate(_currentDate);
        setStatisticsDate(_currentDate);
    }


    return (
        <>
            <div className={stylesTheme.content}>
                <div className={stylesTheme.controller}>
                    {/* <div className={stylesTheme.type}>
                        {statisticsType.map((value: string) => (
                            <button

                            >
                                {value}
                            </button>
                        ))}
                    </div> */}
                    <div className={stylesTheme.itemContainer}>
                        <div className={stylesTheme.item}>
                            <button
                                onClick={() => setDateToday()}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => handleNavigateDate(false)}
                            >
                                <BiChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => handleNavigateDate(true)}
                            >
                                <BiChevronRight size={18} />
                            </button>
                        </div>
                        <div className={stylesTheme.item}>
                            <button
                                onClick={() => handleChangeDate(currentDate as Date)}
                            >
                                <AiOutlineReload size={18} />
                            </button>
                            <button
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                {formatDate(currentDate as Date)}
                            </button>
                            <select value={currentStatisticsType} onChange={(e) => { handleChangeType(e.target.value) }}>
                                {statisticsType.map((value: string, index: number) => (
                                    <option value={value} key={index}>{value}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                </div>
                <div className={stylesTheme.body}>
                    <Bar
                        data={data}
                        height={350}
                        width={600}
                        options={{

                            responsive: false,
                            maintainAspectRatio: true,
                            scales: {
                                y: {

                                    beginAtZero: true,
                                    suggestedMax: 10,
                                    grid: {
                                        display: false,
                                    },
                                    ticks: {
                                        color: '#757575'
                                    }
                                },
                                x: {
                                    grid: {
                                        display: false,
                                    },
                                    ticks: {
                                        color: '#757575'
                                    }
                                }
                            },


                            plugins: {
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: false,
                                },

                            },
                        }}
                    />
                </div>
            </div >
            <ElementAnimator showElement={showCalendar} type={0} duration={300}>
                <Overlay closeOverlay={() => setShowCalendar(!showCalendar)} closeOnBackgroundClick>
                    <Calendar onChange={(value) => { handleChangeDate(value as Date); setShowCalendar(!showCalendar) }} value={currentDate} />
                </Overlay>
            </ElementAnimator>
        </>
    );
}

export default StatisticsDrawer;