import { Canvas } from '@react-three/fiber';
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
    return (
        <div className={styles.page}>
            <div className={styles.canvas}>
                <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                    <Scene />
                </Canvas>
            </div>
            <div className={styles.content}>
                <h1 className={styles.title}>404</h1>
                <p className={styles.sub}>Cette page n'existe pas</p>
                <a href="/" className={styles.link}>← Retour à l'accueil</a>
            </div>
        </div>
    );
}
