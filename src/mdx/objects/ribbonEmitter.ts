import { BinaryStream } from '@cod-evoid/hexcod';
import { Transformation, parseTransformation } from './transformation.js';
import { Node, parseNode } from './node.js';

const enum RibbonEmitterTag {
    KRVS = 0x5356524B,
    KRHA = 0x4148524B,
    KRHB = 0x4248524B,
    KRAL = 0x4C41524B,
    KRCO = 0x4F43524B,
    KRTX = 0x5854524B,
}

type RibbonEmitterTransformations = {
    visibility?: Transformation<'float32'>;
    heightAbove?: Transformation<'float32'>;
    heightBelow?: Transformation<'float32'>;
    alpha?: Transformation<'float32'>;
    color?: Transformation<'float32Array'>;
    textureSlot?: Transformation<'uint32'>;
}

type RibbonEmitter = {
    node: Node;
    heightAbove: number;
    heightBelow: number;
    alpha: number;
    color: Float32Array;
    lifespan: number;
    textureSlot: number;
    emissionRate: number;
    rows: number;
    columns: number;
    materialId: number;
    gravity: number;
    transformations: RibbonEmitterTransformations;
}

function parseRibbonEmitter(stream: BinaryStream): RibbonEmitter {
    const ribbonEmitter: Partial<RibbonEmitter> = {},
        nextOffset = stream.offset + stream.readUint32() - 4;

    ribbonEmitter.node = parseNode(stream);
    ribbonEmitter.heightAbove = stream.readFloat32();
    ribbonEmitter.heightBelow = stream.readFloat32();
    ribbonEmitter.alpha = stream.readFloat32();
    ribbonEmitter.color = stream.readFloat32Array(3);
    ribbonEmitter.lifespan = stream.readFloat32();
    ribbonEmitter.textureSlot = stream.readUint32();
    ribbonEmitter.emissionRate = stream.readUint32();
    ribbonEmitter.rows = stream.readUint32();
    ribbonEmitter.columns = stream.readUint32();
    ribbonEmitter.materialId = stream.readUint32();
    ribbonEmitter.gravity = stream.readFloat32();
    ribbonEmitter.transformations = {};

    while (stream.offset < nextOffset) {
        const tag = stream.readUint32();

        if (tag === RibbonEmitterTag.KRVS)
            ribbonEmitter.transformations.visibility = parseTransformation(stream, 'float32');
        else if (tag === RibbonEmitterTag.KRHA)
            ribbonEmitter.transformations.heightAbove = parseTransformation(stream, 'float32');
        else if (tag === RibbonEmitterTag.KRHB)
            ribbonEmitter.transformations.heightBelow = parseTransformation(stream, 'float32');
        else if (tag === RibbonEmitterTag.KRAL)
            ribbonEmitter.transformations.alpha = parseTransformation(stream, 'float32');
        else if (tag === RibbonEmitterTag.KRCO)
            ribbonEmitter.transformations.color = parseTransformation(stream, 'float32Array', 3);
        else if (tag === RibbonEmitterTag.KRTX)
            ribbonEmitter.transformations.textureSlot = parseTransformation(stream, 'uint32');
        else
            throw new Error(`An unexpected tag was found at ${ stream.offset - 4 } bytes offset.`);
    }

    return ribbonEmitter as RibbonEmitter;
}

export type { RibbonEmitter };
export { parseRibbonEmitter };
