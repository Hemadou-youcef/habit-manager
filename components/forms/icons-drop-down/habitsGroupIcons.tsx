// React
import { useEffect, useState, useRef } from 'react';

// styles
import styles from './habitsGroupIcons.module.css';

// Icons list
import { groupIcons, habitIcons } from '@/components/icons';

const HabitsgroupsIcons = ({currentIcon, onIconChange, type}: {currentIcon: string, onIconChange: (value: string)=>void, type: string}) => {
    const [options, setOptions] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (options) {
            window.addEventListener('click', handleClickOutsideElement);
        }
        return () => {
            window.removeEventListener('click', handleClickOutsideElement);
        }
    }, [options]);

    const handleClickOutsideElement = (event: any) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
            // if he click outside the element, close the dropdown of this element if it's open
            setOptions(false);
        }
    };
    const IconList = () : JSX.Element[] => {
        if (type === "habit") return Object.values(habitIcons);
        return Object.values(groupIcons);
    }
    return (
        <>
            <div className={styles.habitActionButton} ref={optionsRef}>
                <div className={styles.habitActionButtonIcon} onClick={() => setOptions(!options)}>
                    {/* <BiDotsVertical /> */}
                    {/* {groupIcons[currentIcon]} */}
                    {currentIcon}
                </div>
                <div
                    className={styles.habitActionDropDown}
                    style={{ display: options ? 'block' : 'none' }}

                >
                    {IconList().map((_icon,index)=>(
                        <div key={index} className={styles.habitIconItem} onClick={()=> onIconChange('folder')}>
                            {_icon}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default HabitsgroupsIcons;