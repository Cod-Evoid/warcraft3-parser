import { BinaryStream } from '@cod-evoid/hexcod';

type Extent = {
    boundsRadius: number;
    minimum: Float32Array;
    maximum: Float32Array;
}

function parseExtent(stream: BinaryStream): Extent {
    const extent: Partial<Extent> = {};

    extent.boundsRadius = stream.readFloat32();
    extent.minimum = stream.readFloat32Array(3);
    extent.maximum = stream.readFloat32Array(3);

    return extent as Extent;
}

export type { Extent };
export { parseExtent };
