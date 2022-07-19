import { BinaryStream } from '@cod-evoid/hexcod';
import { Layer, parseLayer } from './layer.js';

type Material = {
    priorityPlane: number;
    flags: number;
    shader: string;
    layers: Layer[];
}

function parseMaterial(stream: BinaryStream): Material {
    const material: Partial<Material> = {},
        nextOffset = stream.offset + stream.readUint32() - 4;

    material.priorityPlane = stream.readUint32();
    material.flags = stream.readUint32();
    material.shader = stream.readString(80);
    material.layers = [];

    stream.skip(8);

    while (stream.offset < nextOffset)
        material.layers.push(parseLayer(stream));

    return material as Material;
}

export type { Material };
export { parseMaterial };
