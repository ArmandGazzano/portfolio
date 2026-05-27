import { BLOCK } from './constants';

export default function generateArena(blocksPerFloor = 6, floors = 15) {
    const blocks = [];
    const step = (2 * Math.PI) / blocksPerFloor;
    const r = (blocksPerFloor * BLOCK.l * 1.4) / (2 * Math.PI);

    for (let floor = 0; floor < floors; floor++) {
        const y = BLOCK.h * floor + BLOCK.h * 0.5;
        const isEven = floor % 2 === 0;
        const offset = isEven ? 0 : step / 2;

        for (let k = 0; k < blocksPerFloor; k++) {
            const a = offset + k * step;
            blocks.push({
                position: [r * Math.cos(a), y, r * Math.sin(a)],
                // étages pairs : tangentiel, étages impairs : radial
                rotation: [0, isEven ? -a - Math.PI / 2 : -a + Math.PI / 2, 0],
            });
        }
    }

    return blocks;
}
