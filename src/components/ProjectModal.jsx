import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PROJECT_META } from '../data/projects';
import styles from './project-modal.module.css';

export default function ProjectModal({ projectId, onClose }) {
    const { t } = useTranslation();
    const meta = PROJECT_META[projectId];

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div className={styles.overlay}>
            <div className={styles.backdrop} onClick={onClose} />
            <div className={styles.box} role="dialog" aria-modal="true">
                <button className={styles.close} onClick={onClose} aria-label="Fermer">✕</button>
                <p className={styles.company}>
                    {t(`projects.${projectId}.company`)}
                    <span className={styles.duration}> · {t(`projects.${projectId}.duration`)}</span>
                </p>
                <h2 className={styles.title}>{t(`projects.${projectId}.title`)}</h2>
                <p className={styles.description}>{t(`projects.${projectId}.description`)}</p>
                {meta.stack.length > 0 && (
                    <>
                        <p className={styles.stackLabel}>Stack</p>
                        <div className={styles.stack}>
                            {meta.stack.map((s) => (
                                <span key={s} className={styles.pill}>{s}</span>
                            ))}
                        </div>
                    </>
                )}
                {meta.url && (
                    <a
                        href={meta.url}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.link}
                    >
                        {t('modal.seeProject')} ↗
                    </a>
                )}
            </div>
        </div>
    );
}
