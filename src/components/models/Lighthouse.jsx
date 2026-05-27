import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';

export function Lighthouse({ ...props }) {
    const group = useRef();
    const { scene, animations } = useGLTF('/models/lighthouse.glb');
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    useEffect(() => {
        const action = actions[Object.keys(actions)[0]];
        if (action) action.play();
    }, [actions]);

    return <primitive ref={group} object={scene} {...props} />;
}

useGLTF.preload('/models/lighthouse.glb');
