import MemoryBuffer from "./MemoryBuffer.js"

HEADERS_BYTE = Uint32Array.BYTES_PER_ELEMENT
HEADERS_LENGTH = 12
HEADERS_BYTELENGTH = HEADERS_BYTE * HEADERS_LENGTH

HEADER_OF_SIZE = 1
HEADER_OF_INDEX = 2
HEADER_OF_OFFSET = 3

HEADER_OFFSET_SIZE = -HEADERS_BYTELENGTH + HEADER_OF_SIZE * HEADERS_BYTE
HEADER_OFFSET_OFFSET = -HEADERS_BYTELENGTH + HEADER_OF_OFFSET * HEADERS_BYTE

u32 = null
$buffer = null
$memory = null

class OffsetArray extends Array
class ObjectArray extends Array
class IndexObject extends Object

$offset = new OffsetArray(null)
$index = new IndexObject() 

requestAnimationFrame ->
    console.warn { $offset, $index, $buffer }
    console.warn { u32 }



class Pointer extends Number
    resize  : ( byteLength ) ->

    grow    : ( byteLength = 0, index = this ) ->
        return index
        byteLength += index.headers()[ HEADER_OF_SIZE ]
        $memory.allocate byteLength, @index()

    headers : ( offset ) ->
        offset /= HEADERS_BYTE
        begin = offset - HEADERS_LENGTH
        u32.subarray begin , offset

    setOffset   : ( index , value ) ->
        $offset[ index ] = value

    getOffset   : ( index ) ->
        $offset[ index ]

    setIndex    : ( offset , index ) ->
        $index[ offset ] = index

    getIndex    : ( offset ) ->
        $index[ offset ]

class Index extends Pointer
    index   : -> this

    headers : ( offset ) ->
        super offset ? @offset()

    setOffset : ( offset ) ->
        $memory.save offset , this 

    getOffset : ->
        $offset[ this * 1 ]

    getIndex  : ( offset ) ->
        $index[ offset ]
    
    setIndex  : ( index ) ->
        $index[ @getOffset() * 1 ] = index

class Offset extends Pointer
    setOffset : ( offset ) ->
        super @index() * 1 , offset
    
    getOffset : ->
        super @index() * 1

    setIndex  : ( index ) ->
        $index[ this * 1 ] = index

    getIndex  : ->
        $index[ this * 1 ]

    grow    : ( byteLength ) ->
        super byteLength, @index()

    headers : ->
        super this 

    write   : ( offset ) ->
        u32[ (this + HEADER_OFFSET_OFFSET) / 4 ] = offset * 1

    reset   : ( offset ) ->
        return unless index = @getIndex()
        @write( offset )
        delete $index[ this * 1 ]
        $offset[ index ] = new Offset offset 


Object.defineProperties Number::, {
    offset : value : -> $offset[ this * 1 ]
    index : value : -> $index[ this * 1 ]
    buffer : value : -> $buffer.slice @offset()
}

export class Memory
    __proto__: null
    @MAX = 1e6 * ( self?.navigator?.deviceMemory or 1 )

    constructor : ( bufferSize = HEADERS_BYTELENGTH ) ->
        $buffer = new MemoryBuffer bufferSize, Memory.MAX
        u32 = new Uint32Array $buffer
        $memory = this

    allocate    : ( length , index ) ->        
        offset = @grow length , @bufferOffset
        index or= @save offset , @bufferIndex  
        
        headers = index.headers offset 
        
        headers[ HEADER_OF_SIZE ] = length
        headers[ HEADER_OF_INDEX ] = index
        headers[ HEADER_OF_OFFSET ] = offset

        index

    grow        : ( length , offset ) ->
        $buffer.resize offset + length
        new Offset offset

    save        : ( offset , index ) ->  
        offset *= 1 ; index *= 1

        unless $offset[ index ]?.reset offset
            $offset[ index ] = new Offset offset
               
        $index[ offset ] = new Index index



Object.defineProperties Memory::, {

    byteLength : get : -> $buffer.byteLength

    bufferSize :
        get : -> $buffer.byteLength
        set : ( byteLength ) -> $buffer.resize byteLength

    bufferIndex : get : -> $offset.length
    bufferOffset : get : -> $buffer.byteLength + HEADERS_BYTELENGTH

}

export default Memory