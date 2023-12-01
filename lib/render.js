var DRAW_FUNC, LINE_FUNC, ShaderSource, VertexBuffer, a_Color_location, a_Vertex_location, arc, buf_locationVertex, colorizeArray, compileShader, data_transform, drawCircle, drawFCircle, drawFPolygon, drawFRect, drawPolygon, drawRect, drawTriangle2s, drawTriangleFan, frag, gLProgram, lineWidth, pointSize, rect, rotateY, round, roundRect, shape, u_PointSize_location, u_Transform_location, vert, vertexCount;

import {
  gl,
  aspectRatio,
  canvas
} from "./canvas.js";

import {
  Perspective
} from "./camera.js";

import PhyX from "./PhyX.js";

vert = 'precision mediump int; precision mediump float; uniform   mat4 u_Transform; uniform  float u_PointSize; attribute vec3 a_Vertex; attribute vec3 a_Color; varying vec4 v_Color; void main() { gl_Position = u_Transform * vec4(a_Vertex, 1.0); gl_PointSize = u_PointSize; v_Color = vec4(a_Color, 1.0); }';

frag = 'precision mediump int; precision mediump float; varying vec4 v_Color; void main() { gl_FragColor = v_Color; }';

console.warn(global.phyX = new PhyX(window));

//console.error global.boo = new phyX.Boolean( true )
console.error(global.str = new phyX.String("özgürr"));

ShaderSource = (function() {
  class ShaderSource extends PhyX.prototype.String {
    constructor(source, proto = ShaderSource) {
      super(source, proto);
    }

    [Symbol.toPrimitive](hint) {
      if (hint === "string") {
        return this.value;
      }
      if (hint === "number") {
        return this.id;
      }
      throw console.error([
        this,
        {
          arguments: arguments
        }
      ]);
      if (hint === "number") {
        return this.id;
      }
      if (hint === "default") {
        return this.buffer;
      }
    }

  };

  ShaderSource.static({
    source: {
      get: function() {
        return (this.id || this.valueOf()).decode(ShaderSource);
      },
      set: function() {
        return this.set(arguments[0]);
      }
    }
  });

  return ShaderSource;

}).call(this);

VertexBuffer = (function() {
  class VertexBuffer extends PhyX.prototype.Float32Array {
    constructor(length, proto = VertexBuffer) {
      super(length, proto);
    }

    [Symbol.toPrimitive](hint) {
      if (hint === "number") {
        return this.id;
      }
      throw console.trace([
        this,
        {
          arguments: arguments
        }
      ]);
      if (hint === "string") {
        return this.toString();
      }
      if (hint === "default") {
        return this.buffer;
      }
    }

  };

  VertexBuffer.prototype.gl = gl;

  return VertexBuffer;

}).call(this);

global.vShaderSource = new ShaderSource(vert);

global.fShaderSource = new ShaderSource(frag);

console.log(global.vShaderSource);

gLProgram = null;

//. Get locations of our variables
a_Color_location = a_Vertex_location = u_Transform_location = buf_locationVertex = u_PointSize_location = null;

compileShader = function(source, type) {
  var checks, shader;
  //+ Create shader with type
  if (!(shader = gl.createShader(type))) {
    throw ["Failed to create shader!", type];
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

export var hex2rgb = gl.hex2rgb;

export var render = function() {};

(function() {
  var s_Fragment, s_Vertex;
  //+ Create program
  //+ Fetch and compile shaders
  s_Vertex = compileShader(global.vShaderSource, gl.VERTEX_SHADER);
  s_Fragment = compileShader(global.fShaderSource, gl.FRAGMENT_SHADER);
  if (!(buf_locationVertex = gl.createBuffer())) {
    throw ["Failed to create the location vertex buffer!"];
  }
  //. Make the buffer object the active buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, buf_locationVertex);
  //+ Create gl program
  if (!(gLProgram = gl.program(s_Vertex, s_Fragment))) {
    throw ["Failed to create shaders program!"];
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.CLEAR_BUFFER_BITS);
  
  //* Response with program
  gLProgram;
  //. Get locations of our variables
  a_Color_location = gl.getAttribLocation(gLProgram, 'a_Color');
  a_Vertex_location = gl.getAttribLocation(gLProgram, 'a_Vertex');
  u_Transform_location = gl.getUniformLocation(gLProgram, 'u_Transform');
  return u_PointSize_location = gl.getUniformLocation(gLProgram, 'u_PointSize');
})();


//? 2 4 90 45
//? 3 1 60 60
//? 4 8 45 22.5
//? 5 1 36 0
//? 6 12 30 15
//? 7 1 25.7 15
//? 8 16 22.5 11.25
//? 9 1 20 0
//? 10 20 18 9
//? 11 1 16.36 0
//? 12 24 15 7.5
//? 13 1 13.8 0
//? 14 28 12.85 6.42
//? 15 1 12 0
//? 16 32 11.25 5.625
//? 17 1 10.58 0
//? 18 36 10 5
//? 19 1 9.47 0
//? 20 40 9 4.5
data_transform = null;

round = null;

vertexCount = 0;

pointSize = 0;

lineWidth = 0;

DRAW_FUNC = gl.TRIANGLES;

LINE_FUNC = gl.LINE_STRIP;

colorizeArray = function(array = new Float32Array, color, randomOffset = 0) {
  var colors, i, length, result;
  length = array.length;
  result = new array.constructor(length);
  if (!isNaN(color)) {
    colors = [color, color, color];
  }
  if (!color) {
    colors = [Math.random(), 1, Math.random()];
  }
  if (!colors) {
    colors = color;
  }
  i = 0;
  while (i < length) {
    if (randomOffset) {
      if (!(i % randomOffset)) {
        colors = [Math.random(), 1, Math.random()];
      }
    }
    result.set(colors, i);
    i += colors.length;
  }
  return result;
};

drawTriangle2s = function(triangleCount = 1, size = 1, startAngle = 0, totalAngle = 2 * Math.PI, z = 0) {
  var a, i, t, valuesCount, vertexArray, x, y;
  vertexCount = triangleCount * 3;
  valuesCount = triangleCount * 9;
  vertexArray = new Float32Array(valuesCount);
  a = t = totalAngle / (triangleCount + 2);
  i = 0;
  //t -= (startAngle - Math.PI / 2) 
  t -= a / 2;
  t -= startAngle;
  
  //t -= (totalAngle / 2) / 2 + a / if triangleCount % 2 then -2 else 2
  x = size * Math.cos(t);
  y = size * Math.sin(t);
  while (valuesCount > i) {
    vertexArray[i++] = x;
    vertexArray[i++] = y;
    vertexArray[i++] = z;
    t += a;
    vertexArray[i++] = size * Math.cos(t);
    vertexArray[i++] = size * Math.sin(t);
    vertexArray[i++] = z;
    t += a;
    vertexArray[i++] = size * Math.cos(t);
    vertexArray[i++] = size * Math.sin(t);
    vertexArray[i++] = z;
    t -= a;
  }
  return vertexArray;
};

drawPolygon = function(triangleCount = 1, width = 1, height = 1, totalAngle = 2 * Math.PI, startAngle = Math.PI, xOffset = 0, yOffset = 0, zOffset = 0, counterclockwise = false, stripeRadius = 0) {
  var a, i, t, valuesCount, vertexArray, x, xStripe, y, yStripe;
  vertexCount = triangleCount * 3;
  valuesCount = triangleCount * 9;
  vertexArray = new Float32Array(valuesCount);
  a = totalAngle / triangleCount;
  t = startAngle / (1 + (triangleCount % 2));
  if (!counterclockwise) {
    a *= -1;
  }
  x = xOffset + width * Math.cos(t);
  y = yOffset + height * Math.sin(t);
  i = 0;
  xStripe = xOffset + stripeRadius * Math.cos(t);
  yStripe = yOffset + stripeRadius * Math.sin(t);
  while (i < valuesCount) {
    vertexArray[i + 2] = vertexArray[i + 5] = vertexArray[i + 8] = zOffset;
    vertexArray[i + 3] = x;
    vertexArray[i + 4] = y;
    vertexArray[i + 0] = xStripe;
    vertexArray[i + 1] = yStripe;
    t = t + a;
    if (stripeRadius && 0 < i % 18) {
      xStripe = xOffset + stripeRadius * Math.cos(t);
      yStripe = yOffset + stripeRadius * Math.sin(t);
      vertexArray[i + 6] = xStripe;
      vertexArray[i + 7] = yStripe;
    } else {
      x = xOffset + width * Math.cos(t);
      y = yOffset + height * Math.sin(t);
      vertexArray[i + 6] = x;
      vertexArray[i + 7] = y;
    }
    i += 9;
  }
  return vertexArray;
};

drawTriangleFan = function(triangleCount = 1, size = 1) {
  var a, c, i, t, valuesCount;
  DRAW_FUNC = gl.TRIANGLE_FAN;
  LINE_FUNC = gl.LINE_LOOP;
  vertexCount = triangleCount + 2;
  valuesCount = vertexCount * 3;
  round = {
    label: "round",
    data_vertex: new Float32Array(valuesCount),
    data_color: new Float32Array(valuesCount),
    translateX: 0,
    translateY: 0,
    translateZ: -1.0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
  };
  a = 2 * Math.PI / vertexCount;
  t = -Math.PI / ((vertexCount / 2) % 2 ? -2 : vertexCount);
  c = [1, 1, 0];
  i = 0;
  while (i < valuesCount) {
    round.data_color[i] = c[0];
    round.data_color[i + 1] = c[1];
    round.data_color[i + 2] = c[2];
    round.data_vertex[i] = size * Math.cos(t);
    round.data_vertex[i + 1] = size * Math.sin(t);
    t += a;
    i += 3;
  }
  return round.data_vertex;
};

drawFPolygon = function(count, size, startAngle, totalAngle) {
  return drawTriangleFan(count - 2, size, startAngle, totalAngle);
};

drawFRect = function(size) {
  return drawPolygonFan(4, size, Math.PI / 4);
};

drawFCircle = function(size, points = 100) {
  return drawPolygonFan(points, size);
};

drawRect = function(size = 1, totalAngle, startAngle = Math.PI / 4, x, y, z, counterclockwise) {
  return drawPolygon(4, size, size, totalAngle, startAngle, x, y, z, counterclockwise);
};

drawCircle = function(size, totalAngle, startAngle, points = 50, x, y, z, counterclockwise) {
  return drawPolygon(points, size, size, totalAngle, startAngle, x, y, z, counterclockwise);
};

rect = function(x = 0, y = 0, width = 1, height = 1, startAngle = Math.PI / 4, totalAngle = Math.PI * 2, z, counterclockwise) {
  return drawPolygon(4, width, height, totalAngle, startAngle, x, y, z, counterclockwise);
};

arc = function(x = 0, y = 0, radius = 1, startAngle = 0, endAngle = 2 * Math.PI, counterclockwise = false, stripeRadius = 0, points = 100, z = 0) {
  var totalAngle;
  totalAngle = Math.abs(!counterclockwise ? startAngle - endAngle : endAngle + startAngle);
  points = 27 * Math.ceil(points / 27);
  return drawPolygon(points, radius, radius, totalAngle, startAngle, x, y, z, counterclockwise, stripeRadius);
};

roundRect = function(x = 0, y = 0, width = 1, height = 1, radii = .2) {
  var arr, halfHeight, halfRadii, halfWidth, offset, pol, quarterAngle, startAngle, vRectHeight, vRectWidth;
  startAngle = Math.PI / 2;
  halfRadii = radii / 2;
  halfWidth = width / 2;
  halfHeight = height / 2;
  quarterAngle = Math.PI / 2;
  //...drawPolygon 4, width, height, Math.PI * 2, Math.PI/4, x, y
  arr = new Float32Array(15000);
  offset = 0;
  vRectWidth = width - (radii * 2);
  vRectHeight = height - (radii * 2);
  arr.set(pol = rect(x, y, vRectWidth, vRectHeight), offset);
  offset += pol.length;
  arr.set(pol = rect(x + vRectWidth / 2 + radii, y - vRectHeight / 2 - radii / 2, radii, radii), offset);
  offset += pol.length;
  arr.set(pol = arc(x + vRectWidth / 2 + radii, y + halfHeight - radii / 4, radii, Math.PI / 2, Math.PI), offset);
  offset += pol.length;
  return arr.slice(0, offset);
};

//drawRectFan 1
//drawPolygonFan 4
//drawCircleFan()

//drawCircle 0.5
//drawRect 0.5

//nodemon --exec electron --trace-warnings . -V -e js --ignore node_module -i ~debuf.js -i sass/* -i css/* -i canvas.js -i gl2.js -i prototype.js -i gl2.worker.js -i math4.js

//shape = drawPolygon 4, 0.5, Math.PI / 3, Math.PI/2 
//shape = drawCircle 0.7, Math.PI/2, Math.PI/2, 30
//shape = arc 0, 0, .5, 0, Math.PI, true, 0.3, 180
//shape = arc 0, 0, .3
//shape = rect 0, 0, 0.5, 0.4, 0.1
shape = roundRect(0, 0, 1, 0.8, 0.15);

round = {
  label: "round",
  data_vertex: shape,
  data_color: colorizeArray(shape, [1, 0, 0, 0, 0, 0, 0, 0, 1]),
  translateX: 0,
  translateY: 0,
  translateZ: -2.0,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  pointSize: 0,
  lineWidth: 0
};

console.log(round.data_vertex);

rotateY = 0;

render = function(objects) {
  var color, data_color, data_vertex, label, parameters, ref, results, rotateX, rotateYx, rotateZ, scaleX, scaleY, scaleZ, translateX, translateY, translateZ;
  //context.draw()
  if (!gLProgram) {
    return;
  }
  data_transform = new Perspective(objects.scene.fov, aspectRatio);
  if (global.gLProgram == null) {
    console.log(global.gLProgram = gLProgram);
    console.log(data_transform, round);
  }
  ref = {...objects, round};
  results = [];
  for (label in ref) {
    parameters = ref[label];
    if (label !== "round") {
      continue;
    }
    if (label === "scene") {
      continue;
    }
    ({data_vertex, data_color, color, pointSize, translateX, translateY, translateZ, rotateX, rotateYx, rotateZ, scaleX, scaleY, scaleZ, lineWidth} = parameters);
    rotateY += Math.PI / 30;
    //TODO   burada arm'a uygulanacak view_matrix aslinda oncesinde base'de
    //TODO   olusturulmus
    //TODO   sonra uzantisi olan arm'a uygulanacak
    //TODO   yani loop'un oncesinde bir islem görmüs
    //TODO   
    /*
    unless view_matrix?
        view_matrix = new Phy_X.Index( camera )
        view_matrix.create({ 
            fovy    : objects.scene.fov, 
            aspct   : aspectRatio 
        })

    view_matrix.translate( translateX, translateY, translateZ )
    view_matrix.scale( scaleX, scaleY, scaleZ )
    view_matrix.rotate( rotateX, rotateY, rotateZ )
    */
    data_transform.translate(...[translateX, translateY, translateZ]);
    data_transform.scale(...[scaleX, scaleY, scaleZ]);
    data_transform.rotate(...[rotateX, rotateY, rotateZ]);
    //* Sending transform matrix
    gl.uniformMatrix4fv(u_Transform_location, false, data_transform);
    gl.buffer(data_color);
    gl.enableVertexAttribArray(a_Color_location);
    gl.vertexAttribPointer(a_Color_location, 3, gl.FLOAT, false, 0, 0);
    //. Upload the data for this buffer object to the GPU.
    gl.bindBuffer(gl.ARRAY_BUFFER, buf_locationVertex);
    gl.bufferData(gl.ARRAY_BUFFER, data_vertex, gl.STATIC_DRAW);
    vertexCount = data_vertex.length / 3;
    gl.enableVertexAttribArray(a_Vertex_location);
    gl.vertexAttribPointer(a_Vertex_location, 3, gl.FLOAT, false, 0, 0);
    
    //* Rendering at final
    gl.drawArrays(DRAW_FUNC, 0, vertexCount);
    continue;
    if (lineWidth) {
      gl.buffer(data_color.slice().fill(0));
      gl.enableVertexAttribArray(a_Color_location);
      gl.vertexAttribPointer(a_Color_location, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(LINE_FUNC, 0, vertexCount);
    }
    if (pointSize) {
      //* Sending point size value
      gl.uniform1f(u_PointSize_location, pointSize);
      gl.buffer(data_color.slice().fill(1));
      gl.vertexAttribPointer(a_Color_location, 3, gl.FLOAT, false, 0, 0);
      results.push(gl.drawArrays(gl.POINTS, 0, vertexCount));
    } else {
      results.push(void 0);
    }
  }
  return results;
};
