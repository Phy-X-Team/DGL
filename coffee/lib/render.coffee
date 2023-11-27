import { gl, aspectRatio, canvas } from "./canvas.js"
import { Perspective } from "./camera.js"
import PhyX from "./PhyX.js"



vert = '
    precision mediump int;
    precision mediump float;

    uniform   mat4 u_Transform;
    uniform  float u_PointSize;

    attribute vec3 a_Vertex;
    attribute vec3 a_Color;

    varying vec4 v_Color;

    void main() {
        gl_Position = u_Transform * vec4(a_Vertex, 1.0);
        gl_PointSize = u_PointSize;
        v_Color = vec4(a_Color, 1.0);
    }
'
frag = '
    precision mediump int;
    precision mediump float;

    varying vec4 v_Color;

    void main() {
        gl_FragColor = v_Color;
    }
'


console.warn global.phyX = new PhyX( window )
#console.error global.boo = new phyX.Boolean( true )
console.error global.str = new phyX.String( "özgürr" )

class ShaderSource extends PhyX::String
    constructor :
        ( source , proto = ShaderSource ) -> super source , proto

    @static source :
        get : -> ( @id or @valueOf() ).decode( ShaderSource )
        set : -> @set arguments[ 0 ]

    [ Symbol.toPrimitive ] : ( hint ) ->
        return @value if hint is "string"
        return @id if hint is "number"  

        throw console.error [ this, arguments:arguments ]
        
        return @id if hint is "number"
        return @buffer if hint is "default"

class VertexBuffer extends PhyX::Float32Array
    
    gl : gl 

    constructor : ( length , proto = VertexBuffer ) ->
        super length , proto

    [ Symbol.toPrimitive ] : ( hint ) ->
        return @id if hint is "number"

        throw console.trace [ this, arguments:arguments ]

        return @toString() if  hint is "string"
        return @buffer if hint is "default"

global.vShaderSource = new ShaderSource vert
global.fShaderSource = new ShaderSource frag

console.log global.vShaderSource

gLProgram = null

#. Get locations of our variables
a_Color_location     = 
a_Vertex_location    = 
u_Transform_location = 
buf_locationVertex   =
u_PointSize_location = null
compileShader   = ( source, type ) ->
    #+ Create shader with type
    unless shader = gl.createShader type
        throw ["Failed to create shader!", type]
    
    #+ Create sgader soyrce
    gl.shaderSource shader, source

    #: Compile shader to use
    gl.compileShader shader

    #. Check compile status
    unless checks = gl.getShaderParameter shader, gl.COMPILE_STATUS
        throw [ "Failed to compile shader", source, gl.deleteShader shader ]
    
    #* Response with compiled shader
    return shader 

export hex2rgb = gl.hex2rgb;
export render = ->

do ->
    #+ Create program
    #+ Fetch and compile shaders
    s_Vertex = compileShader global.vShaderSource, gl.VERTEX_SHADER
    s_Fragment = compileShader global.fShaderSource, gl.FRAGMENT_SHADER

    unless buf_locationVertex = gl.createBuffer()
        return throw ["Failed to create the location vertex buffer!"]

    #. Make the buffer object the active buffer.
    gl.bindBuffer gl.ARRAY_BUFFER, buf_locationVertex

    #+ Create gl program
    unless gLProgram = gl.program s_Vertex, s_Fragment
        throw [ "Failed to create shaders program!" ]

    gl.clearColor 0.0, 0.0, 0.0, 1.0
    gl.clear gl.CLEAR_BUFFER_BITS

    
    #* Response with program
    gLProgram

    #. Get locations of our variables
    a_Color_location     = gl.getAttribLocation  gLProgram, 'a_Color'
    a_Vertex_location    = gl.getAttribLocation  gLProgram, 'a_Vertex'
    u_Transform_location = gl.getUniformLocation gLProgram, 'u_Transform'
    u_PointSize_location = gl.getUniformLocation gLProgram, 'u_PointSize'

    

#? 2 4 90 45
#? 3 1 60 60
#? 4 8 45 22.5
#? 5 1 36 0
#? 6 12 30 15
#? 7 1 25.7 15
#? 8 16 22.5 11.25
#? 9 1 20 0
#? 10 20 18 9
#? 11 1 16.36 0
#? 12 24 15 7.5
#? 13 1 13.8 0
#? 14 28 12.85 6.42
#? 15 1 12 0
#? 16 32 11.25 5.625
#? 17 1 10.58 0
#? 18 36 10 5
#? 19 1 9.47 0
#? 20 40 9 4.5



data_transform = null
round = null
vertexCount = 0

DRAW_FUNC = gl.TRIANGLES
LINE_FUNC = gl.LINE_STRIP

colorizeArray = ( array = new Float32Array, color ) ->
    length = array.length
    result = new array.constructor length

    colors = [ color, color, color ] if !isNaN color
    colors = [ Math.random(), 1, Math.random() ] unless color
    colors = color unless colors

    i = 0
    while i < length
        result.set colors, i
        i += colors . length

    result


drawTriangles = ( triangleCount = 1, size = 1, startAngle = 0, totalAngle = 2 * Math.PI, z = 0 ) ->

    vertexCount = triangleCount * 3
    valuesCount = triangleCount * 9
    vertexArray = new Float32Array valuesCount

    a  = t = ( totalAngle ) / ( triangleCount + 2 )
    i  = 0

    #t -= (startAngle - Math.PI / 2) 
    t -= a / 2
    t -= startAngle 
    #t -= (totalAngle / 2) / 2 + a / if triangleCount % 2 then -2 else 2

    x  = size * Math.cos t
    y  = size * Math.sin t

    while valuesCount > i

        vertexArray[i++] = x
        vertexArray[i++] = y
        vertexArray[i++] = z
        t += a

        vertexArray[i++] = size * Math.cos t
        vertexArray[i++] = size * Math.sin t
        vertexArray[i++] = z
        t += a

        vertexArray[i++] = size * Math.cos t
        vertexArray[i++] = size * Math.sin t
        vertexArray[i++] = z
        t -= a

    vertexArray

drawTriangleFan = ( triangleCount = 1, size = 1 ) ->
    DRAW_FUNC = gl.TRIANGLE_FAN
    LINE_FUNC = gl.LINE_LOOP

    vertexCount = triangleCount + 2
    valuesCount = vertexCount * 3


    round = {
        label : "round"
        data_vertex : new Float32Array( valuesCount )
        data_color : new Float32Array( valuesCount )
        translateX : 0
        translateY : 0
        translateZ : -1.0
        scaleX : 1
        scaleY : 1
        scaleZ : 1
        rotateX : 0
        rotateY : 0
        rotateZ : 0
    }

    a = 2 * Math.PI / vertexCount
    t = -Math.PI / ( if (vertexCount/2)%2 then -2 else vertexCount )
    c = [ 1, 1, 0 ]
    i = 0

    while i < valuesCount
        round.data_color[i]     = c[0]
        round.data_color[i+1]   = c[1]
        round.data_color[i+2]   = c[2]

        round.data_vertex[i]    = size * Math.cos t
        round.data_vertex[i+1]  = size * Math.sin t

        t += a
        i += 3

    round.data_vertex


drawFPolygon    = ( count, size, startAngle, totalAngle ) -> drawTriangleFan count - 2, size, startAngle, totalAngle
drawFRect       = ( size ) -> drawPolygonFan 4, size, Math.PI/4
drawFCircle     = ( size, points = 100 ) -> drawPolygonFan points, size

drawPolygon     = ( count, size, startAngle, totalAngle ) -> drawTriangles count - 2, size, startAngle, totalAngle
drawRect        = ( size ) -> drawPolygon 4, size, Math.PI/4
drawCircle      = ( size, points = 100 ) -> drawPolygon points, size


#drawRectFan 1
#drawPolygonFan 4
#drawCircleFan()


#drawCircle 0.5
#drawRect 0.5

shape = drawPolygon 50, 0.5, -Math.PI / 2, Math.PI * 2
#shape = drawRect 0.4

round = {
    label : "round"
    data_vertex : shape
    data_color : colorizeArray shape, [ 0, 0, 0, 0, 0, 1, 0, 1, 0 ]
    translateX : 0
    translateY : 0
    translateZ : -1.0
    scaleX : 1
    scaleY : 1
    scaleZ : 1
    rotateX : 0
    rotateY : 0
    rotateZ : 0
}


console.log  round.data_vertex


render = ( objects ) ->

    #context.draw()

    return unless gLProgram
    
    data_transform = new Perspective( objects.scene.fov, aspectRatio )

    unless global.gLProgram?
        console.log global.gLProgram = gLProgram
        console.log data_transform, round

    for label, parameters of { ...objects, round }

        continue if label isnt "round"
        continue if label is "scene"

        {
            data_vertex, data_color, color, pointSize,
            translateX, translateY, translateZ,
            rotateX, rotateY, rotateZ,
            scaleX, scaleY, scaleZ
        } = parameters

        #TODO   burada arm'a uygulanacak view_matrix aslinda oncesinde base'de
        #TODO   olusturulmus
        #TODO   sonra uzantisi olan arm'a uygulanacak
        #TODO   yani loop'un oncesinde bir islem görmüs
        #TODO   

        ###
        unless view_matrix?
            view_matrix = new Phy_X.Index( camera )
            view_matrix.create({ 
                fovy    : objects.scene.fov, 
                aspct   : aspectRatio 
            })

        view_matrix.translate( translateX, translateY, translateZ )
        view_matrix.scale( scaleX, scaleY, scaleZ )
        view_matrix.rotate( rotateX, rotateY, rotateZ )
        ###


        data_transform.translate( ...[ translateX, translateY, translateZ ] )
        data_transform.scale( ...[ scaleX, scaleY, scaleZ ] )
        data_transform.rotate( ...[ rotateX, rotateY, rotateZ ] )


        #* Sending transform matrix
        gl.uniformMatrix4fv u_Transform_location, no, data_transform


        gl.buffer data_color
        gl.enableVertexAttribArray a_Color_location
        gl.vertexAttribPointer a_Color_location, 3, gl.FLOAT, no, 0, 0


        #. Upload the data for this buffer object to the GPU.
        gl.bindBuffer gl.ARRAY_BUFFER, buf_locationVertex
        gl.bufferData gl.ARRAY_BUFFER, data_vertex, gl.STATIC_DRAW

        gl.enableVertexAttribArray a_Vertex_location 
        gl.vertexAttribPointer a_Vertex_location, 3, gl.FLOAT, no, 0, 0
        

        #* Sending point size value
        gl.uniform1f u_PointSize_location, pointSize = 10

        #* Rendering at final
        gl.drawArrays DRAW_FUNC, 0, vertexCount


        gl.buffer data_color.slice().fill 0            
        gl.enableVertexAttribArray a_Color_location
        gl.vertexAttribPointer a_Color_location, 3, gl.FLOAT, no, 0, 0

        gl.drawArrays LINE_FUNC, 0, vertexCount


        gl.buffer data_color.slice().fill 1            
        gl.vertexAttribPointer a_Color_location, 3, gl.FLOAT, no, 0, 0

        gl.drawArrays gl.POINTS, 0, vertexCount


