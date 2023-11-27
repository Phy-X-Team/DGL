import {
    WebGLColor,
    WebGLObject,
    WebGLParameter,
    WebGLCapability,
    WebGLCampledFloat
} from "./WebGLObject.js"

import GL_CONSTANT from "./GL_CONSTANT.js"

export class GL_DEPTH_FUNC extends GL_CONSTANT
    constructor : ( GL_CONST = 2932 ) -> super GL_CONST

export class BLEND extends GL_DEPTH_FUNC
    constructor : -> super 3042


export class NEVER extends GL_DEPTH_FUNC
    constructor : -> super 512

export class LESS extends GL_DEPTH_FUNC
    constructor : -> super 513
    
export class EQUAL extends GL_DEPTH_FUNC
    constructor : -> super 514
    
export class LEQUAL extends GL_DEPTH_FUNC
    constructor : -> super 515
    
export class GREATER extends GL_DEPTH_FUNC
    constructor : -> super 516
    
export class NOTEQUAL extends GL_DEPTH_FUNC
    constructor : -> super 517
    
export class GEQUAL extends GL_DEPTH_FUNC
    constructor : -> super 518
    
export class ALWAYS extends GL_DEPTH_FUNC
    constructor : -> super 519


export CONTEXT      = 549
export CLEAR        = 359

export DEPTH_FUNC               = 2932
export DEPTH_CLEAR_VALUE        = 2931
export COLOR_CLEAR_VALUE        = 3106

export DEPTH_TEST               = 2929
#export BLEND                    = 3042
export CULL_FACE	            = 2284
export DITHER	                = 3024
export POLYGON_OFFSET_FILL	    = 32823
export SAMPLE_ALPHA_TO_COVERAGE	= 32926
export SAMPLE_COVERAGE	        = 32928
export SCISSOR_TEST	            = 3089
export STENCIL_TEST	            = 2960
export RASTERIZER_DISCARD	    = 35977

export class WebGLContext extends WebGLObject

    @bufferType : CONTEXT

    constructor : ( options = {}, prototype = WebGLContext ) ->
        super( prototype ).initialize( options ) 
        
    context     : ->
        WebGL2RenderingContext


export class WebGLContextCapability extends WebGLCapability
    @gl : {
        BLEND, DEPTH_TEST, CULL_FACE, POLYGON_OFFSET_FILL,
        SAMPLE_ALPHA_TO_COVERAGE, SAMPLE_COVERAGE, 
        SCISSOR_TEST, STENCIL_TEST, RASTERIZER_DISCARD
    }

export class WebGLClearColor extends WebGLColor

    apply    : -> @run "clearColor", ...arguments[0] 

    @bufferType : COLOR_CLEAR_VALUE
    constructor : ( options = {}, prototype = WebGLClearColor ) ->
        super( prototype ).initialize( options ) 
        
export class WebGLDepthTest extends WebGLContextCapability

    @bufferType : WebGLContextCapability.gl.DEPTH_TEST
    constructor : ( options = {}, prototype = WebGLDepthTest ) ->
        super( prototype ).initialize( options ) 

export class WebGLDepthFunc extends WebGLParameter

    TypedArray : Uint16Array

    @gl :
        512 : new NEVER  , 513 : new LESS 
        514 : new EQUAL  , 515 : new LEQUAL
        518 : new GEQUAL , 519 : new ALWAYS
        516 : new GREATER, 517 : new NOTEQUAL

    apply    : -> @run "depthFunc", @value arguments[0]
    value    : -> WebGLDepthFunc.gl[ v = arguments[0]] ? v

    setValue : -> @function = arguments[0]    
    getValue : -> @function

    @bufferSize : 2 * Uint16Array.BYTES_PER_ELEMENT
    @bufferType : new GL_DEPTH_FUNC
    constructor : ( options = {}, prototype = WebGLDepthFunc ) ->
        super( prototype ).initialize( options ) 

    Object.defineProperty WebGLDepthFunc::, "function", {
        get : ->
            if !@get(0) and @set(0,1)
                return @value @set(1, @fetch())
            return @value @get(1)

        set : ( value ) ->
            @set 1, value
    }  


export class WebGLClearDepth extends WebGLCampledFloat

    apply    : -> @run "clearDepth", ...arguments[0] 

    setValue : -> @depth = arguments[0]    
    getValue : -> @depth

    @bufferType : DEPTH_CLEAR_VALUE
    constructor : ( options = {}, prototype = WebGLClearDepth ) ->
        super( prototype ).initialize( options ) 

    Object.defineProperty WebGLClearDepth::, "depth", {
        get : ->
            if !@get(0) and @set(0,1)
                return @set(1, @fetch())
            return @get(1)

        set : ( value ) ->
            @set 1, value
    }            
        
export class WebGLClear extends WebGLObject

    @bufferSize : 4
    @bufferType : CLEAR
    constructor : ( options = {}, prototype = WebGLClear ) ->
        super( prototype ).initialize( options ) 
      
        
WebGLObject.defineProperties WebGLContext, {
    depthTest   : class : WebGLDepthTest
    depthFunc   : class : WebGLDepthFunc
    clearColor  : class : WebGLClearColor
    clearDepth  : class : WebGLClearDepth
    clear       : class : WebGLClear
}

export default WebGLContext
