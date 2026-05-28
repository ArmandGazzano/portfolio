import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import Cursor from './Cursor';
import styles from './not-found.module.css';

function Scene() {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            {/* Ta scène ici */}
        </>
    );
}

export default function NotFound() {
    const [isDark] = useState(false);

    return (
        <div className={styles.page}>
            <Cursor isDark={isDark} />
            <div className={styles.canvas}>
                <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                    <Scene />
                </Canvas>
            </div>
            <div className={styles.content}>
                <h1 className={styles.title}>404</h1>
                <p className={styles.sub}>Cette page n'existe pas</p>
                <a href="/" className={styles.link}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
                    </svg>
                    Retour à l'accueil
                </a>
            </div>
        </div>
    );
}
