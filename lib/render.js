var a_Color, a_Merged, a_Position, aa, clearColor, fShader, program, u_PointSize, vObject, vShader;

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

program = new Buffers.glProgram();

clearColor = new Buffers.glColor();

vShader = new Buffers.glVertexShader();

fShader = new Buffers.glFragmentShader();

a_Color = new Buffers.glAttribute();

a_Position = new Buffers.glAttribute();

a_Merged = new Buffers.glInterleavedAttribute();

u_PointSize = new Buffers.glUniform1f();

vShader.setShaderSource('// Vertex Shader // By: Dr. Wayne Brown, Spring 2016 precision mediump int; precision mediump float; uniform   mat4 u_Transform; uniform  float u_PointSize; attribute vec3 a_Vertex; attribute vec3 a_Color; varying vec4 v_Color; void main() { gl_Position = u_Transform * vec4(a_Vertex, 1.0); gl_PointSize = u_PointSize; v_Color = vec4(a_Color, 1.0); }');

fShader.setShaderSource('// Fragment shader // By: Dr. Wayne Brown, Spring 2016 precision mediump int; precision mediump float; varying vec4 v_Color; void main() { gl_FragColor = v_Color; }');

clearColor.setRGBAColor(1, 1, 1, 1);

a_Color.setAttribName("a_Color");

a_Color.setAttribSize(4);

a_Color.setAttribType(gl.FLOAT);

a_Position.setAttribName("a_Position");

a_Position.setAttribSize(3);

a_Position.setAttribType(gl.FLOAT);

console.warn(program.byteLength, program.addBuffer(clearColor));

console.warn(program.byteLength, program.addShader(vShader));

console.warn(program.byteLength, program.addShader(fShader));

console.warn(a_Merged.addAttrib(a_Color));

console.warn(a_Merged.addAttrib(a_Position));

console.warn(u_PointSize.setUniformName("u_PointSize"));

console.warn(u_PointSize.setUniformValue(10));

console.warn(program.byteLength, program.addAttrib(a_Merged));

console.warn(program.byteLength, program.addUniform(u_PointSize));

console.warn(program.byteLength, program);

console.warn(vObject = new Buffers.glObject());

console.warn(program.addBuffer(vObject));

aa = 1;

(function() {
  var a_Color_location, a_Vertex_location, compileShader, createProgram, gLProgram, u_PointSize_location, u_Transform_location;
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
  return render = function(objects) {
    var color, data_color, data_transform, data_vertex, label, parameters, pointCount, pointSize, results, rotateX, rotateY, rotateZ, scaleX, scaleY, scaleZ, translateX, translateY, translateZ;
    if (!gLProgram) {
      return;
    }
    data_transform = new Perspective(objects.scene.fov, aspectRatio);
    results = [];
    for (label in objects) {
      parameters = objects[label];
      ({data_vertex, data_color, color, pointSize, translateX, translateY, translateZ, rotateX, rotateY, rotateZ, scaleX, scaleY, scaleZ} = parameters);
      data_color = new Float32Array(data_color);
      data_vertex = new Float32Array(data_vertex);
      if (!data_vertex.length) {
        continue;
      }
      if (aa++ === 1) {
        if (label === "base") {
          console.log(data_vertex);
          vObject.setBufferData(data_vertex, Float32Array);
        }
      }
      pointCount = data_vertex.length / 3;
      data_transform.translate(...[translateX, translateY, translateZ]);
      data_transform.scale(...[scaleX, scaleY, scaleZ]);
      data_transform.rotate(...[rotateX, rotateY, rotateZ]);
      gl.buffer(data_color);
      gl.enableVertexAttribArray(a_Color_location);
      gl.vertexAttribPointer(a_Color_location, 3, gl.FLOAT, false, 0, 0);
      gl.buffer(data_vertex);
      gl.enableVertexAttribArray(a_Vertex_location);
      gl.vertexAttribPointer(a_Vertex_location, 3, gl.FLOAT, false, 0, 0);
      //* Sending transform matrix
      gl.uniformMatrix4fv(u_Transform_location, false, data_transform);
      
      //* Sending point size value
      gl.uniform1f(u_PointSize_location, pointSize);
      //* Rendering at final
      gl.drawArrays(gl.TRIANGLES, 0, pointCount);
      gl.buffer(data_color.fill(1));
      gl.enableVertexAttribArray(a_Color_location);
      gl.vertexAttribPointer(a_Color_location, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.LINE_LOOP, 0, pointCount);
      gl.buffer(data_color.fill(1));
      gl.vertexAttribPointer(a_Color_location, 3, gl.FLOAT, false, 0, 0);
      results.push(gl.drawArrays(gl.POINTS, 0, pointCount));
    }
    return results;
  };
})();
