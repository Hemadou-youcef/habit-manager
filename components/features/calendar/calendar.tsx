// React
import { useState } from "react";

// Icons
import { BsChevronUp, BsChevronDown } from "react-icons/bs";

// styles
import styles from './calendar.module.css'

const Calendar = ({ startDate, setSelectedDate }: { startDate: Date, setSelectedDate: (date: Date) => void }) => {
    const [type, setType] = useState("month");

    const [currentDate, setCurrentDate] = useState(startDate || new Date());
    const [focusedDate, setFocusedDate] = useState(startDate || new Date());


    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const getDaysInMonth = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const getDayOfWeek = (date: Date) => date.getDay();

    const getFirstDayOfMonth = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), 1);

    const getLastDayOfMonth = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const getMonthDays = (date: Date) => {
        const firstDay = getFirstDayOfMonth(date);
        const lastDay = getLastDayOfMonth(date);
        const daysInMonth = getDaysInMonth(date);

        const monthDays = [];

        let currentDate = new Date(firstDay.getTime());
        currentDate.setDate(currentDate.getDate() - getDayOfWeek(firstDay));


        for (let i = 0; i < 42; i++) {
            monthDays.push(new Date(currentDate.getTime()));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return monthDays;
    };

    const getYearMonths = (date: Date) => {
        const yearMonths = [];

        for (let i = 0; i < 12; i++) {
            yearMonths.push(new Date(date.getFullYear(), i, 1));
        }

        return yearMonths;
    };

    const getYearsYear = (date: Date) => {
        const startYear = date.getFullYear() - 6;
        const yearsYear = [];

        for (let i = 0; i < 12; i++) {
            yearsYear.push(new Date(startYear + i, 0, 1));
        }

        return yearsYear;
    };

    const monthDays = getMonthDays(currentDate);
    const yearMonths = getYearMonths(currentDate);
    const yearsYear = getYearsYear(currentDate);

    const handlePrevMonthClick = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );

    const handleNextMonthClick = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );

    const handlePrevYearClick = () =>
        setCurrentDate(new Date(currentDate.getFullYear() - 1, 0));

    const handleNextYearClick = () =>
        setCurrentDate(new Date(currentDate.getFullYear() + 1, 0));

    const handlePrevYearsClick = () =>
        setCurrentDate(new Date(currentDate.getFullYear() - 12, 0));

    const handleNextYearsClick = () =>
        setCurrentDate(new Date(currentDate.getFullYear() + 12, 0));


    const handleSelectDate = (date: Date) => {
        setFocusedDate(date);
        setSelectedDate(date);
    };


    return (
        <div className={styles.content} style={{ width: "500px"}}>
            <div className={styles.header}>
                <p
                    onClick={() => {
                        type === "month" ? setType("year") : setType("years");
                    }}
                >
                    {type === "month" && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                    {type === "year" && `${currentDate.getFullYear()}`}
                    {type === "years" && `${yearsYear[0].getFullYear()} - ${yearsYear[yearsYear.length - 1].getFullYear()}`}
                </p>
                <div className={styles.options}>
                    <div className={`${styles.today} ${styles.options_today}`} onClick={() => { handleSelectDate(new Date()) }}>
                        Today
                    </div>
                    <BsChevronUp
                        fontSize={25}
                        className={styles.options_chevron}
                        onClick={type === "month" ? handlePrevMonthClick : type === "year" ? handlePrevYearClick : handlePrevYearsClick}
                    />
                    <BsChevronDown
                        fontSize={25}
                        className={styles.options_chevron}
                        onClick={type === "month" ? handleNextMonthClick : type === "year" ? handleNextYearClick : handleNextYearsClick}
                    />
                </div>
            </div>
            {type === "month" && (
                <div className={styles.monthDays}>
                    {daysOfWeek.map((dayOfWeek) => (
                        <div key={dayOfWeek}>
                            <div className={styles.centerElement}>
                                <p>{dayOfWeek}</p>
                            </div>
                        </div>
                    ))}
                    {monthDays.map((monthDay) => (
                        <div
                            className={` ${styles.centerElement} ${monthDay.getDate() === focusedDate.getDate() && monthDay.getMonth() === focusedDate.getMonth() ? styles.selected : ''}`}
                            key={monthDay.getTime()}
                            onClick={() => handleSelectDate(monthDay)}
                        >
                            <p>{monthDay.getDate()}</p>
                        </div>
                    ))}
                </div>
            )}
            {type === "year" && (
                <div className={styles.yearGrid}>
                    {yearMonths.map((yearMonth) => (
                        <div
                            key={yearMonth.getTime()}
                            className={`${styles.yearCell} ${yearMonth.getMonth() === currentDate.getMonth() && yearMonth.getFullYear() === currentDate.getFullYear() ? styles.selected : ''}`}
                            onClick={() => {
                                setCurrentDate(yearMonth);
                                setType("month");
                            }}
                        >
                            <p>{monthNames[yearMonth.getMonth()]}</p>
                        </div>
                    ))}
                </div>
            )}
            {type === "years" && (
                <div className={styles.yearsGrid}>
                    {yearsYear.map((year) => (
                        <div
                            key={year.getTime()}
                            className={`${styles.yearsCell} ${year.getFullYear() === currentDate.getFullYear() ? styles.selected : ''}`}
                            onClick={() => {
                                setCurrentDate(year);
                                setType("year");
                            }}
                        >
                            <p>{year.getFullYear()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Calendar;