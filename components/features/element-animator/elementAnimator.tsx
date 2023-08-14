// React
import { useState, useEffect } from 'react';

// Styles
import styles from './elementAnimator.module.css';

const ElementAnimator = ({ children, showElement, type = 0 , duration }: { children: React.ReactNode, showElement: boolean, type: number, duration: number }) => {
    const [isVisible, setIsVisible] = useState(showElement);

    const types = [
        [styles.fadeIn, styles.fadeOut],
        [styles.slideIn, styles.slideOut],
        [styles.slideInFromLeft, styles.slideOutToLeft],
        [styles.slideInFromRight, styles.slideOutToRight],
        [styles.slideInFromTop, styles.slideOutToTop],
        [styles.slideInFromBottom, styles.slideOutToBottom],
        [styles.heightIn, styles.heightOut],
    ]

    useEffect(() => {
        if (showElement) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, duration); // Adjust the timing to match your CSS transition duration
            return () => clearTimeout(timer);
        }
    }, [showElement]);

    return (
        <div
            className={`${styles.animator} ${showElement ? types[type][0] : types[type][1]}`}
            style={{ 'transitionDuration': `${duration}ms` }}
        >
            {isVisible ? children : null}
        </div>
    );
}

export default ElementAnimator;
