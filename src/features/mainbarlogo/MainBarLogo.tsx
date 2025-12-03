import { Link } from 'react-router-dom'

import styles from './MainBarLogo.module.css'

export function MainBarLogo() {
    return (
        <Link to="/" className={styles.wrapper}>
            <div className={styles.logoImg}>
                <img src="/logotype.png" className={styles.logo} />
            </div>
            <div className={styles.logoWords}>СПЖЦ.AI</div>
        </Link>
    )
}
