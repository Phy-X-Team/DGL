export NAVIGATOR_GBMEMORY = self?.navigator?.deviceMemory or 2
export INITIAL_BYTELENGTH = 0
export MAXIMUM_BYTELENGTH = 1e9 * Math.max NAVIGATOR_GBMEMORY, 1

export HEADER_INDEX_BUFFER_TYPE     = 1
export HEADER_INDEX_BUFFER_SIZE     = 2
export HEADER_INDEX_OFFSET_START    = 3
export HEADER_INDEX_OFFSET_DATA     = 4
export HEADER_INDEX_OFFSET_END      = 5
export HEADER_INDEX_OBJECT_CONTEXT  = 6
export HEADER_INDEX_OBJECT_PARENT   = 7
export HEADER_INDEX_OBJECT_SELF     = 8


class Container extends Array
    at : ( index ) ->
        @[ index * 1 ]

    it : ( index, value ) ->
        @[ index * 1 ] = value
        
    of : ( offset ) ->
        @indexOf( offset ).object()

    u32 : ( index, value ) ->
        return @at( index ) / 4 unless value?
        return @it( index * 4, value )

export OffsetArray = new class OffsetArray extends Container
    type : "offset"
    constructor : -> super 1

export ObjectArray = new class ObjectArray extends Container
    type : "object"
    constructor : -> super 1


export TypedBuffer  = { F32: 4, U32: 4, Ui8: 1, U16: 2 }
export HeaderBuffer = null

Number::object = -> ObjectArray.at this

export class MemoryBuffer extends ArrayBuffer
export class WebGLHeaders extends Uint32Array

    buffer : ( index, offset ) ->
        offset = offset ? OffsetArray.at index
        header = index.constructor.HEADER_BYTELENGTH
        starts = offset - header
        
        @subarray starts/4, offset/4 

    offset          : ( index, HEADER_INDEX = 12, HEADER_COUNT = 12 ) ->
        (OffsetArray.at(index) / 4) + (HEADER_INDEX - HEADER_COUNT)

    moveOffset      : ( index, length ) ->

        offsetStart = @getOffsetStart index
        offsetData = @getOffsetData index
        offsetEnd = @getOffsetEnd index

        OffsetArray.it index, length + offsetData

        @setOffsetStart index, length + offsetStart 
        @setOffsetData index, length + offsetData 
        @setOffsetEnd index, length + offsetEnd
        
        this

    getBufferType   : ( index ) -> @[ @offset( index, HEADER_INDEX_BUFFER_TYPE ) ]
    setBufferType   : ( index, value ) -> @[ @offset( index, HEADER_INDEX_BUFFER_TYPE ) ] = value

    getBufferSize   : ( index ) -> @[ @offset( index, HEADER_INDEX_BUFFER_SIZE ) ]
    setBufferSize   : ( index, value ) -> @[ @offset( index, HEADER_INDEX_BUFFER_SIZE ) ] = value

    getOffsetStart  : ( index ) -> @[ @offset( index, HEADER_INDEX_OFFSET_START ) ]
    setOffsetStart  : ( index, value ) -> @[ @offset( index, HEADER_INDEX_OFFSET_START ) ] = value

    getOffsetData   : ( index ) -> @[ @offset( index, HEADER_INDEX_OFFSET_DATA ) ]
    setOffsetData   : ( index, value ) -> @[ @offset( index, HEADER_INDEX_OFFSET_DATA ) ] = value

    getOffsetEnd    : ( index ) -> @[ @offset( index, HEADER_INDEX_OFFSET_END ) ]
    setOffsetEnd    : ( index, value ) -> @[ @offset( index, HEADER_INDEX_OFFSET_END ) ] = value

    getIndexContext : ( index ) -> @[ @offset( index, HEADER_INDEX_OBJECT_CONTEXT ) ]
    setIndexContext : ( index, value ) -> @[ @offset( index, HEADER_INDEX_OBJECT_CONTEXT ) ] = value

    getIndexParent  : ( index ) -> @[ @offset( index, HEADER_INDEX_OBJECT_PARENT ) ]
    setIndexParent  : ( index, value ) -> @[ @offset( index, HEADER_INDEX_OBJECT_PARENT ) ] = value

    getIndexSelf    : ( index ) -> @[ @offset( index, HEADER_INDEX_OBJECT_SELF ) ]
    setIndexSelf    : ( index, value ) -> @[ @offset( index, HEADER_INDEX_OBJECT_SELF ) ] = value

    objectContext   : ( index ) -> ObjectArray.at @getIndexContext( index )
    objectParent    : ( index ) -> ObjectArray.at @getIndexParent( index )
    objectSelf      : ( index ) -> ObjectArray.at @getIndexSelf( index )

Object.defineProperties WebGLHeaders::, {

    bufferType      : 
        get : -> @[ HEADER_INDEX_BUFFER_TYPE ]
        set : -> @[ HEADER_INDEX_BUFFER_TYPE ] = arguments[0]
    
    bufferSize      : 
        get : -> @[ HEADER_INDEX_BUFFER_SIZE ]
        set : -> @[ HEADER_INDEX_BUFFER_SIZE ] = arguments[0]
    
    offsetStart     : 
        get : -> @[ HEADER_INDEX_OFFSET_START ]
        set : -> @[ HEADER_INDEX_OFFSET_START ] = arguments[0]
    
    offsetData      : 
        get : -> @[ HEADER_INDEX_OFFSET_DATA ]
        set : -> @[ HEADER_INDEX_OFFSET_DATA ] = arguments[0]
    
    offsetEnd       : 
        get : -> @[ HEADER_INDEX_OFFSET_END ]
        set : -> @[ HEADER_INDEX_OFFSET_END ] = arguments[0]
        
    indexContext    : 
        get : -> @[ HEADER_INDEX_OBJECT_CONTEXT ]
        set : -> @[ HEADER_INDEX_OBJECT_CONTEXT ] = arguments[0]

    indexParent     : 
        get : -> @[ HEADER_INDEX_OBJECT_PARENT ]
        set : -> @[ HEADER_INDEX_OBJECT_PARENT ] = arguments[0]

    indexSelf       : 
        get : -> @[ HEADER_INDEX_OBJECT_SELF ]
        set : ( index = Number this ) ->
            if @indexSelf and @indexSelf is index
                throw /OBJECT_INDEX_HAS_TO_BE_SAME/
            @[ HEADER_INDEX_OBJECT_SELF ] = arguments[0]
}

export class F32Buffer extends Float32Array
export class U32Buffer extends Uint32Array
export class U16Buffer extends Uint16Array
export class Ui8Buffer extends Uint8Array

export class WenGLBuffer extends MemoryBuffer

    constructor : ( options ) ->
        super ...WenGLBuffer.initialize options

        TypedBuffer.F32 = new F32Buffer this
        TypedBuffer.U32 = new U32Buffer this
        TypedBuffer.Ui8 = new Ui8Buffer this
        TypedBuffer.U16 = new U16Buffer this

        (Float32Array.buffer = TypedBuffer.F32)
        ( Uint32Array.buffer = TypedBuffer.U32)
        ( Uint16Array.buffer = TypedBuffer.U16)
        (  Uint8Array.buffer = TypedBuffer.Ui8)        
        
        HeaderBuffer = new WebGLHeaders this
        
    @initialize : ( options = {} ) ->

        OffsetArray = options.OffsetArray ? OffsetArray
        ObjectArray = options.ObjectArray ? ObjectArray

        INITIAL_BYTELENGTH = options.byteLength ? INITIAL_BYTELENGTH
        MAXIMUM_BYTELENGTH = options.maxByteLength ? MAXIMUM_BYTELENGTH

        maxByteLength = ( length = MAXIMUM_BYTELENGTH ) ->
            try b = new ArrayBuffer 0, { maxByteLength: length }
            catch e then return maxByteLength length / 1e1
            return MAXIMUM_BYTELENGTH = length 
        
        return [ INITIAL_BYTELENGTH,
        maxByteLength : maxByteLength()
        ]

    allocate    : ( byteLength ) ->
        offset = @byteLength
        length = byteLength + offset
        length += 8 - length%8
        @resize length ; offset

export default memory = new class Memory extends ArrayBuffer

    allocLength : 1024

    constructor : ->
        super 9182, maxByteLength : 1e9
            .createViews()
        
    createViews : ->
        Object.assign this, {
            f32 : new F32Buffer this
            u32 : new U32Buffer this
            u16 : new U16Buffer this
            ui8 : new Ui8Buffer this
        }

    merge   : ( ...objects ) ->
        console.log objects

    