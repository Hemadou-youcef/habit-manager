// React
import { useState } from 'react'

// styles
import styles from './progress.module.css'

// Components 
import { useDataContext } from "../layouts/app-layout/layout";

// Icons
import { BsFillBookFill } from 'react-icons/bs';




type HabitStatitics = {
    id: string;
    value: number;
    createdAt: string;
}


const ProgressBar = () => {
    const { selectedHabit } = useDataContext();
    return (
        <>
            <div className={styles.content}>
                <div className={styles.habitCard}>
                    <div className={styles.habitCardItem}>
                        <div className={styles.habitIcon}>
                            <BsFillBookFill />
                        </div>
                        <div className={styles.habitName}>
                            READ QURAN
                        </div>
                    </div>
                    <div className={styles.habitCardItem}>
                        <table className={styles.habitInfoTable}>
                            <tbody>
                                <tr>
                                    <th>type:</th>
                                    <td>good</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                </div>
            </div>
        </>
    );
}

export default ProgressBar;