import { BinaryStream } from '@cod-evoid/hexcod';

type Texture = {
    replaceableId: number;
    fileName: string;
    flags: number;
}

function parseTexture(stream: BinaryStream): Texture {
    const texture: Partial<Texture> = {};

    texture.replaceableId = stream.readUint32();
    texture.fileName = stream.readString(260);
    texture.flags = stream.readUint32();

    return texture as Texture;
}

export type { Texture };
export { parseTexture };
