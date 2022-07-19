import { BinaryStream } from '@cod-evoid/hexcod';
import { Extent, parseExtent } from './extent.js';

type Sequence = {
    name: string;
    interval: Uint32Array;
    moveSpeed: number;
    flags: number;
    rarity: number;
    syncPoint: number;
    extent: Extent;
}

function parseSequence(stream: BinaryStream): Sequence {
    const sequence: Partial<Sequence> = {};

    sequence.name = stream.readString(80);
    sequence.interval = stream.readUint32Array(2);
    sequence.moveSpeed = stream.readFloat32();
    sequence.flags = stream.readUint32();
    sequence.rarity = stream.readFloat32();
    sequence.syncPoint = stream.readUint32();
    sequence.extent = parseExtent(stream);

    return sequence as Sequence;
}

export type { Sequence };
export { parseSequence };
