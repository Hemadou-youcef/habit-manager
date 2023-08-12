
// React 
import { useState } from 'react';

// Styles
import styles from './overlay.module.css'

const Overlay = ({ children, width, closeOverlay }: { children: React.ReactNode, width?: string, closeOverlay?: () => void }) => {
    const [visible, setVisible] = useState(true);
    return (
        <div className={`${styles.overlay} ${visible?'fadeIn':'fadeOut'}`}>
            <div className={styles.overlayBackground} onClick={closeOverlay}></div>
            <div className={styles.overlayContent} style={{ width: width ? width : 'auto' }}>
                {children}
            </div>
        </div>
    );
}

export default Overlay;