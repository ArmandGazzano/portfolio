import { useTranslation } from 'react-i18next';
import styles from './hero-text.module.css';

export default function HeroText() {
    const { t } = useTranslation();

    const handleCTA = () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                Armand<br />Gazzano
            </h1>
            <p className={styles.subtitle}>{t('hero.subtitle')}</p>
            <p className={styles.tagline}>{t('hero.tagline')}</p>
            <button className={styles.cta} onClick={handleCTA} aria-label={t('hero.cta')}>
                {t('hero.cta')}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }} aria-hidden="true">
                    <path d="M12 5v14m-7-7l7 7 7-7"/>
                </svg>
            </button>
        </div>
    );
}
