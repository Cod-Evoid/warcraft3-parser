import { BinaryStream } from '@cod-evoid/hexcod';
import { Node, parseNode } from './node.js';

type Bone = {
    node: Node;
    geosetId: number;
    geosetAnimationId: number;
}

function parseBone(stream: BinaryStream): Bone {
    const bone: Partial<Bone> = {};

    bone.node = parseNode(stream);
    bone.geosetId = stream.readUint32();
    bone.geosetAnimationId = stream.readUint32();

    return bone as Bone;
}

export type { Bone };
export { parseBone };
