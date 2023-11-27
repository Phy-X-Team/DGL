import WebGLObject from "./WebGLObject.js"
import * as Shader from "./WebGLShader.js"
import GL_CONSTANT from "./GL_CONSTANT.js"
import { GL } from "./GL_CONSTANT.js"

export class PROGRAM extends GL_CONSTANT
    constructor : ( CONST = 536 ) -> super CONST


export default class WebGLProgram extends WebGLObject

    @bufferType : new PROGRAM #TODO GL.PROGRAM
    @bufferSize : 32

    constructor : ( options = {}, prototype = WebGLProgram ) ->
        super( prototype ).initialize( options )


export { WebGLProgram }


