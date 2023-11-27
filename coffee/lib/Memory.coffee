import "./__proto__.js"
Object::toNumber = ->
    @constructor.name.toNumber()

String::toNumber = ( sum = 0 ) ->
    @split("").map( ( char ) -> sum += char.charCodeAt(0)) ; sum


DEVICE_MEMORY_LENGTH = self?.navigator?.deviceMemory or 1
DEVICE_MAXBYTELENGTH = Math.imul DEVICE_MEMORY_LENGTH , 1e6
DEVICE_MAXINDEXCOUNT = DEVICE_MAXBYTELENGTH / 1e3

HEADERS_LENGTH = 4

BUFFER_UINT8 = 913
BUFFER_UINT16 = 960
BUFFER_UINT32 = 958
BUFFER_FLOAT32 = 1012

HEADER_INDEX_POINTER = 0
HEADER_INDEX_BEGIN = 1
HEADER_INDEX_END = 2
HEADER_INDEX_LENGTH = 3

HEADER_BYTELENGTH = 12


class Ui8Data  extends Uint8Array
class U16Data extends Uint16Array    
class U32Data extends Uint32Array    
class F32Data extends Float32Array    


Object.defineProperties Number::, {
    add : value : ( num ) -> num + this * 1
    offset : value : ( stride = 0 ) ->
        (stride * 1) + ( this * 1 )
        
    begin : value : -> 1 + this * 1
    align : value : ( num = 1 ) ->
        return this unless mod = this % num
        return this + num - mod

    index : value : -> this * 1

    HEADER_INDEX_BEGIN : value : -> this + HEADER_INDEX_BEGIN
    HEADER_INDEX_END : value : -> this + HEADER_INDEX_END
    HEADER_INDEX_LENGTH : value : -> this + HEADER_INDEX_LENGTH
}

export class Memory extends ArrayBuffer

    BUFFER_UINT8 : 913
    BUFFER_UINT16 : 960
    BUFFER_UINT32 : 958
    BUFFER_FLOAT32 : 1012

    constructor : ( maxByteLength = DEVICE_MAXBYTELENGTH ) ->
        memory = super 4096 * 512, { maxByteLength }

        Object.defineProperties this, {

            Ui8Data : {
                enumerate : no, wrieable: no,
                value : new Ui8Data this, 4096
            }

            U16Data : {
                enumerate : no, wrieable: no,
                value : new U16Data this, 4096
            }

            U32Data : {
                enumerate : no, wrieable: no,
                value : new U32Data this, 4096
            }

            F32Data : {
                enumerate : no, wrieable: no,
                value : new F32Data this, 4096
            }

            Pointer : {
                enumerate : no, configurable : no,
                value : class Pointer extends Number
                    HEADERS_LENGTH : HEADERS_LENGTH

                    getMemory  : -> memory
                    getBuffer  : -> memory.getBuffer( this )
                    getHeader  : -> memory.getHeaders( this )[ arguments[0] ]
                    getHeaders : ->
                        memory.getHeaders( this )

                    setHeader  : ( hIndex, hValue ) ->
                        memory.getHeaders( @ )[ hIndex ] = hValue ; @

                    setType    : ( bufferType ) ->
                        memory.getHeaders( @ )[ 3 ] = bufferType ; @


                    index       : ->
                        index = this
                        while index - memory.headers[ index ]
                            index = memory.headers[ index ]
                        index  

                    setIndex       : ( pointer ) ->
                        memory.headers[ this ] = pointer
                    
                    getByteLength : ->
                        memory.headers[ @index() + HEADER_INDEX_LENGTH ] 

                    setByteLength : ( byteLength ) ->
                        hIndex = @index() + HEADER_INDEX_LENGTH

                        if byteLength is @byteLength
                            return byteLength 
                        else memory.headers[ hIndex ] = byteLength

                        byteLength and byteLength = byteLength.align 12
                        pointer = memory.allocate byteLength

                        unless byteOffset = @byteOffset
                            byteOffset = pointer.byteOffset 
                        else pointer.setIndex this
                        
                        @setByteBegin byteOffset
                        @setByteEnd byteOffset + byteLength
                        @setIndex pointer.index()

                        this

                    move        : ( offset ) ->


                    copy        : ( buffer, byteLength ) ->
                        begin = @getByteBegin()
                        buffer = new Uint8Array buffer
                        byteLength ?= buffer.byteLength
                        
                        while i = byteLength--
                            memory.Ui8Data[ begin + i ] = buffer[i]
                        
                        this

                    set         : ( buffer ) ->
                        begin = @getByteBegin()
                        for value, i in new Uint8Array buffer
                            memory.Ui8Data[ begin + i ] = value
                        this

                    getByteBegin : ->
                        memory.headers[ @index() + HEADER_INDEX_BEGIN ] 

                    setByteBegin : ( byteOffset ) ->
                        [ index, begin, end, length ] = @headers

                        if  begin and byteOffset isnt begin
                            memory.Ui8Data.copyWithin byteOffset, begin, end

                        memory.headers[ @index() + HEADER_INDEX_BEGIN ] = byteOffset
                        @setByteEnd byteOffset + length


                        this


                    getByteEnd : ->
                        memory.headers[ @index() + HEADER_INDEX_END ] 

                    setByteEnd : ( byteOffset ) ->
                        memory.headers[ @index() + HEADER_INDEX_END ] = byteOffset


            }

            Headers : {
                enumerate: no, configurable: no,
                value : class Headers extends Uint32Array
            }
        }

        Object.defineProperties this, {

            pointers : {
                enumerate : no, wrieable : no,
                value : new U32Data this, 0, 12 
            }

            headers : {
                enumerate : no, wrieable: no,
                value : new Headers this, 48, 512
            }
        }

        Object.defineProperties Pointer::, {
            buffer  :
                get : -> memory.Ui8Data.subarray @byteOffset, @byteOffset + @byteLength
                set : -> @buffer.set arguments[0]

            dataU32  :
                get : ->
                    begin = @byteOffset/4 + 3
                    end = begin + @byteLength/4
                    memory.U32Data.subarray begin, end
                set : -> @buffer.set arguments[0]

            headers :
                get : ->
                    memory.headers.subarray(
                        begin = memory.headers[ @index() ],
                        begin + HEADERS_LENGTH
                    )
                    
                set : ->
                    @headers.set arguments[0]

            byteOffset :
                get : -> @getByteBegin()
                set : -> @setByteBegin arguments[0]

            byteLength :
                get : -> @getByteLength()
                set : -> @setByteLength arguments[0]
        }
        
        Object.defineProperties Headers::, {

            bufferLength :
                get : -> @[ HEADER_INDEX_LENGTH ]
                set : -> @[ HEADER_INDEX_LENGTH ] = arguments[0] 

            bufferBegin :
                get : -> @[ HEADER_INDEX_BEGIN ]
                set : -> @[ HEADER_INDEX_BEGIN ] = arguments[0]

            bufferType :
                get : -> @[ HEADER_INDEX_TYPE ]
                set : -> @[ HEADER_INDEX_TYPE ] = arguments[0]        

            bufferEnd :
                get : -> @[ HEADER_INDEX_END ]
                set : -> @[ HEADER_INDEX_END ] = arguments[0]        
        }
        
        @pointers[0] = 12      #TODO inital index
        @pointers[1] = 12      #TODO allocated
        @pointers[2] = 4096    #TODO data offset
        
    allocate    : ( byteLength, TypedArray = Uint8Array ) ->

        length = byteLength and byteLength.align 12
        begin = @pointers[1].align 12
        end = @pointers[1] = ( begin + length or 0 ).align 12


        @headers[ pointer = @pointers[0] ] =
            @pointers[0] += HEADERS_LENGTH
        
        @headers[ pointer + HEADER_INDEX_POINTER ] = pointer
        @headers[ pointer + HEADER_INDEX_LENGTH ] = length
        @headers[ pointer + HEADER_INDEX_BEGIN ] = begin
        @headers[ pointer + HEADER_INDEX_END ] = end

        new @Pointer pointer

    relocate        : ( bufferSize, index ) ->
        unless begin = @headers[ index + 1 ]
            throw /UNDEFINED_BEGIN:/ + index
        
        else if @headers[ index + 3 ] - bufferSize
            throw /UNMATCHED_LENGTH:/ + bufferSize

        new @Pointer index

    merge           : ( ...pointers ) ->
        length = 0
        length += @getHeader i, HEADEr @headers.at i + 3 for i in pointers
        
        $index = @allocate length
        target = @headers.at $index + 1
        
        for i in pointers
            

            [ begin, end, length ] =
                headers = @getHeaders i             

            @Ui8Data.copyWithin target, begin, end 

            headers[0] = target
            headers[1] = target += length

        $index

    add             : ( pointer, buffer ) ->
        [ begin, end, length ] = @getHeaders pointer
        $index = @grow pointer, length + buffer.byteLength        
        [ $begin, $end, $length ] = @getHeaders $index 

        $index.buffer.set buffer, length
        $index

    gro2w             : ( index, byteLength ) ->
        length = @headers[ index.offset HEADER_INDEX_LENGTH ]
        length = byteLength + length

        $index = @allocate length
        
        @Ui8Data.copyWithin(
            @headers[ index.offset HEADER_INDEX_LENGTH ],
            @headers[ index.offset HEADER_INDEX_BEGIN ],
            @headers[ index.offset HEADER_INDEX_END ]
        )

        [ begin, end, length ] = @getHeaders $index

        @headers[ index.offset HEADER_INDEX_LENGTH ] = length
        @headers[ index.offset HEADER_INDEX_BEGIN ] = begin
        @headers[ index.offset HEADER_INDEX_END ] = end

        @headers[ index ] = @headers[ $index ]
        
        $index

    setUint32       : ( pointer, index, value ) ->
        offset = @headers[ @headers[ pointer ] + HEADER_INDEX_BEGIN ]
        offset /= 4
        offset += HEADERS_LENGTH

        @U32Data[ offset + index ] = value ; pointer

    getUint32       : ( pointer, index ) ->
        offset = @headers[ @headers[ pointer ] + HEADER_INDEX_BEGIN ]
        offset /= 4
        offset += HEADERS_LENGTH
        
        @U32Data[ offset + index ]


    getBuffer       : ( pointer, TypedArray = Uint8Array, offset = 0, length ) ->
        [ begin, end, $length ] = @getHeaders pointer 

        length ?= $length
        begin += offset
        end = begin + length

        if  TypedArray is Uint8Array
            return @Ui8Data.subarray begin, end

        if  TypedArray is Float32Array
            return @F32Data.subarray begin/4, end/4

    getHeaders   : ( pointer ) ->
        @headers.subarray pointer.offset(), @headers[ pointer ]
        

    getLength       : ( index ) ->
        length = @getHeader 2
        type = @getHeader 3

        return length if type is BUFFER_UINT8

        length /= 2
        return length if type is BUFFER_UINT16
        
        length /= 2
        return length if type is BUFFER_FLOAT32
        return length if type is BUFFER_UINT32

        length

    getHeader       : ( index, hIndex ) ->

        @getHeaders( index )[ hIndex ]

    setHeader       : ( index, hIndex, hValue ) ->
        @getHeaders( index )[ hIndex ] = hValue



        
export default Memory