// Styles
import styles from "@/styles/notFound.module.css"

const NotFound = () => {
    return ( 
        <>
            <h1 className={styles.title}>404</h1>
            <p className={styles.text}>Page not found</p>
        </>
     );
}
 
export default NotFound;