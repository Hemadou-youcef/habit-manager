// React
import { useEffect, useState, useRef } from 'react';

// styles
import styles from './colorPicker.module.css';
import stylesDarkTheme from './colorPickerDarkTheme.module.css';

// Components
import { useDataContext } from '@/components/layouts/app-layout/layout';
import { SwatchesPicker } from 'react-color';

const ColorPicker = ({ currentColor, onColorChange }: { currentColor: string, onColorChange: (value: string) => void }) => {
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

    
    return (
        <div className={stylesTheme.actionButton} ref={optionsRef}>
            <div className={stylesTheme.actionButtonIcon} onClick={() => setOptions(!options)}>
                <div className={stylesTheme.actionButtonIconColor} style={{ backgroundColor: currentColor }}></div>
            </div>
            <div
                className={stylesTheme.actionDropDown}
                style={{ display: options ? 'grid' : 'none' }}

            >
                <SwatchesPicker
                    color={currentColor}
                    onChangeComplete={(color: any) => onColorChange(color.hex)}
                />
            </div>
        </div>
    );
}

export default ColorPicker;