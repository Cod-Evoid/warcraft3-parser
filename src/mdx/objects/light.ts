import { BinaryStream } from '@cod-evoid/hexcod';
import { Transformation, parseTransformation } from './transformation.js';
import { Node, parseNode } from './node.js';

const enum LightTag {
    KLAS = 0x53414C4B,
    KLAE = 0x45414C4B,
    KLAC = 0x43414C4B,
    KLAI = 0x49414C4B,
    KLBI = 0x49424C4B,
    KLBC = 0x43424C4B,
    KLAV = 0x56414C4B,
}

type LightTransformations = {
    attenuationStart?: Transformation<'float32'>;
    attenuationStartEnd?: Transformation<'float32'>;
    color?: Transformation<'float32Array'>;
    intensity?: Transformation<'float32'>;
    ambientIntensity?: Transformation<'float32'>;
    ambientColor?: Transformation<'float32Array'>;
    visibility?: Transformation<'float32'>;
}

type Light = {
    node: Node;
    type: number;
    attenuationStart: number;
    attenuationEnd: number;
    color: Float32Array;
    intensity: number;
    ambientColor: Float32Array;
    ambientIntensity: number;
    transformations: LightTransformations;
}

function parseLight(stream: BinaryStream): Light {
    const light: Partial<Light> = {},
        nextOffset = stream.offset + stream.readUint32() - 4;

    light.node = parseNode(stream);
    light.type = stream.readUint32();
    light.attenuationStart = stream.readFloat32();
    light.attenuationEnd = stream.readFloat32();
    light.color = stream.readFloat32Array(3);
    light.intensity = stream.readFloat32();
    light.ambientColor = stream.readFloat32Array(3);
    light.ambientIntensity = stream.readFloat32();
    light.transformations = {};

    while (stream.offset < nextOffset) {
        const tag = stream.readUint32();

        if (tag === LightTag.KLAS)
            light.transformations.attenuationStart = parseTransformation(stream, 'float32');
        else if (tag === LightTag.KLAE)
            light.transformations.attenuationStartEnd = parseTransformation(stream, 'float32');
        else if (tag === LightTag.KLAC)
            light.transformations.color = parseTransformation(stream, 'float32Array', 3);
        else if (tag === LightTag.KLAI)
            light.transformations.intensity = parseTransformation(stream, 'float32');
        else if (tag === LightTag.KLBI)
            light.transformations.ambientIntensity = parseTransformation(stream, 'float32');
        else if (tag === LightTag.KLBC)
            light.transformations.ambientColor = parseTransformation(stream, 'float32Array', 3);
        else if (tag === LightTag.KLAV)
            light.transformations.visibility = parseTransformation(stream, 'float32');
        else
            throw new Error(`An unexpected tag was found at ${ stream.offset - 4 } bytes offset.`);
    }

    return light as Light;
}

export type { Light };
export { parseLight };
