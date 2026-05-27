import { Environment, Html, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { useIsMobile } from '../hooks/useIsMobile';
import ProjectModal from './ProjectModal';
import { AircraftCarrier } from './models/AircraftCarrier';
import { Fregate } from './models/Fregate';
import { Helicopter } from './models/Helicopter';
import { Lighthouse } from './models/Lighthouse';
import { Rafale } from './models/Rafale';
import { Submarine } from './models/Submarine';

/* ─── tooltip context ────────────────────────────────────── */

const TooltipCtx = createContext(null);

/* ─── utils ──────────────────────────────────────────────── */

function Tooltip({ text, isDark }) {
    return (
        <div
            style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isDark ? '#F2EAD8' : '#1A1714',
                background: isDark
                    ? 'rgba(5,13,26,0.9)'
                    : 'rgba(242,234,216,0.93)',
                border: `1px solid ${isDark ? 'rgba(242,234,216,0.18)' : 'rgba(26,23,20,0.18)'}`,
                padding: '5px 11px',
                whiteSpace: 'pre-line',
                width: 'max-content',
                pointerEvents: 'none',
            }}
        >
            {text}
        </div>
    );
}

function useHover(id) {
    const { hoveredId, setHoveredId, setSelectedId } = useContext(TooltipCtx);
    return {
        hovered: hoveredId === id,
        handlers: {
            onPointerOver: (e) => {
                e.stopPropagation();
                setHoveredId(id);
                document.body.style.cursor = 'pointer';
            },
            onPointerOut: () => {
                setHoveredId((cur) => (cur === id ? null : cur));
                document.body.style.cursor = 'auto';
            },
            onClick: (e) => {
                e.stopPropagation();
                setSelectedId(id);
            },
        },
    };
}

/* ─── generic scene object ───────────────────────────────── */

function SceneObject({
    id,
    tooltipKey,
    groupProps,
    tooltipPosition,
    isDark,
    children,
}) {
    const { hovered, handlers } = useHover(id);
    const { t } = useTranslation();
    return (
        <group {...groupProps} {...handlers}>
            {children}
            {hovered && (
                <Html center position={tooltipPosition}>
                    <Tooltip text={t(tooltipKey)} isDark={isDark} />
                </Html>
            )}
        </group>
    );
}

/* ─── camera ─────────────────────────────────────────────── */

function CameraSetup({ isMobile }) {
    const { camera } = useThree();
    useEffect(() => {
        if (isMobile) {
            camera.position.set(0, 10, 30);
        } else {
            camera.position.set(0, 7.5, 20);
        }
        camera.updateProjectionMatrix();
    }, [camera, isMobile]);
    return null;
}

/* ─── environment ────────────────────────────────────────── */

function Ocean({ isDark }) {
    const water = useMemo(() => {
        const geo = new THREE.PlaneGeometry(1000, 1000);
        const waterNormals = new THREE.TextureLoader().load(
            '/textures/waternormals.jpg',
        );
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
        return new Water(geo, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals,
            sunDirection: new THREE.Vector3(-0.5, 1, 0.75).normalize(),
            sunColor: 0xffffff,
            waterColor: isDark ? 0x001530 : 0x0055a0,
            distortionScale: 4,
            fog: false,
        });
    }, []);

    useEffect(() => {
        water.material.uniforms['waterColor'].value.set(
            isDark ? '#001e40' : '#0055a0',
        );
        water.material.uniforms['sunColor'].value.set(
            isDark ? '#4a6aaa' : '#ffffff',
        );
    }, [isDark, water]);

    useFrame((_, delta) => {
        water.material.uniforms['time'].value += delta * 0.6;
    });

    return <primitive object={water} rotation={[-Math.PI / 2, 0, 0]} />;
}

function SeaFloor({ isDark }) {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
            <planeGeometry args={[1000, 1000, 4, 4]} />
            <meshStandardMaterial
                color={isDark ? '#05101a' : '#0e2030'}
                roughness={1}
            />
        </mesh>
    );
}

/* ─── lighthouse (custom: refs + animation + lights) ─────── */

function LighthouseObject({ isDark, isMobile }) {
    const { hovered, handlers } = useHover('lighthouse');
    const { t } = useTranslation();
    const beamRef = useRef();
    const lightRef = useRef();
    const targetRef = useRef();

    useEffect(() => {
        if (lightRef.current && targetRef.current) {
            lightRef.current.target = targetRef.current;
        }
    }, []);

    useFrame(({ clock }) => {
        if (beamRef.current && isDark) {
            beamRef.current.rotation.y = clock.getElapsedTime() * 0.5;
        }
    });

    return (
        <group
            position={[isMobile ? -6 : -12, -0.25, -6]}
            rotation={[0, (Math.PI * 3) / 4, 0]}
            {...handlers}
        >
            <Lighthouse scale={1} />
            <group ref={beamRef} position={[0, 8, 0]}>
                <spotLight
                    ref={lightRef}
                    angle={0.18}
                    penumbra={0.5}
                    intensity={isDark ? 6000 : 0}
                    color="#ffcc66"
                    distance={200}
                />
                <mesh ref={targetRef} position={[0, -8, 30]}>
                    <sphereGeometry args={[0.01]} />
                    <meshBasicMaterial />
                </mesh>
            </group>
            {isDark && (
                <mesh position={[0, 8, 0]}>
                    <sphereGeometry args={[0.3, 12, 12]} />
                    <meshStandardMaterial
                        color="#ffdd88"
                        emissive="#ffdd88"
                        emissiveIntensity={4}
                    />
                </mesh>
            )}
            {isDark && (
                <pointLight
                    position={[0, 15, 0]}
                    intensity={60}
                    color="#ffdd88"
                    distance={14}
                />
            )}
            {hovered && (
                <Html center position={[0, 5, 0]}>
                    <Tooltip text={t('tooltips.lighthouse')} isDark={isDark} />
                </Html>
            )}
        </group>
    );
}

/* ─── main scene ─────────────────────────────────────────── */

export default function ProjectsScene({ isDark = false }) {
    const isMobile = useIsMobile();
    const [hoveredId, setHoveredId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const { t } = useTranslation();
    const bgColor = isDark ? '#040d18' : '#b0ccdf';

    return (
        <TooltipCtx.Provider value={{ hoveredId, setHoveredId, setSelectedId }}>
            <Canvas
                shadows
                camera={{ position: [0, 5.5, 20], fov: 55 }}
                style={{ width: '100%', height: '100%' }}
            >
                <color attach="background" args={[bgColor]} />
                <fog attach="fog" args={[bgColor, 28, 60]} />

                <ambientLight
                    intensity={isDark ? 0.08 : 0.4}
                    color={isDark ? '#203880' : '#e8f0ff'}
                />
                <directionalLight
                    position={[10, 22, 8]}
                    intensity={isDark ? 0.25 : 1.1}
                    color={isDark ? '#7090c0' : '#fff5e0'}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-left={-25}
                    shadow-camera-right={25}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                />
                <directionalLight
                    position={[-8, 6, -10]}
                    intensity={isDark ? 0.05 : 0.2}
                    color="#c0d8ff"
                />
                {isDark && (
                    <pointLight
                        position={[-6, 3, -6]}
                        intensity={40}
                        color="#304888"
                    />
                )}

                <Environment preset="sunset" backgroundIntensity={0} />
                <OrbitControls
                    autoRotate
                    autoRotateSpeed={0.1}
                    enableDamping
                    dampingFactor={0.06}
                    enableRotate={!isMobile}
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.2}
                    target={[0, 0, 0]}
                />

                <CameraSetup isMobile={isMobile} />
                <Ocean isDark={isDark} />
                <SeaFloor isDark={isDark} />

                <SceneObject
                    id="carrier"
                    tooltipKey="tooltips.carrier"
                    isDark={isDark}
                    groupProps={{ position: [6, 0.08, -10], castShadow: true }}
                    tooltipPosition={[4, 4, -4]}
                >
                    <AircraftCarrier
                        position={[0, 0, 0]}
                        rotation={[0, -Math.PI / 2, 0]}
                        scale={2}
                    />
                </SceneObject>

                <SceneObject
                    id="rafale"
                    tooltipKey="tooltips.rafale"
                    isDark={isDark}
                    groupProps={{ position: [3, 1.5, -7] }}
                    tooltipPosition={[0, 2, 0]}
                >
                    <Rafale
                        position={[0, 0, 0]}
                        rotation={[-Math.PI / 10, -0.4 * Math.PI, 0]}
                        scale={0.15}
                    />
                </SceneObject>

                <SceneObject
                    id="submarine"
                    tooltipKey="tooltips.submarine"
                    isDark={isDark}
                    groupProps={{ position: [6, -0.3, 2] }}
                    tooltipPosition={[0, 2.2, 0]}
                >
                    <Submarine
                        position={[0, 0, 0]}
                        rotation={[0, (-Math.PI * 3) / 4, 0]}
                        scale={0.5}
                    />
                </SceneObject>

                <SceneObject
                    id="helicopter"
                    tooltipKey="tooltips.helicopter"
                    isDark={isDark}
                    groupProps={{ position: [-4, 0.12, 8] }}
                    tooltipPosition={[0, 1.5, 0]}
                >
                    <Helicopter
                        position={[0, 3, 0]}
                        rotation={[0, Math.PI / 2, 0]}
                        scale={0.15}
                    />
                </SceneObject>

                <SceneObject
                    id="fregate"
                    tooltipKey="tooltips.fregate"
                    isDark={isDark}
                    groupProps={{ position: [-4, 0.08, 5], castShadow: true }}
                    tooltipPosition={[0, 3, 0]}
                >
                    <Fregate
                        position={[0, 0, 0]}
                        rotation={[0, Math.PI, 0]}
                        scale={0.5}
                    />
                </SceneObject>

                <LighthouseObject isDark={isDark} isMobile={isMobile} />
            </Canvas>
            {selectedId && (
                <ProjectModal
                    projectId={selectedId}
                    onClose={() => setSelectedId(null)}
                />
            )}
            <div className="click-hint click-hint--projects">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                >
                    <path d="M0 0v11.5l3-3 2 5.5 2-.8-2-5.2H9z" />
                </svg>
                <span>
                    {isMobile ? t('hintProjectsMobile') : t('hintProjects')}
                </span>
            </div>
        </TooltipCtx.Provider>
    );
}
