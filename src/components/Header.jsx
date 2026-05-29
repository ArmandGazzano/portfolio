import { useTranslation } from 'react-i18next';
import styles from './header.module.css';

function scrollTo(id) {
    document.dispatchEvent(new CustomEvent('navigate'));
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

const SunIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="2" x2="12" y2="4"/>
        <line x1="12" y1="20" x2="12" y2="22"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="2" y1="12" x2="4" y2="12"/>
        <line x1="20" y1="12" x2="22" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
);

const MoonIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
);

export default function Header({ isDark, onToggle }) {
    const { t, i18n } = useTranslation();

    const navLinks = [
        { label: t('nav.projects'), id: 'projects' },
        { label: t('nav.about'), id: 'about' },
        { label: t('nav.contact'), id: 'contact' },
    ];

    const toggleLang = () =>
        i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');

    return (
        <header className={styles.header}>
            <span
                className={styles.logo}
                onClick={() => scrollTo('hero')}
                role="button"
                tabIndex={0}
                aria-label="Retour à l'accueil"
                onKeyDown={(e) => e.key === 'Enter' && scrollTo('hero')}
            >
                AG
            </span>

            <nav className={styles.nav}>
                <div className={styles.navLinks}>
                    {navLinks.map(({ label, id }) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            className={styles.navLink}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollTo(id);
                            }}
                        >
                            {label}
                        </a>
                    ))}
                </div>

                <button
                    className={styles.btn}
                    onClick={toggleLang}
                    aria-label={i18n.language === 'fr' ? 'Switch to English' : 'Passer en français'}
                >
                    {i18n.language === 'fr' ? 'FR' : 'EN'}
                </button>

                <button
                    className={styles.themeToggle}
                    onClick={onToggle}
                    aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
                >
                    <SunIcon />
                    <span className={`${styles.track} ${isDark ? styles.trackOn : ''}`}>
                        <span className={styles.thumb} />
                    </span>
                    <MoonIcon />
                </button>
            </nav>
        </header>
    );
}
