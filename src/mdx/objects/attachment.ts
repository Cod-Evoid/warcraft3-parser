import { BinaryStream } from '@cod-evoid/hexcod';
import { Transformation, parseTransformation } from './transformation.js';
import { Node, parseNode } from './node.js';

const enum AttachmentTag {
    KATV = 0x5654414B,
}

type AttachmentTransformations = {
    visibility?: Transformation<'float32'>;
}

type Attachment = {
    node: Node;
    path: string;
    attachmentId: number;
    transformations: AttachmentTransformations;
}

function parseAttachment(stream: BinaryStream): Attachment {
    const attachment: Partial<Attachment> = {},
        nextOffset = stream.offset + stream.readUint32() - 4;

    attachment.node = parseNode(stream);
    attachment.path = stream.readString(260);
    attachment.attachmentId = stream.readUint32();
    attachment.transformations = {};

    while (stream.offset < nextOffset) {
        const tag = stream.readUint32();

        if (tag === AttachmentTag.KATV)
            attachment.transformations.visibility = parseTransformation(stream, 'float32');
        else
            throw new Error(`An unexpected tag was found at ${ stream.offset - 4 } bytes offset.`);
    }

    return attachment as Attachment;
}

export type { Attachment };
export { parseAttachment };
