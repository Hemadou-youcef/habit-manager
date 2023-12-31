
// React
import { useEffect, useState } from "react";

// Styles
import styles from "./timer.module.css";
import stylesDarkTheme from "./timerDarkTheme.module.css";

// Components
import { useDataContext } from "@/components/layouts/app-layout/layout";
import Overlay from "@/components/features/overlay/overlay";

// Typescript Types
import { Progress } from "@/types";


const Timer = ({ data, saveProgressTime, closeTimer }: { data: Progress, saveProgressTime: (minutes: number) => void, closeTimer: () => void }) => {
    const { theme }: { theme: string } = useDataContext();
    const stylesTheme = theme === "light" ? styles : stylesDarkTheme;

    const [startTime, setStartTime] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<string>('00:00:00');
    const [oldTime, setOldTime] = useState<number>(0);
    const [intervall, setTimerIntervall] = useState<NodeJS.Timeout>();
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        return (
            clearInterval(intervall)
        )
    }, [])


    const startTimer = () => {
        setIsTimerRunning(true)
        const _currentTime = new Date().getTime();
        setStartTime(_currentTime)

        setTimerIntervall(setInterval(() => {
            setCurrentTime(calculateCurrentTime(_currentTime));
        }, 1000));
    }

    const stopTimer = () => {
        setIsTimerRunning(false)
        setOldTime((oldValue) => Math.floor((new Date().getTime() - startTime) / 1000) + oldValue);
        clearInterval(intervall);
    }

    const resetTimer = () => {
        setIsTimerRunning(false)
        setOldTime(0);
        setCurrentTime('00:00:00')
        clearInterval(intervall);
    }

    const saveTime = () => {
        stopTimer();
        const minutes: number = calculateCurrentMinutes();
        saveProgressTime(minutes);
    }

    const handleChangeCurrentTimeFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setCurrentTime('00:00:00');
            setOldTime(0);
            return;
        }
        const hours = Math.floor(parseInt(e.target.value) / 60).toString().padStart(2, '0');
        const minutes = (parseInt(e.target.value) % 60).toString().padStart(2, '0');
        setCurrentTime(`${hours}:${minutes}:00`)
        setOldTime(parseInt(e.target.value) * 60);
    }

    const calculateCurrentMinutes = (): number => {
        return parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1]);
    }

    const calculateCurrentTime = (_startTime: number) => {
        // GET THE SECOND AND IGNORE MILLISECONDS
        let seconds: number = Math.floor((new Date().getTime() - _startTime) / 1000);

        // ADD OLD TIME TO SECONDS
        seconds += oldTime;

        // GET HOUR DIFFERENCE
        let hours: number = 0;
        if (seconds / 3600 >= 0) {
            hours = Math.floor(seconds / 3600);
            seconds = seconds % 3600;
        }

        // GET MINUTE DIFFERENCE
        let minutes: number = 0;
        if (seconds / 60 >= 0) {
            minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
        }

        // make it from [hours: number,minutes: number,seconds: number] to hours:minutes:seconds each unit must have 2 digete
        return formatTime([hours, minutes, seconds])
    }

    const formatTime = (data: number[]): string => {
        const formatData: string[] = []
        data.forEach((value) => {
            formatData.push(value.toString().padStart(2, '0'))
        })
        return formatData.join(":");
    }
    return (
        <Overlay width="350px" closeOverlay={() => closeTimer()} closeOnBackgroundClick={false}>
            <div className={stylesTheme.content}>
                <div className={stylesTheme.header}>
                    <input type="number" min="0" value={calculateCurrentMinutes()} onChange={(e) => handleChangeCurrentTimeFromInput(e)} />
                </div>
                <div className={stylesTheme.body}>
                    <div className={stylesTheme.timer}>
                        {currentTime.split(':').map((value, index) => (
                            <div key={index}>
                                {value}
                            </div>
                        ))}
                    </div>
                    <div className={stylesTheme.actions}>
                        <div>
                            <button className={stylesTheme.bg_red} onClick={() => stopTimer()} disabled={!isTimerRunning}>
                                stop
                            </button>
                            <button className={stylesTheme.bg_blue} onClick={() => startTimer()} disabled={isTimerRunning}>
                                start
                            </button>
                        </div>
                        <button onClick={() => resetTimer()}>
                            reset
                        </button>
                    </div>
                </div>
                <div className={stylesTheme.footer}>
                    <button className={stylesTheme.cancelBtn} onClick={() => { clearInterval(intervall); closeTimer() }}>
                        Cancel
                    </button>
                    <input
                        type="submit"
                        value={loading ? 'Loading...' : 'Save'}
                        className={stylesTheme.submit}
                        onClick={() => saveTime()}
                    />
                </div>
            </div>
        </Overlay>
    );
}

export default Timer;