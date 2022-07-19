import { BinaryStream } from '@cod-evoid/hexcod';
import { Extent, parseExtent } from './extent.js';

type Metadata = {
    name: string;
    animationFileName: string;
    extent: Extent;
    blendTime: number;
}

function parseMetadata(stream: BinaryStream): Metadata {
    const metadata: Partial<Metadata> = {};

    metadata.name = stream.readString(80);
    metadata.animationFileName = stream.readString(260);
    metadata.extent = parseExtent(stream);
    metadata.blendTime = stream.readUint32();

    return metadata as Metadata;
}

export type { Metadata };
export { parseMetadata };
