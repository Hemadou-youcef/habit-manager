// React
import { useEffect, useState, useRef } from 'react';

// styles
import styles from './habitsGroupIcons.module.css';

// Icons list
import { groupIcons, habitIcons } from '@/components/icons';

// Icons
import { BsXOctagonFill } from 'react-icons/bs';

const HabitsgroupsIcons = ({ currentIcon, showOnlyMode = false, onIconChange, type }: { currentIcon: string, showOnlyMode: boolean, onIconChange: (value: string) => void, type: string }) => {
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
    const showCurrentIcon = (): JSX.Element => {
        const iconList = type == 'habit' ? habitIcons : groupIcons;
        const choosenIcon: JSX.Element[] = iconList.filter((value) => value.type.name == currentIcon)
        if (choosenIcon.length > 0) return choosenIcon[0];
        else return <BsXOctagonFill size={type == 'habit' ? 16 : 20} />;
    }
    if (showOnlyMode) return showCurrentIcon();
    return (
        <>
            <div className={styles.habitActionButton} ref={optionsRef}>
                <div className={styles.habitActionButtonIcon} onClick={() => setOptions(!options)}>
                    {/* <BiDotsVertical /> */}
                    {/* {groupIcons[currentIcon]} */}
                    {showCurrentIcon()}
                </div>
                <div
                    className={styles.habitActionDropDown}
                    style={{ display: options ? 'grid' : 'none' }}

                >
                    {(type == 'habit' ? habitIcons : groupIcons).map((_icon, index) => (
                        <div key={index} className={styles.habitIconItem} onClick={() => { onIconChange(_icon.type.name), setOptions(false) }}>
                            {_icon}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default HabitsgroupsIcons;