import { useEffect, useRef } from 'react';
import styles from './cursor.module.css';

const TRAIL_COUNT = 16;

export default function Cursor({ isDark }) {
    if (!window.matchMedia('(hover: hover)').matches) return null;
    const color = isDark ? '#F2EAD8' : '#3A322C';
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const trailRefs = useRef([]);

    useEffect(() => {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        const trail = Array.from({ length: TRAIL_COUNT }, () => ({
            x: mouseX,
            y: mouseY,
        }));
        let rafId;

        const onMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const tick = () => {
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            }

            if (ringRef.current) {
                ringX += (mouseX - ringX) * 0.1;
                ringY += (mouseY - ringY) * 0.1;
                ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
            }

            trail[0].x += (mouseX - trail[0].x) * 0.4;
            trail[0].y += (mouseY - trail[0].y) * 0.4;
            for (let i = 1; i < TRAIL_COUNT; i++) {
                trail[i].x += (trail[i - 1].x - trail[i].x) * 0.4;
                trail[i].y += (trail[i - 1].y - trail[i].y) * 0.4;
            }
            trailRefs.current.forEach((el, i) => {
                if (el)
                    el.style.transform = `translate(${trail[i].x}px, ${trail[i].y}px)`;
            });

            rafId = requestAnimationFrame(tick);
        };

        const onEnterClickable = () =>
            ringRef.current?.classList.add(styles.hover);
        const onLeaveClickable = () =>
            ringRef.current?.classList.remove(styles.hover);
        const onCursorHover = (e) =>
            e.detail ? onEnterClickable() : onLeaveClickable();

        const onOver = (e) => {
            if (e.target.closest('a, button, [role="button"]')) onEnterClickable();
        };
        const onOut = (e) => {
            if (e.target.closest('a, button, [role="button"]')) onLeaveClickable();
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('cursorhover', onCursorHover);
        document.addEventListener('mouseover', onOver);
        document.addEventListener('mouseout', onOut);

        rafId = requestAnimationFrame(tick);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('cursorhover', onCursorHover);
            document.removeEventListener('mouseover', onOver);
            document.removeEventListener('mouseout', onOut);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <>
            {Array.from({ length: TRAIL_COUNT }, (_, i) => {
                const progress = (i + 1) / TRAIL_COUNT;
                const size = Math.max(1, 3 * (1 - progress));
                const opacity = 0.35 * (1 - progress);
                return (
                    <div
                        key={i}
                        ref={(el) => (trailRefs.current[i] = el)}
                        className={styles.trail}
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            opacity,
                            marginLeft: `-${size / 2}px`,
                            marginTop: `-${size / 2}px`,
                            background: color,
                        }}
                    />
                );
            })}
            <div
                ref={dotRef}
                className={styles.dot}
                style={{ background: color }}
            />
            <div
                ref={ringRef}
                className={styles.ring}
                style={{ borderColor: color }}
            />
        </>
    );
}
