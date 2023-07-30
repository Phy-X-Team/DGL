var aspectRatio, canvas, gl, height, width;

canvas = document.querySelector("canvas");

width = canvas.width = canvas.clientWidth * window.devicePixelRatio;

height = canvas.height = canvas.clientHeight * window.devicePixelRatio;

aspectRatio = width / height;

gl = canvas.getContext("webgl2");

Object.defineProperties(gl, {
  //? Calculate only once not every frame
  CLEAR_BUFFER_BITS: {
    value: gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT
  },
  hex2rgb: {
    value: function(hex) {
      var b, c, g, r;
      if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        throw new Error(`Bad Hex: ${hex}`);
      }
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      r = ((c >> 16) & 255) / 255;
      g = ((c >> 8) & 255) / 255;
      b = (c & 255) / 255;
      return new Float32Array([r, g, b]);
    }
  },
  get: {
    value: function(byteOffset) {
      return this.space.getFloat32(byteOffset);
    }
  },
  set: {
    value: function(byteOffset, value) {
      return this.space.setFloat32(byteOffset, value);
    }
  },
  buffer: {
    value: function(data = new Float32Array()) {
      var id;
      //+ Create a buffer object
      if (!(id = this.createBuffer())) {
        throw ["Failed to create the buffer!"];
      }
      //. Make the buffer object the active buffer.
      this.bindBuffer(this.ARRAY_BUFFER, id);
      //. Upload the data for this buffer object to the GPU.
      this.bufferData(this.ARRAY_BUFFER, data, this.STATIC_DRAW);
      //* Response with created buffer id
      return id;
    }
  },
  enableDepth: {
    value: function(test = gl.DEPTH_TEST, func = gl.LEQUAL, deep = 1.0) {
      this.enable(test);
      this.depthFunc(func);
      this.clearDepth(deep);
      return this;
    }
  },
  program: {
    value: function(s_Vertex, s_Fragment) {
      var glProgram, link, log;
      //+ Create gl program
      if (!(glProgram = this.createProgram())) {
        throw ["Failed to create WebGL program!"];
      }
      //. Attach shaders to program
      this.attachShaders(glProgram, s_Vertex, s_Fragment).linkProgram(glProgram);
      //: Checking link status
      if (!(link = this.getProgramParameter(glProgram, this.LINK_STATUS))) {
        try {
          log = this.getProgramInfoLog(glProgram);
        } catch (error) {}
        this.deleteShaders(s_Vertex, s_Fragment);
        this.deleteProgram(glProgram);
        throw ["Failed to link program:", log != null ? log : link];
      }
      this.useProgram(glProgram);
      this.enableDepth(gl.DEPTH_TEST, gl.LEQUAL, 1.0);
      return glProgram;
    }
  },
  attachShaders: {
    value: function(glProgram, s_Vertex, s_Fragment) {
      if (!(s_Vertex == null)) {
        this.attachShader(glProgram, s_Vertex);
        
        //+ Remember to use later
        glProgram.s_Vertex = s_Vertex;
      }
      if (!(s_Fragment == null)) {
        this.attachShader(glProgram, s_Fragment);
        
        //+ Remember to use later
        glProgram.s_Fragment = s_Fragment;
      }
      return this;
    }
  },
  deleteShaders: {
    value: function(vShader, fShader) {
      if (!(vShader == null)) {
        this.deleteShader(vShader);
      }
      if (!(fShader == null)) {
        this.deleteShader(fShader);
      }
      return this;
    }
  }
});

export {
  gl,
  canvas,
  width,
  height,
  aspectRatio
};
