// React
import { useEffect, useState, useRef } from 'react';

// styles
import styles from './habitsGroupIcons.module.css';
import stylesDarkTheme from './habitsGroupIconsDarkTheme.module.css';

// Components
import { useDataContext } from '@/components/layouts/app-layout/layout';

// Icons list
import { groupIcons, habitIcons } from '@/components/icons';


const HabitsgroupsIcons = ({ currentIcon, showOnlyMode = false, onIconChange, type }: { currentIcon: string, showOnlyMode: boolean, onIconChange: (value: string) => void, type: string }) => {
    const { theme }: { theme: string } = useDataContext();
    const stylesTheme = (theme === 'light') ? styles : stylesDarkTheme;

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

    const getIconList = (): { name: string, icon: JSX.Element }[] => {
        return type === 'habit' ? habitIcons : groupIcons;
    };

    const findIconByName = (name: string): { name: string, icon: JSX.Element } | undefined => {
        return getIconList().find(icon => icon.name === name);
    };

    const showCurrentIcon = (): JSX.Element => {
        const iconList = type === 'habit' ? habitIcons : groupIcons;
        const chosenIcon = iconList.find(icon => icon.name === currentIcon);
        return chosenIcon ? chosenIcon.icon : iconList[0].icon;
    };

    if (showOnlyMode) return showCurrentIcon();
    return (
        <>
            <div className={stylesTheme.habitActionButton} ref={optionsRef}>
                <div className={stylesTheme.habitActionButtonIcon} onClick={() => setOptions(!options)}>
                    {showCurrentIcon()}
                </div>
                <div
                    className={stylesTheme.habitActionDropDown}
                    style={{ display: options ? 'grid' : 'none' }}

                >
                    {getIconList().map((_icon, index) => (
                        <div key={index} className={stylesTheme.habitIconItem} onClick={() => { onIconChange(_icon.name), setOptions(false) }}>
                            {_icon.icon}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default HabitsgroupsIcons;