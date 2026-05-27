import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Helicopter({ ...props }) {
    const { scene, animations } = useGLTF('/models/helicopter.glb');
    const mixerRef = useRef();

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        if (animations.length > 0) {
            mixerRef.current = new THREE.AnimationMixer(scene);
            animations.forEach((clip) =>
                mixerRef.current.clipAction(clip).play(),
            );
        }

        return () => mixerRef.current?.stopAllAction();
    }, [scene, animations]);

    useFrame((_, delta) => {
        mixerRef.current?.update(delta);
    });

    return <primitive object={scene} {...props} />;
}

useGLTF.preload('/models/helicopter.glb');
