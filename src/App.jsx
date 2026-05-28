import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import About from './components/About';
import Contact from './components/Contact';
import Header from './components/Header';
import HeroText from './components/HeroText';
import Cursor from './components/Cursor';
import LoadingScreen from './components/LoadingScreen';
import ProjectsScene from './components/ProjectsScene';
import Scene from './components/Scene';

const SECTION_COUNT = 4;

function App() {
    const [isDark, setIsDark] = useState(false);
    const { t } = useTranslation();
    const scrollRef = useRef(null);

    useEffect(() => {
        let startY = 0;
        let busy = false;

        const onTouchStart = (e) => {
            startY = e.touches[0].clientY;
        };

        const onTouchEnd = (e) => {
            if (busy) return;
            const delta = startY - e.changedTouches[0].clientY;
            if (Math.abs(delta) < 40) return;

            const el = scrollRef.current;
            if (!el) return;

            busy = true;
            const h = el.clientHeight;
            const cur = Math.round(el.scrollTop / h);
            const next = Math.max(0, Math.min(SECTION_COUNT - 1, delta > 0 ? cur + 1 : cur - 1));
            el.scrollTo({ top: next * h, behavior: 'smooth' });
            setTimeout(() => { busy = false; }, 800);
        };

        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        return () => {
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, []);

    return (
        <>
        <Cursor isDark={isDark} />
        <LoadingScreen />
        <div ref={scrollRef} className={`scroll-container${isDark ? ' dark' : ''}`}>
            <section id="hero" className="snap-section">
                <Scene isDark={isDark} />
                <Header isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
                <HeroText />
                <div className="click-hint">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M0 0v11.5l3-3 2 5.5 2-.8-2-5.2H9z" />
                    </svg>
                    <span>{t('hint')}</span>
                </div>
            </section>
            <section id="projects" className="snap-section">
                <ProjectsScene isDark={isDark} />
            </section>
            <section id="about" className="snap-section">
                <About />
            </section>
            <section id="contact" className="snap-section">
                <Contact />
            </section>
        </div>
        </>
    );
}

export default App;
