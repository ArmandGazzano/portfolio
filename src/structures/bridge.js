import { BLOCK } from './constants';

export default function generateBridge() {
    const blocks = [];

    // Colonnes principales
    for (let i = 0; i < 14; i++) {
        const y = BLOCK.h * i + BLOCK.h * 0.5;
        const isEven = i % 2 === 0;
        const rot = [0, isEven ? Math.PI / 2 : 0, 0];

        blocks.push({
            position: [isEven ? -4.6 : -3.6, y, isEven ? 0 : -1],
            rotation: rot,
        });
        blocks.push({
            position: [isEven ? -2.6 : -3.6, y, isEven ? 0 : 1],
            rotation: rot,
        });
        blocks.push({
            position: [isEven ? 4.6 : 3.6, y, isEven ? 0 : -1],
            rotation: rot,
        });
        blocks.push({
            position: [isEven ? 2.6 : 3.6, y, isEven ? 0 : 1],
            rotation: rot,
        });
    }

    // Renforts latéraux
    for (const x of [-3.6, 3.6]) {
        blocks.push({ position: [x, 3.25, 0], rotation: [0, Math.PI / 2, 0] });
        blocks.push({ position: [x, 4.25, 0], rotation: [0, Math.PI / 2, 0] });
        blocks.push({ position: [x, 5.25, 0], rotation: [0, Math.PI / 2, 0] });
    }

    // Renforts internes
    const internals = [
        { x: -2.5, ys: [3.75, 4.75] },
        { x: -1.25, ys: [4.25] },
        { x: 0, ys: [4.75] },
        { x: 1.25, ys: [4.25] },
        { x: 2.5, ys: [3.75, 4.75] },
    ];

    for (const { x, ys } of internals) {
        for (const y of ys) {
            blocks.push({ position: [x, y, -0.75], rotation: [0, 0, 0] });
            blocks.push({ position: [x, y, 0.75], rotation: [0, 0, 0] });
        }
    }

    // Plateau
    for (let i = 0; i < 8; i++) {
        blocks.push({
            position: [-2.25 + i * (4.5 / 7), 5.0, 0],
            rotation: [Math.PI / 2, 0, Math.PI / 2],
        });
    }

    // Toit
    for (let i = 2.6; i <= 4.6; i += 1) {
        blocks.push({
            position: [i, 7.15, 0],
            rotation: [Math.PI / 2, 0, Math.PI / 2],
        });
        blocks.push({
            position: [-i, 7.15, 0],
            rotation: [Math.PI / 2, 0, Math.PI / 2],
        });
    }

    return blocks;
}
