FLOAT                        = 5126
INT                          = 5124
BYTE                         = 5120
SHORT                        = 5122
UNSIGNED_INT                 = 5125
UNSIGNED_BYTE                = 5121
UNSIGNED_SHORT               = 5123

DEPTH_TEST                   = 2929
LEQUAL                       = 515

DEPTH_BUFFER_BIT             = 0x00000100
STENCIL_BUFFER_BIT           = 0x00000400
COLOR_BUFFER_BIT             = 0x00004000

POINTS                       = 0x0000
LINES                        = 0x0001
LINE_LOOP                    = 0x0002
LINE_STRIP                   = 0x0003
TRIANGLES                    = 0x0004
TRIANGLE_STRIP               = 0x0005
TRIANGLE_FAN                 = 0x0006

UNIFORM_BUFFER               = 35345
FUNC_ADD                        = 32774
FUNC_SUBTRACT                   = 32778
FUNC_REVERSE_SUBTRACT           = 32779

BLEND_COLOR                  = 32773
COLOR_CLEAR_VALUE            = 3106
ACTIVE_ATTRIBUTES            = 35721
ACTIVE_UNIFORMS              = 35718
ATTACHED_SHADERS             = 35717

INTERLEAVED_ATTRIBUTE           = 1606
MATRIX4_FLOAT32                 = 1091
FRUSTRUM_MATRIX4                = 1264
PERSPECTIVE_FRUSTRUM            = 1585
ORTHOGRAPHIC_FRUSTRUM           = 1649

UNIFORMNF_BUFFER                = 1229
UNIFORM1F_BUFFER                = 1200
UNIFORM2F_BUFFER                = 1201
UNIFORM3F_BUFFER                = 1202
UNIFORM4F_BUFFER                = 1203

SHADER                       = 35717
VERTEX_SHADER                = 35633
FRAGMENT_SHADER              = 35632
SEPARATE_ATTRIBS             = 35981
INTERLEAVED_ATTRIBS          = 35980
COMPILE_STATUS               = 35713

VERTEX_ATTRIB_ARRAY_POINTER          = 34373
VERTEX_ATTRIB_ARRAY_BUFFER_BINDING   = 34975
VERTEX_ATTRIB_ARRAY_ENABLED          = 34338
VERTEX_ATTRIB_ARRAY_SIZE             = 34339
VERTEX_ATTRIB_ARRAY_STRIDE           = 34340
VERTEX_ATTRIB_ARRAY_TYPE	            = 34341
VERTEX_ATTRIB_ARRAY_NORMALIZED       = 34922
CURRENT_VERTEX_ATTRIB                = 34342

RGBA                            = 284
VECTOR3                         = 518
COLOR4                          = 435
SCREEN                          = 448
CONTEXT_BUFFER                  = 1071
STATE                        = 627
PROGRAM                      = 778
ARRAY_BUFFER                 = 34962
STATIC_DRAW                  = 35044

RADIAN_CONSTANT                 = 0.017453292519943295
DEGREE_CONSTANT                 = 57.29577951308232

export DEFAULT_ROOT             = self?.document?.body
export DEFAULT_WIDTH            = self?.innerWidth or 8e2
export DEFAULT_HEIGHT           = self?.innerHeight or 6e2
export DEVICE_PIXEL_RATIO       = self?.devicePixelRatio or 1
export DEFAULT_POSITION         = "fixed"
export DEFAULT_NODETAG          = "canvas"
export DEFAULT_ASPECT_RATIO     = DEFAULT_WIDTH/DEFAULT_HEIGHT
export DEFAULT_ZINDEX           = DEFAULT_ROOT.querySelectorAll( DEFAULT_NODETAG ).length
export DEFAULT_CLEAR_COLOR      = 0x000000
export DEFAULT_CLEAR_DEPTH      = 1.0
export DEFAULT_ENABLED_TEST     = DEPTH_TEST
export DEFAULT_DEPTH_FUNCTION   = LEQUAL

export MIN_MEMORY_BYTES         = 96
export MAX_MEMORY_BYTES         = 1e6 * Math.max 1, Math.min( navigator?.deviceMemory, 2 ) or 2

global__index__ = new Object()
Memory = new class extends DataView

    offset          : new Uint32Array new ArrayBuffer Math.ceil MAX_MEMORY_BYTES / 10
    object          : new Object()

    offsetIndex     : 2
    offsetLength    : 3
    offsetErased    : 4

    constructor     : ( buffer = new ArrayBuffer( MIN_MEMORY_BYTES, { maxByteLength: MAX_MEMORY_BYTES } ), offset, length ) ->
        window.memory = Object.defineProperties super( buffer, offset, length ), {
            Float32Array : value : new Float32Array buffer
            Uint32Array  : value : new Uint32Array  buffer
            Uint16Array  : value : new Uint16Array  buffer
            Uint8Array   : value : new Uint8Array   buffer   
        }

        @offset[ @offsetIndex ] = 10

    resize          : ( size = 1e3 ) ->
        @buffer.resize @offset[ @offsetLength ] + 1e3 ; @

    alloc           : ( byteLength, headerSize ) ->
        $index = @offset[ @offsetIndex ]
        offset = @offset[ @offsetLength ]
        length = offset + byteLength

        @offset[ @offsetIndex ] = $index + 1
        @offset[ @offsetLength ] = length

        @resize() if @byteLength < @offset[ @offsetLength ]
        @offset[ $index ] = offset + headerSize

        return $index

    realloc         : ( index, byteLength ) ->
        startOffset = @offset[ index ] - index.headerSize
        copyLength  = index.getBufferSize()
        endOffset   = startOffset + copyLength
        
        allocOffset = @offset[ @offsetLength ]
        allocLength = copyLength + byteLength

        index.setBufferLink index.getBufferLink() + 1

        @offset[ @offsetLength ] = allocOffset + allocLength
        @offset[ @offsetErased ] = copyLength + @offset[ @offsetErased ]

        @resize() if @byteLength < @offset[ @offsetLength ]
        @relocate allocOffset, startOffset, endOffset

        @offset[ index ] = allocOffset + index.headerSize
        index.setBufferSize allocLength ; @offset[ index ]
        
    relocate        : ( offset, start, end, { name: ArrayBuffer } = Uint8Array ) ->
        this[ ArrayBuffer ].copyWithin offset, start, end
        this[ ArrayBuffer ].fill 0, start, end ; @

    toBuffer        : ( index, headers = no ) ->
        start = @offset[ index ]
        byte = index.typedArray.BYTES_PER_ELEMENT
        end = start + index.getBufferSize()

        if  byte > 1
            start /= byte
            end /= byte

        else if headers
            start -= index.headerSize
        
        to = @[index.typedArray.name].subarray start, end

    toObject        : ( index ) ->
        new Index index if @offset[ index ]

    toString        : ( index, offset = 0, length ) ->
        buffer = @toBuffer( index ).slice( offset )
        length = length ? buffer.byteLength
        string = ""
        offset = 0

        #TODO burada niye böyle anlamadik
        length -= index.headerSize
        
        while offset < length
        
            unless 1 - code = buffer[ offset++ ]
                code = buffer[ offset++ ] * 255
                code = code + buffer[ offset++ ]

            break unless code
            string = string + String.fromCharCode code
       
        return string

    writeText       : ( index, text, offset = 0, length ) ->
        @Uint8Array.set(
            Text::encode( text, length ), 
            (offset + @offset.at index )
        ); offset
        
Buffer = class extends Number
    headerSize  : 10
    bufferSize  : 0
    bufferName  : /BUFFER/i
    bufferLink  : null
    typedArray  : Uint8Array

    typeOffset  : -10
    sizeOffset  : -8
    linkOffset  : -4

    constructor         : ( Object = Buffer ) ->
        bufferType = Object::bufferType
        headerSize = Object::headerSize
        byteLength = Object::bufferSize + headerSize

        super Memory.alloc byteLength, headerSize 
            .setBufferType bufferType 
            .setBufferSize byteLength 

    uuid                : ->
        crypto?.randomUUID() or @random().toString(16).substr(3)

    random              : ->
        Math.random()

    setBufferType       : ( type ) ->
        @setUint16 @typeOffset, type

    setBufferSize       : ( size = 0 ) ->
        @setUint32 @sizeOffset, size
        
    setBufferLink       : ( link ) ->
        @setUint32 @linkOffset, link

        
    getBufferType       : ( offset = @typeOffset ) ->
        @getUint16 offset

    getBufferSize       : ( offset = @sizeOffset ) ->
        @getUint32 offset

    getBufferLink       : ( offset = @linkOffset ) ->
        @getUint32 offset


    setFloat32          : ( offset, value = 0 ) ->
        Memory.setFloat32 Memory.offset[this] + offset, value ; @

    setUint32           : ( offset, value = 0 ) ->
        Memory.setUint32    Memory.offset[this] + offset, value ; @

    setUint16           : ( offset, value = 0 ) ->
        Memory.setUint16 Memory.offset[this] + offset, value ; @

    setUint8            : ( offset, value = 0 ) ->
        Memory.setUint8     Memory.offset[this] + offset, value ; @


    getFloat32          : ( offset = 0  ) ->
        Memory.getFloat32   Memory.offset[this] + offset

    getUint32           : ( offset = 0  ) ->
        Memory.getUint32    Memory.offset[this] + offset

    getUint16           : ( offset = 0  ) ->
        Memory.getUint16    Memory.offset[this] + offset

    getUint8            : ( offset = 0 ) ->
        Memory.getUint8     Memory.offset[this] + offset


    alloc               : ( byteLength ) ->
        Memory.realloc this, byteLength

    writeText           : ( text = "", offset, length ) ->
        Memory.writeText this, text, offset, length ; @

    toBuffer            : ( headers ) ->
        Memory.toBuffer this, headers

    toArray             : ( typedArray = @typedArray ) ->
        [ ...@[ typedArray.name ]() ]


    Float32Array        : ( headers ) ->
        @toBuffer headers, Float32Array

    Uint32Array         : ( headers ) ->
        @toBuffer headers, Uint32Array

    Uint16Array         : ( headers ) ->
        @toBuffer headers, Uint16Array

    Uint8Array          : ( headers ) ->
        @toBuffer headers, Uint8Array

    get             : ->
        __index__[ this ]

    set             : ( WebGLObject ) ->
        __index__[ this ] = WebGLObject


class Index extends Number
    constructor : ( index ) ->
        type = Memory.getUint16 Memory.offset[index] - Buffer::headerSize
        Object.setPrototypeOf super(index), ( switch type
            when MATRIX4_FLOAT32 then Matrix4
            when FRUSTRUM_MATRIX4 then glFrustrum
            when PERSPECTIVE_FRUSTRUM then glPerspective
            when INTERLEAVED_ATTRIBS then glAttributes
            when VECTOR3 then Vector3
            when CONTEXT_BUFFER then glContext
            when SHADER then glShader
            when PROGRAM then glProgram
            when VERTEX_SHADER then glVertexShader
            when FRAGMENT_SHADER then glFragmentShader
            when SEPARATE_ATTRIBS then glAttribute
            when UNIFORM1F_BUFFER then glUniform1f
            when UNIFORM2F_BUFFER then glUniform2f
            when UNIFORM3F_BUFFER then glUniform3f
            when UNIFORM4F_BUFFER then glUniform4f
            else throw [ "Undefined type of constructor:", type, "at index:", index, "and offset:", Memory.offset[index], Memory.buffer ]
        ).prototype

class Offset extends Number
    constructor : ( offset ) ->
        new Index( Memory.getUint32 offset + Buffer::linkOffset )

class Vector3 extends Buffer
    bufferSize  : 12
    bufferType  : VECTOR3

    offsetX     : 0
    offsetY     : 4
    offsetZ     : 8

    constructor : ( x, y, z ) ->
        super( Vector3 )
            .setFloat32( @offsetX, x )
            .setFloat32( @offsetY, y )
            .setFloat32( @offsetZ, z )

class Translate extends Vector3

class Scale extends Vector3

class Rotation extends Vector3

class Matrix4 extends Buffer
    bufferType : MATRIX4_FLOAT32
    typedArray : Float32Array
    bufferSize : 64
    bufferByte : 4
    
    @ITEMS_PER_MATRIX = 16 

    @translateMatrix    = ( dx = 0, dy = 0, dz = 0 ) =>
        new Float32Array [
            1  ,  0  ,  0  ,  0
            0  ,  1  ,  0  ,  0
            0  ,  0  ,  1  ,  0
           dx  , dy  , dz  ,  1
        ]
    
    @rotationMatrix     = ( ax = 0, ay = 0, az = 0 ) =>
        ax = ax * RADIAN_CONSTANT
        ay = ay * RADIAN_CONSTANT
        az = az * RADIAN_CONSTANT

        sx = Math.sin ax  ;  sy = Math.sin ay  ;  sz = Math.sin az
        cx = Math.cos ax  ;  cy = Math.cos ay  ;  cz = Math.cos az

        [
            (cy*cz) , (sx*sy*cz - cx*sz) , (cx*sy*cz + sx*sz) ,  0
            (cy*sz) , (sx*sy*sz + cx+cz) , (cx*sy*sz - sx*cz) ,  0
            ( -sy ) , (      sx * cy   ) , (      cx * cy   ) ,  0
               0    ,           0        ,           0        ,  1
        ]

    @rotationXMatrix    = ( ax ) =>
        ax *= RADIAN_CONSTANT
        sin = Math.sin ax ; cos = Math.cos ax
        
        [
            1  ,  0  ,  0  ,  0
            0  , cos , sin ,  0
            0  ,-sin , cos ,  0
            0  ,  0  ,  0  ,  1
        ]

    @rotationYMatrix    = ( ay ) =>
        ay *= RADIAN_CONSTANT
        sin = Math.sin ay ; cos = Math.cos ay
        
        [
            cos ,  0  ,-sin ,  0
             0  ,  1  ,  0  ,  0
            sin ,  0  , cos ,  0
             0  ,  0  ,  0  ,  1
        ]

    @rotationZMatrix    = ( az ) =>
        az *= RADIAN_CONSTANT 
        sin = Math.sin az ;
        cos = Math.cos az
        
        [
           cos , sin ,  0  ,  0
          -sin , cos ,  0  ,  0
            0  ,  0  ,  1  ,  0
            0  ,  0  ,  0  ,  1
        ]


    @scaleMatrix        = ( sx = 1, sy = 1, sz = 1 ) =>
        new Float32Array [
           sx  ,  0  ,  0  ,  0
            0  , sy  ,  0  ,  0
            0  ,  0  , sz  ,  0
            0  ,  0  ,  0  ,  1
        ]


    constructor : ( values = [], Object = Matrix4 ) ->
        super( Object ).create( values )

    create      : ( values ) ->
        for value, index in values
            @setFloat32 index, value 
        return this

    multiply    : ( B, target ) ->
        A = @toArray()
        R = target ? []

        R[ 0] = A[0] * B[ 0]  +  A[4] * B[ 1]  +  A[ 8] * B[ 2]  +  A[12] * B[ 3];
        R[ 1] = A[1] * B[ 0]  +  A[5] * B[ 1]  +  A[ 9] * B[ 2]  +  A[13] * B[ 3];
        R[ 2] = A[2] * B[ 0]  +  A[6] * B[ 1]  +  A[10] * B[ 2]  +  A[14] * B[ 3];
        R[ 3] = A[3] * B[ 0]  +  A[7] * B[ 1]  +  A[11] * B[ 2]  +  A[15] * B[ 3];
    
        R[ 4] = A[0] * B[ 4]  +  A[4] * B[ 5]  +  A[ 8] * B[ 6]  +  A[12] * B[ 7];
        R[ 5] = A[1] * B[ 4]  +  A[5] * B[ 5]  +  A[ 9] * B[ 6]  +  A[13] * B[ 7];
        R[ 6] = A[2] * B[ 4]  +  A[6] * B[ 5]  +  A[10] * B[ 6]  +  A[14] * B[ 7];
        R[ 7] = A[3] * B[ 4]  +  A[7] * B[ 5]  +  A[11] * B[ 6]  +  A[15] * B[ 7];
    
        R[ 8] = A[0] * B[ 8]  +  A[4] * B[ 9]  +  A[ 8] * B[10]  +  A[12] * B[11];
        R[ 9] = A[1] * B[ 8]  +  A[5] * B[ 9]  +  A[ 9] * B[10]  +  A[13] * B[11];
        R[10] = A[2] * B[ 8]  +  A[6] * B[ 9]  +  A[10] * B[10]  +  A[14] * B[11];
        R[11] = A[3] * B[ 8]  +  A[7] * B[ 9]  +  A[11] * B[10]  +  A[15] * B[11];
    
        R[12] = A[0] * B[12]  +  A[4] * B[13]  +  A[ 8] * B[14]  +  A[12] * B[15];
        R[13] = A[1] * B[12]  +  A[5] * B[13]  +  A[ 9] * B[14]  +  A[13] * B[15];
        R[14] = A[2] * B[12]  +  A[6] * B[13]  +  A[10] * B[14]  +  A[14] * B[15];
        R[15] = A[3] * B[12]  +  A[7] * B[13]  +  A[11] * B[14]  +  A[15] * B[15];

        @fromArray R, target

    toBuffer    : ->
        offset = Memory.offset[ Number(@) ] / @bufferByte
        Memory.Float32Array.subarray offset , offset + 16

    toArray     : ->
        new Float32Array(
            @getFloat32 i * @bufferByte for i in [ 0 ... 16 ]
        )

    fromArray   : ( array, target ) ->
        unless target? then for i in [ 0 ... 16 ]
            @setFloat32 i * @bufferByte, array[i]
        else for value, i in array
            target[ i ] = value
        return target ? this
        
    translate   : ( dx, dy, dz ) ->
        @multiply @constructor.translateMatrix dx, dy, dz

    rotate      : ( ax, ay, az ) ->
        ax and @multiply @constructor.rotationXMatrix ax
        ay and @multiply @constructor.rotationYMatrix ay
        az and @multiply @constructor.rotationZMatrix az
        @
    
    scale       : ( sx, sy, sz ) ->
        @multiply @constructor.scaleMatrix sx, sy, sz

class glFrustrum extends Matrix4
    bufferType   : FRUSTRUM_MATRIX4
    bufferSize   : 88

    offsetNear   : 64
    offsetFar    : 68
    offsetRight  : 72
    offsetBottom : 76
    offsetTop    : 80
    offsetLeft   : 84

    constructor     : ( options = {}, Object = glFrustrum ) ->
        super( null, Object ).create( options )
            
    create          : ( options, set = yes ) ->                
        ( options = { ...this.getOptions(), ...options } ) unless ! set
        { fovy, aspect, near, far, top, bottom, left, right } = options

        fovy    or= 60
        aspect  or= DEFAULT_WIDTH/DEFAULT_HEIGHT
        near    or= 0.01
        far     or= 1e3

        left    = - (  right /= 2 ) if !left and right
        top     = - ( bottom /= 2 ) if  !top and bottom

        top     or= near * Math.tan fovy * RADIAN_CONSTANT * .5
        bottom  or= -top
        right   or= top * aspect
        left    or= -right

        return if set and !@setOptions { 
            fovy, aspect, far, near 
            right, top, bottom, left
        }

        w = right - left
        h = top - bottom

        sx = 2 * near / w
        sy = 2 * near / h

        c2 = - ( far + near ) / (far - near)
        c1 = 2 * near * far / ( near - far )

        tx = -near * (   left + right ) / w
        ty = -near * ( bottom + top   ) / h

        matrix = [
            sx,       0,       0,      0,
             0,      sy,       0,      0,
             0,       0,      c2,     -1,
            tx,      ty,      c1,      0
        ]

        unless set then return matrix
        
        for value, index in matrix
            @setFloat32 index * @bufferByte, value

        return this

    setOptions      : ( options ) ->        
        throw [ "Invalid frustrum parameters:", options ] if (
            options.left is options.right or options.bottom is options.top 
        )
        
        throw [ "Distance near >= far and must be positive:", options ] if (
            options.near <= 0 or options.far <= 0 or options.near >= options.far 
        )

        this
            .setNear options.near
            .setFar options.far
            .setRight options.right
            .setBottom options.bottom
            .setLeft options.left
            .setTop options.top

    setNear         : ( near ) ->
        @setFloat32 @offsetNear, near ; this

    setFar          : ( far ) ->
        @setFloat32 @offsetFar, far ; this
        
    setRight        : ( right ) ->
        @setFloat32 @offsetRight, right ; this
        
    setBottom       : ( bottom ) ->
        @setFloat32 @offsetBottom, bottom ; this
        
    setTop          : ( top ) ->
        @setFloat32 @offsetTop, top ; this
        
    setLeft         : ( left ) ->
        @setFloat32 @offsetLeft, left ; this
        
    
    getOptions      : ->
        near    : @getNear()
        far     : @getFar()
        right   : @getRight()
        bottom  : @getBottom()
        top     : @getTop()
        left    : @getLeft() 

    getNear         : ->
        @getFloat32 @offsetNear

    getFar          : ->
        @getFloat32 @offsetFar
        
    getRight        : ->
        @getFloat32 @offsetRight
        
    getBottom       : ->
        @getFloat32 @offsetBottom
        
    getTop          : ->
        @getFloat32 @offsetTop
        
    getLeft         : ->
        @getFloat32 @offsetLeft
        
class glPerspective extends glFrustrum
    bufferType  : PERSPECTIVE_FRUSTRUM
    bufferSize  : 96

    offsetFovy  : 88
    offsetAspect: 92

    constructor : ( options, Object = glPerspective ) ->
        super options, Object

    setOptions  : ( options ) ->
        this
            .setFovy options.fovy
            .setAspect options.aspect
        super options

    setFovy     : ( fovy ) -> 
        throw [ /fovy/ ] if fovy < 1 or fovy > 179
        @setFloat32 @offsetFovy, fovy ; this

    setAspect   : ( aspect ) -> 
        throw [ /aspect/ ] unless aspect > 0
        @setFloat32 @offsetAspect, aspect ; this



    getOptions  : ->
        Object.assign super(), {
            fovy : @getFovy()
            aspect : @getAspect()
        }

    getFovy     : -> 
        @getFloat32 @offsetFovy

    getAspect   : -> 
        @getFloat32 @offsetAspect
        
class Text extends Buffer
    bufferType  : 325
    bufferName  : /TEXT/i

    encode      : ( text, MAX_MEMORY_BYTES ) ->
        charCodes = new Array()

        for char in text.split ""
            code = char.charCodeAt 0
            unless 0xff < code then charCodes.push code
            else charCodes.push 1, code >> 8 & 0xff, code & 0xff
            break if MAX_MEMORY_BYTES is length = charCodes.length
        
        bufferArray = new Uint8Array MAX_MEMORY_BYTES ? length
        bufferArray.set charCodes
        bufferArray

class Display extends DataView

    context : WebGL2RenderingContext 
    program : new Array()

    # WebGLProgram?
        # 
        # Create a WebGLProgram object and initialize it with a program object 
        # name as if by calling glCreateProgram.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glCreateProgram.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createProgram
        #
        #
        # @return                       <WebGLProgram>
        #                               A WebGLProgram object that is a combination of two 
        #                               compiled WebGLShaders consisting of a vertex shader 
        #                               and a fragment shader (both written in GLSL). 
        #                               These are then linked into a usable program.
    createProgram               : ->
        @program[ @program.length ] = @context.createProgram()

    # void
        # 
        # The WebGLRenderingContext interface's linkProgram() method links a given 
        # WebGLProgram, completing the process of preparing the GPU code for the 
        # program's fragment and vertex shaders.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glLinkProgram.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/linkProgram
        #
        #
        # @parameter     <WebGLProgram> program
        #                               The WebGLProgram to link.
        #
        #
        # @return                       undefined
    linkProgram                 : ( program ) ->
        @context.linkProgram program

    # void
        # 
        # The WebGLRenderingContext.useProgram() method of the WebGL API sets the 
        # specified WebGLProgram as part of the current rendering state.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glUseProgram.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram
        #
        #
        # @parameter     <WebGLProgram> program
        #                               The WebGLProgram to use.
        #
        #
        # @return                       undefined
    useProgram                  : ( program ) ->
        @context.useProgram program

    # <GLint>
        # [WebGLHandlesContextLoss]
        # 
        # glGetAttribLocation returns the binding that actually went into 
        # effect the last time glLinkProgram was called for the specified 
        # program object. Attribute bindings that have been specified since 
        # the last link operation are not returned by glGetAttribLocation.
        # 
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetAttribLocation.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getAttribLocation
        # 
        # 
        # @parameter     <WebGLProgram> program
        #                               A WebGLProgram containing the vertex 
        #                               attribute.
        # 
        # @parameter        <DOMString> name
        #                               A string specifying the name of the attribute 
        #                               variable whose location to get.
        # 
        # 
        # @return                       <GLint> 
        #                        index: A GLint number indicating the location of the 
        #                               variable name if found. Returns -1 otherwise.
    getAttribLocation           : ( program, name ) ->
        @context.getAttribLocation program, name

    # WebGLUniformLocation?
        # Part of the WebGL API, the WebGLRenderingContext method getUniformLocation() 
        # returns the location of a specific uniform variable which is part of a given 
        # WebGLProgram.
        # 
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetUniformLocation.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniformLocation
        # 
        # 
        # @parameter     <WebGLProgram> program
        #                               The WebGLProgram in which to locate the 
        #                               specified uniform variable.
        # 
        # @parameter        <DOMString> name
        #                               A string specifying the name of the uniform 
        #                               variable whose location is to be returned. 
        #                               The name can't have any whitespace in it, 
        #                               and you can't use this function to get the 
        #                               location of any uniforms starting with 
        #                               the reserved string "gl_", since those are 
        #                               internal to the WebGL layer.
        # 
        # 
        # @return                       <WebGLUniformLocation> 
    getUniformLocation          : ( program, name ) ->
        @context.getUniformLocation program, name

    # WebGLActiveInfo? 
        #
        # The WebGLRenderingContext.getActiveAttrib() method of the WebGL API returns a 
        # WebGLActiveInfo object containing size, type, and name of a vertex attribute. 
        # It is generally used when querying unknown attributes either for debugging or 
        # generic library creation.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetActiveAttrib.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveAttrib
        # 
        # 
        # @parameter     <WebGLProgram> program
        #                               A WebGLProgram containing the vertex 
        #                               attribute.
        #
        #
        # @parameter           <GLuint> index
        #                               A GLuint specifying the index of the vertex 
        #                               attribute to get. This value is an index 0 to N-1 
        #                               as returned by gl.getProgramParameter( program, 
        #                               gl.ACTIVE_ATTRIBUTES).
        # 
        # @return                       <WebGLActiveInfo> 
        #                         name: The read-only WebGLActiveInfo.name property 
        #                               represents the name of the requested data returned 
        #                               by calling the getActiveAttrib() or getActiveUniform() 
        #                               methods.
        #
        #                         size: The read-only WebGLActiveInfo.size property is a 
        #                               Number representing the size of the requested data 
        #                               returned by calling the getActiveAttrib() or 
        #                               getActiveUniform() methods.
        #                               
        #                         type: The read-only WebGLActiveInfo.type property 
        #                               represents the type of the requested data returned 
        #                               by calling the getActiveAttrib() or getActiveUniform() 
        #                               methods.
    getActiveAttrib             : ( program, index ) ->
        @context.getActiveAttrib program, index

    # any 
        #
        # The WebGLRenderingContext.getActiveAttrib() method of the WebGL API returns a 
        # WebGLActiveInfo object containing size, type, and name of a vertex attribute. 
        # It is generally used when querying unknown attributes either for debugging or 
        # generic library creation.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetUniform.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniform
        # 
        # 
        # @parameter     <WebGLProgram> program
        #                               A WebGLProgram containing the uniform 
        #                               attribute.
        # @parameter
        #        <WebGLUniformLocation> location
        #                               A WebGLUniformLocation object containing
        #                               the location of the uniform attribute 
        #                               to get.
        # 
        # 
        # @return                       any 
        #                      boolean:	<GLBoolean>
        #                          int:	<GLint>
        #                         uint: <GLuint>
        #                        float:	<GLfloat>
        #                         vec2:	<Float32Array>  (with  2 elements)
        #                         vec3:	<Float32Array>  (with  3 elements)
        #                         vec4:	<Float32Array>  (with  4 elements)
        #                        bvec2:	<Array>         (with  2 booleans)
        #                        bvec3:	<Array>         (with  3 booleans)
        #                        bvec4:	<Array>         (with  4 booleans)
        #                        ivec2:	<Int32Array>    (with  2 elements)
        #                        ivec3:	<Int32Array>    (with  3 elements)
        #                        ivec4:	<Int32Array>    (with  4 elements)
        #                        uvec2: <Uint32Array>   (with  2 elements)
        #                        uvec3:	<Uint32Array>   (with  3 elements)
        #                        uvec4:	<Uint32Array>   (with  4 elements)
        #                         mat2:	<Float32Array>  (with  4 elements)
        #                         mat3:	<Float32Array>  (with  9 elements)
        #                         mat4:	<Float32Array>  (with 16 elements)        
        #                       mat2x3: <Float32Array>  (with  6 elements)
        #                       mat2x4:	<Float32Array>  (with  8 elements)
        #                       mat3x2:	<Float32Array>  (with  6 elements)
        #                       mat3x4:	<Float32Array>  (with 12 elements)
        #                       mat4x2:	<Float32Array>  (with  8 elements)
        #                       mat4x3:	<Float32Array>  (with 12 elements)
    getUniform                  : ( program, location ) ->
        @context.getUniform program, location

    # <GLintptr>
        #
        # return the address of the specified generic vertex attribute pointer.
        # glGetVertexAttribPointerv returns pointer information. index is the 
        # generic vertex attribute to be queried, pname is a symbolic constant 
        # indicating the pointer to be returned, and params is a pointer to a 
        # location in which to place the returned data.
        #
        # If a non-zero named buffer object was bound to the ARRAY_BUFFER target
        # (see glBindBuffer) when the desired pointer was previously specified, 
        # the pointer returned is a byte offset into the buffer object's data store.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetVertexAttribPointerv.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getVertexAttribOffset
        #
        #
        # @parameter           <GLuint> index 
        #                               Specifies the generic vertex attribute 
        #                               parameter to be returned.
        #
        # @parameter           <GLenum> pname                     
        #                               Specifies the symbolic name of the generic 
        #                               vertex attribute parameter to be returned.
        #                               Must be: VERTEX_ATTRIB_ARRAY_POINTER 
        # 
        # 
        # @return                       <GLintptr> 
        #                               Address of the specified generic vertex 
        #                               attribute pointer
    getVertexAttribOffset       : ( index, pname ) ->
        @context.getVertexAttribOffset index, pname ? VERTEX_ATTRIB_ARRAY_POINTER

    # any
        # 
        # Return the information requested in pname about the vertex attribute 
        # at the passed index. The type returned is dependent on the information 
        # requested.
        # 
        # glGetVertexAttrib returns in params the value of a generic vertex 
        # attribute parameter. The generic vertex attribute to be queried is 
        # specified by index, and the parameter to be queried is specified 
        # by pname.
        # 
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetVertexAttrib.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getVertexAttrib
        # 
        # 
        # @parameter           <GLuint> index 
        #                               Specifies the generic vertex attribute parameter 
        #                               to be returned.
        #
        # @parameter           <GLenum> pname                     
        #                               Specifies the symbolic name of the generic vertex 
        #                               attribute parameter to be returned.  
        #                               Must be: 
        #
        # @returns                      <Object> 
        #                 <WebGLBuffer> VERTEX_ATTRIB_ARRAY_BUFFER_BINDING
        #                   <GLboolean> VERTEX_ATTRIB_ARRAY_ENABLED
        #                       <GLint> VERTEX_ATTRIB_ARRAY_SIZE
        #                       <GLint> VERTEX_ATTRIB_ARRAY_STRIDE
        #                      <GLenum> VERTEX_ATTRIB_ARRAY_TYPE
        #                   <GLboolean> VERTEX_ATTRIB_ARRAY_NORMALIZED
        #                <Float32Array> CURRENT_VERTEX_ATTRIB
    getVertexAttrib             : ( index, pname ) ->
        return @context.getVertexAttrib index , pname unless ! pname?  
        
        enabled      : @getVertexAttrib index , VERTEX_ATTRIB_ARRAY_ENABLED
        buffer       : @getVertexAttrib index , VERTEX_ATTRIB_ARRAY_BUFFER_BINDING
        size         : @getVertexAttrib index , VERTEX_ATTRIB_ARRAY_SIZE
        type         : @getVertexAttrib index , VERTEX_ATTRIB_ARRAY_TYPE
        normalized   : @getVertexAttrib index , VERTEX_ATTRIB_ARRAY_NORMALIZED
        snapshot     : @getVertexAttrib index , CURRENT_VERTEX_ATTRIB
        stride       : @getVertexAttrib index , VERTEX_ATTRIB_ARRAY_STRIDE

    # void
        # 
        # Enable the vertex attribute at index as an array. WebGL imposes additional rules 
        # beyond OpenGL ES 2.0 regarding enabled vertex attributes; see Enabled Vertex 
        # Attributes and Range Checking.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glEnableVertexAttribArray.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray
        #
        #
        # @parameter           <GLuint> index
        #                               A GLuint specifying the index of the vertex 
        #                               attribute to get. This value is an index 0 to N-1 
        #                               as returned by gl.getProgramParameter( program, 
        #                               gl.ACTIVE_ATTRIBUTES).
        #
        #
        # @return                       undefined
    enableVertexAttribArray     : ( index ) ->
        @context.enableVertexAttribArray index 

    # WebGLShader?
        #
        # The WebGLRenderingContext method createShader() of the WebGL API 
        # creates a WebGLShader that can then be configured further using: 
        #  - WebGLRenderingContext.shaderSource() 
        #  - WebGLRenderingContext.compileShader()
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glCreateShader.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createShader
        #
        #
        # @parameter           <GLenum> type
        #                               A type of fragment or vertex shader
        #                               VERTEX_SHADER
        #                               FRAGMENT_SHADER
        #                               
        # @return                       <WebGLShader>
    createShader                : ( type ) ->
        @context.createShader type

    # void
        #
        # The WebGLRenderingContext.compileShader() method of the WebGL API compiles 
        # a GLSL shader into binary data so that it can be used by a WebGLProgram.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glCompileShader.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compileShader
        #
        #
        # @parameter      <WebGLShader> shader
        #                               A fragment or vertex WebGLShader.
        #                               
        # @return                       undefined
    compileShader               : ( shader ) ->
        @context.compileShader shader

    # void
        #
        # The WebGLRenderingContext.deleteShader() method of the WebGL API marks a 
        # given WebGLShader object for deletion. It will then be deleted whenever 
        # the shader is no longer in use. This method has no effect if the shader 
        # has already been deleted, and the WebGLShader is automatically marked 
        # for deletion when it is destroyed by the garbage collector.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDeleteShader.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader
        #
        #
        # @parameter      <WebGLShader> shader
        #                               A WebGLShader object to delete.
        #                               
        #                               
        # @return                       undefined
    deleteShader                : ( shader ) ->
        @context.deleteShader shader

    # void
        #
        # The WebGLRenderingContext.shaderSource() method of the WebGL API sets 
        # the source code of a WebGLShader.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glShaderSource.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/shaderSource
        #
        #
        # @parameter      <WebGLShader> shader
        #                               A WebGLShader object in which to set the source 
        #                               code.
        #                               
        #                   <DOMString> source
        #                               A string containing the GLSL source code to set.
        #                               
        # @return                       undefined
    shaderSource                : ( shader, source ) ->
        @context.shaderSource shader, source
    
    # any
        #
        # The WebGLRenderingContext.getShaderParameter() method of the WebGL API 
        # returns information about the given shader.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetShaderiv.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderParameter
        #
        #
        # @parameter      <WebGLShader> shader
        #                               A WebGLShader object in which to set the source 
        #                               code.
        #                               
        #                      <GLenum> pname
        #                               Specifying the information to query.
        #                               Possible values:
        #                               
        # @return                       any
        #                      <GLenum> SHADER_TYPE
        #                   <GLboolean> DELETE_STATUS
        #                   <GLboolean> COMPILE_STATUS
    getShaderParameter          : ( shader, pname ) ->
        @context.getShaderParameter shader, pname

    # void
        # The WebGLRenderingContext.vertexAttribPointer() method of the 
        # WebGL API binds the buffer currently bound to gl.ARRAY_BUFFER 
        # to a generic vertex attribute of the current vertex buffer 
        # object and specifies its layout.
        # 
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glVertexAttribPointer.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
        # 
        # @parameter           <GLuint> index
        #                               A GLuint specifying the index of the 
        #                               vertex attribute that is to be modified.
        #                               [ 0, 255 ]
        #   
        # @parameter           <GLint>  size
        #                               A GLint specifying the number of components
        #                               per vertex attribute. Must be 1, 2, 3, or 4.
        #                               [ +1, +4 ]
        #                               
        # @parameter           <GLenum> type 
        #                               A GLenum specifying the data type of each 
        #                               component in the array. Possible values:
        #                               BYTE
        #                               SHORT
        #                               UNSIGNED_BYTE
        #                               UNSIGNED_SHORT
        #                               FLOAT
        #                               HALF_FLOAT
        #                               INT
        #                               UNSIGNED_INT
        #                               INT_2_10_10_10_REV
        #                               UNSIGNED_INT_2_10_10_10_REV
        #
        # @parameter        <GLboolean> normalized 
        #                               A GLboolean specifying whether integer 
        #                               data values should be normalized into a 
        #                               certain range when being cast to a float.
        #                         BYTE: [ -1, +1 ]
        #                        SHORT: [ -1, +1 ]
        #                UNSIGNED_BYTE: [  0, +1 ]
        #               UNSIGNED_SHORT: [  0, +1 ]
        #                        FLOAT: ^effectless
        #                   HALF_FLOAT: ^effectless
        #
        #
        # @parameter          <GLsizei> stride
        #                               A GLsizei specifying the offset in bytes between
        #                               the beginning of consecutive vertex attributes.
        #                               Cannot be negative or larger than 255. 
        #                               [ 0, 255 ]
        #
        # @parameter         <GLintptr> offset
        #                               A GLintptr specifying an offset in bytes of 
        #                               the first component in the vertex attribute 
        #                               array. Must be a multiple of the byte length 
        #                               of type.
        #                               [ 0, 255 ]
        #
        #
        # @return                       undefined
    vertexAttribPointer         : ( index, size, type, normalized, stride, offset ) ->
        @context.vertexAttribPointer index, size, type, normalized, stride, offset 

    # void
        # The WebGLRenderingContext.uniform[1234][fi][v]() methods of the 
        # WebGL API specify values of uniform variables. All active uniform 
        # variables defined in a program object are initialized to 0 when 
        # the program object is linked successfully.
        # 
        # They retain the values assigned to them by a call to this method 
        # until the next successful link operation occurs on the program object, 
        # when they are once again initialized to 0.
        # 
        # * Non-normative:
        #   Performance problems have been observed on some implementations 
        #   when using uniform1i to update sampler uniforms. To change the 
        #   texture referenced by a sampler uniform, binding a new texture 
        #   to the texture unit referenced by the uniform should be preferred 
        #   over using uniform1i to update the uniform itglobal
        # 
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glUniform.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
        # 
        # 
        # @parameter                
        #        <WebGLUniformLocation> location
        #                               A object containing the location of 
        #                               the uniform attribute to modify.
        # 
        # @parameter          <GLfloat> v0, v1, v2, v3
        #                               A new value to be used for the uniform 
        #                               variable.
        # 
        # @return                       undefined
    uniform1f                   : ( location, v0 ) -> 
        @context.uniform1f location, v0
    
    # void
        #? see: uniform1f
    uniform2f                   : ( location, v0, v1 ) -> 
        @context.uniform2f location, v0, v1
    
    # void
        #? see: uniform1f
    uniform3f                   : ( location, v0, v1, v2 ) -> 
        @context.uniform3f location, v0, v1, v2
    
    # void
        #? see: uniform1f
    uniform4f                   : ( location, v0, v1, v2, v3 ) -> 
        @context.uniform4f location, v0, v1, v2, v3
    
    # void
        # The WebGLRenderingContext.uniformMatrix[234]fv() methods of the 
        # WebGL API specify matrix values for uniform variables.
        # 
        # The three versions of this method (uniformMatrix2fv(), 
        # uniformMatrix3fv(), and uniformMatrix4fv()) take as the 
        # input value 2-component, 3-component, and 4-component 
        # square matrices, respectively. 
        # They are expected to have 4, 9 or 16 floats.
        # 
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glUniform.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix
        # 
        # 
        # @parameter                
        #        <WebGLUniformLocation> location
        #                               A object containing the location of 
        #                               the uniform attribute to modify.
        # 
        # @parameter          <GLfloat> value, v0, v1, v2, v3
        #                               A new value to be used for the uniform 
        #                               variable.
        #
            # @parameter     GLboolean> transpose
            #                           A specifying whether to transpose the matrix. 
            #                         ? Must be false.
        #
        # @parameter        <GLboolean> value
        #                               A Float32Array or sequence of GLfloat values. 
        #                               The values are assumed to be supplied in 
        #                               column major order.
        # 
        # @return                       undefined    
    uniformMatrix2fv            : ( location, value ) ->
        @context.uniformMatrix2fv location, false, value

    # void
        #? see: uniformMatrix2fv 
    uniformMatrix3fv            : ( location, value ) ->
        @context.uniformMatrix3fv location, false, value
    
    # void
        #? see: uniformMatrix2fv
    uniformMatrix4fv            : ( location, value ) ->
        @context.uniformMatrix4fv location, false, value

    # void
        # The WebGLRenderingContext.drawArrays() method of the WebGL API 
        # renders primitives from array data.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDrawArrays.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
        # 
        #  
        # @parameter           <GLenum> mode
        #                               A GLenum specifying the type primitive to render. 
        #                               Possible values are:
        #                       POINTS: Draws a single dot.
        #                   LINE_STRIP: Draws a straight line to the next vertex.
        #                    LINE_LOOP: Draws a straight line to the next vertex, and connects
        #                               the last vertex back to the first.
        #                        LINES: Draws a line between a pair of vertices.
        #               TRIANGLE_STRIP: Connected triangles that share one central vertex.
        #                 TRIANGLE_FAN: A subset in a triangle mesh with shared vertices.
        #                    TRIANGLES: Draws a triangle for a group of three vertices.
        # 
        # @parameter           <GLint>  first
        #                               The starting index in the array of vector points.
        # 
        # @parameter         <GLsizei>  count
        #                               The number of indices to be rendered.
        # 
        # 
        # @return                       undefined
    drawArrays                  : ( mode, first, count ) ->
        @context.drawArrays mode, first, count

    # void
        # The WebGLRenderingContext.clearColor() method of the WebGL API 
        # specifies the color values used when clearing color buffers.
        # Default values of all parameters is zero (0).
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glClearColor.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor
        #
        # 
        # @parameter         <GLclampf> red
        #!                              The red color value used when the buffers are cleared.
        #
        # @parameter         <GLclampf> green
        #*                              The green color value used when the buffers are cleared.
        #
        # @parameter         <GLclampf> blue
        #?                              The blue color value used when the buffers are cleared.
        #
        # @parameter         <GLclampf> alpha
        #TODO                           Transparency value used when the buffers are cleared.
        #
        # @return                       undefined
    clearColor                  : ( red, green, blue, alpha ) ->
        @context.clearColor red, green, blue, alpha

    # void
        # The WebGLRenderingContext.depthFunc() method of the WebGL API 
        # specifies a function that compares incoming pixel depth to 
        # the current depth buffer value.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDepthFunc.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc
        #
        # 
        # @parameter           <GLenum> func
        #                               Specifying the depth comparison function, 
        #                               which sets the conditions under which the pixel 
        #                               will be drawn. The default value is gl.LESS. 
        #                               Possible values are:
        #                        NEVER: never pass
        #                        *LESS: pass if incoming value == depth buffer value
        #                       LEQUAL: pass if incoming value <= depth buffer value
        #                      GREATER: pass if incoming value >  depth buffer value
        #                     NOTEQUAL: pass if incoming value != depth buffer value
        #                       GEQUAL: pass if incoming value >= depth buffer value
        #                       ALWAYS: always pass
        #
        #
        # @return                       undefined
    depthFunc                   : ( func ) ->
        @context.depthFunc func

    # void
        # The WebGLRenderingContext.clearDepth() method of the WebGL API
        # specifies the clear value for the depth buffer. Default value is 1
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glClearDepthf.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth
        #
        #
        # @parameter         <GLclampf> depth
        #                               The depth value used when the depth buffer 
        #                               is cleared. Default value: 1.
        #                               [ 0, +1 ]
        # 
        # @return                       undefined
    clearDepth                  : ( depth ) ->
        @context.clearDepth depth

    # DOMString?
        # The WebGLRenderingContext.getProgramInfoLog returns 
        # the information log for the specified WebGLProgram 
        # object. It contains errors that occurred during failed 
        # linking or validation of WebGLProgram objects.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetProgramInfoLog.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramInfoLog
        #
        # 
        # @parameter     <WebGLProgram> program
        #                               The WebGLProgram to query.
        #
        #
        # @return                       <DOMString> 
        #                               A string that contains diagnostic 
        #                               messages, warning messages, and other 
        #                               information about the last linking or 
        #                               validation operation. When a 
        #                               WebGLProgram object is initially 
        #                               created, its information log will be 
        #                               a string of length 0.
    getProgramInfoLog           : ( program ) ->
        @context.getProgramInfoLog program

    # WebGLBuffer?
        # The WebGLRenderingContext.createBuffer() method of the WebGL API 
        # creates and initializes a WebGLBuffer storing data such as 
        # vertices or colors.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGenBuffers.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer 
        #
        #
        # @return                       <WebGLBuffer>
        #                               A buffer for storing data such as 
        #                               vertices or colors.
    createBuffer                : ->
        @context.createBuffer()

    # void
        # The WebGLRenderingContext.createBuffer() method of the WebGL API 
        # creates and initializes a WebGLBuffer storing data such as 
        # vertices or colors.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGenBuffers.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer
        #
        # 
        # @parameter           <GLenum> target 
        #                               The binding point (target). Possible 
        #                               values:
        #                 ARRAY_BUFFER: Buffer containing vertex attributes,
        #                               such as vertex coordinates, texture 
        #                               coordinate data, or vertex color data.
        #         ELEMENT_ARRAY_BUFFER: Element indices.
        #             COPY_READ_BUFFER: Copying buffer object to another.
        #            COPY_WRITE_BUFFER: Copying buffer object to another.
        #    TRANSFORM_FEEDBACK_BUFFER: Transform feedback operations.
        #               UNIFORM_BUFFER: Storing uniform blocks.
        #            PIXEL_PACK_BUFFER: Pixel transfer operations.
        #          PIXEL_UNPACK_BUFFER: Pixel transfer operations.
        #
        # @parameter      <WebGLBuffer> buffer
        #                               A WebGLBuffer to bind.
        #
        # @return                       undefined
    bindBuffer                  : ( target, buffer ) ->
        @context.bindBuffer target, buffer

    # void
        # The WebGLRenderingContext.bufferData() method of the 
        # WebGL API initializes and creates the buffer object's 
        # data store.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glBufferData.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
        #
        # 
        # @parameter           <GLenum> target 
        #                               The binding point (target). Possible 
        #                               values:
        #                 ARRAY_BUFFER: Buffer containing vertex attributes,
        #                               such as vertex coordinates, texture 
        #                               coordinate data, or vertex color data.
        #         ELEMENT_ARRAY_BUFFER: Element indices.
        #             COPY_READ_BUFFER: Copying buffer object to another.
        #            COPY_WRITE_BUFFER: Copying buffer object to another.
        #    TRANSFORM_FEEDBACK_BUFFER: Transform feedback operations.
        #               UNIFORM_BUFFER: Storing uniform blocks.
        #            PIXEL_PACK_BUFFER: Pixel transfer operations.
        #          PIXEL_UNPACK_BUFFER: Pixel transfer operations.
        #
        # @parameter       <GLsizeiptr> size
        #                               Setting the size in bytes of the buffer 
        #                               object's data store.
        #
        # @parameter       <GLsizeiptr> srcData                   #? (optional) 
        #                               Will be copied into the data store. If 
        #                               null, a data store is still created, but 
        #                               the content is uninitialized and undefined. 
        #                               <ArrayBuffer>
        #                               <SharedArrayBuffer>
        #                               <TypedArray>
        #                               <DataView>
        #       
        # @parameter           <GLenum> usage
        #                               The intended usage pattern of the data store 
        #                               for optimization purposes. Possible values:
        #
        #                  STATIC_DRAW: Specified once by the application, and used 
        #                               many times as the source for WebGL drawing 
        #                               and image specification commands.
        #
        #                  STREAM_DRAW: Specified once by the application, and used 
        #                               at most a few times as the source for WebGL 
        #                               drawing and image specification commands.
        #
        #                  STATIC_READ: Specified once by reading data from WebGL, 
        #                               and queried many times by the application.
        #
        #                  STREAM_READ: Specified once by reading data from WebGL, 
        #                               and queried at most a few times by the 
        #                               application
        #
        #                  STATIC_COPY: Specified once by reading data from WebGL, 
        #                               and used many times as the source for WebGL 
        #                               drawing and image specification commands.
        #
        #                  STREAM_COPY: Specified once by reading data from WebGL, 
        #                               and used at most a few times as the source 
        #                               for WebGL drawing and image specification 
        #                               commands.
        #
        #                 DYNAMIC_DRAW: Respecified repeatedly by the application, 
        #                               and used many times as the source for WebGL 
        #                               drawing and image specification commands.
        #
        #                 DYNAMIC_READ: Respecified repeatedly by reading data from 
        #                               WebGL, and queried many times by the 
        #                               application.
        #
        #                 DYNAMIC_COPY: Respecified repeatedly by reading data from 
        #                               WebGL, and used many times as the source 
        #                               for WebGL drawing and image specification 
        #                               commands.
        #       
        #       
        # @return                       undefined
        #TODO                   : ( target, usage, srcOffset ) ->
        #TODO                   : ( target, srcData, usage, srcOffset ) ->
    bufferData                  : ( target, srcData, usage, srcOffset, length ) ->
        @context.bufferData target, srcData, usage, srcOffset, length

    # any
        # The WebGLRenderingContext.getProgramParameter() method of the 
        # WebGL API returns information about the given program.
        #
        # @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetProgramiv.xml
        # @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramParameter
        #
        #
        # @parameter     <WebGLProgram> program
        #                               A WebGLProgram to get parameter  
        #                               information from.
        #
        # @parameter           <GLenum> pname
        #                               A GLenum specifying the information 
        #                               to query. Possible values:
        #                DELETE_STATUS: Flagged for deletion. 
        #                  LINK_STATUS: Last link operation success.
        #              VALIDATE_STATUS: Last validation operation success.
        #             ATTACHED_SHADERS: Number of attached shaders.
        #            ACTIVE_ATTRIBUTES: Number of active attribute variables
        #              ACTIVE_UNIFORMS: Number of active uniform variables
        # TRANSFORM_FEEDBACK_BUFR_MODE: The buffer mode when transform feedback is active. May be gl.SEPARATE_ATTRIBS or gl.INTERLEAVED_ATTRIBS.
        #  TRANSFORM_FEEDBACK_VARYINGS: Number of varying variables to capture in transform feedback mode.
        #        ACTIVE_UNIFORM_BLOCKS: Number of uniform blocks containing active uniforms
        #
        # @return           <GLboolean> DELETE_STATUS 
        #                   <GLboolean> LINK_STATUS 
        #                   <GLboolean> VALIDATE_STATUS 
        #                       <GLint> ATTACHED_SHADERS
        #                       <GLint> ACTIVE_ATTRIBUTES
        #                       <GLint> ACTIVE_UNIFORMS
        #                      <GLenum> TRANSFORM_FEEDBACK_BUFFER_MODE
        #                       <GLint> TRANSFORM_FEEDBACK_VARYINGS
        #                       <GLint> ACTIVE_UNIFORM_BLOCKS
    getProgramParameter         : ( program, pname ) ->
        @context.getProgramParameter program, pname

class glContext extends Buffer
    bufferType : CONTEXT_BUFFER
    bufferSize : 64

    @type = [
        "webgl2", "webgl", "experimental-webgl", 
        "2d", "webgpu", "bitmaprenderer"
    ]

    offsetDrawcall      : 4
        
    offsetWidth         : 36
    offsetHeight        : 38
    offsetTop           : 40
    offsetRight         : 42
    offsetBottom        : 44
    offsetLeft          : 46
    offsetConnected     : 48
    offsetPixelRatio    : 49
    offsetAspectRatio   : 50
    offsetZIndex        : 54
    offsetType          : 55

    offsetClearColor    : 56
    offsetClearMask     : 60

    @defaults           =
        width           : DEFAULT_WIDTH
        height          : DEFAULT_HEIGHT
        zIndex          : DEFAULT_ZINDEX
        pixelRatio      : DEVICE_PIXEL_RATIO
        aspectRatio     : DEFAULT_ASPECT_RATIO
        clearColor      : DEFAULT_CLEAR_COLOR

    constructor     : ( options, Object = glContext ) ->
        super( Object ).init( options )

    init            : ( options ) ->

        for label, value of @defaults options
            @[ label ]?( value )        

        gl = @get()

        gl.enable DEFAULT_ENABLED_TEST
        gl.depthFunc DEFAULT_DEPTH_FUNCTION
        gl.clearDepth DEFAULT_CLEAR_DEPTH
        gl.clearColor( 0, 0.2, 0.2, .5 )
    
        this

    defaults        : ( options = {} ) ->
        if  options instanceof HTMLCanvasElement
            options = new Object { canvas : options }
            
        options = new Object { 
            ...glContext.defaults, 
            ...options
        }

        unless options.canvas instanceof HTMLCanvasElement
            options.canvas = @create options 

        options

    create          : ( options ) ->
        tagName = options.nodeTag or DEFAULT_NODETAG
        Object.defineProperties( 
            document.createElement( tagName ), {
                id : value : options.id or @uuid()
            }
        )

    add             : ( index ) ->
        index.context( this ) ; this

    append          : ( parent = DEFAULT_ROOT ) ->
        parent.appendChild @style().canvas()

    style           : ->
        element = @canvas()
        element.width = @pixelRatio() * @width()
        element.height = @pixelRatio() * @height()

        Object.defineProperties( element.style , {
            width    : value : CSS.px @width()
            height   : value : CSS.px @height()
            top      : value : CSS.px @top()
            right    : value : CSS.px @right()
            bottom   : value : CSS.px @bottom()
            left     : value : CSS.px @left()
        } ).position = DEFAULT_POSITION
        
        return this

    canvas          : ( canvas ) ->
        return @get().canvas unless canvas?
        @set( canvas.getContext @type() ); @

    type            : ( type ) ->
        unless type?
            return glContext.type[ @getUint8 @offsetType ]
        @setUint8 @offsetType, glContext.type.indexOf( type )
                
    width           : ( width ) ->
        return @getUint16 @offsetWidth unless width?
        @setUint16 @offsetWidth, width ; return this

    height          : ( height ) ->
        return @getUint16 @offsetHeight unless height?
        @setUint16 @offsetHeight, height ; return this

    top             : ( top ) ->
        return @getUint16 @offsetTop unless top?
        @setUint16 @offsetTop, top ; return this

    right           : ( right ) ->
        return @getUint16 @offsetRight unless right?
        @setUint16 @offsetRight, right ; return this

    bottom          : ( bottom ) ->
        return @getUint16 @offsetBottom unless bottom?
        @setUint16 @offsetBottom, bottom ; return this

    left            : ( left ) ->
        return @getUint16 @offsetLeft unless left?
        @setUint16 @offsetLeft, left ; return this

    connected       : ( connected ) ->
        return @getUint8 @offsetConnected unless connected?
        @setUint8 @offsetConnected, connected ; return this

    pixelRatio      : ( pixelRatio ) ->
        return @getUint8 @offsetPixelRatio unless pixelRatio?
        @setUint8 @offsetPixelRatio, pixelRatio ; return this

    aspectRatio     : ( aspectRatio ) ->
        return @getFloat32 @offsetAspectRatio unless aspectRatio?
        @setFloat32 @offsetAspectRatio, aspectRatio ; return this

    zIndex          : ( zIndex ) ->
        return @getUint8 @offsetZIndex unless zIndex?
        @setUint8 @offsetZIndex, zIndex ; return this
    
    clearColor      : ( index ) ->
        return @getUint32 @offsetClearColor unless index?
        @setUint32 @offsetZIndex, index ; return this

    clearMask       : ( index ) ->
        return @getUint32 @offsetClearMask unless index?
        @setUint32 @offsetClearMask, index ; return this

    draw            : ->
        drawCalls = @addDrawcall()
        #@get().clear COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT

    setDrawcall     : ( count ) ->
        @setUint32 @offsetDrawcall , count  

    getDrawcall     : ->
        @getUint32 @offsetDrawcall
        
    addDrawcall     : ->
        @setUint32 @offsetDrawcall, count = @getDrawcall() + 1 ; count  
        


class glProgram extends Buffer
    bufferType : PROGRAM
    bufferSize : 96 #? has empty slots for shaders, attrs and uniforms 
    offsetByte : 14

    offsetVertexShader : 2
    offsetFragmentShader : 6
    offsetContext : 10

    constructor         : ( context, Object = glProgram ) ->
        super( Object ).init({ context })

    init                : ( options = {} ) ->
        for label, value of options
            try this[ label ]?( value )
        return @

    create              : ->
        @set @context().get().createProgram() ; @

    attach              : ( shader ) ->
        @context().get().attachShader @get(), shader; @

    link                : ->
        @context().get().linkProgram @get() ; @
    
    use                 : ->
        @context().get().useProgram @get() ; @

    attribute           : ( glAttribute ) ->
        gl = @context().get()
        name = glAttribute.name()
        index = 0
        program = @get()
        
        while attrib = gl.getActiveAttrib program, index++
            if attrib.name is name then return glAttribute.set(
                Object.defineProperties attrib, index : value : index
            )

        return

    add                 : ( index ) ->
        index.program( this )

    fragmentShader      : ( shader ) ->
        return @getUint32 @offsetFragmentShader unless shader?
        @setUint32 @offsetFragmentShader, shader ; return this

    context             : ( context ) ->
        return new Index @getUint32 @offsetContext unless context?
        @setUint32( @offsetContext, context ); return this

    getProperties       : ( bufferType = null ) ->
        return unless @getUint8( i = 0 )
        while index = @getUint32 @offsetByte + (i++ * 4)
            new Index index 


class glColor extends Buffer

    bufferType  : COLOR4
    bufferSize  : 16
    typedArray  : Float32Array

    constructor : ( options, Object = glColor ) ->
        super( Object ).create( options )
        
    create      : ( options = {} ) ->
        @setAlpha options.alpha     if options.alpha
        @setRed options.red         if options.red
        @setGreen options.green     if options.green
        @setBlue options.blue       if options.blue
        @fromArray options          if options.constructor is Array

        options.normalize and @normalize() ; this

    fromArray   : ( rgba = [0, 0, 0, 1] ) ->
        for offset, index in [ 0, 4, 8, 12 ]
            @setFloat32 offset, rgba[ index ]
        return this

    fromHex     : ( OxRRGGBBAA, OxRRGGBB ) ->
        r = (OxRRGGBBAA >> 24) & 0xff / 0xff
        g = (OxRRGGBBAA >> 16) & 0xff / 0xff
        b = (OxRRGGBBAA >>  8) & 0xff / 0xff
        a = (OxRRGGBBAA >> 32) & 0xff / 0xff

        r = (  OxRRGGBB >> 16) & 0xff / 0xff
        g = (  OxRRGGBB >>  8) & 0xff / 0xff
        b = (  OxRRGGBB >>  0) & 0xff / 0xff
        a = 0xff / 0xff

    toArray     : ( rgba = [] ) ->
        for offset, index in [ 0, 4, 8, 12 ]
            rgba[ index ] = @getFloat32 offset
        return rgba[ index ]

    normalize   : ( Oxff = 255 ) ->
        for offset in [ 0, 4, 8, 12 ]
            @setFloat32 offset, @getFloat32(offset) / Oxff
        return this

    setRed      : ( red = 1 ) ->
        @setFloat32 0, red ; this

    setGreen    : ( green = 1 ) ->
        @setFloat32 4, green ; this

    setBlue     : ( blue = 1 ) ->
        @setFloat32 8, blue ; this

    setAlpha    : ( alpha = 1 ) ->
        @setFloat32 12, alpha ; this


    getRed      : ->
        @getFloat32 0

    getGreen    : ->
        @getFloat32 4

    getBlue     : ->
        @getFloat32 8

    getAlpha    : ->
        @getFloat32 12
        
class glBlendColor extends glColor
    bufferType  : BLEND_COLOR
    constructor : ( options, Object = glBlendColor ) ->
        super( options, Object )

class glClearColor extends glColor
    bufferType  : COLOR_CLEAR_VALUE
    constructor : ( options, Object = glClearColor ) ->
        super( options, Object )

class glState extends Buffer
    bufferType : STATE
    bufferSize : 236

    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glActiveTexture.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture
    activeTexture : 0 
    # 4 <GLenum> texture


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glBlendColor.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor
    blendColor : 4                  
    # 12 <GLfloat> red, <GLfloat> green, <GLfloat> blue, <GLfloat> alpha


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glBlendEquation.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation
    blendEquation : 16              
    # 4 <GLenum> mode) 


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glBlendEquationSeparate.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquationSeparate
    blendEquationSeparate : 20  
    # 8 <GLenum> modeRGB, <GLenum> modeAlpha


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glBlendFunc.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc
    blendFunc : 28              
    # 8 <GLenum> sfactor, <GLenum> dfactor


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glBlendFuncSeparate.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate
    blendFuncSeparate : 36
    # 16 <GLenum> srcRGB, <GLenum> dstRGB, <GLenum> srcAlpha, <GLenum> dstAlpha


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glClearColor.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor
    clearColor : 52                 
    # 4:index <GLclampf> red, <GLclampf> green, <GLclampf> blue, <GLclampf> alpha


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glClear.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear
    clearMask : 60
    # 4 <GLbitfield> mask ( COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT | STENCIL_BUFFER_BIT )


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glClearDepthf.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth
    clearDepth : 68
    # 4 <GLclampf> depth [ 0, 1 ]


    # http://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glClearStencil.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil
    clearStencil : 72
    # 1 <GLint> s ( STENCIL_CLEAR_VALUE^ = 1 )


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glColorMask.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/colorMask
    colorMask : 73
    # 4 <GLboolean> red, <GLboolean> green, <GLboolean> blue, <GLboolean> alpha ( COLOR_WRITEMASK )


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glCullFace.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace
    cullFace : 77
    # 4 <GLenum> mode ( FRONT | BACK^ | FRONT_AND_BACK )


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDepthFunc.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc
    depthFunc : 81
    # 4 <GLenum> func


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDepthMask.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthMask
    depthMask : 85
    # 1 <GLboolean> flag


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDepthRangef.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthRange
    depthRange : 86
    # 8 <GLclampf> zNear, <GLclampf> zFar


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDisable.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/disable
    disable : 92
    # 4 + 40 <GLenum> cap


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glEnable.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enable
    enable : 96
    # 4 + 40 <GLenum> cap


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glFrontFace.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/frontFace
    frontFace : 100
    # 4 <GLenum> mode


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glHint.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/hint
    hint : 104
    # 8 <GLenum> target, <GLenum> mode


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glLineWidth.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/lineWidth
    lineWidth : 112
    # 4 <GLfloat> width


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glPixelStorei.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei
    pixelStorei : 116
    # 8 <GLenum> pname, <GLint> param


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glPolygonOffset.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/polygonOffset
    polygonOffset : 124
    # 8 <GLfloat> factor, <GLfloat> units

    
    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glSampleCoverage.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/sampleCoverage
    sampleCoverage : 132
    # 6 <GLclampf> value, <GLboolean> invert


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glStencilFunc.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc
    stencilFunc : 138
    # 12 <GLenum> func, <GLint> ref, <GLuint> mask


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glStencilFuncSeparate.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate
    stencilFuncSeparate : 160
    # 16 <GLenum> face, <GLenum> func, <GLint> ref, <GLuint> mask


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glStencilMask.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilMask
    stencilMask : 176
    # 4 <GLuint> mask


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glStencilMaskSeparate.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilMaskSeparate
    stencilMaskSeparate : 180
    # 8 <GLenum> face, <GLuint> mask


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glStencilOp.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilOp
    stencilOp : 188
    # 12 <GLenum> fail, <GLenum> zfail, <GLenum> zpass


    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glStencilOpSeparate.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilOpSeparate
    stencilOpSeparate : 200
    # 16 <GLenum> face, <GLenum> fail, <GLenum> zfail, <GLenum> zpass
    

    #* ----------------------------> 216 (bytes) <-----------------------------


    # any
    #
    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGet.xml
    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetString.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter
    #
    # <GLenum>
    getParameter    : ( pname ) ->


    # [WebGLHandlesContextLoss] <GLenum>
    #
    # If the context's webgl context lost flag is set, returns CONTEXT_LOST_WEBGL 
    # the first time this method is called. Afterward, returns NO_ERROR until 
    # the context has been restored.
    #
    # https://www.khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetError.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError
    getError        : ->


    # [WebGLHandlesContextLoss] <GLboolean>
    # 
    # For any isEnabled query, the same boolean value can be obtained via 
    # getParameter. Returns false if the context's webgl context lost flag is set.
    #
    # https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glIsEnabled.xml
    # https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/isEnabled
    #
    # <GLenum> cap
    isEnabled       : ( cap ) ->

class glShader extends Buffer
    bufferType      : SHADER
    bufferSize      : 8

    enabled         : 4

    constructor     : ( source = "", Object = glShader ) ->
        super( Object )
            .setBufferType @bufferType
            .setSource source

    compile         : ( gl ) ->
        gl ?= @program().context().get()
        
        unless @set shader = gl.createShader @getBufferType()
            throw ["Failed to create shader!", this]

        gl.shaderSource shader, @source()
        gl.compileShader shader

        unless gl.getShaderParameter shader, COMPILE_STATUS
            gl.deleteShader shader ; shader = null
            throw [ "Failed to compile shader", @source() ]
        
        return this

    attach          : ->
        @program().attach @get() ; @
        
    enable          : ->
        @setUint8 @enabled, 1
        
    disable         : ->
        @setUint8 @enabled, 0

    setSource       : ( source = "" ) ->
        buffer = Text::encode source
        length = @toBuffer().byteLength - @constructor::bufferSize - @headerSize
        offset = @alloc buffer.byteLength - length, @headerSize
        Memory.Uint8Array.set buffer, offset + @constructor::bufferSize ; @

    source          : ->
        Memory.toString( this, glShader::bufferSize )


    offsetProgram   : 0
    program         : ( program ) ->
        return new Index @getUint32 @offsetProgram unless program?
        @setUint32 @offsetProgram, program ; return this


class glVertexShader extends glShader
    bufferType  : VERTEX_SHADER
    constructor : ( source, Object = glVertexShader ) ->
        super( source, Object )
    
class glFragmentShader extends glShader
    bufferType  : FRAGMENT_SHADER
    constructor : ( source, Object = glFragmentShader ) ->
        super( source, Object )

class glAttribute extends Buffer
    bufferType : SEPARATE_ATTRIBS
    bufferSize : 56
    
    lengthAttributeName : 36
    offsetAttributeName : 0

    offsetLocationIndex : 36
    offsetNumComponents : 37
    offsetAttrValueType : 38
    offsetNormalizeStat : 40
    
    offsetEnabledStatus : 41
    offsetAttribsStride : 42
    offsetAttribsOffset : 43
    
    offsetInLeavedIndex : 44
    offsetVerticesIndex : 48

    offsetProgram   : 52

    constructor         : ( name, size, type, Object = glAttribute ) -> 
        super( Object ).create({ name, size, type })
        
    create              : ( options ) ->
        for label, value of options then switch label
            when "name"   then @setAttributeName value
            when "size"   then @setNumComponents value
            when "type"   then @setAttrValueType value
            when "index"  then @setLocationIndex value
            when "stride" then @setAttribsStride value
            when "offset" then @setAttribsOffset value
        return @

    name                : -> @getAttributeName()
    size                : -> @getNumComponents()
    type                : -> @getAttrValueType()

    info                : ->
        gl = @program().context().get()
        program = @program().get()



    enable              : ->
        return 
        console.log @enableVertexAttribArray(0)
        console.log @getVertexAttribOffset(0)
        console.log @getVertexAttrib(0)
        console.log @program().context().get().getActiveAttrib @program().get(), 0
    
    buffer              : ->
        @setVerticesIndex id = ___.createBuffer()
        ___.bindBuffer ARRAY_BUFFER, id
        ___.bufferData ARRAY_BUFFER, new Float32Array(@getNumComponents()*10), STATIC_DRAW
        @

    pointer             : ->
        ___.vertexAttribPointer(
            @getLocationIndex(), @getNumComponents(), @getAttrValueType(),
            @getNormalizeStat(), @getAttribsStride(), @getAttribsOffset()
        ) ; @

    gl_Location         : ->
        ___.getAttribLocation @getProgram(), @getAttributeName()

    setAttributeName    : ( name ) ->
        @writeText name, @offsetAttributeName, @lengthAttributeName

    setLocationIndex    : ( index ) ->
        @setUint8 @offsetLocationIndex, index
        
    setNumComponents    : ( count ) ->
        @setUint8 @offsetNumComponents, count

    setAttrValueType    : ( TYPE = FLOAT ) ->
        @setUint16 @offsetAttrValueType, TYPE

    setNormalizeStat    : ( normalized = no ) ->
        @setUint8 @offsetNormalizeStat, normalized

    setEnabledStatus    : ( status = 1 ) ->
        @setUint8 @offsetEnabledStatus, status ; this

    setAttribsStride    : ( stride ) ->
        @setUint8 @offsetAttribsStride, stride ; this

    setAttribsOffset    : ( offset ) ->
        @setUint8 @offsetAttribsOffset, offset ; this

    setInLeavedIndex    : ( index ) ->        
        @setUint32 @offsetInLeavedIndex , index ; this

    setVerticesIndex    : ( index ) ->
        @setUint32 @offsetVerticesIndex , index ; this


    getAttributeName    : ->
        Memory.toString( @, @offsetAttributeName, @lengthAttributeName)

    getLocationIndex    : ->
        @getUint8 @offsetLocationIndex

    getNumComponents    : ->
        @getUint8 @offsetNumComponents

    getAttrValueType    : ->
        @getUint16 @offsetAttrValueType

    getNormalizeStat    : ->
        Boolean @getUint8 @offsetNormalizeStat

    getAttrValueByte    : ->
        switch @getAttrValueType()
            when FLOAT, INT, UNSIGNED_INT
                return 4
            when SHORT, UNSIGNED_SHORT
                return 2
            when BYTE, UNSIGNED_BYTE
                return 1
        return throw /Unknown attribute value type!/

    getAttribsStride    : ->
        @getUint8 @offsetAttribsStride

    getAttribsOffset    : ->
        @getUint8 @offsetAttribsOffset

    getEnabledStatus    : ->
        @getUint8 @offsetEnabledStatus

    getInLeavedIndex    : ->
        @getUint32 @offsetInLeavedIndex

    getVerticesIndex    : ->
        @getUint32 @offsetVerticesIndex


    delInLeavedIndex    : ->
        @setUint32 @offsetInLeavedIndex , 0 ; this


    program         : ( program ) ->
        return new Index @getUint32 @offsetProgram unless program?
        @setUint32 @offsetProgram, program ; return this        

class glAttributes extends Buffer
    bufferType : INTERLEAVED_ATTRIBS
    bufferSize : 8

    offsetStrideType    : 0
    offsetStrideBytes   : 2
    offsetStrideLength  : 3

    program : 4

    constructor     : ( ...attributes, Object = glAttributes ) ->
        super( Object )
            .setContainer new Array
            .addAttributes attributes

    setContainer    : ( container ) ->
        @with = container ; this

    addAttributes   : ( attributes ) ->
        @addAttribute a for a in attributes ; @

    addAttribute    : ( attr ) ->
        unless @with.includes attr
            @with[ @getAttributes().length ] = attr
            
        return @recalc()

    setStrideType   : ( type ) ->
        @setUint16 @offsetStrideType, type ; this

    setStrideBytes  : ( bytes ) ->
        @setUint8 @offsetStrideBytes, bytes ; this

    setStrideLength : ( stride ) ->
        @setUint8 @offsetStrideLength, stride ; this


    getStrideLength : ->
        @getUint8 @offsetStrideLength

    getStrideBytes  : ->
        @getUint8 @offsetStrideBytes

    getStrideType   : ->
        @getUint16 @offsetStrideType

    getAttributes   : ->
        @with.filter Boolean
    

    recalc          : ->
        length = 0

        count = @getAttributes().length
        while count--
            attr = @with[ count ]
            attr.setAttribsOffset length 
            length += attr.getNumComponents()

        @setStrideType type = attr.getAttrValueType()
        @setStrideBytes bytes = attr.getAttrValueByte()
        @setStrideLength stride = length * bytes

        count = @getAttributes().length
        while count--
            attr = @with[ count ]
            attr.setAttribsOffset bytes * attr.getAttribsOffset()
            attr.setAttribsStride stride                
            attr.setInLeavedIndex this

        return this

    setProgram          : ( index ) ->
        @setUint32 @program, index ; this

    getProgram          : ( index ) ->
        ___[ index ? @getUint32 @program ]

class glUniform extends Buffer
    bufferType  : UNIFORM_BUFFER

    lengthName  : 32
    offsetName  : 4

    offsetProgram : 0

    constructor : ( options, Object = glUniform ) ->
        super( Object ).create( options )

    create      : ( options = {} ) ->
        @setUniformName options.name if options.name
        @setUniformIndex options.index if options.index
        @

    name        : ->
        @getUniformName()

    gl_Location         : ->
        ___.getUniformLocation @getProgram(), @getUniformName()

    setLocationIndex    : ( index ) ->
        ___[ this ] = index

    getLocationIndex    : ->
        ___[ this ]

    setUniformName      : ( name ) ->
        @writeText name, @offsetName, @lengthName 

    getUniformName      : ->
        Memory.toString @, @offsetName, @lengthName

    program             : ( program ) ->
        return @getUint32 @offsetProgram unless program?
        @setUint32 @offsetProgram, program ; return this        

class glUniformNf extends glUniform
    bufferType  : UNIFORMNF_BUFFER
    bufferSize  : 52
    
    offsetV0    : 36
    offsetV1    : 40
    offsetV2    : 44
    offsetV3    : 48

    constructor : ( options, Object = glUniformNf ) ->
        super( options, Object )

    create      : ( options = {} ) ->
        super( options )
        @setUniformV0 options.v0 if options.v0
        @setUniformV1 options.v1 if options.v1
        @setUniformV2 options.v2 if options.v2
        @setUniformV3 options.v3 if options.v3

    setUniformV0    : ( value ) ->
        @setFloat32 @offsetV0, value

    setUniformV1    : ( value ) ->
        @setFloat32 @offsetV1, value

    setUniformV2    : ( value ) ->
        @setFloat32 @offsetV2, value

    setUniformV3    : ( value ) ->
        @setFloat32 @offsetV3, value

    getUniformV0    : ->
        @getFloat32 @offsetV0

    getUniformV1    : ->
        @getFloat32 @offsetV1

    getUniformV2    : ->
        @getFloat32 @offsetV2

    getUniformV3    : ->
        @getFloat32 @offsetV3

class glUniform1f extends glUniformNf
    bufferType  : UNIFORM1F_BUFFER
    bufferSize  : 40

    constructor : ( name, value, Object = glUniform1f ) ->
        super( { name, value }, Object )

    create      : ( options = {} ) ->
        super { ...options, v0: options.value }

class glUniform2f extends glUniformNf
    bufferType  : UNIFORM2F_BUFFER
    bufferSize  : 44

    constructor : ( name, v0, v1, Object = glUniform2f ) ->
        super( { name, v0, v1 }, Object )

class glUniform3f extends glUniformNf
    bufferType  : UNIFORM3F_BUFFER
    bufferSize  : 48

    constructor : ( name, v0, v1, v2, Object = glUniform3f ) ->
        super( { name, v0, v1, v2 }, Object )

class glUniform4f extends glUniformNf
    bufferType  : UNIFORM4F_BUFFER
    bufferSize  : 52

    constructor : ( name, v0, v1, v2, v3, Object = glUniform4f ) ->
        super( { name, v0, v1, v2, v3 }, Object )


Object.defineProperties Buffer::, {
    "[[Instance]]" : get : ->
        byte = Memory.offset[ this ]
        size = @getBufferSize()-@headerSize 

        object : Memory.buffer.slice byte, byte + size
        header : {
            buffer : Memory.buffer.slice byte-@headerSize, byte
            typeof : @getBufferType()
            offset : byte
            bufferSize : {
                header : @headerSize
                object : size
            }
            linkus : @getBufferLink()
        }
        Memory : Memory
}
    
export default exports = {
    Memory,
    Index,
    Matrix4,
    Vector3,
    glProgram,
    glAttribute,
    glAttributes,
    glVertexShader,
    glFragmentShader,
    glPerspective,
    glColor,
    glBlendColor,
    glClearColor,
    glUniform1f,
    glUniform2f,
    glUniform3f,
    glContext,
    glUniform4f,
    glState
}
