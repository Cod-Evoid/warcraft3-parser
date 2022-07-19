import { BinaryStream } from '@cod-evoid/hexcod';
import { Transformation, parseTransformation } from './transformation.js';

const enum NodeTag {
    KGTR = 0x5254474B,
    KGRT = 0x5452474B,
    KGSC = 0x4353474B,
}

type NodeTransformations = {
    translation?: Transformation<'float32Array'>;
    rotation?: Transformation<'float32Array'>;
    scaling?: Transformation<'float32Array'>;
};

type Node = {
    name: string;
    objectId: number;
    parentId: number;
    flags: number;
    transformations: NodeTransformations;
}

function parseNode(stream: BinaryStream): Node {
    const node: Partial<Node> = {},
        nextOffset = stream.offset + stream.readUint32() - 4;

    node.name = stream.readString(80);
    node.objectId = stream.readUint32();
    node.parentId = stream.readUint32();
    node.flags = stream.readUint32();
    node.transformations = {};

    while (stream.offset < nextOffset) {
        const tag = stream.readUint32();

        if (tag === NodeTag.KGTR)
            node.transformations.translation = parseTransformation(stream, 'float32Array', 3);
        else if (tag === NodeTag.KGRT)
            node.transformations.rotation = parseTransformation(stream, 'float32Array', 4);
        else if (tag === NodeTag.KGSC)
            node.transformations.scaling = parseTransformation(stream, 'float32Array', 3);
        else
            throw new Error(`An unexpected tag was found at ${ stream.offset - 4 } bytes offset.`);
    }

    return node as Node;
}

export type { Node };
export { parseNode };
