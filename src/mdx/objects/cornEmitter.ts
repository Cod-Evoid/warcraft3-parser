import { BinaryStream } from '@cod-evoid/hexcod';
import { Transformation, parseTransformation } from './transformation.js';
import { Node, parseNode } from './node.js';

const enum CornEmitterTag {
    KPPA = 0x4150504B,
    KPPC = 0x4350504B,
    KPPE = 0x4550504B,
    KPPL = 0x4C50504B,
    KPPS = 0x5350504B,
    KPPV = 0x5650504B,
}

type CornEmitterTransformations = {
    alpha?: Transformation<'float32'>;
    color?: Transformation<'float32Array'>;
    emissionRate?: Transformation<'float32'>;
    lifespan?: Transformation<'float32'>;
    speed?: Transformation<'float32'>;
    visibility?: Transformation<'float32'>;
}

type CornEmitter = {
    node: Node;
    lifespan: number;
    emissionRate: number;
    speed: number;
    color: Float32Array;
    replaceableId: number;
    path: string;
    flags: string;
    transformations: CornEmitterTransformations;
}

function parseCornEmitter(stream: BinaryStream): CornEmitter {
    const cornEmitter: Partial<CornEmitter> = {},
        nextOffset = stream.offset + stream.readUint32() - 4;

    cornEmitter.node = parseNode(stream);
    cornEmitter.lifespan = stream.readFloat32();
    cornEmitter.emissionRate = stream.readFloat32();
    cornEmitter.speed = stream.readFloat32();
    cornEmitter.color = stream.readFloat32Array(4);
    cornEmitter.replaceableId = stream.readUint32();
    cornEmitter.path = stream.readString(260);
    cornEmitter.flags = stream.readString(260);
    cornEmitter.transformations = {};

    while (stream.offset < nextOffset) {
        const tag = stream.readUint32();

        if (tag === CornEmitterTag.KPPA)
            cornEmitter.transformations.alpha = parseTransformation(stream, 'float32');
        else if (tag === CornEmitterTag.KPPC)
            cornEmitter.transformations.color = parseTransformation(stream, 'float32Array', 3);
        else if (tag === CornEmitterTag.KPPE)
            cornEmitter.transformations.emissionRate = parseTransformation(stream, 'float32');
        else if (tag === CornEmitterTag.KPPL)
            cornEmitter.transformations.lifespan = parseTransformation(stream, 'float32');
        else if (tag === CornEmitterTag.KPPS)
            cornEmitter.transformations.speed = parseTransformation(stream, 'float32');
        else if (tag === CornEmitterTag.KPPV)
            cornEmitter.transformations.visibility = parseTransformation(stream, 'float32');
        else
            throw new Error(`An unexpected tag was found at ${ stream.offset - 4 } bytes offset.`);
    }

    return cornEmitter as CornEmitter;
}

export type { CornEmitter };
export { parseCornEmitter };
