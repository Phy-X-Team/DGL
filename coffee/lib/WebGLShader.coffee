import WebGLObject from "./WebGLObject.js"
import GL_CONSTANT from "./GL_CONSTANT.js"

export class SHADER_TYPE extends GL_CONSTANT
    constructor : ( GL_CONST = 35663 ) -> super GL_CONST
export class VERTEX_SHADER extends SHADER_TYPE
    constructor : -> super 35633
export class FRAGMENT_SHADER extends SHADER_TYPE
    constructor : -> super 35632



export default class WebGLShader extends WebGLObject

    @bufferType : new SHADER_TYPE 
    @bufferSize : 8

    constructor : ( options, prototype = WebGLShader ) ->
        super( prototype ).setOptions( options )

    setOptions  : ( options = {} ) ->

        unless typeof options isnt "string"
            options = source : options

        unless ! options.source
            @source = options.source

        this

    Object.defineProperty WebGLShader::, "source", {
        get : ->
            @decode @buffer( Uint8Array, 
                @get( 0, Uint16Array ), @get( 1, Uint16Array)
            )

        set : ( value ) ->
            bufferSize = @bufferSize()
            textBuffer = @encode value

            textLength = textBuffer.byteLength
            byteLength = bufferSize + textLength

            offset = @realloc byteLength
            textOffset = offset + bufferSize

            @move offset, byteLength
            @copy textBuffer, textOffset

            skipStart = @constructor.OBJECT_BYTELENGTH
            trimEnd = @offsetEnd() - textOffset - textLength

            @set 0, trimEnd, Uint16Array
            @set 1, skipStart, Uint16Array
    }   

export class WebGLVertexShader extends WebGLShader
    @bufferType : new VERTEX_SHADER
    constructor : ( options, prototype = WebGLVertexShader ) ->
        super( options, prototype )

export class WebGLFragmentShader extends WebGLShader
    @bufferType : new FRAGMENT_SHADER
    constructor : ( options, prototype = WebGLFragmentShader ) ->
        super( options, prototype )


export { WebGLShader }


