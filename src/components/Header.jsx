import { useTranslation } from 'react-i18next';
import styles from './header.module.css';

function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

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
                    className={`${styles.btn} ${styles.darkBtn}`}
                    onClick={onToggle}
                    aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
                >
                    {isDark ? '☀' : '☾'}
                </button>
            </nav>
        </header>
    );
}
