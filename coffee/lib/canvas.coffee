canvas      = document.querySelector "canvas"
width        = canvas.width = canvas.clientWidth * window.devicePixelRatio
height       = canvas.height = canvas.clientHeight * window.devicePixelRatio
aspectRatio  = width / height
gl           = canvas.getContext "webgl2"

{}.constructor.defineProperties gl, {

    #? Calculate only once not every frame
    CLEAR_BUFFER_BITS :
        value : gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT

    hex2rgb         :
        value       : ( hex ) ->
            unless /^#([A-Fa-f0-9]{3}){1,2}$/.test hex
                return throw new Error "Bad Hex: #{hex}"

            c = ( hex.substring(1).split '' )
            c = [ c[0], c[0], c[1], c[1], c[2], c[2] ] if c.length is 3
            c = '0x' + c.join ''

            r = ((c>>16)&255) / 255
            g = ((c>>8)&255) / 255
            b = ((c&255))   / 255

            return [ r, g, b ]

    #get             : value : ( byteOffset ) -> @space.getFloat32 byteOffset
    #set             : value : ( byteOffset, value ) -> @space.setFloat32 byteOffset, value
    
    buffer : value : ( d = new {}.constructor.Float32Array() ) ->
        #+ Create a buffer object
        unless id = @createBuffer()
            return throw ["Failed to create the buffer!"]

        #. Make the buffer object the active buffer.
        @bindBuffer @ARRAY_BUFFER, id

        #. Upload the data for this buffer object to the GPU.
        @bufferData @ARRAY_BUFFER, d, @STATIC_DRAW

        #* Response with created buffer id
        id

    enableDepth     :
        value       : ( test = gl.DEPTH_TEST, func = gl.LEQUAL, deep = 1.0 ) ->
            @enable       test
            @depthFunc    func
            @clearDepth   deep
            @
    
    program         :
        value       : ( s_Vertex, s_Fragment ) ->

            #+ Create gl program
            unless glProgram = @createProgram()
                return throw [ "Failed to create WebGL program!" ]

            #. Attach shaders to program
            this
                .attachShaders glProgram, s_Vertex, s_Fragment
                .linkProgram glProgram

            #: Checking link status
            unless link = @getProgramParameter glProgram, @LINK_STATUS
                try log = @getProgramInfoLog glProgram

                @deleteShaders s_Vertex, s_Fragment
                @deleteProgram glProgram

                return throw [ "Failed to link program:", log ? link ]

            
            @useProgram glProgram   
            @enableDepth gl.DEPTH_TEST, gl.LEQUAL, 1.0

            glProgram

    attachShaders   :
        value       : ( glProgram, s_Vertex, s_Fragment ) ->
            unless ! s_Vertex?
                @attachShader glProgram, s_Vertex 
                #+ Remember to use later
                glProgram.s_Vertex = s_Vertex
                                
            unless ! s_Fragment?
                @attachShader glProgram, s_Fragment 
                #+ Remember to use later
                glProgram.s_Fragment = s_Fragment

            return this
            
    deleteShaders   :
        value       : ( vShader, fShader ) ->
            @deleteShader vShader unless ! vShader?
            @deleteShader fShader unless ! fShader?
            @
}

export {
    gl,
    canvas,
    width,
    height,
    aspectRatio
}