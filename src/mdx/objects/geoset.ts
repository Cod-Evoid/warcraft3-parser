import { BinaryStream } from '@cod-evoid/hexcod';
import { Extent, parseExtent } from './extent.js';

type DynamicType = 'float32Array' | 'uint32Array' | 'uint16Array' | 'uint8Array';

type DynamicValue<T extends DynamicType> =
    T  extends 'float32Array'
    ? Float32Array
    : T extends 'uint32Array'
    ? Uint32Array
    : T extends 'uint16Array'
    ? Uint16Array
    : T extends 'uint8Array'
    ? Uint8Array
    : never;

type Geoset = {
    vertexPositions: Float32Array;
    vertexNormals: Float32Array;
    faceTypeGroups: Uint32Array;
    faceGroups: Uint32Array;
    faces: Uint16Array;
    vertexGroups: Uint8Array;
    matrixGroups: Uint32Array;
    matrixIndices: Uint32Array;
    materialId: number;
    selectionGroup: number;
    selectionFlags: number;
    levelOfDetail: number;
    name: string;
    extent: Extent;
    sequenceExtents: Extent[];
    tangents: Float32Array;
    skin: Uint8Array;
    textureCoordinates: Float32Array[];
}

function parseDynamicArray<T extends DynamicType>(stream: BinaryStream, type: T, multiplier = 1): DynamicValue<T> {
    stream.skip(4);

    const count = stream.readUint32();
    let value: Float32Array | Uint32Array | Uint16Array | Uint8Array;

    if (type === 'float32Array')
        value = stream.readFloat32Array(count * multiplier);
    else if (type === 'uint32Array')
        value = stream.readUint32Array(count * multiplier);
    else if (type === 'uint16Array')
        value = stream.readUint16Array(count * multiplier);
    else if (type === 'uint8Array')
        value = stream.readUint8Array(count * multiplier);
    else
        throw new Error(`Invalid dynamic array type ${ type }.`);

    return value as DynamicValue<T>;
}

function parseGeoset(stream: BinaryStream): Geoset {
    const geoset: Partial<Geoset> = {};

    stream.skip(4);

    geoset.vertexPositions = parseDynamicArray(stream, 'float32Array', 3);
    geoset.vertexNormals = parseDynamicArray(stream, 'float32Array', 3);
    geoset.faceTypeGroups = parseDynamicArray(stream, 'uint32Array');
    geoset.faceGroups = parseDynamicArray(stream, 'uint32Array');
    geoset.faces = parseDynamicArray(stream, 'uint16Array');
    geoset.vertexGroups = parseDynamicArray(stream, 'uint8Array');
    geoset.matrixGroups = parseDynamicArray(stream, 'uint32Array');
    geoset.matrixIndices = parseDynamicArray(stream, 'uint32Array');
    geoset.materialId = stream.readUint32();
    geoset.selectionGroup = stream.readUint32();
    geoset.selectionFlags = stream.readUint32();
    geoset.levelOfDetail = stream.readUint32();
    geoset.name = stream.readString(80);
    geoset.extent = parseExtent(stream);

    geoset.sequenceExtents = [];
    for (let x = 0, count = stream.readUint32(); x < count; x++)
        geoset.sequenceExtents.push(parseExtent(stream));

    geoset.tangents = parseDynamicArray(stream, 'float32Array', 4);
    geoset.skin = parseDynamicArray(stream, 'uint8Array');

    stream.skip(4);

    geoset.textureCoordinates = [];
    for (let x = 0, count = stream.readUint32(); x < count; x++)
        geoset.textureCoordinates.push(parseDynamicArray(stream, 'float32Array', 2));

    return geoset as Geoset;
}

export type { Geoset };
export { parseGeoset };
