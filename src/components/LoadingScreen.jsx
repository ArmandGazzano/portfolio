import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './loading-screen.module.css';

export default function LoadingScreen() {
    const { active } = useProgress();
    const { t } = useTranslation();
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        if (!active) {
            const t1 = setTimeout(() => setFadeOut(true), 200);
            const t2 = setTimeout(() => setVisible(false), 800);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        }
    }, [active]);

    if (!visible) return null;

    return (
        <div
            className={`${styles.screen}${fadeOut ? ` ${styles.fadeOut}` : ''}`}
        >
            <p className={styles.name}>Armand Gazzano</p>
            <p className={styles.loading}>{t('loading')} ...</p>
        </div>
    );
}
