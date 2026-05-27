import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const BLOCK = { w: 0.15, h: 0.5, l: 2.5 };
const RECONSTRUCTION_SPEED = 0.06;

function KaplaBlock({ position, rotation = [0, 0, 0] }) {
    const [colorMap, normalMap, roughnessMap] = useTexture([
        '/textures/wood50/Wood050_1K-JPG_Color.jpg',
        '/textures/wood50/Wood050_1K-JPG_NormalGL.jpg',
        '/textures/wood50/Wood050_1K-JPG_Roughness.jpg',
    ]);

    return (
        <mesh castShadow receiveShadow>
            <boxGeometry args={[BLOCK.l, BLOCK.h, BLOCK.w]} />
            <meshStandardMaterial
                map={colorMap}
                normalMap={normalMap}
                roughnessMap={roughnessMap}
                roughness={0.8}
            />
        </mesh>
    );
}

export default function KaplaStructure({ structures }) {
    const bodyRefs = useRef([]);
    const positionsRef = useRef([]);
    const isDestroyed = useRef(false);
    const isReconstructing = useRef(false);
    const currentStructure = useRef(0);

    const destroy = () => {
        if (isReconstructing.current || isDestroyed.current) return;
        Object.values(bodyRefs.current).forEach((body) => {
            if (!body) return;
            try {
                body.wakeUp();
                body.applyImpulse(
                    {
                        x: (Math.random() - 0.5) * 7,
                        y: Math.random() * 2,
                        z: (Math.random() - 0.5) * 7,
                    },
                    true,
                );
                isDestroyed.current = true;
            } catch (e) {
                console.warn('bloc ignoré', e);
            }
        });
    };

    const reconstruct = () => {
        const next = Math.floor(Math.random() * structures.length);
        currentStructure.current = next;

        // Mettre à jour les positions cibles
        structures[next].forEach((block, index) => {
            positionsRef.current[index] = block;
        });

        Object.values(bodyRefs.current).forEach((body, index) => {
            if (!body) return;
            try {
                body.enableCcd(false);
                body.setBodyType(2); // Kinematic
            } catch (e) {
                console.warn('bloc ignoré', e);
            }
        });
        isReconstructing.current = true;
    };

    useFrame(() => {
        // Phase 1 — Wait for all blocks to be sleeping
        if (isDestroyed.current) {
            const allSleeping = Object.values(bodyRefs.current).every(
                (body) => {
                    if (!body) return true;
                    try {
                        return body.isSleeping();
                    } catch (e) {
                        return true;
                    }
                },
            );

            if (allSleeping) {
                isDestroyed.current = false;
                reconstruct();
            }
            return;
        }

        // Phase 2 — recconstruction
        if (isReconstructing.current) {
            let allArrived = true;

            Object.values(bodyRefs.current).forEach((body, index) => {
                if (!body) return;
                try {
                    const { position, rotation } = positionsRef.current[index];
                    const current = body.translation();
                    const currentRot = body.rotation();
                    const targetQuat = new THREE.Quaternion().setFromEuler(
                        new THREE.Euler(...rotation),
                    );

                    const dx = position[0] - current.x;
                    const dy = position[1] - current.y;
                    const dz = position[2] - current.z;

                    if (
                        Math.abs(dx) > 0.05 ||
                        Math.abs(dy) > 0.05 ||
                        Math.abs(dz) > 0.05
                    ) {
                        allArrived = false;
                    }

                    body.setNextKinematicTranslation({
                        x: current.x + dx * RECONSTRUCTION_SPEED,
                        y: current.y + dy * RECONSTRUCTION_SPEED,
                        z: current.z + dz * RECONSTRUCTION_SPEED,
                    });

                    const currentQuat = new THREE.Quaternion(
                        currentRot.x,
                        currentRot.y,
                        currentRot.z,
                        currentRot.w,
                    );

                    currentQuat.slerp(targetQuat, RECONSTRUCTION_SPEED);

                    body.setNextKinematicRotation({
                        x: currentQuat.x,
                        y: currentQuat.y,
                        z: currentQuat.z,
                        w: currentQuat.w,
                    });
                } catch (e) {}
            });

            if (allArrived) {
                Object.values(bodyRefs.current).forEach((body) => {
                    if (!body) return;
                    try {
                        body.setBodyType(0);
                        body.enableCcd(true);
                        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
                        body.setAngvel({ x: 0, y: 0, z: 0 }, true);
                    } catch (e) {}
                });
                isReconstructing.current = false;
            }
        }
    });

    const layers = useMemo(() => {
        return structures[currentStructure.current].map((block, index) => {
            positionsRef.current[index] = block;
            return (
                <RigidBody
                    key={index}
                    ref={(el) => (bodyRefs.current[index] = el)}
                    position={block.position}
                    rotation={block.rotation}
                    ccd
                >
                    <KaplaBlock />
                </RigidBody>
            );
        });
    }, [structures, currentStructure.current]);

    return <group onClick={destroy}>{layers}</group>;
}
