// React
import { useEffect, useState } from 'react'

// styles
import styles from './progress.module.css'
import stylesDarkTheme from './progressDarkTheme.module.css'

// Components 
import axios from 'axios';
import { useDataContext } from "../layouts/app-layout/layout";
import StatisticsDrawer from '../features/statistics-drawer/statisticsDrawer';

// Icons
import { FiInfo } from 'react-icons/fi';
import { IoStatsChartSharp } from 'react-icons/io5';
import { BiChevronLeft } from 'react-icons/bi';

// Typesscript Types
import { Habit, HabitWithProgress, Progress } from '@/types';
import HabitsgroupsIcons from '../forms/icons-drop-down/habitsGroupIcons';

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
type mainInfo = {
    completedProgress: number;
    failedProgress: number;
}


const ProgressBar = () => {
    const { selectedHabit, selectHabit, theme }: { selectedHabit: Habit, selectHabit: (habit: null) => void, theme: string } = useDataContext();
    const stylesTheme = (theme === 'light') ? styles : stylesDarkTheme;
    const [tabIndex, setTabIndex] = useState(0);

    const [mainInfo, setMainInfo] = useState<mainInfo>({ completedProgress: 0, failedProgress: 0 });
    const [statistics, setStatistics] = useState<barChart>();
    const [statisticsType, setStatisticsType] = useState<string>('week');
    const [statisticsDate, setStatisticsDate] = useState<Date>(new Date());

    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setStatistics(undefined);
        setStatisticsType('week');
        setStatisticsDate(new Date());
        setTabIndex(0);
        if (selectedHabit) getHabitMainInfo();
    }, [selectedHabit]);

    const handleTabChange = (index: number) => {
        setTabIndex(index);
        if (index == 1) {
            if (!statistics) {
                setLoading(true)
                getHabitStatistics();
            }
        } else {
            getHabitMainInfo();
        }
    }

    const getHabitMainInfo = () => {
        axios.get(`/api/habits/${selectedHabit?.id}`)
            .then((res) => {
                const data = res.data as HabitWithProgress;
                const completedProgress = (data.progress as Progress[]).filter((value) => value.value == selectedHabit.goalsValue).length;
                const failedProgress = (data.progress as Progress[]).length - completedProgress;
                setMainInfo({ completedProgress, failedProgress })
            }).catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }

    const getHabitStatistics = (type?: string, date?: Date) => {
        axios.get(`/api/habits/statistics/${selectedHabit?.id}?type=${type || statisticsType}&date=${formatDate(date || statisticsDate)}`)
            .then((res) => {
                res.data.datasets[0].backgroundColor = selectedHabit?.accentColor;
                res.data.datasets[0].borderColor = selectedHabit?.accentColor;
                res.data.datasets[0].borderSize = 0;
                setStatistics(res.data)
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }

    const handleChangeStatisticsType = (value: string) => {
        setStatisticsType(value);
        getHabitStatistics(value);
    }

    const handleChangeStatisticsDate = (value: Date) => {
        setStatisticsDate(value);
        getHabitStatistics(statisticsType, value);
    }
    function formatDate(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    if (!selectedHabit) return <div></div>;
    return (
        <>
            <div className={stylesTheme.content}>
                <div className={stylesTheme.habitCard}>
                    <div className={stylesTheme.habitCardItem}>
                        <button
                            className={stylesTheme.returnButton}
                            onClick={() => { selectHabit(null) }}
                        >
                            <BiChevronLeft size={22} />
                        </button>
                        <div className={stylesTheme.habitIcon} style={{ backgroundColor: selectedHabit?.accentColor }}>
                            <HabitsgroupsIcons
                                currentIcon={selectedHabit?.icon}
                                showOnlyMode={true}
                                type={'habit'}
                                onIconChange={(value: string) => { }}
                            />
                        </div>
                        <div className={stylesTheme.habitName}>
                            {selectedHabit?.name}
                        </div>
                    </div>

                </div>
                <div className={stylesTheme.habitsSections}>
                    <button
                        className={tabIndex == 0 ? stylesTheme.active : undefined}
                        onClick={() => handleTabChange(0)}
                    >
                        <FiInfo size={20} />
                        Information
                    </button>
                    <button
                        className={tabIndex == 1 ? stylesTheme.active : undefined}
                        onClick={() => handleTabChange(1)}
                    >

                        <IoStatsChartSharp size={20} />
                        Statistics
                    </button>
                </div>
                {loading && <div className={stylesTheme.loading}>Loading</div>}
                {!loading && (tabIndex == 0 ? (
                    <div className={stylesTheme.InformationSection}>
                        <div className={stylesTheme.mainInformation}>
                            <div className={stylesTheme.informationItem}>
                                <p>Type:</p>
                                <p>{`${selectedHabit?.type} Habit`}</p>
                            </div>
                            <div className={stylesTheme.informationItem}>
                                <p>Goal:</p>
                                <p>{`${selectedHabit?.goalsValue} ${selectedHabit?.goalsUnit} ${selectedHabit?.goalsPeriodicity}`}</p>
                            </div>
                            <div className={stylesTheme.informationItem}>
                                <p>Total Completed Progress:</p>
                                <p>{`${mainInfo?.completedProgress}`}</p>
                            </div>
                        </div>
                        {/* <div className={stylesTheme.habitCardItem}>
                            <table className={stylesTheme.habitInfoTable}>
                                <tbody>
                                    <tr>
                                        <th>type:</th>
                                        <td>{selectedHabit?.type}</td>
                                    </tr>
                                    <tr>
                                        <th>goal:</th>
                                        <td>{selectedHabit?.goalsValue}</td>
                                    </tr>
                                    <tr>
                                        <th>unit:</th>
                                        <td>{selectedHabit?.goalsUnit}</td>
                                    </tr>
                                    <tr>
                                        <th>periodicity:</th>
                                        <td>{selectedHabit?.goalsPeriodicity}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div> */}
                    </div>
                ) : (
                    <div className={stylesTheme.statisticsSection}>
                        {/* <div className={stylesTheme.habitProgress}>
                            <div className={stylesTheme.habitProgressItem}>
                                <div className={stylesTheme.habitProgressItemTitle}>
                                    <p>Done</p>
                                </div>
                                <div className={stylesTheme.habitProgressItemValue}>
                                    <p>0</p>
                                </div>
                            </div>
                            <div className={stylesTheme.habitProgressItem}>
                                <div className={stylesTheme.habitProgressItemTitle}>
                                    <p>Failed</p>
                                </div>
                                <div className={stylesTheme.habitProgressItemValue}>
                                    <p>0</p>
                                </div>
                            </div>
                        </div> */}
                        <StatisticsDrawer
                            data={statistics as barChart}
                            setStatisticsType={handleChangeStatisticsType}
                            setStatisticsDate={handleChangeStatisticsDate}
                        />
                    </div>
                ))}



            </div>
        </>
    );
}

export default ProgressBar;