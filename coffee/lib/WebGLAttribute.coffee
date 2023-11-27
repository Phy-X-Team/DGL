import {
    WebGLObject,
    WebGLParameter,
    WebGLCapability,
    WebGLCampledFloat
} from "./WebGLObject.js"

import GL_CONSTANT from "./GL_CONSTANT.js"

export ATTRIBUTE = new (class ATTRIBUTE extends GL_CONSTANT
    constructor : ( GL_CONST = 692 ) -> super GL_CONST)

export class OPTIONS extends ATTRIBUTE.constructor
    constructor : ( GL_CONST = 556 ) -> super GL_CONST

export FLOAT = new (class FLOAT extends GL_CONSTANT
    constructor : -> super 5126)

export class WebGLAttribute extends WebGLObject
    @bufferType : ATTRIBUTE
    
    defaults : {
        size : 1, type : FLOAT, location : 0
        normalize : no, stride : 0, offset : 0
    }

    constructor : ( name, size, type, location, normalize, stride, offset ) ->
        super( WebGLAttribute ).setOptions {
            name, size, type, location
            normalize, stride, offset
        }

    setOptions  : ( options = {} ) ->
        for key of @options
            @[ key ] = if options[ key ]?
                @options[ key ]
            else options[ key ]
        return this

export class WebGLAttributeParameter extends WebGLParameter

export NAME = new (class NAME extends OPTIONS
    constructor : -> super 1076)

export class AttributeName extends WebGLAttributeParameter
    @bufferType : NAME
    @bufferSize : 32

    constructor : ( name = "", prototype = AttributeName ) ->
        super( prototype ).setValue name

    setValue    : -> @text = arguments[0]
    getValue    : -> @text

    Object.defineProperty AttributeName::, "text", {
        get : -> @decode @buffer.slice 0, @byteLength

        set : ( value ) ->
            buffer = @encode( value.trim() )
            @buffer.fill(0).set buffer.slice 0, AttributeName.bufferSize
    }        

    Object.defineProperty AttributeName::, "byteLength", {
        get : ->
            buffer = @buffer
            for j in [ buffer.byteLength .. 0 ]
                break if buffer[ j ]
            return j + 1
    }        

    Object.defineProperty AttributeName::, "buffer", {
        get : -> WebGLObject::buffer.call this, Uint8Array
    }        



export SIZE = new (class SIZE extends OPTIONS
    constructor : -> super 1102)

export class AttributeSize extends WebGLAttributeParameter
    @bufferType : SIZE
    @bufferSize : 1

    constructor : ( size = 3, prototype = AttributeSize ) ->
        super( prototype ).setValue size

    setValue    : -> @value = arguments[0]
    getValue    : -> @value

    Object.defineProperty AttributeSize::, "value", {
        get : -> @get(0)
        set : ( value ) -> @set 0, value
    }            



export TYPE = new (class TYPE extends OPTIONS
    constructor : -> super 1109)

export class AttributeType extends WebGLAttributeParameter
    TypedArray  : Uint32Array

    @bufferType : TYPE
    @bufferSize : 1 * Uint32Array.BYTES_PER_ELEMENT

    @gl = [
        FLOAT
    ]

    constructor : ( type = FLOAT, prototype = AttributeType ) ->
        super( prototype ).setValue type

    setValue    : -> @value = arguments[0]
    getValue    : -> @value

    Object.defineProperty AttributeType::, "value", {
        get : -> @get(0)
        set : ( value ) -> @set 0, value
    }            



export NORMALIZE = new (class NORMALIZE extends OPTIONS
    constructor : -> super 1476)

export class AttributeNormalize extends WebGLAttributeParameter
    @bufferType : NORMALIZE
    @bufferSize : 1

    constructor : ( normalize = no, prototype = AttributeNormalize ) ->
        super( prototype ).setValue normalize

    setValue    : -> @isNormalized = arguments[0]
    getValue    : -> @isNormalized

    Object.defineProperty AttributeNormalize::, "isNormalized", {
        get : -> Boolean @get(0)
        set : ( value ) -> @set 0, value
    }            



export LOCATION = new (class LOCATION extends OPTIONS
    constructor : -> super 1388)

export class AttributeLocation extends WebGLAttributeParameter
    @bufferType : LOCATION
    @bufferSize : 2

    constructor : ( location, prototype = AttributeLocation ) ->
        super( prototype ).setValue location

    setValue    : -> @index = arguments[0]
    getValue    : -> @index

    Object.defineProperty AttributeLocation::, "isLocated", {
        get : -> Boolean @get 0
        set : ( value ) -> @set 0, Boolean value?
    }            

    Object.defineProperty AttributeLocation::, "index", {
        get : -> @get 1
        set : ( value ) -> @isLocated = @set 1, value
    }            

export STRIDE = new (class STRIDE extends OPTIONS
    constructor : -> super 1246)

export class AttributeStride extends WebGLAttributeParameter
    @bufferType : STRIDE
    @bufferSize : 1

    constructor : ( stride = 0, prototype = AttributeStride ) ->
        super( prototype ).setValue stride

    setValue    : -> @byteLength = arguments[0]
    getValue    : -> @byteLength

    Object.defineProperty AttributeStride::, "byteLength", {
        get : -> @get 0
        set : ( value ) -> @set 0, value
    }            


export OFFSET = new (class OFFSET extends OPTIONS
    constructor : -> super 1242)

export class AttributeOffset extends WebGLAttributeParameter
    @bufferType : OFFSET
    @bufferSize : 1

    constructor : ( offset = 0, prototype = AttributeOffset ) ->
        super( prototype ).setValue offset

    setValue    : -> @skipOffset = arguments[0]
    getValue    : -> @skipOffset

    Object.defineProperty AttributeOffset::, "skipOffset", {
        get : -> @get 0
        set : ( value ) -> @set 0, value
    }            


export OBJECT = new (class OBJECT extends OPTIONS
    constructor : -> super 1226)

export class AttributeBuffer extends WebGLAttributeParameter
    
    TypedArray  : Uint32Array
    @bufferType : OBJECT
    @bufferSize : 1 * Uint32Array.BYTES_PER_ELEMENT

    constructor : ( index = 0, prototype = AttributeBuffer ) ->
        super( prototype ).setValue index

    setValue    : -> @index = arguments[0]
    getValue    : -> @index

    Object.defineProperty AttributeBuffer::, "index", {
        get : -> @get 0
        set : ( value ) -> @set 0, value
    }            

    Object.defineProperty AttributeBuffer::, "object", {
        get : -> @constructor.object @index
        set : ( value ) -> @index = value
    }            

export INTERLEAVE = new (class INTERLEAVE extends OPTIONS
    constructor : -> super 1225)



class TYPED_VALUE extends GL_CONSTANT
    
export u8 = new (class UINT8 extends TYPED_VALUE
    TypedArray : Uint8Array
    BYTES_PER_ELEMENT : Uint8Array.BYTES_PER_ELEMENT
    constructor : -> super +8)

export i8 = new (class INT8 extends TYPED_VALUE
    TypedArray : Int8Array
    BYTES_PER_ELEMENT : Int8Array.BYTES_PER_ELEMENT
    constructor : -> super -8)    

export u16 = new (class UINT16 extends TYPED_VALUE
    TypedArray : Uint16Array
    BYTES_PER_ELEMENT : Uint16Array.BYTES_PER_ELEMENT
    constructor : -> super +16)

export i16 = new (class INT16 extends TYPED_VALUE
    TypedArray : Int16Array
    BYTES_PER_ELEMENT : Int16Array.BYTES_PER_ELEMENT
    constructor : -> super -16)

export u32 = new (class UINT32 extends TYPED_VALUE
    TypedArray : Uint32Array
    BYTES_PER_ELEMENT : Uint32Array.BYTES_PER_ELEMENT
    constructor : -> super +32)

export i32 = new (class INT32 extends TYPED_VALUE
    TypedArray : Int32Array
    BYTES_PER_ELEMENT : Int32Array.BYTES_PER_ELEMENT
    constructor : -> super -32)

export b64 = new (class BIGINT64 extends TYPED_VALUE
    TypedArray : BigInt64Array
    BYTES_PER_ELEMENT : BigInt64Array.BYTES_PER_ELEMENT
    constructor : -> super -64)

export u64 = new (class BIGUINT64 extends TYPED_VALUE
    TypedArray : BigUint64Array
    BYTES_PER_ELEMENT : BigUint64Array.BYTES_PER_ELEMENT
    constructor : -> super 64)

export f32 = new (class FLOAT32 extends TYPED_VALUE
    TypedArray : Float32Array
    BYTES_PER_ELEMENT : Float32Array.BYTES_PER_ELEMENT
    constructor : -> super 0.32)
    
export f64 = new (class FLOAT64 extends TYPED_VALUE
    TypedArray : Float64Array
    BYTES_PER_ELEMENT : Float32Array.BYTES_PER_ELEMENT
    constructor : -> super 0.64)

export class AttributeInterleave extends WebGLAttributeParameter
    
    TypedArray  : Uint32Array
    @bufferType : INTERLEAVE
    @bufferSize : 2 * Uint32Array.BYTES_PER_ELEMENT

    constructor : ( index = 0, prototype = AttributeInterleave ) ->
        super( prototype ).setValue index

    setValue    : -> @index = arguments[0]
    getValue    : -> @index

    Object.defineProperty AttributeInterleave::, "index", {
        get : -> @get 0
        set : ( value ) -> @set 0, value
    }            

    Object.defineProperty AttributeInterleave::, "object", {
        get : -> @constructor.object @index
        set : ( value ) -> @index = value
    }            

    Object.defineProperty AttributeInterleave::, "order", {
        get : -> @constructor.object @index
    }            

    Object.defineProperty AttributeInterleave::, "bytes", {
        get : -> @constructor.object @index
    }            


export SHADER = new (class SHADER extends OPTIONS
    constructor : -> super 1227)

export class AttributeShader extends WebGLAttributeParameter
    
    TypedArray  : Uint32Array
    @bufferType : SHADER
    @bufferSize : 1 * Uint32Array.BYTES_PER_ELEMENT

    constructor : ( index = 0, prototype = AttributeShader ) ->
        super( prototype ).setValue index

    setValue    : -> @index = arguments[0]
    getValue    : -> @index

    Object.defineProperty AttributeShader::, "index", {
        get : -> @get 0
        set : ( value ) -> @set 0, value
    }            

    Object.defineProperty AttributeShader::, "object", {
        get : -> @constructor.object @index
        set : ( value ) -> @index = value
    }            

    Object.defineProperty AttributeShader::, "isCompiled", {
        get : -> @object.isCompiled
    }            

    Object.defineProperty AttributeShader::, "isReady", {
        get : -> @isCompiled and @isAttached
    }            

    Object.defineProperty AttributeShader::, "isAttached", {
        get : -> @object.isAttached
    }            


WebGLObject.defineProperties WebGLAttribute, {
    name        : class : AttributeName
    size        : class : AttributeSize
    type        : class : AttributeType
    data        : class : AttributeBuffer
    shader      : class : AttributeShader
    normalize   : class : AttributeNormalize
    location    : class : AttributeLocation
    interleave  : class : AttributeInterleave
    stride      : class : AttributeStride
    offset      : class : AttributeOffset
}

export default WebGLAttribute