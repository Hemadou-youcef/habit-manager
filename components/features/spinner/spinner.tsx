
// Styles
import styles from "./spinner.module.css";
import stylesDarkTheme from "./spinnerDarkTheme.module.css";

// Components
import { useDataContext } from "@/components/layouts/app-layout/layout";

const Spinner = ({ width, height }: { width: string, height: string }) => {
    const { theme }: { theme: string } = useDataContext();
    const stylesTheme = theme === "light" ? styles : stylesDarkTheme;

    return (
        <>
            <div className={stylesTheme.pageLoading} style={{ width, height }}>
                <div className={stylesTheme.spinner}>
                </div>
            </div>
        </>
    );
}

export default Spinner;