import { BLOCK } from './constants';

export default function generateHelix() {
    const blocks = [];

    for (let k = 0; k < 3; k++) {
        const angle = (k * 2 * Math.PI) / 3;
        const ox = 4 * Math.cos(angle);
        const oz = 4 * Math.sin(angle);

        for (let i = 0; i < 30; i++) {
            const y = BLOCK.w * i + BLOCK.w * 0.5;

            blocks.push({
                position: [ox, y, oz],
                rotation: [Math.PI / 2, 0, (Math.PI / 14) * i],
            });
        }
    }

    return blocks;
}
