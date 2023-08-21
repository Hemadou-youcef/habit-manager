
// Styles
import styles from "./alert.module.css";

// Components
import Overlay from "../overlay/overlay";

// Icons
import { BsCheck, BsX } from "react-icons/bs";


const Alert = ({ text, onCancel, onConfirm }: { text: string, onCancel: () => void, onConfirm: () => void }) => {
    return (
        <Overlay width="350px" closeOverlay={() => onCancel()} closeOnBackgroundClick={false}>
            <div className={styles.content}>
                <div className={styles.question}>
                    {text}
                </div>
                <div className={styles.actions}>
                    <button
                        onClick={onCancel}
                    >
                        <BsX size={30}/>
                    </button>
                    <button
                        onClick={onConfirm}
                    >
                        <BsCheck size={30}/>
                    </button>
                </div>
            </div>
        </Overlay>
    );
}

export default Alert;