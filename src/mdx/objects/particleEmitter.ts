import { BinaryStream } from '@cod-evoid/hexcod';
import { Transformation, parseTransformation } from './transformation.js';
import { Node, parseNode } from './node.js';

const enum ParticleEmitterTag {
    KPEE = 0x4545504B,
    KPEG = 0x4745504B,
    KPLN = 0x4E4C504B,
    KPLT = 0x544C504B,
    KPEL = 0x4C45504B,
    KPES = 0x5345504B,
    KPEV = 0x5645504B,
}

type ParticleEmitterTransformations = {
    emissionRate?: Transformation<'float32'>;
    gravity?: Transformation<'float32'>;
    longitude?: Transformation<'float32'>;
    latitude?: Transformation<'float32'>;
    lifespan?: Transformation<'float32'>;
    speed?: Transformation<'float32'>;
    visibility?: Transformation<'float32'>;
}

type ParticleEmitter = {
    node: Node;
    emissionRate: number;
    gravity: number;
    longitude: number;
    latitude: number;
    spawnModelFileName: string;
    lifespan: number;
    initialVelocity: number;
    transformations: ParticleEmitterTransformations;
}

function parseParticleEmitter(stream: BinaryStream): ParticleEmitter {
    const particleEmitter: Partial<ParticleEmitter> = {},
        nextOffset = stream.offset + stream.readUint32() - 4;

    particleEmitter.node = parseNode(stream);
    particleEmitter.emissionRate = stream.readFloat32();
    particleEmitter.gravity = stream.readFloat32();
    particleEmitter.longitude = stream.readFloat32();
    particleEmitter.latitude = stream.readFloat32();
    particleEmitter.spawnModelFileName = stream.readString(260);
    particleEmitter.lifespan = stream.readFloat32();
    particleEmitter.initialVelocity = stream.readFloat32();
    particleEmitter.transformations = {};

    while (stream.offset < nextOffset) {
        const tag = stream.readUint32();

        if (tag === ParticleEmitterTag.KPEE)
            particleEmitter.transformations.emissionRate = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitterTag.KPEG)
            particleEmitter.transformations.gravity = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitterTag.KPLN)
            particleEmitter.transformations.longitude = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitterTag.KPLT)
            particleEmitter.transformations.latitude = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitterTag.KPEL)
            particleEmitter.transformations.lifespan = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitterTag.KPES)
            particleEmitter.transformations.speed = parseTransformation(stream, 'float32');
        else if (tag === ParticleEmitterTag.KPEV)
            particleEmitter.transformations.visibility = parseTransformation(stream, 'float32');
        else
            throw new Error(`An unexpected tag was found at ${ stream.offset - 4 } bytes offset.`);
    }

    return particleEmitter as ParticleEmitter;
}

export type { ParticleEmitter };
export { parseParticleEmitter };
