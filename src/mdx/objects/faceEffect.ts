import { BinaryStream } from '@cod-evoid/hexcod';

type FaceEffect = {
    target: string;
    path: string;
}

function parseFaceEffect(stream: BinaryStream): FaceEffect {
    const faceEffect: Partial<FaceEffect> = {};

    faceEffect.target = stream.readString(80);
    faceEffect.path = stream.readString(260);

    return faceEffect as FaceEffect;
}

export type { FaceEffect };
export { parseFaceEffect };
