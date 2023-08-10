import {
  gl,
  aspectRatio
} from "./canvas.js";

import {
  get
} from "./fetch.js";

import {
  Vector3,
  Point4,
  Matrix4
} from "./math.js";

import {
  Perspective
} from "./camera.js";

import {
  Plane,
  Box
} from "./box.js";

import * as Buffers from "../main.js";

import {
  Buffer
} from "../main.js";

self.gl = gl;

export var hex2rgb = gl.hex2rgb;

export var render = function(objects) {};

(async function() {
  var a_Color, a_Position, attrib, attrib2, attrib3, fShader, merged, program, vShader;
  program = new Buffers.glProgram();
  vShader = new Buffers.glVertexShader();
  fShader = new Buffers.glFragmentShader();
  a_Color = new Buffers.glAttribute();
  a_Position = new Buffers.glAttribute();
  console.warn(program);
  console.warn(vShader.setShaderSource((await get("./shaders/01.vert"))));
  console.warn(program.addShader(vShader));
  console.warn(fShader.setShaderSource((await get("./shaders/01.frag"))));
  console.warn(program.addShader(fShader));
  a_Color.setAttribName("a_Color");
  a_Color.setAttribSize(3);
  a_Color.setAttribType(gl.FLOAT);
  console.warn(program.addAttrib(a_Color));
  console.warn({a_Color, a_Position});
  return 1;
  program = new glProgram();
  vShader = (await get("./shaders/01.vert"));
  fShader = (await get("./shaders/01.frag"));
  program.setVertexShader(vShader);
  program.setFragmentShader(fShader);
  program.setAttirbute("a_Color", 4, gl.FLOAT);
  program.setAttirbute("a_Location", 3, gl.FLOAT);
  program.setAttirbute("a_Texture", 2, gl.FLOAT);
  console.warn("bufferBeforeMerged:", program.buffer.slice(), program.byteLength);
  console.warn("getVertexShader:", program.getVertexShader());
  console.warn("getFragmentShader:", program.getFragmentShader());
  console.warn("glSerperateAttrib:", attrib = program.find(35981));
  console.warn({
    getAttribName: attrib.getAttribName()
  });
  console.warn({
    getAttribSize: attrib.getAttribSize()
  });
  console.warn({
    getAttribType: attrib.getAttribType()
  });
  console.warn("glSerperateAttrib2:", attrib2 = program.getAttribute(564));
  console.warn("glSerperateAttrib3:", attrib3 = program.getAttribute(688));
  program.values(function(offset, type, byteLength) {
    var name, ref;
    name = ((ref = this[type]) != null ? ref.name : void 0) || glProgram.getPropertyName(type);
    return console.log("[program]", [name], {offset, type, byteLength});
  });
  return console.warn("mergeAttributes:", merged = program.mergeAttributes(attrib2, attrib3));
  program.values(function(offset, type, byteLength) {
    var name, ref;
    name = ((ref = this[type]) != null ? ref.name : void 0) || glProgram.getPropertyName(type);
    return console.log("[program]", [name], {offset, type, byteLength});
  });
  merged.values(function(offset, type, byteLength) {
    var name, ref;
    name = ((ref = this[type]) != null ? ref.name : void 0) || glProgram.getPropertyName(type);
    return console.log("[merged]", [name], {offset, type, byteLength});
  });
  return console.warn("bufferAfterMerged:", program.buffer.slice());
})();

(function() {
  var a_Color_location, a_Vertex_location, attribs, buffer, compileShader, createProgram, gLProgram, glAttribBuffer, u_PointSize_location, u_Transform_location, vertexAttrib;
  return 4;
  compileShader = async function(path, type) {
    var checks, shader, source;
    //+ Create shader with type
    if (!(shader = gl.createShader(type))) {
      throw ["Failed to create shader!", type];
    }
    
    //. Fetch text content of shader
    if (!(source = (await get(path)))) {
      throw ["Failed to fetch source!", path];
    }
    //+ Create sgader soyrce
    gl.shaderSource(shader, source);
    //: Compile shader to use
    gl.compileShader(shader);
    //. Check compile status
    if (!(checks = gl.getShaderParameter(shader, gl.COMPILE_STATUS))) {
      throw ["Failed to compile shader", source, gl.deleteShader(shader)];
    }
    
    //* Response with compiled shader
    return shader;
  };
  createProgram = async function(p_Vertex, p_Fragment) {
    var gLProgram, s_Fragment, s_Vertex;
    //+ Fetch and compile shaders
    [s_Vertex, s_Fragment] = [(await compileShader(p_Vertex, gl.VERTEX_SHADER)), (await compileShader(p_Fragment, gl.FRAGMENT_SHADER))];
    //+ Create gl program
    if (!(gLProgram = gl.program(s_Vertex, s_Fragment))) {
      throw ["Failed to create shaders program!"];
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.CLEAR_BUFFER_BITS);
    
    //* Response with program
    return gLProgram;
  };
  gLProgram = null;
  //. Get locations of our variables
  a_Color_location = a_Vertex_location = u_Transform_location = u_PointSize_location = null;
  attribs = {
    a_Vertex: {
      size: 3
    },
    a_Color: {
      size: 4
    }
  };
  (async function() {
    var p_Fragment, p_Vertex;
    //+ Create program
    gLProgram = (await createProgram(p_Vertex = "./shaders/01.vert", p_Fragment = "./shaders/01.frag"));
    //. Get locations of our variables
    a_Color_location = gl.getAttribLocation(gLProgram, 'a_Color');
    a_Vertex_location = gl.getAttribLocation(gLProgram, 'a_Vertex');
    u_Transform_location = gl.getUniformLocation(gLProgram, 'u_Transform');
    return u_PointSize_location = gl.getUniformLocation(gLProgram, 'u_PointSize');
  })();
  gl.enableVertexAttribBuffer = function(buffer, attribLocation, size, type = gl.FLOAT, normalized = false, stride, offset) {
    return 1;
  };
  buffer = null;
  vertexAttrib = {};
  glAttribBuffer = (function() {
    class glAttribBuffer extends ArrayBuffer {
      constructor(name, size, stride, offset) {
        super(64, {
          maxByteLength: 1e4
        });
        Object.defineProperties(this, {
          headers: {
            value: new DataView(this, 0, 64)
          },
          dataset: {
            get: function() {
              return new Float32Array(this, 64);
            }
          }
        });
        Object.assign(this, {name, size});
      }

    };

    glAttribBuffer.prototype.nameOffset = 0;

    glAttribBuffer.prototype.nameLength = 32;

    glAttribBuffer.prototype.sizeOffset = 32;

    return glAttribBuffer;

  }).call(this);
  Object.defineProperties(glAttribBuffer.prototype, {
    name: {
      get: function() {
        var code, i, j, name, ref;
        name = "";
        for (i = j = 0, ref = this.nameLength; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          code = this.headers.getUint8(i + this.nameOffset);
          if (!code) {
            break;
          }
          name = name + String.fromCharCode(code);
        }
        return name;
      },
      set: function(name) {
        var i, j, ref, ref1;
        for (i = j = 0, ref = this.nameLength; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          this.headers.setUint8(i, (ref1 = name.charCodeAt(i)) != null ? ref1 : 0);
        }
        return name;
      }
    },
    size: {
      get: function() {
        return this.headers.getUint8(this.sizeOffset);
      },
      set: function(size) {
        return this.headers.setUint8(this.sizeOffset, size);
      }
    },
    stride: {
      get: function() {
        return this.size * this.dataset.BYTES_PER_ELEMENT;
      }
    },
    offset: {
      get: function() {
        return 0;
      }
    }
  });
  gl.attribBuffer = function(name, data, size) {
    var a, attrib, bufferSize, i, item, j, k, offset, pointerLength, pointerSize, real_buffer, ref, sumDataCount, sumPointCount, sumPointLength, temp_buffer, view;
    attrib = vertexAttrib[name] != null ? vertexAttrib[name] : vertexAttrib[name] = {size};
    attrib.dataCount = Math.max(0, data.length);
    attrib.pointCount = Math.max(0, data.length / size);
    attrib.pointLength = Math.max(0, size * Float32Array.BYTES_PER_ELEMENT);
    sumPointLength = 0;
    sumPointCount = 0;
    sumDataCount = 0;
    for (k in vertexAttrib) {
      a = vertexAttrib[k];
      sumPointLength = a.pointLength + sumPointLength;
      sumPointCount = a.pointCount + sumPointCount;
      sumDataCount = a.dataCount + sumDataCount;
    }
    for (k in vertexAttrib) {
      a = vertexAttrib[k];
      a.sumPointLength = sumPointLength;
      a.sumPointCount = sumPointCount;
      a.sumDataCount = sumDataCount;
    }
    temp_buffer = new Float32Array(sumPointLength);
    real_buffer = buffer != null ? buffer : new Float32Array(length);
    item = 0;
    for (i = j = 0, ref = data; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      real_buffer[i] = temp_buffer[i];
    }
    temp_buffer = null;
    return buffer = real_buffer;
    offset = 0;
    bufferSize = 0;
    pointerSize = 0;
    pointerLength = 0;
    for (name in attribs) {
      attrib = attribs[name];
      bufferSize += attrib.size * size;
      attrib.pointerOffset = pointerSize;
      pointerSize += attrib.size;
      pointerLength += attrib.size * Float32Array.BYTES_PER_ELEMENT;
    }
    console.warn("writing", name);
    console.log("options", attrib);
    buffer = new Float32Array(bufferSize);
    buffer;
    return buffer;
    for (name in attribs) {
      attrib = attribs[name];
      attrib.index = gl.getAttribLocation(gLProgram, name);
      attrib.size = attrib.size;
      attrib.type = gl.FLOAT;
      attrib.normalized = false;
      attrib.stride = pointerSize;
      attrib.offset = offset;
      offset += attrib.size * Float32Array.BYTES_PER_ELEMENT;
    }
    view = new DataView(buffer.buffer);
    buffer.setData = function(label, data) {
      var attribIndex, bufferIndex, bufferOffset, dataIndex;
      attrib = attribs[label];
      console.warn(pointerSize, data);
      dataIndex = 0;
      bufferIndex = 0;
      while (dataIndex !== data.length) {
        attribIndex = 0;
        while (attribIndex !== attrib.size) {
          bufferOffset = (attrib.index * attrib.stride) + (bufferIndex * 4);
          console.warn({bufferOffset, bufferIndex, dataIndex, attribIndex}, data[dataIndex]);
          //buffer[ bufferIndex ] = data[ dataIndex ]
          view.setFloat32(bufferOffset, data[dataIndex]);
          dataIndex++;
          attribIndex++;
          bufferOffset++;
        }
        bufferIndex++;
      }
      return this;
    };
    return buffer;
  };
  hex2rgb = gl.hex2rgb;
  return render = function(objects) {
    var color, data_color, data_transform, data_vertex, e, j, label, parameters, pointSize, ref, rgba, rotateX, rotateY, rotateZ, scaleX, scaleY, scaleZ, translateX, translateY, translateZ;
    if (!gLProgram) {
      return;
    }
    data_transform = new Perspective(objects.scene.fov, aspectRatio);
    for (label in objects) {
      parameters = objects[label];
      ({data_vertex, data_color, color, pointSize, translateX, translateY, translateZ, rotateX, rotateY, rotateZ, scaleX, scaleY, scaleZ} = parameters);
      if (!data_vertex.length) {
        continue;
      }
      if (buffer == null) {
        try {
          gl.attribBuffer("a_Color", data_color, 4);
          gl.attribBuffer("a_Vertex", data_vertex, 3);
        } catch (error) {
          e = error;
          console.error(e);
        }
        if (buffer == null) {
          buffer = 1;
        }
      }
      return;
      data.pointCount = data.length / 3;
      data_transform.translate(...[translateX, translateY, translateZ]);
      data_transform.scale(...[scaleX, scaleY, scaleZ]);
      data_transform.rotate(...[rotateX, rotateY, rotateZ]);
      data_color = [];
      rgba = gl.hex2rgb(color);
      for (j = 0, ref = data.length; (0 <= ref ? j < ref : j > ref); 0 <= ref ? j++ : j--) {
        data_color.push(...rgba.slice(0, 3), 1);
      }
      gl.buffer(new Float32Array(data_color));
      gl.enableVertexAttribArray(a_Color_location);
      gl.vertexAttribPointer(a_Color_location, 3, gl.FLOAT, false, 0, 0);
      gl.buffer(new Float32Array(data));
      gl.enableVertexAttribArray(a_Vertex_location);
      gl.vertexAttribPointer(a_Vertex_location, 3, gl.FLOAT, false, 0, 0);
      //* Sending transform matrix
      gl.uniformMatrix4fv(u_Transform_location, false, data_transform);
      
      //* Sending point size value
      gl.uniform1f(u_PointSize_location, pointSize);
      //* Rendering at final
      gl.drawArrays(gl.TRIANGLES, 0, data.pointCount);
      gl.buffer(data_color.fill(1));
      gl.enableVertexAttribArray(a_Color_location);
      gl.vertexAttribPointer(a_Color_location, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.LINE_LOOP, 0, data.pointCount);
      gl.drawArrays(gl.POINTS, 0, data.pointCount);
    }
  };
})();
