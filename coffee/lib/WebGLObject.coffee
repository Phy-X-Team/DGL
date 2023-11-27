import GL_CONSTANT from "./GL_CONSTANT.js"
export WEBGL_OBJECT_BUFFER          = 1440
export HEADER_BYTELENGTH            = 48

import {
    WenGLBuffer, TypedBuffer, HeaderBuffer
    OffsetArray, ObjectArray

    HEADER_INDEX_OBJECT_SELF
    HEADER_INDEX_OBJECT_CONTEXT
} from "./WebGLMemory.js"

export class BLEND extends GL_CONSTANT
    constructor : -> super 3042


export WebGLMemory = new WenGLBuffer {}

#import memory from "./WebGLMemory.js"
#console.error "memory:", memory

encoder = new TextEncoder()
decoder = new TextDecoder()
    
export WebGLObject = class Buffer extends Number

    TypedArray  : Uint8Array

    @bufferType : WEBGL_OBJECT_BUFFER

    attrsOffset : new Object()
    
    attrsObject : new Object()

    constructor : ( constructor = WebGLObject, parent ) ->
        #console.log "creating:", constructor.name, WebGLMemory.byteLength
        super ObjectArray.length

        unless this instanceof constructor
            Object.setPrototypeOf @, constructor::

        unless ObjectArray.at( this )?
            if parent then @relocate parent
            else @allocate constructor.BUFFER_BYTELENGTH
            
            @setHeaders constructor, parent
        
        return this

    initialize      : ( options = {} ) ->
        this

    setParent       : ( parent ) ->
        unless ! context = parent?.getHeaders().indexContext
            @getHeaders().indexContext = context
        @getHeaders().indexParent = parent ; this

    allocate        : ( byteLength ) ->
        OffsetArray.it @, HEADER_BYTELENGTH + WebGLMemory.allocate byteLength
        ObjectArray.it @, this

    relocate        : ( parent ) ->
        OffsetArray.it @, HEADER_BYTELENGTH + parent.offsetProperty this
        ObjectArray.it @, this

    realloc         : ( byteLength ) ->
        offset = WebGLMemory.allocate byteLength      

    getHeaders      : ->
        HeaderBuffer.buffer this

    setHeaders      : ( constructor, parent ) ->
        offset = OffsetArray.at this
        headers = HeaderBuffer.buffer this

        unless ! ObjectArray.at( parent )?
            headers.indexParent = parent
            unless context = parent.indexContext()
                headers.context = context

        headers.bufferType      = constructor.bufferType
        headers.bufferSize      = constructor.BUFFER_BYTELENGTH
        headers.offsetEnd       = offset + constructor.bufferSize
        headers.offsetData      = offset
        headers.offsetStart     = offset - constructor.HEADER_BYTELENGTH
        headers.indexContext    = @ if /context/i.test constructor.name
        headers.indexSelf       = @
        
        this

    offsetChild     : ( prevChild ) ->
        unless ! prevChild?
            return prevChild.offsetEnd() + HEADER_BYTELENGTH
        @offsetData() + @constructor.bufferSize + HEADER_BYTELENGTH
    
    offsetProperty  : ( property ) ->
        OffsetArray.at( this ) + @attrsOffset[ property.constructor.bufferType ]
    
    bufferSize      : ->
        HeaderBuffer.getBufferSize( this )

    bufferType      : ->
        HeaderBuffer.getBufferType( this )

    offsetStart     : ->
        HeaderBuffer.getOffsetStart( this )

    offsetData      : ->
        HeaderBuffer.getOffsetData( this )

    offsetEnd       : ->
        HeaderBuffer.getOffsetEnd( this )

    indexContext    : ->
        HeaderBuffer.getIndexContext( this )

    indexParent     : ->
        HeaderBuffer.getIndexParent( this )

    indexSelf       : ->
        HeaderBuffer.getIndexSelf( this )

    context         : ->
        HeaderBuffer.objectContext( this )

    parent          : ->
        HeaderBuffer.objectParent( this )

    object          : ->
        HeaderBuffer.objectSelf( this )

    buffer          : ( TypedArray = @TypedArray, trimEnd = 0, skipStart = 0 ) ->
        divisor = TypedArray.BYTES_PER_ELEMENT
        start = skipStart + @offsetData() / divisor
        end = -trimEnd + @offsetEnd() / divisor

        switch TypedArray
            when   Uint8Array then TypedBuffer.Ui8.subarray start, end 
            when  Uint16Array then TypedBuffer.U16.subarray start, end 
            when  Uint32Array then TypedBuffer.U32.subarray start, end 
            when Float32Array then TypedBuffer.F32.subarray start, end 


    get             : ( index = 0, typedArray = @TypedArray ) ->
        offset = HeaderBuffer.getOffsetData this 
        index += offset / typedArray.BYTES_PER_ELEMENT
        typedArray.buffer[ index ]

    set             : ( index, value, typedArray = @TypedArray ) ->
        offset = HeaderBuffer.getOffsetData this 
        index += offset / typedArray.BYTES_PER_ELEMENT
        typedArray.buffer[ index ] = value    

    run             : ( func, ...args ) ->
        console.warn "gl.#{func}(", args.join(", "), ")"
        gl[ func ].apply( gl, args )

    add             : ( index ) ->
        length = @bufferSize() + index.bufferSize()
        target = WebGLMemory.allocate length
        stride = target - @offsetStart()

        TypedBuffer.Ui8.copyWithin target, @offsetStart(), @offsetEnd()
        
        HeaderBuffer.setOffsetStart this, target
        HeaderBuffer.setOffsetData this, start = target + HEADER_BYTELENGTH
        HeaderBuffer.setOffsetEnd this, target + length
        HeaderBuffer.setBufferSize this, length

        OffsetArray.it this, start
        start += @constructor.OBJECT_BYTELENGTH

        TypedBuffer.Ui8.copyWithin start, index.offsetStart(), index.offsetEnd()

        i = 0
        children = null
        loop

            console.log i, index.offsetData()
            break if i++ > 0

        index.setParent this
        this
        #@copy index.buffer(), offset ; @

        #memory.merge this, i

    copy            : ( buffer, offset = @offsetData() ) ->
        TypedBuffer.Ui8.set buffer, offset ; @

    move            : ( target, bufferSize = @bufferSize() ) ->
        offsetStart = @offsetStart()
        moveLength = target - offsetStart

        TypedBuffer.Ui8.copyWithin target, offsetStart, @offsetEnd()
        HeaderBuffer.moveOffset this, moveLength
            .setBufferSize this, bufferSize

        this

    @object         : ( index ) ->
        ObjectArray.at( index ) if index


    encode          : ( text ) ->
        encoder.encode text
        
    decode          : ( data ) ->
        decoder.decode data

    #TODO too many calls in here
    toString        : ->
        unless typeof @buffer is "function"
            return Number::toString.call this

        @decode @buffer().slice()

    children        : ->
        ObjectArray.at OffsetArray.indexOf( @offsetData() + @constructor.bufferSize + HEADER_BYTELENGTH )
        

Object.defineProperties WebGLObject::, {

    [ "__proto__" ] : get : ->

        offsetStart     : @offsetStart()
        offsetData      : @offsetData()
        offsetEnd       : @offsetEnd()

        indexContext    : @indexContext()
        indexParent     : @indexParent()
        indexSelf       : @indexSelf()
        
        objectContext   : @context()
        objectParent    : @parent()
        objectSelf      : @object()
        
        headerBuffer    : HeaderBuffer.buffer this 
        buffer          : 
            Ui8 : @buffer( Uint8Array )
            U16 : @buffer( Uint16Array )        
            U32 : @buffer( Uint32Array )                        
            F32 : @buffer( Float32Array )

        bufferType      : @bufferType()
        bufferSize      : @bufferSize()

        typedArray          : @TypedArray

        dataBuffer          : @buffer()
        dataBufferByte      : @bufferSize()-@constructor.HEADER_BYTELENGTH
        dataBufferLength    : (@bufferSize()-@constructor.HEADER_BYTELENGTH)/@TypedArray.BYTES_PER_ELEMENT
        dataBufferOffsets   : [ @offsetData(), @offsetEnd() ]
}

Object.defineProperties WebGLObject, {

    BUFFER_BYTELENGTH : get : ->
        @OBJECT_BYTELENGTH + @HEADER_BYTELENGTH  
    
    HEADER_BYTELENGTH : get : ->
        HEADER_BYTELENGTH  
    
    OBJECT_BYTELENGTH : get : -> 
        prototype = Object.getPrototypeOf @
        unless Object.hasOwn this, "bufferSize"
            unless Number is this
                return @bufferSize or 0
            return prototype.OBJECT_BYTELENGTH
        return prototype.OBJECT_BYTELENGTH + @bufferSize

    defineProperty    : value : ->
        
        [ constructor, property, definition ] = arguments
        ( offset = constructor.bufferSize or= 0 )
        ( type = definition.class.bufferType )

        Object.defineProperties constructor::, new Object [ property ] :
            get : -> 
                u32index  = offset/4 + OffsetArray.u32( this )
                u32index += HEADER_INDEX_OBJECT_SELF
                unless index = TypedBuffer.U32[ u32index ]
                    return new WebGLObject definition.class, this
                ObjectArray.at index

            set : ( value ) ->
                console.warn value.getValue?() or value
                @[ property ].setValue value.getValue?() or value

        Object.defineProperties constructor::attrsOffset, [ type ] : value : offset
        Object.defineProperties constructor::attrsObject, [ type ] : value : definition.class
        
        constructor.bufferSize += definition.class.BUFFER_BYTELENGTH
        constructor.bufferSize += 8 - constructor.bufferSize%8

    defineProperties  : value : ->
        [ constructor, definitions ] = arguments

        for property, definition of definitions
            @defineProperty constructor, property, definition

        return constructor
}


export class WebGLParameter extends WebGLObject
    fetch : -> @run "getParameter", @bufferType()   
    apply : ->
        console.warn "applying parameter", ...arguments
        this     


export class WebGLCapability extends WebGLParameter

    TypedArray : Uint32Array
    @bufferSize : 2 * Uint32Array.BYTES_PER_ELEMENT
    
    @gl : [
        GL_CONSTANT
    ]

    check : -> @run "isEnabled", @bufferType()
    apply : ->
        if @getValue() then @enable()
        else @disable() ; return this

    enable : -> @run "enable", @bufferType(); yes
    disable : -> @run "disable", @bufferType(); no

    setValue : -> @isEnabled = arguments[0]    
    getValue : -> @isEnabled

    Object.defineProperty WebGLCapability::, "isEnabled", {
        get : ->
            if !@get(0) and @set(0,1)
                return @set(1, @fetch())
            return Boolean @get(1)

        set : ( value ) ->
            @set 1, value
    }

export class WebGLCampledFloat extends WebGLParameter

    TypedArray : Float32Array
    @bufferSize : 2 * Float32Array.BYTES_PER_ELEMENT

export class WebGLColor extends WebGLParameter

    TypedArray  : Float32Array

    @bufferSize : 16    

    setValue    : -> @rgb = arguments[0]

    getValue    : -> @rgb

    @toDecimal  = ( rgba, alpha = yes ) =>
        Array.from( rgba ).slice(0, alpha and 4 or 3).map (n) -> Math.round n * 0xff

    @toHexadec  = ( rgba, prefix = "#" ) =>
        prefix + Array.from( rgba ).map( (n) -> n.toString(16).padStart(2, 0) ).join ""

    @rgba2hexa  = ( rgba, alpha, prefix ) =>
        WebGLColor.toHexadec WebGLColor.toDecimal(rgba, alpha), prefix    

    Object.defineProperties WebGLColor::, {
        rgb     :
            get : -> Array.from @buffer
            set : -> @buffer = arguments[0]

        hex     : get : -> WebGLColor.rgba2hexa @buffer
        css     : get : -> "rgba(#{WebGLColor.toDecimal(@buffer,no).join(', ')}, #{@get(3)})"

        buffer  :
            get : -> WebGLObject::buffer.call this, Float32Array
            set : -> @buffer.set Array.from( arguments[0] ).flat()
    }

export default WebGLObject
