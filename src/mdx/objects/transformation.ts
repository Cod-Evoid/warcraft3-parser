import { BinaryStream } from '@cod-evoid/hexcod';

type FrameType = 'float32Array' | 'float32' | 'uint32';

type FrameValue<T extends FrameType> =
    T extends 'float32Array'
    ? Float32Array
    : T extends 'float32' | 'uint32'
    ? number
    : never;

type Frame<T extends FrameType> = {
    id: number;
    value: FrameValue<T>;
    inTan?: FrameValue<T>;
    outTan?: FrameValue<T>;
}

type Transformation<T extends FrameType> = {
    interpolationType: number;
    globalSequenceId: number;
    frames: Frame<T>[];
}

function parseTransformationValue<T extends FrameType>(stream: BinaryStream, type: T, elements: number): FrameValue<T> {
    let value: Float32Array | number;

    if (type === 'float32Array') {
        value = stream.readFloat32Array(elements);
    } else if (type === 'float32') {
        value = stream.readFloat32();
    } else if (type === 'uint32') {
        value = stream.readUint32();
    } else
        throw new Error(`Invalid transformation type ${ type }.`);

    return value as FrameValue<T>;
}

function parseTransformation<T extends FrameType>(stream: BinaryStream, type: T, elements = 0): Transformation<T> {
    const transformation: Partial<Transformation<T>> = {},
        count = stream.readUint32();

    transformation.interpolationType = stream.readUint32();
    transformation.globalSequenceId = stream.readUint32();
    transformation.frames = [];

    for (let x = 0; x < count; x++) {
        const frame: Partial<Frame<T>> = {};

        frame.id = stream.readInt32();
        frame.value = parseTransformationValue(stream, type, elements);

        if (transformation.interpolationType > 1) {
            frame.inTan = parseTransformationValue(stream, type, elements);
            frame.outTan = parseTransformationValue(stream, type, elements);
        }

        transformation.frames.push(frame as Frame<T>);
    }

    return transformation as Transformation<T>;
}

export type { Transformation };
export { parseTransformation };
