import { BinaryStream } from '@cod-evoid/hexcod';
import { Transformation, parseTransformation } from './transformation.js';
import { Node, parseNode } from './node.js';

const enum ParticleEmitter2Tag {
    KP2E = 0x4532504B,
    KP2G = 0x4732504B,
    KP2L = 0x4C32504B,
    KP2S = 0x5332504B,
    KP2V = 0x5632504B,
    KP2R = 0x5232504B,
    KP2N = 0x4E32504B,
    KP2W = 0x5732504B,
}

type ParticleEmitter2Transformations = {
    emissionRate?: Transformation<'float32'>;
    gravity?: Transformation<'float32'>;
    latitude?: Transformation<'float32'>;
    speed?: Transformation<'float32'>;
    visibility?: Transformation<'float32'>;
    variation?: Transformation<'float32'>;
    length?: Transformation<'float32'>;
    width?: Transformation<'float32'>;
}

type ParticleEmitter2 = {
    node: Node;
    speed: number;
    variation: number;
    latitude: number;
    gravity: number;
    lifespan: number;
    emissionRate: number;
    length: number;
    width: number;
    filterMode: number;
    rows: number;
    columns: number;
    headOrTail: number;
    tailLength: number;
    time: number;
    segmentColor: Float32Array;
    segmentAlpha: Uint8Array;
    segmentScaling: Float32Array;
    headInterval: Uint32Array;
    headDecayInterval: Uint32Array;
    tailInterval: Uint32Array;
    tailDecayInterval: Uint32Array;
    textureId: number;
    squirt: number;
    priorityPlane: number;
    replaceableId: number;
    transformations: ParticleEmitter2Transformations;
}

function parsePatricleEmitter2(stream: BinaryStream): ParticleEmitter2 {
    const particleEmitter2: Partial<ParticleEmitter2> = {},
        nextOffset = stream.offset + stream.readUint32() - 4;

    particleEmitter2.node = parseNode(stream);
    particleEmitter2.speed = stream.readFloat32();
    particleEmitter2.variation = stream.readFloat32();
    particleEmitter2.latitude = stream.readFloat32();
    particleEmitter2.gravity = stream.readFloat32();
    particleEmitter2.lifespan = stream.readFloat32();
    particleEmitter2.emissionRate = stream.readFloat32();
    particleEmitter2.length = stream.readFloat32();
    particleEmitter2.width = stream.readFloat32();
    particleEmitter2.filterMode = stream.readUint32();
    particleEmitter2.rows = stream.readUint32();
    particleEmitter2.columns = stream.readUint32();
    particleEmitter2.headOrTail = stream.readUint32();
    particleEmitter2.tailLength = stream.readFloat32();
    particleEmitter2.time = stream.readFloat32();
    particleEmitter2.segmentColor = stream.readFloat32Array(9);
    particleEmitter2.segmentAlpha = stream.readUint8Array(3);
    particleEmitter2.segmentScaling = stream.readFloat32Array(3);
    particleEmitter2.headInterval = stream.readUint32Array(3);
    particleEmitter2.headDecayInterval = stream.readUint32Array(3);
    particleEmitter2.tailInterval = stream.readUint32Array(3);
    particleEmitter2.tailDecayInterval = stream.readUint32Array(3);
    particleEmitter2.textureId = stream.readUint32();
    particleEmitter2.squirt = stream.readUint32();
    particleEmitter2.priorityPlane = stream.readUint32();
    particleEmitter2.replaceableId = stream.readUint32();
    particleEmitter2.transformations = {};

    while (stream.offset < nextOffset) {
        const tag = stream.readUint32();

        if (tag === ParticleEmitter2Tag.KP2E)
            particleEmitter2.transformations.emissionRate = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitter2Tag.KP2G)
            particleEmitter2.transformations.gravity = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitter2Tag.KP2L)
            particleEmitter2.transformations.latitude = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitter2Tag.KP2S)
            particleEmitter2.transformations.speed = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitter2Tag.KP2V)
            particleEmitter2.transformations.visibility = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitter2Tag.KP2R)
            particleEmitter2.transformations.variation = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitter2Tag.KP2N)
            particleEmitter2.transformations.length = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitter2Tag.KP2W)
            particleEmitter2.transformations.width = parseTransformation(stream, 'float32');
        else
            throw new Error(`An unexpected tag was found at ${ stream.offset - 4 } bytes offset.`);
    }

    return particleEmitter2 as ParticleEmitter2;
}

export type { ParticleEmitter2 };
export { parsePatricleEmitter2 };
