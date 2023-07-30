import EventControl from "./event.js"
import { gl } from "./constant.js"

id = 0

export class Vertices extends Float32Array

export class Geometry extends Float32Array

    type : "raw"

    attribOffset : 0
    attribsLength : 0

    defaults : {
        color : "#bb0ca4"
        drawMode : gl.TRIANGLES
    }

    constructor : ( options = {} ) ->

        super( options.bufferLength )
        
        Object.defineProperties this, {
            gl       : value : options.gl
            id       : value : id++
            uuid     : value : crypto.randomUUID()
        }

        this.options = {
            ...options, ...@defaults,
        }

        this.create()

    setAttribute : ( location, size = 3, offset = @attribsByte ) ->
        @attribsLength += size
        gl.vertexAttribPointer( location, size, gl.FLOAT, no, @attribsLength * 4, offset );

    create : -> this

