
// React 
import { useState } from 'react';

// Styles
import styles from './overlay.module.css'
import stylesDarkTheme from './overlayDarkTheme.module.css'

// Components
import { useDataContext } from '@/components/layouts/app-layout/layout';

const Overlay = ({ children, width, closeOnBackgroundClick = true, closeOverlay }: { children: React.ReactNode, width?: string, closeOnBackgroundClick: boolean, closeOverlay: () => void }) => {
    const { theme }: { theme: string } = useDataContext();
    const stylesTheme = (theme === 'light') ? styles : stylesDarkTheme;
    // const [visible, setVisible] = useState(true);
    return (
        <div className={`${stylesTheme.overlay}`}>
            <div className={stylesTheme.overlayBackground} onClick={() => { closeOnBackgroundClick ? closeOverlay() : null }}></div>
            <div className={stylesTheme.overlayContent} style={{ width: width ? width : 'auto' }}>
                {children}
            </div>
        </div>
    );
}

export default Overlay;