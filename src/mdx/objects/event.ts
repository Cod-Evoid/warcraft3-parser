import { BinaryStream } from '@cod-evoid/hexcod';
import { Node, parseNode } from './node.js';

type Event = {
    node: Node;
    globalSequenceId: number;
    frames: Uint32Array;
}

function parseEvent(stream: BinaryStream): Event {
    const event: Partial<Event> = {};

    event.node = parseNode(stream);

    stream.skip(4);

    const count = stream.readUint32();
    event.globalSequenceId = stream.readUint32();
    event.frames = stream.readUint32Array(count);

    return event as Event;
}

export type { Event };
export { parseEvent };
