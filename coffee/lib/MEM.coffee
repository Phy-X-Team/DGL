export HEADERS_LENGTH = 8
export HEADERS_BYTELENGTH = 16

export OFFSET_INDEX = 1
export FINISH_INDEX = 2
export LENGTH_INDEX = 3

export OBJECT_TYPE_INDEX = 4
export TYPED_ARRAY_INDEX = 5
export HEAD_LENGTH_INDEX = 6
export BODY_LENGTH_INDEX = 7

export POINTER = 6647

ROOT = NaN.constructor
POINTER_LINK_JUMP = yes #* /ACTIVE/


import * as window from "./Native.js"

window.Uint8Array.objectType = 8001
window.Uint32Array.objectType = 32001
window.Float32Array.objectType = 32003




headers = new ( class Headers extends window.Uint32Array ) 1e5
console.error headers:headers


BYTE_OFFSET = 0
INDEX_OFFSET = 0

Handler = class Pointer extends window.Number

    get : ->
        [ object , key , proxy ] = arguments
        console.warn key, this, object, proxy
        
        if  key is "index"
            i = headers[ object * 1 ] 
            i = headers[ i ] while i - headers[i]
            return i

        return this if key is "pointer"
        return proxy if key is "proxy"
        return object if key is "object"

        #! Object.hasOwn(@, key) and
        if  e = object[ key ]
            unless typeof e is "function"
                result = e
            else
                try result = -> e.call proxy , ...arguments
                catch e then result = e

        else if e = object.GET[ key ]
            try result = e.call proxy , ...arguments
            catch e then result = e

        else if e = this.GET[ key ]
            try result = e.call proxy , ...arguments
            catch e then result = e

        else if e = this[ key ]
            unless typeof e is "function"
                result = e
            else
                try result = -> e.call proxy , ...arguments
                catch e then result = e
                        
        else result = object[ key ]

        console.error { e: e }, object[ key ]?.name, object:object, result:result
        
        return result

    GET             :

        byteLength  : ->
            console.warn @index, @index + LENGTH_INDEX
            headers[ @index + LENGTH_INDEX ]

        byteFinish  : -> headers[ @index + FINISH_INDEX ]

        byteOffset  : -> headers[ @index + OFFSET_INDEX ]

        index      : ->
            i = headers[ @pointer ]
            i = headers[i] while i - headers[i] ; i 

    byteLength      : -> @GET.byteLength()
    byteOffset      : -> @GET.byteOffset()
    byteFinish      : -> @GET.byteFinish()

    set : ->
        console.log "setting from pointer", this, arguments:arguments

    put : ( value ) ->
        console.log "putting from pointer", this, arguments:arguments

    toPrimitive     : ->
        console.log "to primitive from pointer", ...arguments

    toString        : ->
        console.error "To strinnngngngngn", ...arguments, this
        super()

    alloc           : ( byteLength ) ->
        byteLength = byteLength
        byteOffset = BYTE_OFFSET
        byteFinish = BYTE_OFFSET += byteLength

        index = INDEX_OFFSET += HEADERS_LENGTH

        headers[ index ] = index
        headers[ index + OFFSET_INDEX ] = byteOffset
        headers[ index + FINISH_INDEX ] = byteFinish
        headers[ index + LENGTH_INDEX ] = byteLength

        new Pointer index

    resize          : ( byteLength ) ->

        if  byteLength
            pointer = @alloc byteLength

            
            console.log "pointer:", pointer, headers[pointer]

        unless  @byteLength is byteLength
            if  @byteLength or byteLength
                @memory.copyWithin pointer.byteOffset, @byteOffset, @byteFinish
            headers.copyWithin @index, i = pointer.index, i + HEADERS_LENGTH
        
        return @proxy

    valueOf     : -> headers[ @index ]

pointerOffset = 0
class BufferObject extends window.Number

    constructor : ( value, index ) ->

        unless index
            index = INDEX_OFFSET += HEADERS_LENGTH
            revoc = Proxy.revocable super( index ), new Handler index
        else    
            Proxy.revocable super( index ), new Handler index
        
        @put.call( revoc.proxy, value )
        
        return revoc.proxy

        #revoc.revoke

    GET         :
        length  : -> @byteLength / @BYTES_PER_ELEMENT
            
    valueO2f     : -> headers[ this * 1 ]


window.Object.defineProperties window.Number::,

    toChar          : value : ->
        window.String.fromCharCode this

    toStrin2g        : value : ->
        console.error "To strinnngngngngn", ...arguments, this
        headers[ this * 1 ] + ""

    valueO2f         : value : ->
        console.error "valueofff", this * 1
        headers[ this * 1 ]


window.Object.defineProperties BufferObject::,
    isObject : { enumerable : no, writable: yes, value : yes }
    isPointer : { enumerable : no, writable: yes, value : no }
    isPrimitive : { enumerable : no, writable: yes, value : no }

window.Object.defineProperties Pointer::,
    isObject : { enumerable : no, writable: yes, value : no }
    isPointer : { enumerable : no, writable: yes, value : yes }
    isPrimitive : { enumerable : no, writable: yes, value : no }

window.Object.defineProperties window.Object::,
    isObject : { enumerable : no, writable: no, value : no }
    isPointer : { enumerable : no, writable: no, value : no }
    isPrimitive : { enumerable : no, writable: no, value : yes }


export class Memory extends ArrayBuffer

    BufferObject    : ( BufferObject )
    TypedArray      : ( class TypedArray   extends this::BufferObject )



    Uint8Array      :   class Uint8Array   extends this::TypedArray
        BYTES_PER_ELEMENT : 1

    Uint16Array     :   class Uint16Array  extends this::TypedArray
        BYTES_PER_ELEMENT : 2

    Uint32Array     :   class Uint32Array  extends this::TypedArray
        BYTES_PER_ELEMENT : 4
        
    Float32Array    :   class Float32Array extends this::TypedArray
        BYTES_PER_ELEMENT : 4
        


    String : class String extends this::Uint8Array

        @fromCharCode   = window.String.fromCharCode

        value : ( value ) ->
            console.log "set from string", ...arguments

        encode          : ( string ) ->
            array = [] ; length = 0

            for char in string.split ""
                code = char.charCodeAt 0
                next = code % 0xff

                unless next - code
                    array[ length ] = code
                    length = length + 1

                else
                    array[ length + 1 ] = next
                    length = length + 2

            [ array , length ]
            
        decode          : ( buffer ) ->
            length = buffer.length ; i = 0
            string = ""

            while i < length  
                unless code = buffer[ i++ ]
                    code = 0xff + buffer[ i++ ]
                string = string + code.toChar()

            string

        put : ( value ) ->

            return @setObject    value if value.isObject
            return @setPointer   value if value.isPointer
            return @setPrimitive value if value.isPrimitive

            throw /UNDEFINED_KIND_OF_OBJECT/ + value   

        setPrimitive    : ( string ) ->
            [ array, length ] = @encode string
            console.warn @resize length
            @buffer

        setPointer      : ( pointer ) ->
            console.log "put pointer", pointer
        
        setObject       : ( object ) ->
            console.log "put object", object

        toPrimitive : -> @decode @buffer()
        
    Object : class Map extends BufferObject
        set : ( value ) ->
            console.log "set from object", ...arguments

        get : ( value ) ->
            console.log "get from object", ...arguments

        put : ( value ) ->
            console.log "put from object", ...arguments

        toPrimitive : ->
            console.log "to primitive from object buffer", ...arguments

    constructor : ->

        unless ! window.Object.hasOwn ROOT::, "alloc"
            throw /MULTIPLE_MEMORIES_NOT_IMPLEMENTED_YET/ 

        super 1e6, maxByteLength: 1e8

        u32 = new  window.Uint32Array this
        u16 = new  window.Uint16Array this
        f32 = new window.Float32Array this

        @constructor::Uint8Array::memory =
            new window.Uint8Array this


        ###
        class Pointer extends ROOT
            
            ROOT[ @class = POINTER ] = this

            @typedArray = Uint8Array
            @byteLength = 0
            @headLength = 0

            getHeaders      : ->
                pointers.subarray @index(), @index() + HEADERS_LENGTH
                
            toPrimitive     : ->
                @getObject().get()

            window.Object.defineProperties Pointer::, {
                dump     :
                    value    : ( object ) ->
                        index       : @index()
                        buffer      : @getBuffer()
                        
                        object          : object
                        objectBuffer    : object.getBuffer()
                        objectHeaders   : object.getHeaders()
                        objectPointer   : object.getPointer()

                        headers     : @getHeaders()
                        byteOffset  : @byteOffset()
                        byteLength  : @byteLength()
                        byteFinish  : @byteFinish()
                        objectType  : @objectType()

                        Uint8Array : try ui8.subarray @byteOffset(), @byteFinish()
                        Uint32Array : try u32.subarray @typeOffset(4), @typeFinish(4)
                        Float32Array : try f32.subarray @typeOffset(4), @typeFinish(4)

            }


        window.Object.defineProperties Memory::,
            
            alloc           :
                value       : ( constructor = Pointer, byteLength = 0 ) ->
                    ++memory.pointerCount

                    memory.pointerOffset += HEADERS_LENGTH
                    memory.pointerOffset += constructor.headLength or 0
                    memory.pointerOffset += 4 - memory.pointerOffset % 4

                    index = memory.pointerOffset

                    unless byteLength

                        byteOffset =
                        byteFinish = memory.byteOffset
    
                    else if byteLength % constructor.typedArray.BYTES_PER_ELEMENT
                        throw /BYTELENGTH_MUST_BE_MULTIPLE_OF_/ + constructor.name

                    else
                        byteOffset = memory.byteOffset += 8 - memory.byteOffset % 8
                        byteFinish = memory.byteOffset += byteLength

                    pointers[ index ] = 0

                    pointers[ index + OFFSET_INDEX ] = byteOffset
                    pointers[ index + FINISH_INDEX ] = byteFinish
                    pointers[ index + LENGTH_INDEX ] = byteLength

                    pointers[ index + OBJECT_TYPE_INDEX ] = constructor . class
                    pointers[ index + TYPED_ARRAY_INDEX ] = constructor . typedArray . objectType

                    pointers[ index + HEAD_LENGTH_INDEX ] = constructor . headLength
                    pointers[ index + BODY_LENGTH_INDEX ] = byteLength

                    new Pointer index 

        window.Object.defineProperties ROOT::, {
            
            testOffset      : 
                value       : ( num ) ->
                    unless ROOT.isInteger num
                        throw /NUMBER_IS_FLOATED_/ + num
                    return num

            toByteLength    : 
                value       : ( constructor = Uint8Array, align ) ->
                    return 0 unless length = this * 1
                    return length if 1 is bytes = constructor.typedArray.BYTES_PER_ELEMENT
                    unless no is align then length += bytes - length % bytes
                    return length * bytes

            toObject        :
                value       : ->
                    return unless index = this * 1
                    object = index.getPointer().getObject()
                    return object unless object.proxy
                    object.proxy()


            toPrimitive     :
                value       : ->
                    ( this * 1 ).getPointer().getObject().get()

            alloc           :
                value       : ( constructor = Pointer ) ->
                    Memory::alloc constructor , this * 1

            copy            :
                value       : ( target ) ->
                    @getPointer().copy( target )

            iterate         :
                value       : ( exec = -> ) ->
                    exec i for i in [ 0 ... this ]

            resize          :
                value       : ( byteLength ) ->
                    constructor = @getConstructor()
                    pointer = byteLength.alloc constructor

                    ui8.copyWithin( pointer.byteOffset()
                        @byteOffset(), @byteFinish()
                    )

                    @setPointer pointer

            align           :
                value       : ( number ) ->
                    unless this % number
                        return this
                    this + number - this % number

            
            index           :
                value       : ( i = this * 1 ) ->
                    return i unless POINTER_LINK_JUMP 
                    i = pointers[i] while pointers.at i ; i

            setPrototype    :
                value       : ( prototype ) ->
                    window.Object.setPrototypeOf this , prototype

            getPrototype    :
                value       : ->
                    @getConstructor() . prototype

            getConstructor  :
                value       : ->
                    ROOT[ @objectType() ] ? Pointer

            getObject       :
                value       : ->
                    @setPrototype @getPrototype()
            
            getPointer      :
                value       : ->
                    new Pointer( this * 1 )
            
            setPointer      :
                value       : ( object ) ->
                    index = @index()
                    pointer = object.getPointer()

                    if   POINTER_LINK_JUMP
                         pointers[ index ] = pointer
                    else 
                         pointers.set pointer.getHeaders(), index
                        
                    return this
                    #@getPointer().getHeaders().set pointer.getHeaders() ; this

            getHeaders      :
                value       : ->
                    offset = @index()

                    headLength = @headLength() + HEADERS_LENGTH
                    headers = pointers.subarray offset , offset + headLength

                    headLength = @headLength() or HEADERS_LENGTH
                    headers.subarray -headLength 

            setHeaders      :
                value       : ( arrayLike ) -> 
                    @getHeaders().set arrayLike ; this
                    # [ index, offset, length, end ]

            setHeader       :
                value       : ( index, value ) -> 
                    @getHeaders()[ index ] = value

            getHeader       :
                value       : ( index ) -> 

                    @getHeaders()[ index ]


            getBuffer       :
                value       : -> @subUint8()

            setBuffer       :
                value       : -> @getBuffer().set ...arguments ; this




            byteOffset      :
                value       : -> pointers[ @index() + OFFSET_INDEX ]
            
            byteFinish      :
                value       : -> pointers[ @index() + FINISH_INDEX ]
            
            byteLength      :
                value       : -> pointers[ @index() + LENGTH_INDEX ]



            objectType      :
                value       : -> pointers[ @index() + OBJECT_TYPE_INDEX ]

            typedArray      :
                value       : -> pointers[ @index() + TYPED_ARRAY_INDEX ]
            
            headLength      :
                value       : -> pointers[ @index() + HEAD_LENGTH_INDEX ]

            bodyLength      :
                value       : -> pointers[ @index() + BODY_LENGTH_INDEX ]



            typeOffset      :
                value       : ( byte ) -> @testOffset @byteOffset() / byte
            
            typeFinish      :
                value       : ( byte ) -> @testOffset @byteFinish() / byte
            
            typeLength      :
                value       : ( byte ) -> @testOffset @byteLength() / byte


            subUint8        :
                value       : ( begin, end ) -> ui8.subarray begin ? @byteOffset(), end ? @byteFinish()

            getUint8        :
                value       : ( index ) -> ui8[ index + @byteOffset() ]

            setUint8        :
                value       : ( index, value ) -> ui8[ index + @byteOffset() ] = value ; value

            
            getUint16       :
                value       : ( index ) -> u16[ index + @typeOffset(2) ]
            
            setUint16       :
                value       : ( index, value ) -> u16[ index + @typeOffset(2) ] = value
                

            subUint32       :
                value       : ( begin, end ) -> u32.subarray begin ? @typeOffset(4), end ? @typeFinish(4)
            
            getUint32       :
                value       : ( index ) -> u32[ index + @typeOffset(4) ]
            
            setUint32       :
                value       : ( index, value ) -> u32[ index + @typeOffset(4) ] = value
                

            subFloat32      :
                value       : ( begin, end ) -> f32.subarray begin ? @typeOffset(4), end ? @typeFinish(4)

            getFloat32      :
                value       : ( index ) -> f32[ index + @typeOffset(4) ]
            
            setFloat32      :
                value       : ( index, value ) -> f32[ index + @typeOffset(4) ] = value
                
        }
        ###

export default Memory