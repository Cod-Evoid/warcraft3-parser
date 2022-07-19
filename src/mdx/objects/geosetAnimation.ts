import { BinaryStream } from '@cod-evoid/hexcod';
import { Transformation, parseTransformation } from './transformation.js';

const enum GeosetAnimationTag {
    KGAO = 0x4F41474B,
    KGAC = 0x4341474B,
}

type GeosetAnimationTransformations = {
    alpha?: Transformation<'float32'>;
    color?: Transformation<'float32Array'>;
}

type GeosetAnimation = {
    alpha: number;
    flags: number;
    color: Float32Array;
    geosetId: number;
    transformations: GeosetAnimationTransformations;
}

function parseGeosetAnimation(stream: BinaryStream): GeosetAnimation {
    const geosetAnimation: Partial<GeosetAnimation> = {},
        nextOffset = stream.offset + stream.readUint32() - 4;

    geosetAnimation.alpha = stream.readFloat32();
    geosetAnimation.flags = stream.readUint32();
    geosetAnimation.color = stream.readFloat32Array(3);
    geosetAnimation.geosetId = stream.readUint32();
    geosetAnimation.transformations = {};

    while (stream.offset < nextOffset) {
        const tag = stream.readUint32();

        if (tag === GeosetAnimationTag.KGAO)
            geosetAnimation.transformations.alpha = parseTransformation(stream, 'float32');
        else if (tag === GeosetAnimationTag.KGAC)
            geosetAnimation.transformations.color = parseTransformation(stream, 'float32Array', 3);
        else
            throw new Error(`An unexpected tag was found at ${ stream.offset - 4 } bytes offset.`);
    }

    return geosetAnimation as GeosetAnimation;
}

export type { GeosetAnimation };
export { parseGeosetAnimation };
