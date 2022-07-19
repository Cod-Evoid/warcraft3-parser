import { BinaryStream } from '@cod-evoid/hexcod';
import { Transformation, parseTransformation } from './transformation.js';

const enum LayerTag {
    KMTF = 0x46544D4B,
    KMTA = 0x41544D4B,
    KMTE = 0x45544D4B,
    KFC3 = 0x3343464B,
    KFCA = 0x4143464B,
    KFTC = 0x4354464B,
}

type LayerTransformations = {
    textureId?: Transformation<'uint32'>;
    alpha?: Transformation<'float32'>;
    emissiveGain?: Transformation<'float32'>;
    fresnelColor?: Transformation<'float32Array'>;
    fresnelAlpha?: Transformation<'float32'>;
    fresnelTeamColor?: Transformation<'float32'>;
}

type Layer = {
    filter: number;
    flags: number;
    textureId: number;
    textureAnimationId: number;
    coordId: number;
    alpha: number;
    emissiveGain: number;
    fresnelColor: Float32Array;
    fresnelAlpha: number;
    fresnelTeamColor: number;
    transformations: LayerTransformations;
}

function parseLayer(stream: BinaryStream): Layer {
    const layer: Partial<Layer> = {},
        nextOffset = stream.offset + stream.readUint32() - 4;

    layer.filter = stream.readUint32();
    layer.flags = stream.readUint32();
    layer.textureId = stream.readUint32();
    layer.textureAnimationId = stream.readUint32();
    layer.coordId = stream.readUint32();
    layer.alpha = stream.readFloat32();
    layer.emissiveGain = stream.readFloat32();
    layer.fresnelColor = stream.readFloat32Array(3);
    layer.fresnelAlpha = stream.readFloat32();
    layer.fresnelTeamColor = stream.readFloat32();
    layer.transformations = {};

    while (stream.offset < nextOffset) {
        const tag = stream.readUint32();

        if (tag === LayerTag.KMTF)
            layer.transformations.textureId = parseTransformation(stream, 'uint32');
        else if (tag === LayerTag.KMTA)
            layer.transformations.alpha = parseTransformation(stream, 'float32');
        else if (tag === LayerTag.KMTE)
            layer.transformations.emissiveGain = parseTransformation(stream, 'float32');
        else if (tag === LayerTag.KFC3)
            layer.transformations.fresnelColor = parseTransformation(stream, 'float32Array', 3);
        else if (tag === LayerTag.KFCA)
            layer.transformations.fresnelAlpha = parseTransformation(stream, 'float32');
        else if (tag === LayerTag.KFTC)
            layer.transformations.fresnelTeamColor = parseTransformation(stream, 'float32');
        else
            throw new Error(`An unexpected tag was found at ${ stream.offset - 4 } bytes offset.`);
    }

    return layer as Layer;
}

export type { Layer };
export { parseLayer };
