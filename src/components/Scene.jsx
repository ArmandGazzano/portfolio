import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    CuboidCollider,
    Physics,
    RigidBody,
    TrimeshCollider,
} from '@react-three/rapier';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useIsMobile';
import generateArena from '../structures/arena';
import generateBridge from '../structures/bridge';
import generateTemple from '../structures/temple';
import generateTower from '../structures/tower';
import KaplaStructure from './KaplaStructure';

function ViewOffset({ xRatio = 0.2, yRatio = 0 }) {
    const { camera, size } = useThree();
    useEffect(() => {
        camera.setViewOffset(
            size.width,
            size.height,
            -size.width * xRatio,
            size.height * yRatio,
            size.width,
            size.height,
        );
        return () => camera.clearViewOffset();
    }, [camera, size.width, size.height, xRatio, yRatio]);
    return null;
}

function Lights({ isDark }) {
    const sunRef = useRef();
    const lampRef = useRef();
    const { camera } = useThree();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * 0.15;
        if (sunRef.current) {
            sunRef.current.position.set(Math.cos(t) * 15, 20, Math.sin(t) * 15);
        }
        if (lampRef.current) {
            const camAngle = Math.atan2(camera.position.x, camera.position.z);
            const lightAngle = camAngle + Math.PI * -0.25;
            lampRef.current.position.set(
                Math.sin(lightAngle) * 15,
                20,
                Math.cos(lightAngle) * 15,
            );
        }
    });

    return (
        <>
            <directionalLight
                position={[-10, 8, -10]}
                intensity={isDark ? 0 : 0.3}
            />
            <directionalLight
                ref={sunRef}
                position={[10, 20, 10]}
                intensity={isDark ? 0 : 1.0}
                color="#FFE8C0"
                castShadow
                shadow-camera-left={-15}
                shadow-camera-right={15}
                shadow-camera-top={15}
                shadow-camera-bottom={-15}
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
            />
            <pointLight
                ref={lampRef}
                position={[-4, 40, -10]}
                intensity={isDark ? 1100 : 0}
                color="#FFD97A"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={0.5}
                shadow-camera-far={30}
            />
            <directionalLight
                position={[-5, 4, 10]}
                intensity={isDark ? 0.3 : 0}
            />
        </>
    );
}

export default function Scene({ isDark = false }) {
    const isMobile = useIsMobile();
    const cylinderWall = useMemo(() => {
        const geom = new THREE.CylinderGeometry(15, 15, 30, 24, 1, true);
        return [
            new Float32Array(geom.attributes.position.array),
            new Uint32Array(geom.index.array),
        ];
    }, []);

    const structures = useMemo(
        () => [
            generateBridge(),
            generateTemple(),
            generateTower(),
            generateArena(),
        ],
        [],
    );

    return (
        <Canvas
            shadows
            camera={{ position: [0, 6, 20], fov: 65 }}
            style={{ width: '100vw', height: '100vh' }}
        >
            <color
                attach="background"
                args={[isDark ? '#0a0a22' : '#F2EAD8']}
            />
            <ambientLight
                intensity={isDark ? 0.04 : 0.7}
                color={isDark ? '#0a0427' : '#FFF5E0'}
            />
            <Lights isDark={isDark} />
            <ViewOffset
                xRatio={isMobile ? 0 : 0.2}
                yRatio={isMobile ? -0.15 : 0}
            />
            <OrbitControls
                autoRotate
                autoRotateSpeed={0.6}
                target={[0, 3, 0]}
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
            />
            <Physics>
                <KaplaStructure structures={structures} />
                <RigidBody type="fixed">
                    <TrimeshCollider
                        args={cylinderWall}
                        position={[0, 15, 0]}
                    />
                    <CuboidCollider args={[15, 2, 15]} position={[0, 20, 0]} />
                </RigidBody>
                <RigidBody type="fixed">
                    <CuboidCollider args={[15, 1, 15]} position={[0, -1, 0]} />
                    <mesh
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[0, 0, 0]}
                        receiveShadow
                    >
                        <planeGeometry args={[30, 30]} />
                        <shadowMaterial transparent opacity={0.3} />
                    </mesh>
                </RigidBody>
            </Physics>
        </Canvas>
    );
}
