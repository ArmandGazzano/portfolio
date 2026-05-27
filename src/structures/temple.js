export default function generateTemple() {
    const blocks = [];
    const roofRot = [Math.PI / 2, 0, Math.PI / 2];
    const sideRot = [0, Math.PI / 2, 0];
    const topRot = [Math.PI / 2, Math.PI / 2, Math.PI / 2];
    const plankZs = [1.175, 0.375, -0.375, -1.175];

    // Colonnes et poutres (côté gauche et droit)
    for (const s of [-1, 1]) {
        for (let i = 0; i < 4; i++)
            blocks.push({
                position: [s * (0.925 + i * 0.5), 0.25, 0],
                rotation: sideRot,
            });

        for (const z of plankZs)
            blocks.push({ position: [s * 1.25, 0.75, z], rotation: [0, 0, 0] });

        for (const y of [1.25, 2.25]) {
            blocks.push({ position: [s * 0.925, y, 0], rotation: sideRot });
            blocks.push({ position: [s * 2.425, y, 0], rotation: sideRot });
        }

        for (const z of plankZs)
            blocks.push({ position: [s * 1.25, 1.75, z], rotation: [0, 0, 0] });

        for (let z = -1; z <= 1.001; z += 0.5)
            blocks.push({
                position: [s * 1.25, 2.65, z],
                rotation: [Math.PI / 2, 0, 0],
            });
    }

    // Bloc central
    blocks.push({ position: [0, 1.25, 0], rotation: sideRot });

    // TOIT — paires extérieures
    blocks.push({ position: [-2.45, 2.7, 0], rotation: roofRot });
    blocks.push({ position: [2.45, 2.7, 0], rotation: roofRot });

    // TOIT — pyramide (6 niveaux)
    for (let tier = 0; tier < 6; tier++) {
        const yBase = 2.7 + tier * 0.3;
        const maxX = 2.0 - tier * 0.4;
        const offset = tier % 2 === 0 ? 0.4 : 0;

        for (const dy of [0, 0.15]) {
            for (let x = offset; x <= maxX + 0.001; x += 0.8) {
                blocks.push({
                    position: [x, yBase + dy, 0],
                    rotation: roofRot,
                });
                if (x > 0)
                    blocks.push({
                        position: [-x, yBase + dy, 0],
                        rotation: roofRot,
                    });
            }
        }
    }

    // Décorations sommet
    for (const [x, y] of [
        [-2.4, 2.95],
        [2.4, 2.95],
        [0, 4.6],
    ])
        blocks.push({ position: [x, y, 0], rotation: topRot });

    return blocks;
}
