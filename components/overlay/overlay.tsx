
// Styles
import styles from './overlay.module.css'

const Overlay = ({ children, width, closeOverlay }: { children: React.ReactNode, width?: string, closeOverlay?: () => void }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.overlayBackground} onClick={closeOverlay}></div>
            <div className={styles.overlayContent} style={{ width: width ? width : 'auto' }}>
                {children}
            </div>
        </div>
    );
}

export default Overlay;