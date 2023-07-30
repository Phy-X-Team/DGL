import { gl, aspectRatio } from "./canvas.js"
import { get } from "./fetch.js"
import { Vector3, Point4, Matrix4 } from "./math.js"
import { Perspective } from "./camera.js"
import { Plane, Box } from "./box.js"

compileShader   = ( path, type ) ->
    #+ Create shader with type
    unless shader = gl.createShader type
        throw ["Failed to create shader!", type]
    
    #. Fetch text content of shader
    unless source = await get path
        throw ["Failed to fetch source!", path]

    #+ Create sgader soyrce
    gl.shaderSource shader, source

    #: Compile shader to use
    gl.compileShader shader

    #. Check compile status
    unless checks = gl.getShaderParameter shader, gl.COMPILE_STATUS
        throw [ "Failed to compile shader", source, gl.deleteShader shader ]
    
    #* Response with compiled shader
    return shader 

createProgram   = ( p_Vertex, p_Fragment ) ->

    #+ Fetch and compile shaders
    [ s_Vertex, s_Fragment ] = [
        await compileShader p_Vertex, gl.VERTEX_SHADER
        await compileShader p_Fragment, gl.FRAGMENT_SHADER
    ]
    #+ Create gl program
    unless glProgram = gl.program s_Vertex, s_Fragment
        throw [ "Failed to create shaders program!" ]

    gl.clearColor 0.0, 0.0, 0.0, 1.0
    gl.clear gl.CLEAR_BUFFER_BITS

    
    #* Response with program
    glProgram


glProgram = null

#. Get locations of our variables
a_Color_location     = 
a_Vertex_location    = 
u_Transform_location = 
u_PointSize_location = null


do ->
    #+ Create program
    glProgram = await createProgram(
        p_Vertex = "./shaders/01.vert", 
        p_Fragment = "./shaders/01.frag"
    )

    #. Get locations of our variables
    a_Color_location     = gl.getAttribLocation  glProgram, 'a_Color'
    a_Vertex_location    = gl.getAttribLocation  glProgram, 'a_Vertex'
    u_Transform_location = gl.getUniformLocation glProgram, 'u_Transform'
    u_PointSize_location = gl.getUniformLocation glProgram, 'u_PointSize'


  
export render = ( objects ) ->

    return unless glProgram;

    data_transform = new Perspective( objects.scene.fov, aspectRatio )
    
    for object, parameters of objects

        {
            data, color, pointSize,
            translateX, translateY, translateZ,
            rotateX, rotateY, rotateZ,
            scaleX, scaleY, scaleZ
        } = parameters

        continue unless data.length
        data.pointCount = data.length / 3   

        data_transform  .translate( ...[ translateX, translateY, translateZ ] )
        data_transform      .scale( ...[ scaleX, scaleY, scaleZ ] )
        data_transform     .rotate( ...[ rotateX, rotateY, rotateZ ] )

        data_color = new Float32Array data.length * 3
        rgba = gl.hex2rgb color
        for i in [ 0 ... data.length ]
            for c, j in rgba
                data_color[ ( i * 3 ) + j ] = c

        gl.buffer data_color
        gl.enableVertexAttribArray a_Color_location
        gl.vertexAttribPointer a_Color_location, 3, gl.FLOAT, no, 0, 0

        gl.buffer new Float32Array data
        gl.enableVertexAttribArray a_Vertex_location 
        gl.vertexAttribPointer a_Vertex_location, 3, gl.FLOAT, no, 0, 0

        #* Sending transform matrix
        gl.uniformMatrix4fv u_Transform_location, no, data_transform
        
        #* Sending point size value
        gl.uniform1f u_PointSize_location, pointSize

        #* Rendering at final
        gl.drawArrays gl.TRIANGLES, 0, data.pointCount

        gl.buffer data_color.fill 1            
        gl.enableVertexAttribArray a_Color_location
        gl.vertexAttribPointer a_Color_location, 3, gl.FLOAT, no, 0, 0

        gl.drawArrays gl.LINE_LOOP, 0, data.pointCount
        gl.drawArrays gl.POINTS, 0, data.pointCount
