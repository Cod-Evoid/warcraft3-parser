import { BinaryStream } from '@cod-evoid/hexcod';
import { Node, parseNode } from './node.js';

type CollisionShape = {
    node: Node;
    type: number;
    vertices: Float32Array;
    radius?: number;
}

const enum CollisionShapeType {
    CUBE = 0,
    PLANE = 1,
    SPHERE = 2,
    CYLINDER = 3,
}

function parseCollisionShape(stream: BinaryStream): CollisionShape {
    const collisionShape: Partial<CollisionShape> = {};

    collisionShape.node = parseNode(stream);
    collisionShape.type = stream.readUint32();
    collisionShape.vertices = stream.readFloat32Array(collisionShape.type === CollisionShapeType.SPHERE ? 3 : 6);
    collisionShape.radius = collisionShape.type === CollisionShapeType.SPHERE || collisionShape.type === CollisionShapeType.CYLINDER ? stream.readFloat32() : undefined;

    return collisionShape as CollisionShape;
}

export type { CollisionShape };
export { parseCollisionShape };
