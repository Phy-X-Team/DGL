import TYPE from "./lib/constants.js"
import { BufferEncoder, BufferDecoder } from "../BufferControl/buffer.js"
import { BufferObject } from "../BufferObject/object.js"
import { get } from "./lib/fetch.js"
import { gl } from "./lib/canvas.js"



###
do ->
    bobject = new BufferObject()

    for v, i in float32Array = new Float32Array(10)
        float32Array[ i ] = (Math.random()*100).toPrecision(
            Math.floor( 1 + Math.random()*10 )
        ) * 1

    for v, i in uInt16Array = new Uint16Array(10)
        uInt16Array[ i ] = (Math.random()*255) * 255

    object = {
        float32Array,
        uInt16Array
    }

    console.warn "untouch:", object
    console.warn "encoded:", encoded = encode.encode object
    console.warn "decoded:", decoder.decode encoded


    console.error "bobject:", bobject
    console.warn "_setter (a):", bobject.a = 1123
    console.log "_getter (a):", bobject.a
    console.error "_resetter (a):", bobject.a = 2241
    console.error "_resetter (a):", bobject.a = 55111
    console.error "_resetter (a):", bobject.a = 14
    console.error "_resetter (a):", bobject.a = { a: 5555 }
    console.error "_resetter (a):", bobject.a.a
    console.error "_resetter (a):", bobject.a = "özgür"
    console.error "_resetter (a):", bobject
###

global.setTimeout ->
    Object.defineProperties Buffer::, {
        dump : get : -> @forEach ( object ) -> object.detach?() or object
    }

export class Buffer extends DataView

    this.register           = ( object, bufferType ) ->      
        Buffer::[ object::bufferType = bufferType ] = object 

    headLength              : 6

    constructor             : ( buffer = new ArrayBuffer( 0, { maxByteLength: 1e6 } ), offset, length ) ->
        super buffer, offset, length
            .byteLength or this.create()

    create                  : ( type = @constructor::bufferType, size = 0 ) ->
        length = size + Math.max @headLength, @constructor::headLength
        offset = @allocate length

        @setBufferType type ? TYPE.BUFFER, offset
        @setBufferSize length, offset
        
        offset

    allocate                : ( byteLength ) ->
        unless ! @link
            @link = @link?.allocate byteLength

        length = @byteLength + byteLength
        offset = @byteLength + @byteOffset

        @buffer.resize(
            byteLength + this.buffer.byteLength
        )

        @setBufferSize( length )

        unless ! @byteOffset
        
            buffer = new Uint8Array @buffer, offset
            shifts = buffer.byteLength

            while shifts-- then buffer[ shifts ] = 
                buffer[ shifts - byteLength ]
            buffer = shifts = null

            return new @constructor(
                @buffer, @byteOffset, length
            )
            
        return offset

    getBufferType           : ( offset = 0 ) ->
        @getUint16 offset

    getBufferSize           : ( offset = 0 ) ->
        @getUint32 offset + 2

    setBufferType           : ( type, offset = 0 ) ->
        @setU16 offset, type ; @

    setBufferSize           : ( size = @byteLength, offset = 0 ) ->
        @setU32 offset + 2, size ; @

    getLoopOffset           : ( offset = 0, finish = @byteLength ) ->
        [ offset + Math.max( @headLength, Buffer::[@bufferType]?::headLength ), finish ]
    
    getLoopValues           : ( offset ) ->
        [ @getBufferType( offset ), size = @getBufferSize( offset ), offset + size ]

    object                  : ( offset, type, size ) ->
        type ?= @getBufferType offset ; size ?= @getBufferSize offset
        new Buffer::[ type ]?( @buffer, offset, size ) or @slice offset, size

    detach                  : ( offset = @byteOffset, length = @byteLength ) ->
        new @constructor @slice offset, length

    slice                   : ( offset = 0, length = @byteLength ) ->
        this.buffer.slice offset, offset + length

    forEach                 : ( handler, offset, finish ) ->
        [ offset, finish ] = @getLoopOffset offset, finish
        ( result = new Array() )

        while offset < finish

            [ type, size, next ] = @getLoopValues offset

            if type then break unless (
                result[ index = result.length ] =
                    handler.call( @, @object( offset, type, size ), index )
            )

            offset = next

        return result

    filter                  : ( bufferType, offset, finish ) ->
        [ offset, finish ] = @getLoopOffset offset, finish
        ( result = new Array() )

        while offset < finish

            [ type, size, next ] = @getLoopValues offset

            if  bufferType is type
                result.push @object offset, type, size

            offset = next

        return result        

    find                    : ( bufferType, offset, finish ) ->
        [ offset, finish ] = @getLoopOffset offset, finish
        ( result = new Array() )

        while offset < finish

            [ type, size, next ] = @getLoopValues offset

            if  bufferType is type
                return @object offset, type, size

            offset = next

        return result        

    writeString             : ( string, offset = @byteLength, maxByteLength ) ->

        buffer = new Array()
        
        for char, i in string.split ""
            code = char.charCodeAt 0
            unless 0xff < code then buffer.push code
            else buffer.push 1, code >>> 8 & 0xff, code & 0xff
            break if maxByteLength is length = buffer.length
        
        if  offset + length > @byteLength
            offset = @allocate length
        
        for uint, i in buffer
            @setUi8 offset + i, uint

        this

    readString              : ( offset = 0, maxByteLength = @byteLength ) ->

        string = ""
        
        while offset < maxByteLength
        
            unless 1 - code = @getUint8 offset
                code = @getUint16 offset + 1
                offset = offset + 2

            offset = offset + 1
            string = string + String.fromCharCode code
        
        return string

    writeBuffer             : ( buffer, isView = true ) ->
        offset = @allocate length = buffer.byteLength
        reader = isView and buffer or new DataView buffer 

        for i in [ 0 ... length ]
            @setUi8 offset + i, reader.getUint8 i
        
        new buffer.constructor @buffer, offset, length

    writeArray              : ( array, TypedArray = Float32Array ) ->
        buffer = new TypedArray array
        offset = @byteLength
        object = @allocate l = buffer.byteLength
        length = TypedArray.BYTES_PER_ELEMENT

        writer = switch TypedArray
            when Float32Array then this.setF32
            when Uint32Array  then this.setU32
            when Uint16Array  then this.setU16
            when Uint8Array   then this.setUi8

        while l -= length
            writer.call @, offset + l, buffer[l/length]
            
        object

    setUi8                  : ( offset, value ) ->
        @setUint8 offset, value
        @link.setUint8 offset, value if @link
        value

    setU16                  : ( offset, value ) ->
        @setUint16 offset, value
        @link.setUint16 offset, value if @link
        value

    setU32                  : ( offset, value ) ->
        @setUint32 offset, value
        @link.setUint32 offset, value if @link
        value

    setF32                  : ( offset, value ) ->
        @setFloat32 offset, value
        @link.setFloat32 offset, value if @link
        value
     

export class glProgram extends Buffer

    addBuffer               : ( buffer ) ->
        buffer.link = @writeBuffer buffer

    addShader               : ( buffer ) ->
        @addBuffer buffer

    addAttrib               : ( buffer ) ->
        @addBuffer buffer

    addUniform              : ( buffer ) ->
        @addBuffer buffer

    getVertexShader         : ->
        @find gl.VERTEX_SHADER, ...arguments

    getFragmentShader       : ->
        @find gl.FRAGMENT_SHADER, ...arguments

class glShader extends Buffer
    setShaderSource         : ( source ) ->
        @writeString( source )

export class glVertexShader extends glShader

export class glFragmentShader extends glShader
    
export class glAttribute extends Buffer    
    headLength  : 48
    lengthName  : 32

    offsetName  : 16
    offsetType  : 14
    offsetSlot  : 13
    offsetSize  : 12
    offsetSkip  : 11


    setAttribName           : ( name ) ->
        @writeString name, @offsetName, @lengthName

    setAttribType           : ( type = gl.FLOAT ) ->
        @setU16 @offsetType, type
    
    setAttribSlot           : ( slot = 0 ) ->
        @setUi8 @offsetSlot, slot
    
    setAttribSize           : ( size = 1 ) ->
        @setUi8 @offsetSize, size

    setAttribSkip           : ( skip = 0 ) ->
        @setUi8 @offsetSkip, skip


    getAttribName           : ->
        @readString @offsetName, @lengthName

    getAttribType           : ->
        @getUint16 @offsetType

    getAttribSlot           : ->
        @getUint8 @offsetSlot    
    
    getAttribSize           : ->
        @getUint8 @offsetSize
    
    getAttribSkip           : ->
        @getUint8 @offsetSkip

export class glInterleavedAttribute extends Buffer

    strideOffset : 8
    lengthOffset : 9

    headLength   : 10
    typeLength   :
        [ gl.FLOAT ]          : 4
        [ gl.INT ]            : 4
        [ gl.UNSIGNED_INT ]   : 4
        [ gl.BYTE ]           : 1
        [ gl.UNSIGNED_BYTE ]  : 1
        [ gl.SHORT ]          : 2
        [ gl.UNSIGNED_SHORT ] : 2

    addAttrib               : ( buffer ) ->
        length = @typeLength[ buffer.getAttribType() ]
        buffer . setAttribSkip @getStride() * length

        @setStride @getStride() + buffer.getAttribSize()
        @setLength @getStride() * length

        @writeBuffer buffer

    setStride               : ( stride ) ->
        @setUi8 @strideOffset, stride ; stride

    setLength               : ( length ) ->
        @setUi8 @lengthOffset, length ; length

    getStride               : ->
        @getUint8 @strideOffset

    getLength               : ->
        @getUint8 @lengthOffset

class glUniform extends Buffer

    headLength  : 38
    lengthName  : 32
    offsetName  : 6

    setUniformName          : ( name ) ->
        @writeString name, @offsetName, @lengthName

    getUniformName          : ->
        @readString @offsetName, @lengthName

export class glUniform1f extends glUniform
    headLength  : 42
    ufv0Offset  : 38

    setUniformValue         : ( value ) ->
        @setF32 @ufv0Offset, value ; value

    getUniformValue         : ->
        @getFloat32 @ufv0Offset

export class glColor extends Buffer
    headLength  : 24
    colorOffset : 8

    rgbLength   : 12
    rgbaLength  : 16

    redOffset   : 8
    blueOffset  : 16
    greenOffset : 12
    alphaOffset : 20

    setHEXColor             : ( hex ) ->
        c = ( hex.substring(1).split '' )
        c = [ c[0], c[0], c[1], c[1], c[2], c[2] ] if c.length is 3
        c = '0x' + c.join ''

        @setF32 @redOffset, ((c >> 16) & 255) / 255
        @setF32 @greenOffset, ((c >> 8 ) & 255) / 255
        @setF32 @blueOffset (( c & 255 )) / 255

    setRGBAColor            : ( red, green, blue, alpha = 1 ) ->
        @setF32 @redOffset, red
        @setF32 @greenOffset, green
        @setF32 @blueOffset, blue
        @setF32 @alphaOffset, alpha

    setRGBColor             : ( red, green, blue ) ->
        @setF32 @redOffset, red
        @setF32 @greenOffset, green
        @setF32 @blueOffset, blue

    setRedColor             : ( red ) ->
        @setF32 @redOffset, red

    setGreenColor           : ( green ) ->
        @setF32 @greenOffset, green

    setBlueColor            : ( blue ) ->
        @setF32 @blueOffset, blue

    setColorAlpha           : ( alpha ) ->
        @setF32 @alphaOffset, alpha


    getRGBAColor            : ->
        new Float32Array @slice( @colorOffset, @rgbaLength )

    getRGBColor             : ->
        new Float32Array @slice( @colorOffset, @rgbLength )

    getRedColor             : ->
        @getFloat32 @redOffset

    getGreenColor           : ->
        @getFloat32 @greenOffset

    getBlueColor            : ->
        @getFloat32 @blueOffset

    getColorAlpha           : ->
        @getFloat32 @alphaOffset

export class glUniformMatrix4fv extends glUniform

export class glObject extends Buffer

    headLength              : 90

    lengthName              : 36

    offsetName              : 10

    offsetRotateX           : 46

    offsetRotateY           : 50

    offsetRotateZ           : 54

    offsetScaleX            : 58

    offsetScaleY            : 62

    offsetScaleZ            : 62

    offsetTranslateX        : 66

    offsetTranslateY        : 70

    offsetTranslateZ        : 74

    offsetPointCount        : 78

    offsetChangeMark        : 82

    offsetBufferData        : 90
    

    needsUpdate             : ( mark ) ->
        unless mark? #TODO mark changed when asked 
            @setUi8 @offsetUpdateMark , 0
            return Boolean @getUint8 @offsetChangeMark 
        @setUi8 @offsetUpdateMark, Number mark; mark

    setName                 : ( name ) ->
        @writeString name, @offsetName, @lengthName

    setRotateX              : ( radians ) ->
        @setF32 @offsetRotateX, radians

    setRotateY              : ( radians ) ->
        @setF32 @offsetRotateY, radians

    setRotateZ              : ( radians ) ->
        @setF32 @offsetRotateZ, radians

    setScaleX               : ( ratio ) ->
        @setF32 @offsetScaleX, ratio

    setScaleY               : ( ratio ) ->
        @setF32 @offsetScaleY, ratio

    setScaleZ               : ( ratio ) ->
        @setF32 @offsetScaleZ, ratio

    setTranslateX           : ( distance ) ->
        @setF32 @offsetTranslateX, distance

    setTranslateY           : ( distance ) ->
        @setF32 @offsetTranslateY, distance

    setTranslateZ           : ( distance ) ->
        @setF32 @offsetTranslateZ, distance

    setPointCount           : ( count ) ->
        @setU32 @offsetPointCount, count

    setBufferData           : ( data, TYPE ) ->
        @writeArray data, TYPE


    getName                 : ->
        @readString @offsetName, @lengthName

    getRotateX              : ->
        @getFloat32 @offsetRotateX

    getRotateY              : ->
        @getFloat32 @offsetRotateY

    getRotateZ              : ->
        @getFloat32 @offsetRotateZ

    getScaleX               : ->
        @getFloat32 @offsetScaleX

    getScaleY               : ->
        @getFloat32 @offsetScaleY

    getScaleZ               : ->
        @getFloat32 @offsetScaleZ

    getTranslateX           : ->
        @getFloat32 @offsetTranslateX

    getTranslateY           : ->
        @getFloat32 @offsetTranslateY

    getTranslateZ           : ->
        @getFloat32 @offsetTranslateZ

    getPointCount           : ->
        @getUint32 @offsetPointCount



Buffer.register glProgram, TYPE.GL_PROGRAM
Buffer.register glShader, gl.ATTACHED_SHADERS
Buffer.register glVertexShader, gl.VERTEX_SHADER
Buffer.register glFragmentShader, gl.FRAGMENT_SHADER
Buffer.register glAttribute, gl.SEPARATE_ATTRIBS
Buffer.register glInterleavedAttribute, gl.INTERLEAVED_ATTRIBS
Buffer.register glUniform1f, TYPE.GL_UNIFORM_1F
Buffer.register glColor, gl.COLOR
Buffer.register glUniformMatrix4fv, TYPE.GL_UNIFORM_MATRIX4FV
Buffer.register glObject, TYPE.GL_OBJECT



###


console.log TYPE.PROGRAM

export class TypedBuffer extends DataView

    @getPropertyName        = ( definition ) ->
        for key, def of @prototype
            return key if definition is def
        return null

    @registerType           = ( object, type ) =>
        Object.defineProperties object.prototype, {
            bufferType : value : type
        }

        Object.defineProperty this::, type, value : object


    bufferType              : TYPE.TYPED_BUFFER

    bufferSize              : 1e6

    headerSize              : 10

    constructor             : ( buffer = new ArrayBuffer(0, { maxByteLength: 1e8 }), offset, length) ->

        super buffer, offset, length

        unless  @byteLength
            if  @byteLength  < @bufferSize
                @buffer.resize @bufferSize

            @setBufferSize @bufferSize
            @setBufferType @bufferType
            @setByteOffset @headerSize

    getBufferType           : ( offset = 0 ) -> 
        @getUint16 offset
    
    getBufferSize           : ( offset = 0 ) -> 
        @getUint32 offset + 2
    
    getByteOffset           : -> 
        @getUint32 6

    setBufferType           : ( type, offset = 0 ) -> 
        @setU16 offset, type ; type
    
    setBufferSize           : ( size, offset = 0 ) -> 
        @setU32 offset + 2, size ; size
    
    setByteOffset           : ( byte, offset = 0 ) -> 
        @setU32 offset + 6, byte ; byte

    addUint8                : ( value ) -> 
        offset = @allocate(1)
        @setUi8 offset, value ; offset
    
    addUint16               : ( value ) -> 
        offset = @allocate(2)
        @setU16 offset, value ; offset
    
    addUint32               : ( value ) -> 
        offset = @allocate(4)
        @setU32 offset, value ; offset
        
    addFloat32              : ( value ) -> 
        @setF32 @allocate(4), value

    allocateBuffer          : ( type, size ) ->
        offset = @allocate size + @headerSize
        @setBufferType type, offset
        @setBufferSize size, offset
        offset + @headerSize

    allocate                : ( length ) ->
        offset = @getByteOffset()
        length = length + offset

        console
        @resize length if length > @byteLength
        @setByteOffset length

        offset

    resize                  : ( byteLength, transfer = no ) ->
        return this if @byteLength is byteLength

        unless @buffer.maxByteLength > byteLength
            throw "Max byte length exceed! #{byteLength}"

        @buffer.resize byteLength
        
        this

    slice                   : ( byteLength = @bufferLength, offset ) ->
        new @constructor @buffer, byteLength, offset

    values                  : ( handle, start, end = @byteLength ) ->
        offset = start ? @headerSize
        result = []
        
        while end > offset

            type = @getBufferType offset
            size = @getBufferSize offset

            if type then result.push(
                handle.call(
                    this, offset, type, size
                )
            )

            offset = offset + size + @headerSize

        return result
        
    find                    : ( type, start, end = @byteLength ) ->
        offset = start ? @headerSize

        while end > offset

            size = @getBufferSize offset

            if  type is @getBufferType offset
                return new @[ type ] @buffer, offset, size + @headerSize

            offset = offset + size + @headerSize

        return null

    copy                    : ( buffer, offset ) ->
        length = buffer.byteLength
        for i in [ 0 ... buffer.byteLength ]
            @setUi8 offset + i, buffer.getUint8 i
        offset + length


    readString              : ( offset, length ) ->
        length ?= @byteLength - offset
        decode.string @buffer, offset, length

    writeString             : ( string, offset, maxByteLength ) ->
        buffer = encode.string string
        length = buffer.byteLength

        if  maxByteLength?
            length = Math.min length, maxByteLength ? length

        @writeBuffer buffer, offset ? @allocate length

    writeBuffer             : ( buffer, offset ) ->
        offset ?= @allocate buffer.byteLength
        
        for uint8, index in new Uint8Array buffer 
            @setUi8 offset + index, uint8

        offset

    mergeBuffers            : ( type, buffer1, bufferN ) ->
        cache1 = []
        cache2 = []
        offsets = []
        buffers = [ ...arguments ].slice 1
        minOffset = @byteLength

        for buffer in buffers
            left = buffer.byteOffset
            size = buffer.byteLength

            offsets.push buffer.byteOffset

        @values ( offset, t, length ) =>
            if !offsets.includes offset
                while length--
                    cache2.push @getUint8 offset + length
            else
                while length--
                    cache1.push @getUint8 offset + length

            console.warn offset, length

        { cache1, cache2 }
        


Object.defineProperties TypedBuffer::, {
    debug : get : ->
        buffer : @buffer.slice @byteOffset, @byteOffset + @byteLength
        values : @values ( offset, type, byteLength ) =>
            name = glProgram.getPropertyName( type )
            return [ name ] : { offset, type, byteLength }
}

        
export class glProgram2 extends TypedBuffer

    bufferType              : TYPE.GL_PROGRAM_BUFFER

    FLOAT                   : 5126

    ATTACHED_SHADERS        : 35717

    VERTEX_SHADER           : 35633

    FRAGMENT_SHADER         : 35632

    SEPARATE_ATTRIBS        : 35981

    INTERLEAVED_ATTRIBS     : 35980

    CURRENT_VERTEX_ATTRIB   : 34342

    bufferSize              : 256

    attribSize              : 52

    maxNameLength           : 32

    setShaderSource         : ( source, SHADER_TYPE ) ->
        buffer = @[ SHADER_TYPE ].encode source
        offset = @allocateBuffer SHADER_TYPE, buffer.byteLength
        @writeBuffer buffer, offset

    setVertexShader         : ( source ) ->
        @setShaderSource source, @VERTEX_SHADER

    setFragmentShader       : ( source ) ->
        @setShaderSource source, @FRAGMENT_SHADER

    getVertexShader         : ->
        @find @VERTEX_SHADER

    getFragmentShader       : ->
        @find this.FRAGMENT_SHADER
    
    getAttribute            : ( offset ) ->
        new this[ @getBufferType offset ] @buffer, offset, @attribSize

    setAttirbute            : ( name, size, type, stride = 0, Offset = 0 ) ->
        offset = @allocateBuffer @SEPARATE_ATTRIBS, @attribSize

        @setAttributeName name, offset
        @setAttributeSize size, offset
        @setAttributeType type, offset
        
        @setAttributeStride stride, offset if stride
        @setAttributeOffset Offset, offset if Offset

        offset

    mergeAttributes         : ( attr1, attrN ) ->
        @mergeBuffers @INTERLEAVED_ATTRIBS, ...arguments

    setAttributeName        : ( name, offset ) ->
        buffer = encode.string name
        length = buffer.byteLength

        for uint8, i in new Uint8Array buffer
            @setUi8 offset + i, uint8

        offset

    setAttributeSize        : ( size, offset ) ->
        @setUi8 offset + @maxNameLength, size

    setAttributeType        : ( type = @FLOAT, offset ) ->
        @setU16 offset + @maxNameLength + 1, type

    setAttributeStride      : ( stride, offset ) ->
        @setUi8 offset + @maxNameLength + 3, stride

    setAttributeOffset      : ( Offset, offset ) ->
        @setUi8 offset + @maxNameLength + 4, Offset

    setAttirbuteIndex       : ( index, offset ) ->
        @setUi8 offset + @maxNameLength + 5, index

    setUniform1f            : ( label, value ) ->

    setUniformMatrix4fv     : ( label, value, transpose = no ) ->

    getAttribLocation       : ( label ) ->

    getUniformLocation      : ( label ) ->


export class glShader2 extends TypedBuffer
    @encode = ( source ) -> encode.string source                        
    @decode = ( buffer ) -> decode.string buffer                        


export class glVertexShader2 extends glShader
export class glFragmentShader2 extends glShader

    
#TypedBuffer.registerType glShader, glProgram::ATTACHED_SHADERS
#TypedBuffer.registerType glVertexShader, glProgram::VERTEX_SHADER
#TypedBuffer.registerType glFragmentShader, glProgram::FRAGMENT_SHADER




export class glAttribute extends TypedBuffer
    maxNameLength           : 32

    attribNameOffset        : 10
    attribSizeOffset        : 42
    attribTypeOffset        : 43

    getAttribName           : ->
        @readString @byteOffset + @attribNameOffset, @maxNameLength

    getAttribSize           : ->
        @getUint8 @attribSizeOffset

    getAttribType           : ->
        @getUint16 @attribTypeOffset

        

export class glSerperateAttrib extends glAttribute
export class glInterleavedAttrib extends glAttribute

export class glAttrib extends TypedBuffer

    #sizeOption              : [ 1, 2, 3, 4 ]
    
    #typeOption              : [ 5126 ]

    FLOAT                   : 5126

    GL_NORMALIZED           : no

    BYTES_PER_ELEMENT       : Float32Array.BYTES_PER_ELEMENT

    bufferType              : TYPE.GL_ATTRIB_BUFFER

    lengthName              : 32

    offsetName              : 12

    offsetSize              : 44
    
    offsetType              : 46

    strideOffset            : 48

    offsetOffset            : 49

    locationOffset          : 50

    location                : ( gl, program ) ->
        @setAttribLocation gl.getAttribLocation program, @getAttribName()

    enable                  : ( gl ) ->
        gl.enableVertexAttribArray @getAttribName()

    bind                    : ->

    pointer                 : ( gl ) ->
        gl.vertexAttribPointer(
            @getAttribLocation(), @getAttribSize(), @getAttribType(), 
            @GL_NORMALIZED, @getAttribStride(), @getAttribOffset()
        )

    setAttribLocation       : ( location ) ->
        @setUi8 @locationOffset, location

    getAttribLocation       : ->
        @getUint8 @locationOffset

    setAttribName           : ( name ) ->
        buffer = encode.string name
        length = Math.min @lengthName, buffer.byteLength
        tarray = new Uint8Array buffer, 0, length 

        for uint8, index in tarray
            @setUi8 @offsetName + index, uint8
        @

    getAttribName           : ->
        decode.string @buffer, @offsetName, @lengthName
    
    setAttribSize           : ( size ) ->
        @setUi8 @offsetSize, size ; @

    getAttribSize           : ->
        @getUint8 @offsetSize
    
    setAttribType           : ( type ) ->
        @setU16 @offsetType, type; @

    getAttribType           : ->
        @getUint16 @offsetType
    
    setAttribStride         : ( size = @getAttributeSize(), bytes = @BYTES_PER_ELEMENT ) ->
        @setUi8( @strideOffset, stride = size * bytes ); stride
    
    getAttribStride         : ->
        @getUint8 @strideOffset

    setAttribOffset         : ( prev_attrib_sizes = 0, bytes = @BYTES_PER_ELEMENT ) ->
        @setUi8( @offsetOffset, offset = prev_attrib_sizes * bytes ); offset
    
    getAttribOffset         : ->
        @getUint8 @offsetOffset

#TypedBuffer.registerType glAttribute, glProgram::CURRENT_VERTEX_ATTRIB
#TypedBuffer.registerType glSerperateAttrib, glProgram::SEPARATE_ATTRIBS
#TypedBuffer.registerType glInterleavedAttrib, glProgram::INTERLEAVED_ATTRIBS
###