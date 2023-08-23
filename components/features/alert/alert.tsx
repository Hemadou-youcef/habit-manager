// React
import { useState } from "react";

// Styles
import styles from "./alert.module.css";
import stylesDarkTheme from "./alertDarkTheme.module.css";

// Components
import { useDataContext } from "@/components/layouts/app-layout/layout";
import Overlay from "../overlay/overlay";

// Icons
import { BsCheck, BsX } from "react-icons/bs";
import Spinner from "../spinner/spinner";


const Alert = ({ text, onCancel, onConfirm }: { text: string, onCancel: () => void, onConfirm: () => void }) => {
    const { theme }: { theme: string } = useDataContext();
    const stylesTheme = (theme === 'light') ? styles : stylesDarkTheme;
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <Overlay width="350px" closeOverlay={() => onCancel()} closeOnBackgroundClick={true}>
            <div className={stylesTheme.content}>
                <div className={stylesTheme.question}>
                    {text}
                </div>
                <div className={stylesTheme.actions}>
                    <button
                        onClick={onCancel}
                    >
                        <BsX size={30} />
                    </button>
                    <button
                        onClick={() => {
                            setLoading(true);
                            onConfirm();
                        }}
                    >
                        {loading ? <Spinner width="30px" height="30px"/> : <BsCheck size={30} />}
                    </button>
                </div>
            </div>
        </Overlay>
    );
}

export default Alert;