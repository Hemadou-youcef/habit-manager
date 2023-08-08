
// Styles
import styles from './settings.module.css';

// Components
import Overlay from '../overlay/overlay';

// Typescript Types


const Settings = ({ closeForm }: { closeForm: () => void }) => {
    return (
        <Overlay width="500px" closeOverlay={() => closeForm()}>
            <div className={styles.habitForm}>
                dsfd
            </div>
        </Overlay>
    );
}

export default Settings;