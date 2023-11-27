export class MemoryBuffer extends ArrayBuffer
    constructor : ( byteLength, maxByteLength ) ->
        super byteLength, { maxByteLength }

export default MemoryBuffer