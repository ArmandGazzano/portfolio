import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

export function AircraftCarrier({ ...props }) {
    const { scene } = useGLTF('/models/aircraft_carrier.glb');

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    return <primitive object={scene} {...props} />;
}

useGLTF.preload('/models/aircraft_carrier.glb');
