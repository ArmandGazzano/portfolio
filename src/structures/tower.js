import { BLOCK } from './constants';

function addTriangleTower(blocks, ox, oz, floors) {
    const r = 0.8;
    for (let i = 0; i < floors; i++) {
        const y = BLOCK.h * i + BLOCK.h * 0.5;
        const base = Math.PI + (i % 2) * (Math.PI / 3);

        for (let k = 0; k < 3; k++) {
            const a = base + (k * 2 * Math.PI) / 3;
            blocks.push({
                position: [Math.sin(a) * r + ox, y, -Math.cos(a) * r + oz],
                rotation: [0, -a, 0],
            });
        }
    }
}

export default function generateTower() {
    const blocks = [];

    for (let i = 0; i < 21; i++) {
        const y = BLOCK.h * i + BLOCK.h * 0.5;
        const isEven = i % 2 === 0;

        blocks.push({
            position: [isEven ? -4 : -5, y, isEven ? -1 : 0],
            rotation: [0, isEven ? 0 : Math.PI / 2, 0],
        });
        blocks.push({
            position: [isEven ? -4 : -3, y, isEven ? 1 : 0],
            rotation: [0, isEven ? 0 : Math.PI / 2, 0],
        });
    }

    addTriangleTower(blocks, 4, 0, 16);

    return blocks;
}
