
// React 
import { useState } from 'react';

// Styles
import styles from './overlay.module.css'

const Overlay = ({ children, width, closeOnBackgroundClick = true, closeOverlay }: { children: React.ReactNode, width?: string, closeOnBackgroundClick: boolean, closeOverlay: () => void }) => {
    // const [visible, setVisible] = useState(true);
    return (
        <div className={`${styles.overlay}`}>
            <div className={styles.overlayBackground} onClick={() => { closeOnBackgroundClick ? closeOverlay() : null }}></div>
            <div className={styles.overlayContent} style={{ width: width ? width : 'auto' }}>
                {children}
            </div>
        </div>
    );
}

export default Overlay;