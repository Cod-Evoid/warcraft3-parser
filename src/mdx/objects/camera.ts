import { BinaryStream } from '@cod-evoid/hexcod';
import { Transformation, parseTransformation } from './transformation.js';

const enum CameraTag {
    KCTR = 0x5254434B,
    KCRL = 0x4C52434B,
    KTTR = 0x5254544B,
}

type CameraTransformations = {
    translation?: Transformation<'float32Array'>;
    rotation?: Transformation<'float32'>;
    targetTranslation?: Transformation<'float32Array'>;
}

type Camera = {
    name: string;
    position: Float32Array;
    filedOfView: number;
    farClippingPlane: number;
    nearClippingPlane: number;
    targetPosition: Float32Array;
    transformations: CameraTransformations;
}

function parseCamera(stream: BinaryStream): Camera {
    const camera: Partial<Camera> = {},
        nextOffset = stream.offset + stream.readUint32() - 4;

    camera.name = stream.readString(80);
    camera.position = stream.readFloat32Array(3);
    camera.filedOfView = stream.readFloat32();
    camera.farClippingPlane = stream.readFloat32();
    camera.nearClippingPlane = stream.readFloat32();
    camera.targetPosition = stream.readFloat32Array(3);
    camera.transformations = {};

    while (stream.offset < nextOffset) {
        const tag = stream.readUint32();

        if (tag === CameraTag.KCTR)
            camera.transformations.translation = parseTransformation(stream, 'float32Array', 3);
        else if (tag === CameraTag.KCRL)
            camera.transformations.rotation = parseTransformation(stream, 'float32');
        else if (tag === CameraTag.KTTR)
            camera.transformations.targetTranslation = parseTransformation(stream, 'float32Array', 3);
        else
            throw new Error(`An unexpected tag was found at ${ stream.offset - 4 } bytes offset.`);
    }

    return camera as Camera;
}

export type { Camera };
export { parseCamera };
