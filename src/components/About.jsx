import { useTranslation } from 'react-i18next';
import { useInView } from '../hooks/useInView';
import styles from './about.module.css';

export default function About() {
    const { t } = useTranslation();
    const [ref, inView] = useInView();

    const stack = [
        { category: t('about.stack.front'), items: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'] },
        { category: t('about.stack.back'), items: ['Java', 'Spring Boot', 'Node.js', '.NET', 'SQL', 'Microservices'] },
        { category: t('about.stack.cloud'), items: ['Docker', 'Kubernetes', 'GitLab', 'GitHub'] },
        { category: t('about.stack.tools'), items: ['Git', 'CI/CD', 'JIRA', 'Agile / Scrum'] },
        { category: t('about.stack.threeD'), items: ['Three.js', 'WebGL', 'Unity', 'Unreal Engine 5', 'Blender', 'Fusion 360'] },
    ];

    return (
        <section className={styles.section}>
            <div ref={ref} className={`${styles.grid}${inView ? ` ${styles.visible}` : ''}`}>
                <div>
                    <p className={styles.bio}>{t('about.bio')}</p>
                </div>
                <div className={styles.stackList}>
                    {stack.map(({ category, items }) => (
                        <div key={category}>
                            <p className={styles.stackCategory}>{category}</p>
                            <p className={styles.stackItems}>{items.join(' · ')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
