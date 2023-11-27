encoder = new TextEncoder()
decoder = new TextDecoder()

export VECTOR3 = 518
export CONTEXT = 549
export PROGRAM = 536

BYTE_LENGTH = "BYTE_LENGTH"
HEADER_BYTELENGTH = 12
HEADERS_LENGTH = 3


HEADER_INDEX_END = 2
HEADER_INDEX_LENGTH = 3


export SHADER_SOURCE = 999
export SHADER_STATUS = 1018

export class GL2

    constructor : ( memory ) ->
        return unless memory

        class Headers extends Uint32Array

        class Pointer extends Number
    
        class WebGL2Object extends Number
            
            @byteLength = 0
            @headerSize = 12

            properties : new Object
            HEADERS_LENGTH : HEADERS_LENGTH

            encode : -> encoder.encode arguments[0] 
            decode : -> decoder.decode arguments[0].slice() 



            constructor : ( prototype, pointer ) ->
                super pointer ?= memory.allocate HEADER_BYTELENGTH, prototype.bufferType

                headers = @getHeaders()

                headers[0] = pointer.index()
                headers[1] = @byteLength()
                headers[2] = @OBJECT_TYPE

                #OBJECT_TYPE : prototype.objectType
                #@objectSize = byteLength - prototype.headerSize

            

            @property = ( type ) -> @::properties[ type ]

            @lengthOf   = ( property ) ->
                prototype = Object.getPrototypeOf this 
                unless Object.hasOwn this, property
                    unless Number is this
                        return @[ property ] or 0
                    return prototype[ property ]
                return prototype[ property ] + @[ property ]   

            @register = ( type, constructor ) ->
                @::properties[ type ] = constructor

            @define     = ( property, constructor ) ->
                Object.defineProperty @prototype, property, {
                    get : ->
                        console.warn "getting property object", index = @findPointer constructor::OBJECT_TYPE

                    set : ->
                        console.error "SETting property object"

                        unless index = @findPointer constructor::OBJECT_TYPE

                            object = new constructor()

                            console.warn "property not found at index creted:", object
                            
                            pointer = object.getPointer()
                            offset = @resize @byteLength() + 8

                            index = @byteLength() / 8

                            console.warn "pointer.index()", pointer.index(), offset:offset, index:index

                            @setUint32 index + 1, constructor::OBJECT_TYPE
                            @setUint32 index + 2, pointer.index()

                            object.value = arguments[0]

                            console.log { object, offset, pointer }
                            console.log "pointerheaders:", Array.from pointer.headers

                            #TODO move children pointers AFTER RESIZE
                            #TODO move children pointers AFTER RESIZE
                            #TODO move children pointers AFTER RESIZE
                            #TODO move children pointers AFTER RESIZE

                        else console.error "property found at index", index

                }

                Object.defineProperty constructor::, "value", {
                    get : ->
                        console.error "getting property VALUE", this
                        @get()

                    set : ->
                        console.error "setting property VALUE"
                        @set arguments[0]
                }

                @register constructor::OBJECT_TYPE, constructor

            @defineProperties   = ( properties = {} ) ->
                for property, constructor of properties
                    @define property, constructor
                    
                return @

            setUint32   : ( index = 0, value ) ->
                index += memory.headers[ @HEADER_INDEX_BEGIN() ] / 4
                index += HEADERS_LENGTH

                memory.U32Data[ index ] = value ; @

            getUint32   : ( index = 0 ) ->
                index += memory.headers[ @HEADER_INDEX_BEGIN() ] / 4
                index += HEADERS_LENGTH
                memory.U32Data[ index ]

            setUint32   : ( index = 0, value ) ->
                memory.setUint32 this, index, value

            getUint32   : ( index = 0 ) ->
                memory.getUint32 this, index

            children    : ->

            findPointer : ( OBJECT_TYPE, offset = 0 ) ->
                offset += HEADER_BYTELENGTH
                child = @getHeaders( offset )
                console.warn @getBuffer( Uint32Array )
                #console.error @getHeaders( offset )
                #console.error length = memory.headers.at( child[0] + 3 )
                #console.error offset,child[0], @getHeaders( offset + length + HEADER_BYTELENGTH )
                no

            resize      : ( byteLength ) ->
                headers = @getHeaders()
                pointer = @getPointer()

                byteOffset = headers[1]
                byteLength += HEADER_BYTELENGTH #TODO self header realloc
                pointer.byteLength = byteLength

                headers[0] = pointer.index()
                headers[1] = byteLength

                byteOffset

        class Uint8Object extends WebGL2Object
            bufferType : Uint8Array
            BYTES_PER_ELEMENT : Uint8Array.BYTES_PER_ELEMENT

        class Uint32Object extends WebGL2Object
            bufferType : Uint32Array
            BYTES_PER_ELEMENT : Uint32Array.BYTES_PER_ELEMENT

        class Float32Object extends WebGL2Object
            bufferType : Float32Array
            BYTES_PER_ELEMENT : Float32Array.BYTES_PER_ELEMENT

        Object.defineProperties WebGL2Object, {
            BYTES_PER_ELEMENT : get : ->
                Object.getPrototypeOf(@).BYTES_PER_ELEMENT
        }

        Object.defineProperties WebGL2Object::, {
            getBuffer : value : ( TypedArray = @bufferType, length, offset ) ->
                offset ?= @getPointer().byteOffset + HEADER_BYTELENGTH
                offset /= TypedArray.BYTES_PER_ELEMENT

                length ?= @getPointer().byteLength - HEADER_BYTELENGTH
                length /= TypedArray.BYTES_PER_ELEMENT
                
                finish  = offset + length 

                switch TypedArray
                    when Uint32Array then memory.U32Data.subarray offset, finish
                    when Float32Array then memory.F32Data.subarray offset, finish
                    else memory.Ui8Data.subarray offset, finish

            byteLength : value : ->
                @getPointer().getByteLength() - HEADER_BYTELENGTH
            
            getPointer : value : ->
                new memory.Pointer this * 1
            
            getHeaders : value : ( offset = 0 ) ->
                begin = @getPointer().byteOffset
                begin = begin + offset if offset
                end = begin + HEADER_BYTELENGTH
                memory.U32Data.subarray begin/4, end/4    
        }
        

        class WebGL2Vector extends Float32Object

            OBJECT_TYPE : VECTOR3

            constructor : ( options = {}, prototype = WebGL2Vector ) ->
                super prototype


        class WebGL2Context extends Uint8Object
            
            OBJECT_TYPE : CONTEXT

            constructor : ( options = {}, prototype = WebGL2Context ) ->
                super prototype


        class WebGL2Program extends Uint8Object

            OBJECT_TYPE : PROGRAM

            constructor : ( options = {}, prototype = WebGL2Program ) ->
                super prototype


        class Text extends Uint8Object
            constructor : ( text, prototype = Text ) ->

                buffer = prototype::encode text
                pointer = memory.allocate buffer.byteLength

                super( prototype, pointer ).set( buffer )

            encode      : ( string ) -> encoder.encode string

            decode      : ( buffer ) -> decoder.decode buffer.slice()

        class Bool extends Uint8Object
            constructor : ( bool, prototype = Bool ) ->
                super prototype, memory.allocate 4
                    .set bool

        class ShaderStatus extends Bool
            OBJECT_TYPE : SHADER_STATUS

            constructor : ( status, prototype = ShaderSource ) ->
                super status, prototype

            get         : ->
                console.error "property primitive value requested:", Boolean @getUint32(0)
                Boolean @getUint32(0)

            set         : ->
                console.error "property primitive value SET", arguments[0]
                @setUint32(0, arguments[0])

        class ShaderSource extends Text
            OBJECT_TYPE : SHADER_SOURCE

            constructor : ( source, prototype = ShaderSource ) ->
                super source, prototype

            get         : -> @decode @getBuffer()

            set         : ( source ) ->
                unless source?
                    source = new Uint8Array 0

                else if "string" is typeof source
                    source = @encode source

                else if source instanceof Uint8Array
                    source = source

                else if source instanceof memory.Pointer
                    source = memory.getBuffer source

                @resize source.byteLength.align 12
                @getBuffer().set( source )


        class WebGL2Shader extends Uint8Object

            constructor : ( options = {}, prototype = WebGL2Shader ) ->
                super prototype
                    .setOptions options

                this.status = true

            setOptions  : ( options ) ->

                for property, value of options
                    @[ property ] = value
                    
                return this

            WebGL2Shader.defineProperties(
                source : ShaderSource
                status : ShaderStatus
            )

        class WebGL2VertexShader extends WebGL2Shader

            OBJECT_TYPE : WebGL2RenderingContext.VERTEX_SHADER

            constructor : ( source, prototype = WebGL2VertexShader ) ->
                super { source }, prototype

        class WebGL2FragmentShader extends WebGL2Shader
            constructor : ( source, prototype = WebGL2FragmentShader ) ->
                super { source }, prototype

        class WebGL2 extends WebGL2Object
            Context : WebGL2Context
            Program : WebGL2Program
            VertexShader : WebGL2VertexShader
            FragmentShader : WebGL2FragmentShader
            Vector : WebGL2Vector

        return new WebGL2( WebGL2 )

export default GL2

