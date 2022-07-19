import { BinaryStream } from '@cod-evoid/hexcod';
import { Transformation, parseTransformation } from './transformation.js';

const enum TextureAnimationTag {
    KTAT = 0x5441544B,
    KTAR = 0x5241544B,
    KTAS = 0x5341544B,
}

type TextureAnimationTransformations = {
    translation?: Transformation<'float32Array'>;
    rotation?: Transformation<'float32Array'>;
    scaling?: Transformation<'float32Array'>;
}

type TextureAnimation = {
    transformations: TextureAnimationTransformations;
}

function parseTextureAnimation(stream: BinaryStream): TextureAnimation {
    const textureAnimation: Partial<TextureAnimation> = {},
        nextOffset = stream.offset + stream.readUint32() - 4;

    textureAnimation.transformations = {};

    while (stream.offset < nextOffset) {
        const tag = stream.readUint32();

        if (tag === TextureAnimationTag.KTAT)
            textureAnimation.transformations.translation = parseTransformation(stream, 'float32Array', 3);
        else if (tag === TextureAnimationTag.KTAR)
            textureAnimation.transformations.rotation = parseTransformation(stream, 'float32Array', 4);
        else if (tag === TextureAnimationTag.KTAS)
            textureAnimation.transformations.scaling = parseTransformation(stream, 'float32Array', 3);
        else
            throw new Error(`An unexpected tag was found at ${ stream.offset - 4 } bytes offset.`);
    }

    return textureAnimation as TextureAnimation;
}

export type { TextureAnimation };
export { parseTextureAnimation };
