import TYPE from "./constants.js"


global.cache = new class BufferStorage extends window.Array
    
    add : -> this[ @length ] = arguments[0]

    get : ( i ) ->
        for o in @ then if i is o.id
            return o 





log = -> console.log ...arguments
warn = -> console.warn "\t", ...arguments
error = -> console.error "".padStart(5, "-") + ">", ...arguments


Object.defineProperties window.Object::,
    ["#encode"] : get : -> root.encode this 


Object.defineProperties window.Uint8Array::,

    ["{{textEncode}}"] : get : -> @slice().join " " 
    ["{{textDecode}}"] : get : -> root.decodeString @slice() 
    ["#decode"] : get : -> root.decode @slice() 

    toString : value : -> PhyX::String.decode @slice()
    stringify : value : -> PhyX::String.decode @slice()

Object.defineProperty Function::, "static", value : ->
    for n, definitions of arguments[0] then ((name, exec) ->
        window.Object.defineProperty @prototype, name,
            get : -> exec.get.call( this, ...arguments )
            set : -> exec.set.call( this, ...arguments )
    ).call(this, n, definitions)    

OBJECT_RESIZED_FOR_ALIGN = new (class OBJECT_RESIZED_FOR_ALIGN extends Number)( TYPE.OBJECT_RESIZED_FOR_ALIGN )
NUMBER_RESIZE_NOT_LOGICAL = new (class NUMBER_RESIZE_NOT_LOGICAL extends Number)( TYPE.NUMBER_RESIZE_NOT_LOGICAL )

next = 0
headers = new window.Uint32Array new ArrayBuffer 1e6
buffer = new ArrayBuffer 1e8



headerLength = 4 
headerOffset = 4 
memoryOffset = 0 


bridge = ( id, prototype ) ->

    memory = prototype.MEMORY
    
    get : ( object, key, proxy ) ->
        unless ! PhyX.DEBUG
            console.log ""; console.log ""
            console.group( "🤷‍♂️", "object[key]:", [ object?[key]?.toString().replace(/\r|\n|\s+/g, " ").substr(0,40) ] )  
            console.warn( GET: key, typeofKey: typeof key )
            warn { proto:prototype.name, id, storage: memory.constructor.name, object, proxy:proxy }
            console.groupEnd()
            
        unless "symbol" is typeof key
            unless isNaN( key ) and prototype.isArray
                return memory.at( headers[ id + 1 ] + key * 1 )

        return switch key
            when "id" then id                                   #! [105, 100]
            when "value", "get"
                value = prototype.decode memory.subarray(
                    headers[ id + 1 ], headers[ id + 2 ]
                )
                if key is "value" then value else -> value 
            when "begin"  then headers[ id + 1 ]
            when "end"    then headers[ id + 2 ]
            when "length" then headers[ id + 3 ]
            when "byteOffset" then headers[ id + 1] * prototype.BYTES_PER_ELEMENT
            when "byteFinish" then headers[ id + 2] * prototype.BYTES_PER_ELEMENT
            when "byteLength" then headers[ id + 3 ] * prototype.BYTES_PER_ELEMENT
            when "buffer" then memory.subarray(
                    headers[ id + 1 ], headers[ id + 2 ]
                )
            when "setBuffer" then ( buffer ) =>
                memory.set( buffer, headers[ id + 1 ] ); proxy 
            when "headers" then headers.subarray id, id + headerLength
            else Reflect.get( ...arguments )

    set : ( object, key, value, proxy ) ->
        unless ! PhyX.DEBUG
            console.group( "💁🏻‍♂️" )
            console.error( SET: key )
            warn { proto:prototype.name, id, storage: memory.constructor.name, object, proxy }
            console.groupEnd()

        if "value" is key
            return proxy.set.call proxy, value
        Reflect.set( object, key, value, proxy )
        

    has : -> /has/.then arguments, => Reflect.has( ...arguments )

    apply : -> /apply/.then arguments, => Reflect.apply( ...arguments )
    ownKeys : -> /ownKeys/.then arguments, => Reflect.ownKeys( ...arguments )
    construct : -> /construct/.then arguments, => Reflect.construct( ...arguments )
    isExtensible : -> /isExtensible/.then arguments, => Reflect.isExtensible( ...arguments )

    getPrototypeOf : ( value ) ->
        window.Object.getPrototypeOf value

    setPrototypeOf : -> /setPrototypeOf/.then arguments, => Reflect.setPrototypeOf( ...arguments )
    defineProperty : ->
        [ defineProperty: @, "args ->", ...arguments ].log Reflect.defineProperty( ...arguments )
        
    deleteProperty : -> /deleteProperty/.then arguments, => Reflect.deleteProperty( ...arguments )
    
    preventExtensions : -> /preventExtensions/.then arguments, => Reflect.preventExtensions( ...arguments )
    getOwnPropertyDescriptor : ->
        [ getOwnPropertyDescriptor: @, "args ->", ...arguments ].log Reflect.getOwnPropertyDescriptor( ...arguments )





export default PhyX = class PhyX

    @DEBUG      : false

    __proto__   : null

    dataOffset  : 0
    headOffset  : 8

    indexCount  : 1
    headerSize  : 8

    buffer      : buffer
    headers     : headers

    Shadow          : class Shadow extends window.Number
        u : true        

        resizable   : yes

        @MEMORY = new window.Uint8Array buffer

        @OBJECT_BYTELENGTH = 0 
        @BYTES_PER_ELEMENT = 0

        @instanceof : ( this )

        constructor : ( value, proto = Shadow ) ->

            unless proto.BYTES_PER_ELEMENT
                throw /Root object constructed!/
            
            headers[ id = headerOffset ] = id            
            headerOffset = id + headerLength
            
            proxy = new global.Proxy super(id), bridge id, proto

            #if  value instanceof Shadow
            #    value = value.value
            #! if value instanceof proto

            value = proto.encode.call proxy, value
            Shadow::resize.call proxy, value?.length or 0
            proxy.buffer.set value
            global.cache.push proxy

            return proxy

        set     : ( value ) ->
            buffer = @constructor.encode value
            unless buffer.length is @length
                @resize.call this, buffer.length
            @buffer.set buffer ; this

        resize  : ( length ) ->
            offset = memoryOffset
            pointer = @headers
            itembyte = @constructor.BYTES_PER_ELEMENT

            unless  1 - itembyte
                if  aligns = offset % itembyte
                    offset = offset + itembyte - aligns

                if  aligns = length % itembyte
                    length = length + itembyte - aligns                    
                    error OBJECT_RESIZED_FOR_ALIGN, this

            pointer[ 1 ] = offset
            pointer[ 3 ] = length
            pointer[ 2 ] = pointer[ 1 ] + pointer[ 3 ]

            memoryOffset = pointer[ 2 ]

            this

        toString        : -> "#{ @value }" 

        toArray         : -> window.Array.from @buffer
        
        stringify       : -> @toString()

        bufferize       : -> new window.Uint8Array @buffer.slice().buffer

        is : ( object ) -> @id is object.id

        eq : ( object ) -> @value is object.value

    Boolean         : class Boolean extends Shadow

        resizable   : no

        @OBJECT_BYTELENGTH = 1 
        @BYTES_PER_ELEMENT = 1

        @instanceof : window.Boolean

        constructor : ( value, proto = Boolean ) ->
            super value, proto

        @encode = ( value, array = [] ) ->            
            array[0] = (
                if value is true then 1
                else if value is NaN then 4
                else if value is undefined then 3
                else if value is null then 2
                else if value is no then 0
                else if value.u then value.buffer[0]
                else if typeof value is "object" 
                    window.Object.keys( value ).length > 0
                else 1 * window.Boolean value
            )
            return array

        @decode = ( array ) ->
            [ no, yes, null, undefined, NaN ][ array[0] ]

        [Symbol.toPrimitive] : ( hint ) ->
            console.log "[Symbol.toPrimitive]", this, hint: hint

            try
                if  hint is "number"
                    return @value * 1

                if  hint is "string"
                    return "#{ @value }"

                if  hint is "default"
                    return @value
                
            return @value

    TypedArray      : class TypedArray extends Shadow

        resizable   : yes

        @isArray    : yes

        valueOf     : -> @buffer

        @encode     : ( value = 0 ) ->
            if  typeof value is "number"
                return new window.Array( value ).fill( 0 )
            
            if  typeof value is "object"
                return window.Object.values value
            
            new window.Array()

        @decode     : ( value ) ->
            value

        fill        : ( value ) ->
            @buffer.fill( value )

        sum         : ( start = 0 ) ->
            start += num for num in @buffer ; start

        [Symbol.toPrimitive] : ( hint ) ->
            console.log "[Symbol.toPrimitive]", this, hint: hint, arguments:arguments

            return @id if hint is "number"
            return @toString() if  hint is "string"
            return @buffer if hint is "default"
                

    Uint8Array      : class Uint8Array extends TypedArray

        @MEMORY = new window.Uint8Array buffer
    
        @BYTES_PER_ELEMENT = 1
        @OBJECT_BYTELENGTH = 1

        @instanceof : window.Uint8Array

        constructor : ( value, proto = Uint8Array ) ->
            super value, proto

    Uint32Array     : class Uint32Array extends TypedArray

        @MEMORY = new window.Uint32Array buffer

        @BYTES_PER_ELEMENT = 4
        @OBJECT_BYTELENGTH = 4

        @instanceof : window.Uint32Array

        constructor : ( value, proto = Uint32Array ) ->
            super value, proto

    Float32Array    : class Float32Array extends TypedArray
    
        @MEMORY = new window.Float32Array buffer

        @BYTES_PER_ELEMENT = 4
        @OBJECT_BYTELENGTH = 4

        @instanceof : window.Float32Array

        constructor : ( value, proto = Float32Array ) ->
            super value, proto
            
    Array           : class Array extends Uint32Array

        @instanceof : window.Array

        constructor : ( value = [], proto = Array ) ->
            super value, proto

        push : ( value ) ->
            console.log this, value

        @encode : ( value, array = [] ) ->
            unless value instanceof Array
                unless value instanceof window.Array
                    value = [ value ]

            for item, index in value
                unless item instanceof Shadow
                    unless BufferObject = PhyX::[item.constructor.name]
                        throw  "Type error"
                    item = new BufferObject item
                array[ index ] = item.id
            array

        
            
    Number          : class Number extends Uint8Array

        resizable   : no

        @BYTES_PER_ELEMENT = 1
        @OBJECT_BYTELENGTH = 8

        [Symbol.toStringTag] : ->
            console.log "[Symbol.toStringTag]", this, arguments:arguments

            "#{ @value }"

        [Symbol.toPrimitive] : ( hint ) ->
            console.log "[Symbol.toPrimitive]", this, hint: hint

            try
                if  hint is "number"
                    return @value

                if  hint is "string"
                    return "#{ @value }"

                if  hint is "default"
                    return @value
                
            return @value

            #TODO Could GL.buffer catch in this trap
        
        @instanceof : window.Number

        constructor : ( value = 0, proto = Number ) ->
            super value, proto

        valueOf : -> Number.decode @buffer

        resize  : -> this

        @encode : ( value, array = [] ) ->

            if  window.Number.isNaN value
                array[0] = 1                                #! NaN
                
            else if window.Number.isFinite value
                
                if !value
                    array[0] = 0                            #! zero
                        
                
                else if window.Number.isInteger value
                    array[0] = 4                            #! uint
                    array.push( 0, 0, 0, ...window.Array.from(
                        new window.Uint8Array( 
                            new window.Uint32Array([ value ]).buffer )
                        )
                    )                    
                
                else
                    array[0] = 5                            #! float
                    array.push( 0, 0, 0, ...window.Array.from(
                        new window.Uint8Array( 
                            new window.Float32Array([ value ]).buffer )
                        )
                    )
            
            else if value < 0
                array[0] = 2                                #! -Infinity
            
            else
                array[0] = 3                                #! +Infinity

            return array

        @decode = ( array ) ->
            if  array[0]  < 4
                return [ 0, NaN, -Infinity, +Infinity ][ array[0] ]

            buffer =
                new window.Uint8Array( array.slice(4) ).buffer

            if  array[0] is 4
                return new window.Uint32Array( buffer )[0]
                
            if  array[0] is 5
                return new window.Float32Array( buffer )[0]
            
    String          : class String extends Uint8Array


        @instanceof : window.String

        constructor : ( value = "", proto = String ) ->
            super value, proto

        @encode = ( string ) ->
            array = [] ; length = 0

            for char in "#{string}".split ""
                code = char.charCodeAt 0
                next = code % 0xff

                unless next - code
                    array[ length ] = code
                    length = length + 1

                else
                    array[ length + 1 ] = next
                    length = length + 2
            array
            
        @decode = ( buffer ) ->
            length = buffer.length ; i = 0
            string = ""
            toChar = window.String.fromCharCode

            while i < length  
                unless code = buffer[ i++ ]
                    code = 0xff + buffer[ i++ ]
                string = string + toChar code

            string

        [Symbol.toPrimitive] : ( hint ) ->
            console.log "[Symbol.toPrimitive]", this, hint: hint

            try
                if  hint is "number"
                    return @id

                if  hint is "string"
                    return "#{ @value }"

                if  hint is "default"
                    return @value
                
            return @value

            #TODO Could GL.buffer catch in this trap