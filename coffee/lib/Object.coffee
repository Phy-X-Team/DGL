import * as window from "./Native.js"

export HEADERS_LENGTH = 2
export HEADERS_BYTELENGTH = 8

export TYPE_BUFFER_POINTER = 7681

export BUFFER = 20
export BOOLEAN = 21

export NUMBER = 22
export FLOAT32 = 23
export UINT32 = 24

export STRING = 30
export ARRAY = 40
export INT8ARRAY = 41
export UINT8ARRAY = 42
export INT16ARRAY = 43
export UINT16ARRAY = 44
export INT32ARRAY = 45
export UINT32ARRAY = 46
export FLOAT32ARRAY = 47
export FLOAT64ARRAY = 48

export OBJECT = 60

encoder = new window.TextEncoder()
decoder = new window.TextDecoder()

export class Buffer extends window.Number        

    window.Number[ @class = BUFFER ] = this
    
    @typedArray = window.Uint8Array
    @byteLength = 0
    @headLength = 2

    constructor : ( constructor , byteLength = 0 ) ->
        super mem.alloc constructor, byteLength
    
    toString        : ->
        console.error "toStringgg", this ; super()

    value           : -> @get()

    toByteLength    : ( length ) ->
        ( length * 1 ).toByteLength( @constructor )

    alloc           : ( byteLength = 0 ) ->
        parseFloat( byteLength ).alloc @constructor, @headLength() 

    window.Object.defineProperties Buffer::, {
        "[[Instance]]" : get : ->
            [Symbol("Native")]: @get()
            [Symbol("Pointer")]: @getPointer().dump( this )
            Buffer : @getBuffer()
            Headers : @getHeaders()
    }

    
export class Boolean extends Buffer
    
    window.Number[ @class = BOOLEAN ] = this

    @byteLength = 4
    @typedArray = window.Uint32Array
    
    constructor : ( value, constructor = Boolean ) ->
        super( constructor ) . set( value )

    getBuffer   : -> @subUint32( @typeOffset(4) , @typeOffset(4) + 1)

    set         : ( value ) ->
        return @setUint32 0, 3   if value is undefined
        return @setUint32 0, 2   if value is null
        return @setUint32 0, 1   if value is yes
        return @setUint32 0, 0   if value is no
        @set !! value

    get         : ->
        value = @getUint32 0
        return no               if 0 is value
        return yes              if 1 is value
        return null             if 2 is value
        return undefined        if 3 is value
        value

    window.Boolean::toPointer = -> new Boolean this

export class Number extends Buffer

    window.Number[ @class = NUMBER ] = this

    window.Number::toPointer = ->
        unless window.Number.isInteger this
            return new Float32 this
        return new Uint32 this
    
    @typedArray = window.Uint32Array
    @byteLength = 8

    TYPED_INDEX = 0
    BIGINT_INDEX = 1
    
    constructor : ( value, constructor ) ->
        unless constructor
            return value.toPointer()

        super( constructor, constructor.byteLength )
            #TODO.setNumberType constructor.class
            #!!.setNumberType constructor.class

    getNumberType : -> @getHeader TYPED_INDEX

    setNumberType : -> @setHeader TYPED_INDEX, arguments[0]

export class Float32 extends Number

    window.Number[ @class = FLOAT32 ] = this

    @typedArray = window.Float32Array

    constructor : ( value, constructor = Float32 ) ->
        super( value, constructor ) . set( value )            

    set         : -> @setFloat32( 0, arguments[0] ) ; this
    
    get         : -> @getFloat32( 0 )


export class Uint32 extends Number

    window.Number[ @class = UINT32 ] = this

    @typedArray = window.Uint32Array

    constructor : ( value, constructor = Uint32 ) ->
        super( value, constructor ) . set( value )

    set         : -> @setUint32( 0, arguments[0] ) ; this
    
    get         : -> @getUint32( 0 )



export class String extends Buffer

    window.Number[ @class = STRING ] = this

    @typedArray = window.Uint8Array

    LENGTH_INDEX = 0
    
    constructor : ( value, constructor = String ) ->
        super( constructor ) . set( value )

    getLength   : ->
        @getHeader LENGTH_INDEX

    setLength   : ( length ) ->
        @setHeader LENGTH_INDEX, arguments[0] ; this 
        
    @decode     : ( buffer ) ->
        decoder.decode buffer
        
    @encode     : ( string ) ->
        encoder.encode string

    detach      : ->
        @getBuffer().slice 0, @getLength()

    set         : ( text ) ->
        buffer = String.encode text
        length = buffer.byteLength


        @resize length 
            .setBuffer buffer
            .setLength length

        this
        
    get         : ->
        @toString()

    toString        : ->
        String.decode @detach()

    window.String::toPointer = -> new String this

export class Uint32Array extends Buffer

    window.Number[ @class = UINT32ARRAY ] = this

    window.Uint32Array::toPointer = -> new Uint32Array this

    @typedArray = window.Uint32Array

    LENGTH_INDEX = 0
    OFFSET_INDEX = 1
    
    constructor : ( length = 0, constructor = Uint32Array ) ->
        byteLength = length.toByteLength constructor
        
        super constructor , byteLength
            .setLength length 

    getBuffer   : ->
        @subUint32()

    getLength   : ->
        @getHeader LENGTH_INDEX

    setLength   : ( length ) ->
        @setHeader LENGTH_INDEX, arguments[0] ; this


    getOffset   : ->
        @getHeader OFFSET_INDEX

    setOffset   : ( offset ) ->
        @setHeader OFFSET_INDEX, arguments[0] ; this

    set         : ( array = [], offset = 0 ) ->
        offset = offset or @getOffset()
        length = array.length

        unless @getLength() > offset + length
            @resize @toByteLength offset + length 
                .setLength length = offset + length 

        @setOffset offset + array.length
            .getBuffer().set array , offset

        this
        
    get         : ->
        @getBuffer()
    
    push        : ( ...items ) ->
        @set items , @getOffset()

    at          : ( index, value, buffer ) ->
        buffer = buffer or @getBuffer()
        return buffer[ index ] unless value
        buffer[ index ] = value ; return value

    forEach     : ( exec = -> ) ->
        for item, index in items = @get()
            exec item, index, items, this
        this

    map         : ( exec = -> ) ->
        for item, index in items = @get()
            items[ index ] = exec item, index, items, this
        this



export class Array extends Uint32Array

    window.Number[ @class = ARRAY ] = this

    constructor : ( options = 0, constructor = Array ) ->
        type = typeof options

        if  type is "number"
            length = options

        else if type is "object"
            length = options.length

        super length , constructor
        
        if  length > 0
            for item in options
                @push item

        return this . proxy()

    push        : ( ...items ) ->
        for item , index in items
            unless item instanceof Buffer
                item = item.toPointer()
            items[ index ] = item.index()

        @set( items , @getOffset() )

    get         : ->
        buffer = @getBuffer()
        for pointer, index in buffer
            continue unless pointer
            pointer.toObject().get()

    forEach     : ( exec = -> ) ->
        buffer = @getBuffer()
        for pointer, index in buffer
            continue unless pointer
            exec pointer.toObject(), index, buffer

    map         : ( exec = -> ) ->
        buffer = @getBuffer()
        for pointer, offset in buffer
            continue unless pointer
            object = pointer.toObject() 
            object.set exec object, offset, buffer
            buffer[ offset ] = object.index()
        this

    at          : ->
        super( ...arguments ).toObject()

    proxy       : -> new Proxy this,
        get : ( $ , key ) =>

            if "function" is typeof e = @[ key ]
                return ( (c) -> -> e.apply( c, arguments ) )( this )

            return unless @getLength() > index = key * 1
            @getUint32( index ).toObject()

        set : ( $ , key , value ) =>
            index = key * 1

            unless @getLength() > index
                throw /BOUNDING_BOUNCE_OFFSET/ + key 
            return @at index, value

    children    : ->
        buffer = @getBuffer()
        @getOffset().iterate (i) =>
            buffer[i].getPointer().getObject()





UNMATCHED           = new (class UNMATCHED      extends window.Number)( 81 )    
MATCH_BY_INDEX      = new (class MATCH_BY_INDEX extends window.Number)( 86 )    
MATCH_BY_VALUE      = new (class MATCH_BY_VALUE extends window.Number)( 87 )    
MATCH_BY_WEAK       = new (class MATCH_BY_WEAK extends window.Number)( 88 )    
MATCH_BY_OBJECT     = new (class MATCH_BY_OBJECT extends window.Number)( 89 )    
MATCH_BY_CONTENT    = new (class MATCH_BY_CONTENT extends window.Number)( 88 )    

KEY_INDEX_MATCH    = new (class MATCH_BY_CONTENT extends window.Number)( 88 )    
KEY_POINTER_MATCH    = new (class MATCH_BY_CONTENT extends window.Number)( 88 )    
KEY_PRIMITIVE_MATCH    = new (class MATCH_BY_CONTENT extends window.Number)( 88 )    
KEY_PRIMITIVE_WEAK_MATCH    = new (class MATCH_BY_CONTENT extends window.Number)( 88 )    

TYPE_OF_KEY     = new (class TYPE_OF_KEY    extends window.Number)( 88 )    
TYPE_OF_VALUE   = new (class TYPE_OF_VALUE  extends window.Number)( 89 )    

export class Obsect extends Array

    window.Number[ @class = OBJECT ] = this
    window.Object::toPointer = -> new Obsect this

    @typedArray = window.Uint32Array

    LENGTH_INDEX = 0
    OFFSET_INDEX = 1
    
    constructor : ( object = {}, constructor = Obsect ) ->

        keys = window.Object.keys object
        length = keys.length * 2 #? key & value

        super length , constructor
        
        for key in keys
            @assign key, object[ key ]

        return this . proxy()

    proxy       : -> new Proxy this,
        get : ( $ , key ) =>

            if "function" is typeof e= @[ key ]
                return ( (c) -> -> e.apply( c, arguments ) )( this )

            index = 0

            return if index is length = @getLength()
            while index < length
                if key is @getUint32( index ).toPrimitive()
                    return @getUint32( index + 1 ).toObject()
                else index = index + 2
            return undefined

        set : ( $ , key , value ) =>
            unless ! find = @find key 
                return find.value.set value 
            return @assign key, value

    assign      : ( key, value ) ->

        unless key instanceof Buffer
            key = key.toPointer()
        
        unless value instanceof Buffer
            value = value.toPointer()

        @push key, value

    toPrimitive : -> @get()

    get         : ( pointers = no ) ->
        object = {} ; key = null
        for item, i in @children()
            unless i % 2 then key = item
            else 
                if pointers then object[ key*1 ] = item
                else object[ key.get() ] = item.get()
        object

    findKey     : ( key ) ->
        for item, i in @getBuffer()
            unless item.toPrimitive() is key
                continue
            return @at( i + 1 )
        return undefined

    find        : ( search, weak = no ) ->
        index = 0
        value = search

        if  search instanceof Buffer
            index = search.index()
            value = search.get()
        
        result =
            i : -1
            key : null
            match : UNMATCHED
            value : undefined
            pointer : undefined

        for item, i in list = @children()

            unless value then break

            else if (item is search)
                result.match = MATCH_BY_OBJECT

            else if (item.index() is index)
                result.match = MATCH_BY_INDEX
            
            else if (item.value() is value)
                result.match = MATCH_BY_VALUE

            else if `item.value() == value` and weak
                result.match = MATCH_BY_WEAK

            else continue

            if (result.i = i) % 2
                result.key = list[ i - 1 ]
                result.type = TYPE_OF_VALUE
                result.value = item

            else 
                result.key = item
                result.type = TYPE_OF_KEY
                result.value = list[ i + 1 ]

            result.pointer = result.value.getPointer()
            result.data = 
                [ result.key.get() ] : result.value.get()
            
            return result

        return undefined

export class Object extends Obsect



export default Buffer
