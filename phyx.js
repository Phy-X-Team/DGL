var ACTIVE_ATTRIBUTES, ACTIVE_UNIFORMS, ARRAY_BUFFER, ATTACHED_SHADERS, BLEND_COLOR, BYTE, Buffer, COLOR4, COLOR_BUFFER_BIT, COLOR_CLEAR_VALUE, COMPILE_STATUS, CONTEXT_BUFFER, CURRENT_VERTEX_ATTRIB, DEGREE_CONSTANT, DEPTH_BUFFER_BIT, DEPTH_TEST, Display, FLOAT, FRAGMENT_SHADER, FRUSTRUM_MATRIX4, FUNC_ADD, FUNC_REVERSE_SUBTRACT, FUNC_SUBTRACT, INT, INTERLEAVED_ATTRIBS, INTERLEAVED_ATTRIBUTE, Index, LEQUAL, LINES, LINE_LOOP, LINE_STRIP, MATRIX4_FLOAT32, Matrix4, Memory, ORTHOGRAPHIC_FRUSTRUM, Offset, PERSPECTIVE_FRUSTRUM, POINTS, PROGRAM, RADIAN_CONSTANT, RGBA, Rotation, SCREEN, SEPARATE_ATTRIBS, SHADER, SHORT, STATE, STATIC_DRAW, STENCIL_BUFFER_BIT, Scale, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, Text, Translate, UNIFORM1F_BUFFER, UNIFORM2F_BUFFER, UNIFORM3F_BUFFER, UNIFORM4F_BUFFER, UNIFORMNF_BUFFER, UNIFORM_BUFFER, UNSIGNED_BYTE, UNSIGNED_INT, UNSIGNED_SHORT, VECTOR3, VERTEX_ATTRIB_ARRAY_BUFFER_BINDING, VERTEX_ATTRIB_ARRAY_ENABLED, VERTEX_ATTRIB_ARRAY_NORMALIZED, VERTEX_ATTRIB_ARRAY_POINTER, VERTEX_ATTRIB_ARRAY_SIZE, VERTEX_ATTRIB_ARRAY_STRIDE, VERTEX_ATTRIB_ARRAY_TYPE, VERTEX_SHADER, Vector3, exports, glAttribute, glAttributes, glBlendColor, glClearColor, glColor, glContext, glFragmentShader, glFrustrum, glPerspective, glProgram, glShader, glState, glUniform, glUniform1f, glUniform2f, glUniform3f, glUniform4f, glUniformNf, glVertexShader, global__index__, ref,
  splice = [].splice;

FLOAT = 5126;

INT = 5124;

BYTE = 5120;

SHORT = 5122;

UNSIGNED_INT = 5125;

UNSIGNED_BYTE = 5121;

UNSIGNED_SHORT = 5123;

DEPTH_TEST = 2929;

LEQUAL = 515;

DEPTH_BUFFER_BIT = 0x00000100;

STENCIL_BUFFER_BIT = 0x00000400;

COLOR_BUFFER_BIT = 0x00004000;

POINTS = 0x0000;

LINES = 0x0001;

LINE_LOOP = 0x0002;

LINE_STRIP = 0x0003;

TRIANGLES = 0x0004;

TRIANGLE_STRIP = 0x0005;

TRIANGLE_FAN = 0x0006;

UNIFORM_BUFFER = 35345;

FUNC_ADD = 32774;

FUNC_SUBTRACT = 32778;

FUNC_REVERSE_SUBTRACT = 32779;

BLEND_COLOR = 32773;

COLOR_CLEAR_VALUE = 3106;

ACTIVE_ATTRIBUTES = 35721;

ACTIVE_UNIFORMS = 35718;

ATTACHED_SHADERS = 35717;

INTERLEAVED_ATTRIBUTE = 1606;

MATRIX4_FLOAT32 = 1091;

FRUSTRUM_MATRIX4 = 1264;

PERSPECTIVE_FRUSTRUM = 1585;

ORTHOGRAPHIC_FRUSTRUM = 1649;

UNIFORMNF_BUFFER = 1229;

UNIFORM1F_BUFFER = 1200;

UNIFORM2F_BUFFER = 1201;

UNIFORM3F_BUFFER = 1202;

UNIFORM4F_BUFFER = 1203;

SHADER = 35717;

VERTEX_SHADER = 35633;

FRAGMENT_SHADER = 35632;

SEPARATE_ATTRIBS = 35981;

INTERLEAVED_ATTRIBS = 35980;

COMPILE_STATUS = 35713;

VERTEX_ATTRIB_ARRAY_POINTER = 34373;

VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 34975;

VERTEX_ATTRIB_ARRAY_ENABLED = 34338;

VERTEX_ATTRIB_ARRAY_SIZE = 34339;

VERTEX_ATTRIB_ARRAY_STRIDE = 34340;

VERTEX_ATTRIB_ARRAY_TYPE = 34341;

VERTEX_ATTRIB_ARRAY_NORMALIZED = 34922;

CURRENT_VERTEX_ATTRIB = 34342;

RGBA = 284;

VECTOR3 = 518;

COLOR4 = 435;

SCREEN = 448;

CONTEXT_BUFFER = 1071;

STATE = 627;

PROGRAM = 778;

ARRAY_BUFFER = 34962;

STATIC_DRAW = 35044;

RADIAN_CONSTANT = 0.017453292519943295;

DEGREE_CONSTANT = 57.29577951308232;

export var DEFAULT_ROOT = typeof self !== "undefined" && self !== null ? (ref = self.document) != null ? ref.body : void 0 : void 0;

export var DEFAULT_WIDTH = (typeof self !== "undefined" && self !== null ? self.innerWidth : void 0) || 8e2;

export var DEFAULT_HEIGHT = (typeof self !== "undefined" && self !== null ? self.innerHeight : void 0) || 6e2;

export var DEVICE_PIXEL_RATIO = (typeof self !== "undefined" && self !== null ? self.devicePixelRatio : void 0) || 1;

export var DEFAULT_POSITION = "fixed";

export var DEFAULT_NODETAG = "canvas";

export var DEFAULT_ASPECT_RATIO = DEFAULT_WIDTH / DEFAULT_HEIGHT;

export var DEFAULT_ZINDEX = DEFAULT_ROOT.querySelectorAll(DEFAULT_NODETAG).length;

export var DEFAULT_CLEAR_COLOR = 0x000000;

export var DEFAULT_CLEAR_DEPTH = 1.0;

export var DEFAULT_ENABLED_TEST = DEPTH_TEST;

export var DEFAULT_DEPTH_FUNCTION = LEQUAL;

export var MIN_MEMORY_BYTES = 96;

export var MAX_MEMORY_BYTES = 1e6 * Math.max(1, Math.min(typeof navigator !== "undefined" && navigator !== null ? navigator.deviceMemory : void 0, 2) || 2);

global__index__ = new Object();

Memory = new ((function() {
  var _Class;

  _Class = class extends DataView {
    constructor(buffer = new ArrayBuffer(MIN_MEMORY_BYTES, {
        maxByteLength: MAX_MEMORY_BYTES
      }), offset, length) {
      window.memory = Object.defineProperties(super(buffer, offset, length), {
        Float32Array: {
          value: new Float32Array(buffer)
        },
        Uint32Array: {
          value: new Uint32Array(buffer)
        },
        Uint16Array: {
          value: new Uint16Array(buffer)
        },
        Uint8Array: {
          value: new Uint8Array(buffer)
        }
      });
      this.offset[this.offsetIndex] = 10;
    }

    resize(size = 1e3) {
      this.buffer.resize(this.offset[this.offsetLength] + 1e3);
      return this;
    }

    alloc(byteLength, headerSize) {
      var $index, length, offset;
      $index = this.offset[this.offsetIndex];
      offset = this.offset[this.offsetLength];
      length = offset + byteLength;
      this.offset[this.offsetIndex] = $index + 1;
      this.offset[this.offsetLength] = length;
      if (this.byteLength < this.offset[this.offsetLength]) {
        this.resize();
      }
      this.offset[$index] = offset + headerSize;
      return $index;
    }

    realloc(index, byteLength) {
      var allocLength, allocOffset, copyLength, endOffset, startOffset;
      startOffset = this.offset[index] - index.headerSize;
      copyLength = index.getBufferSize();
      endOffset = startOffset + copyLength;
      allocOffset = this.offset[this.offsetLength];
      allocLength = copyLength + byteLength;
      index.setBufferLink(index.getBufferLink() + 1);
      this.offset[this.offsetLength] = allocOffset + allocLength;
      this.offset[this.offsetErased] = copyLength + this.offset[this.offsetErased];
      if (this.byteLength < this.offset[this.offsetLength]) {
        this.resize();
      }
      this.relocate(allocOffset, startOffset, endOffset);
      this.offset[index] = allocOffset + index.headerSize;
      index.setBufferSize(allocLength);
      return this.offset[index];
    }

    relocate(offset, start, end, {
        name: ArrayBuffer
      } = Uint8Array) {
      this[ArrayBuffer].copyWithin(offset, start, end);
      this[ArrayBuffer].fill(0, start, end);
      return this;
    }

    toBuffer(index, headers = false) {
      var byte, end, start, to;
      start = this.offset[index];
      byte = index.typedArray.BYTES_PER_ELEMENT;
      end = start + index.getBufferSize();
      if (byte > 1) {
        start /= byte;
        end /= byte;
      } else if (headers) {
        start -= index.headerSize;
      }
      return to = this[index.typedArray.name].subarray(start, end);
    }

    toObject(index) {
      if (this.offset[index]) {
        return new Index(index);
      }
    }

    toString(index, offset = 0, length) {
      var buffer, code, string;
      buffer = this.toBuffer(index).slice(offset);
      length = length != null ? length : buffer.byteLength;
      string = "";
      offset = 0;
      //TODO burada niye böyle anlamadik
      length -= index.headerSize;
      while (offset < length) {
        if (!(1 - (code = buffer[offset++]))) {
          code = buffer[offset++] * 255;
          code = code + buffer[offset++];
        }
        if (!code) {
          break;
        }
        string = string + String.fromCharCode(code);
      }
      return string;
    }

    writeText(index, text, offset = 0, length) {
      this.Uint8Array.set(Text.prototype.encode(text, length), offset + this.offset.at(index));
      return offset;
    }

  };

  _Class.prototype.offset = new Uint32Array(new ArrayBuffer(Math.ceil(MAX_MEMORY_BYTES / 10)));

  _Class.prototype.object = new Object();

  _Class.prototype.offsetIndex = 2;

  _Class.prototype.offsetLength = 3;

  _Class.prototype.offsetErased = 4;

  return _Class;

}).call(this));

Buffer = (function() {
  var _Class;

  _Class = class extends Number {
    constructor(Object = Buffer) {
      var bufferType, byteLength, headerSize;
      bufferType = Object.prototype.bufferType;
      headerSize = Object.prototype.headerSize;
      byteLength = Object.prototype.bufferSize + headerSize;
      super(Memory.alloc(byteLength, headerSize)).setBufferType(bufferType).setBufferSize(byteLength);
    }

    uuid() {
      return (typeof crypto !== "undefined" && crypto !== null ? crypto.randomUUID() : void 0) || this.random().toString(16).substr(3);
    }

    random() {
      return Math.random();
    }

    setBufferType(type) {
      return this.setUint16(this.typeOffset, type);
    }

    setBufferSize(size = 0) {
      return this.setUint32(this.sizeOffset, size);
    }

    setBufferLink(link) {
      return this.setUint32(this.linkOffset, link);
    }

    getBufferType(offset = this.typeOffset) {
      return this.getUint16(offset);
    }

    getBufferSize(offset = this.sizeOffset) {
      return this.getUint32(offset);
    }

    getBufferLink(offset = this.linkOffset) {
      return this.getUint32(offset);
    }

    setFloat32(offset, value = 0) {
      Memory.setFloat32(Memory.offset[this] + offset, value);
      return this;
    }

    setUint32(offset, value = 0) {
      Memory.setUint32(Memory.offset[this] + offset, value);
      return this;
    }

    setUint16(offset, value = 0) {
      Memory.setUint16(Memory.offset[this] + offset, value);
      return this;
    }

    setUint8(offset, value = 0) {
      Memory.setUint8(Memory.offset[this] + offset, value);
      return this;
    }

    getFloat32(offset = 0) {
      return Memory.getFloat32(Memory.offset[this] + offset);
    }

    getUint32(offset = 0) {
      return Memory.getUint32(Memory.offset[this] + offset);
    }

    getUint16(offset = 0) {
      return Memory.getUint16(Memory.offset[this] + offset);
    }

    getUint8(offset = 0) {
      return Memory.getUint8(Memory.offset[this] + offset);
    }

    alloc(byteLength) {
      return Memory.realloc(this, byteLength);
    }

    writeText(text = "", offset, length) {
      Memory.writeText(this, text, offset, length);
      return this;
    }

    toBuffer(headers) {
      return Memory.toBuffer(this, headers);
    }

    toArray(typedArray = this.typedArray) {
      return [...this[typedArray.name]()];
    }

    Float32Array(headers) {
      return this.toBuffer(headers, Float32Array);
    }

    Uint32Array(headers) {
      return this.toBuffer(headers, Uint32Array);
    }

    Uint16Array(headers) {
      return this.toBuffer(headers, Uint16Array);
    }

    Uint8Array(headers) {
      return this.toBuffer(headers, Uint8Array);
    }

    get() {
      return __index__[this];
    }

    set(WebGLObject) {
      return __index__[this] = WebGLObject;
    }

  };

  _Class.prototype.headerSize = 10;

  _Class.prototype.bufferSize = 0;

  _Class.prototype.bufferName = /BUFFER/i;

  _Class.prototype.bufferLink = null;

  _Class.prototype.typedArray = Uint8Array;

  _Class.prototype.typeOffset = -10;

  _Class.prototype.sizeOffset = -8;

  _Class.prototype.linkOffset = -4;

  return _Class;

}).call(this);

Index = class Index extends Number {
  constructor(index) {
    var type;
    type = Memory.getUint16(Memory.offset[index] - Buffer.prototype.headerSize);
    Object.setPrototypeOf(super(index), ((function() {
      switch (type) {
        case MATRIX4_FLOAT32:
          return Matrix4;
        case FRUSTRUM_MATRIX4:
          return glFrustrum;
        case PERSPECTIVE_FRUSTRUM:
          return glPerspective;
        case INTERLEAVED_ATTRIBS:
          return glAttributes;
        case VECTOR3:
          return Vector3;
        case CONTEXT_BUFFER:
          return glContext;
        case SHADER:
          return glShader;
        case PROGRAM:
          return glProgram;
        case VERTEX_SHADER:
          return glVertexShader;
        case FRAGMENT_SHADER:
          return glFragmentShader;
        case SEPARATE_ATTRIBS:
          return glAttribute;
        case UNIFORM1F_BUFFER:
          return glUniform1f;
        case UNIFORM2F_BUFFER:
          return glUniform2f;
        case UNIFORM3F_BUFFER:
          return glUniform3f;
        case UNIFORM4F_BUFFER:
          return glUniform4f;
        default:
          throw ["Undefined type of constructor:", type, "at index:", index, "and offset:", Memory.offset[index], Memory.buffer];
      }
    })()).prototype);
  }

};

Offset = class Offset extends Number {
  constructor(offset) {
    new Index(Memory.getUint32(offset + Buffer.prototype.linkOffset));
  }

};

Vector3 = (function() {
  class Vector3 extends Buffer {
    constructor(x, y, z) {
      super(Vector3).setFloat32(this.offsetX, x).setFloat32(this.offsetY, y).setFloat32(this.offsetZ, z);
    }

  };

  Vector3.prototype.bufferSize = 12;

  Vector3.prototype.bufferType = VECTOR3;

  Vector3.prototype.offsetX = 0;

  Vector3.prototype.offsetY = 4;

  Vector3.prototype.offsetZ = 8;

  return Vector3;

}).call(this);

Translate = class Translate extends Vector3 {};

Scale = class Scale extends Vector3 {};

Rotation = class Rotation extends Vector3 {};

Matrix4 = (function() {
  class Matrix4 extends Buffer {
    static translateMatrix(dx = 0, dy = 0, dz = 0) {
      return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, dx, dy, dz, 1]);
    }

    static rotationMatrix(ax = 0, ay = 0, az = 0) {
      var cx, cy, cz, sx, sy, sz;
      ax = ax * RADIAN_CONSTANT;
      ay = ay * RADIAN_CONSTANT;
      az = az * RADIAN_CONSTANT;
      sx = Math.sin(ax);
      sy = Math.sin(ay);
      sz = Math.sin(az);
      cx = Math.cos(ax);
      cy = Math.cos(ay);
      cz = Math.cos(az);
      return [cy * cz, sx * sy * cz - cx * sz, cx * sy * cz + sx * sz, 0, cy * sz, sx * sy * sz + cx + cz, cx * sy * sz - sx * cz, 0, -sy, sx * cy, cx * cy, 0, 0, 0, 0, 1];
    }

    static rotationXMatrix(ax) {
      var cos, sin;
      ax *= RADIAN_CONSTANT;
      sin = Math.sin(ax);
      cos = Math.cos(ax);
      return [1, 0, 0, 0, 0, cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1];
    }

    static rotationYMatrix(ay) {
      var cos, sin;
      ay *= RADIAN_CONSTANT;
      sin = Math.sin(ay);
      cos = Math.cos(ay);
      return [cos, 0, -sin, 0, 0, 1, 0, 0, sin, 0, cos, 0, 0, 0, 0, 1];
    }

    static rotationZMatrix(az) {
      var cos, sin;
      az *= RADIAN_CONSTANT;
      sin = Math.sin(az);
      cos = Math.cos(az);
      return [cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }

    static scaleMatrix(sx = 1, sy = 1, sz = 1) {
      return new Float32Array([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
    }

    constructor(values = [], Object = Matrix4) {
      super(Object).create(values);
    }

    create(values) {
      var index, j, len, value;
      for (index = j = 0, len = values.length; j < len; index = ++j) {
        value = values[index];
        this.setFloat32(index, value);
      }
      return this;
    }

    multiply(B, target) {
      var A, R;
      A = this.toArray();
      R = target != null ? target : [];
      R[0] = A[0] * B[0] + A[4] * B[1] + A[8] * B[2] + A[12] * B[3];
      R[1] = A[1] * B[0] + A[5] * B[1] + A[9] * B[2] + A[13] * B[3];
      R[2] = A[2] * B[0] + A[6] * B[1] + A[10] * B[2] + A[14] * B[3];
      R[3] = A[3] * B[0] + A[7] * B[1] + A[11] * B[2] + A[15] * B[3];
      R[4] = A[0] * B[4] + A[4] * B[5] + A[8] * B[6] + A[12] * B[7];
      R[5] = A[1] * B[4] + A[5] * B[5] + A[9] * B[6] + A[13] * B[7];
      R[6] = A[2] * B[4] + A[6] * B[5] + A[10] * B[6] + A[14] * B[7];
      R[7] = A[3] * B[4] + A[7] * B[5] + A[11] * B[6] + A[15] * B[7];
      R[8] = A[0] * B[8] + A[4] * B[9] + A[8] * B[10] + A[12] * B[11];
      R[9] = A[1] * B[8] + A[5] * B[9] + A[9] * B[10] + A[13] * B[11];
      R[10] = A[2] * B[8] + A[6] * B[9] + A[10] * B[10] + A[14] * B[11];
      R[11] = A[3] * B[8] + A[7] * B[9] + A[11] * B[10] + A[15] * B[11];
      R[12] = A[0] * B[12] + A[4] * B[13] + A[8] * B[14] + A[12] * B[15];
      R[13] = A[1] * B[12] + A[5] * B[13] + A[9] * B[14] + A[13] * B[15];
      R[14] = A[2] * B[12] + A[6] * B[13] + A[10] * B[14] + A[14] * B[15];
      R[15] = A[3] * B[12] + A[7] * B[13] + A[11] * B[14] + A[15] * B[15];
      return this.fromArray(R, target);
    }

    toBuffer() {
      var offset;
      offset = Memory.offset[Number(this)] / this.bufferByte;
      return Memory.Float32Array.subarray(offset, offset + 16);
    }

    toArray() {
      var i;
      return new Float32Array((function() {
        var j, results;
        results = [];
        for (i = j = 0; j < 16; i = ++j) {
          results.push(this.getFloat32(i * this.bufferByte));
        }
        return results;
      }).call(this));
    }

    fromArray(array, target) {
      var i, j, k, len, value;
      if (target == null) {
        for (i = j = 0; j < 16; i = ++j) {
          this.setFloat32(i * this.bufferByte, array[i]);
        }
      } else {
        for (i = k = 0, len = array.length; k < len; i = ++k) {
          value = array[i];
          target[i] = value;
        }
      }
      return target != null ? target : this;
    }

    translate(dx, dy, dz) {
      return this.multiply(this.constructor.translateMatrix(dx, dy, dz));
    }

    rotate(ax, ay, az) {
      ax && this.multiply(this.constructor.rotationXMatrix(ax));
      ay && this.multiply(this.constructor.rotationYMatrix(ay));
      az && this.multiply(this.constructor.rotationZMatrix(az));
      return this;
    }

    scale(sx, sy, sz) {
      return this.multiply(this.constructor.scaleMatrix(sx, sy, sz));
    }

  };

  Matrix4.prototype.bufferType = MATRIX4_FLOAT32;

  Matrix4.prototype.typedArray = Float32Array;

  Matrix4.prototype.bufferSize = 64;

  Matrix4.prototype.bufferByte = 4;

  Matrix4.ITEMS_PER_MATRIX = 16;

  return Matrix4;

}).call(this);

glFrustrum = (function() {
  class glFrustrum extends Matrix4 {
    constructor(options = {}, Object = glFrustrum) {
      super(null, Object).create(options);
    }

    create(options, set = true) {
      var aspect, bottom, c1, c2, far, fovy, h, index, j, left, len, matrix, near, right, sx, sy, top, tx, ty, value, w;
      if (!!set) {
        (options = {...this.getOptions(), ...options});
      }
      ({fovy, aspect, near, far, top, bottom, left, right} = options);
      fovy || (fovy = 60);
      aspect || (aspect = DEFAULT_WIDTH / DEFAULT_HEIGHT);
      near || (near = 0.01);
      far || (far = 1e3);
      if (!left && right) {
        left = -(right /= 2);
      }
      if (!top && bottom) {
        top = -(bottom /= 2);
      }
      top || (top = near * Math.tan(fovy * RADIAN_CONSTANT * .5));
      bottom || (bottom = -top);
      right || (right = top * aspect);
      left || (left = -right);
      if (set && !this.setOptions({fovy, aspect, far, near, right, top, bottom, left})) {
        return;
      }
      w = right - left;
      h = top - bottom;
      sx = 2 * near / w;
      sy = 2 * near / h;
      c2 = -(far + near) / (far - near);
      c1 = 2 * near * far / (near - far);
      tx = -near * (left + right) / w;
      ty = -near * (bottom + top) / h;
      matrix = [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, c2, -1, tx, ty, c1, 0];
      if (!set) {
        return matrix;
      }
      for (index = j = 0, len = matrix.length; j < len; index = ++j) {
        value = matrix[index];
        this.setFloat32(index * this.bufferByte, value);
      }
      return this;
    }

    setOptions(options) {
      if (options.left === options.right || options.bottom === options.top) {
        throw ["Invalid frustrum parameters:", options];
      }
      if (options.near <= 0 || options.far <= 0 || options.near >= options.far) {
        throw ["Distance near >= far and must be positive:", options];
      }
      return this.setNear(options.near).setFar(options.far).setRight(options.right).setBottom(options.bottom).setLeft(options.left).setTop(options.top);
    }

    setNear(near) {
      this.setFloat32(this.offsetNear, near);
      return this;
    }

    setFar(far) {
      this.setFloat32(this.offsetFar, far);
      return this;
    }

    setRight(right) {
      this.setFloat32(this.offsetRight, right);
      return this;
    }

    setBottom(bottom) {
      this.setFloat32(this.offsetBottom, bottom);
      return this;
    }

    setTop(top) {
      this.setFloat32(this.offsetTop, top);
      return this;
    }

    setLeft(left) {
      this.setFloat32(this.offsetLeft, left);
      return this;
    }

    getOptions() {
      return {
        near: this.getNear(),
        far: this.getFar(),
        right: this.getRight(),
        bottom: this.getBottom(),
        top: this.getTop(),
        left: this.getLeft()
      };
    }

    getNear() {
      return this.getFloat32(this.offsetNear);
    }

    getFar() {
      return this.getFloat32(this.offsetFar);
    }

    getRight() {
      return this.getFloat32(this.offsetRight);
    }

    getBottom() {
      return this.getFloat32(this.offsetBottom);
    }

    getTop() {
      return this.getFloat32(this.offsetTop);
    }

    getLeft() {
      return this.getFloat32(this.offsetLeft);
    }

  };

  glFrustrum.prototype.bufferType = FRUSTRUM_MATRIX4;

  glFrustrum.prototype.bufferSize = 88;

  glFrustrum.prototype.offsetNear = 64;

  glFrustrum.prototype.offsetFar = 68;

  glFrustrum.prototype.offsetRight = 72;

  glFrustrum.prototype.offsetBottom = 76;

  glFrustrum.prototype.offsetTop = 80;

  glFrustrum.prototype.offsetLeft = 84;

  return glFrustrum;

}).call(this);

glPerspective = (function() {
  class glPerspective extends glFrustrum {
    constructor(options, Object = glPerspective) {
      super(options, Object);
    }

    setOptions(options) {
      this.setFovy(options.fovy).setAspect(options.aspect);
      return super.setOptions(options);
    }

    setFovy(fovy) {
      if (fovy < 1 || fovy > 179) {
        throw [/fovy/];
      }
      this.setFloat32(this.offsetFovy, fovy);
      return this;
    }

    setAspect(aspect) {
      if (!(aspect > 0)) {
        throw [/aspect/];
      }
      this.setFloat32(this.offsetAspect, aspect);
      return this;
    }

    getOptions() {
      return Object.assign(super.getOptions(), {
        fovy: this.getFovy(),
        aspect: this.getAspect()
      });
    }

    getFovy() {
      return this.getFloat32(this.offsetFovy);
    }

    getAspect() {
      return this.getFloat32(this.offsetAspect);
    }

  };

  glPerspective.prototype.bufferType = PERSPECTIVE_FRUSTRUM;

  glPerspective.prototype.bufferSize = 96;

  glPerspective.prototype.offsetFovy = 88;

  glPerspective.prototype.offsetAspect = 92;

  return glPerspective;

}).call(this);

Text = (function() {
  class Text extends Buffer {
    encode(text, MAX_MEMORY_BYTES) {
      var bufferArray, char, charCodes, code, j, len, length, ref1;
      charCodes = new Array();
      ref1 = text.split("");
      for (j = 0, len = ref1.length; j < len; j++) {
        char = ref1[j];
        code = char.charCodeAt(0);
        if (!(0xff < code)) {
          charCodes.push(code);
        } else {
          charCodes.push(1, code >> 8 & 0xff, code & 0xff);
        }
        if (MAX_MEMORY_BYTES === (length = charCodes.length)) {
          break;
        }
      }
      bufferArray = new Uint8Array(MAX_MEMORY_BYTES != null ? MAX_MEMORY_BYTES : length);
      bufferArray.set(charCodes);
      return bufferArray;
    }

  };

  Text.prototype.bufferType = 325;

  Text.prototype.bufferName = /TEXT/i;

  return Text;

}).call(this);

Display = (function() {
  class Display extends DataView {
    // WebGLProgram?

    // Create a WebGLProgram object and initialize it with a program object 
    // name as if by calling glCreateProgram.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glCreateProgram.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createProgram

    // @return                       <WebGLProgram>
    //                               A WebGLProgram object that is a combination of two 
    //                               compiled WebGLShaders consisting of a vertex shader 
    //                               and a fragment shader (both written in GLSL). 
    //                               These are then linked into a usable program.
    createProgram() {
      return this.program[this.program.length] = this.context.createProgram();
    }

    // void

    // The WebGLRenderingContext interface's linkProgram() method links a given 
    // WebGLProgram, completing the process of preparing the GPU code for the 
    // program's fragment and vertex shaders.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glLinkProgram.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/linkProgram

    // @parameter     <WebGLProgram> program
    //                               The WebGLProgram to link.

    // @return                       undefined
    linkProgram(program) {
      return this.context.linkProgram(program);
    }

    // void

    // The WebGLRenderingContext.useProgram() method of the WebGL API sets the 
    // specified WebGLProgram as part of the current rendering state.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glUseProgram.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram

    // @parameter     <WebGLProgram> program
    //                               The WebGLProgram to use.

    // @return                       undefined
    useProgram(program) {
      return this.context.useProgram(program);
    }

    // <GLint>
    // [WebGLHandlesContextLoss]

    // glGetAttribLocation returns the binding that actually went into 
    // effect the last time glLinkProgram was called for the specified 
    // program object. Attribute bindings that have been specified since 
    // the last link operation are not returned by glGetAttribLocation.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetAttribLocation.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getAttribLocation

    // @parameter     <WebGLProgram> program
    //                               A WebGLProgram containing the vertex 
    //                               attribute.

    // @parameter        <DOMString> name
    //                               A string specifying the name of the attribute 
    //                               variable whose location to get.

    // @return                       <GLint> 
    //                        index: A GLint number indicating the location of the 
    //                               variable name if found. Returns -1 otherwise.
    getAttribLocation(program, name) {
      return this.context.getAttribLocation(program, name);
    }

    // WebGLUniformLocation?
    // Part of the WebGL API, the WebGLRenderingContext method getUniformLocation() 
    // returns the location of a specific uniform variable which is part of a given 
    // WebGLProgram.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetUniformLocation.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniformLocation

    // @parameter     <WebGLProgram> program
    //                               The WebGLProgram in which to locate the 
    //                               specified uniform variable.

    // @parameter        <DOMString> name
    //                               A string specifying the name of the uniform 
    //                               variable whose location is to be returned. 
    //                               The name can't have any whitespace in it, 
    //                               and you can't use this function to get the 
    //                               location of any uniforms starting with 
    //                               the reserved string "gl_", since those are 
    //                               internal to the WebGL layer.

    // @return                       <WebGLUniformLocation> 
    getUniformLocation(program, name) {
      return this.context.getUniformLocation(program, name);
    }

    // WebGLActiveInfo? 

    // The WebGLRenderingContext.getActiveAttrib() method of the WebGL API returns a 
    // WebGLActiveInfo object containing size, type, and name of a vertex attribute. 
    // It is generally used when querying unknown attributes either for debugging or 
    // generic library creation.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetActiveAttrib.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveAttrib

    // @parameter     <WebGLProgram> program
    //                               A WebGLProgram containing the vertex 
    //                               attribute.

    // @parameter           <GLuint> index
    //                               A GLuint specifying the index of the vertex 
    //                               attribute to get. This value is an index 0 to N-1 
    //                               as returned by gl.getProgramParameter( program, 
    //                               gl.ACTIVE_ATTRIBUTES).

    // @return                       <WebGLActiveInfo> 
    //                         name: The read-only WebGLActiveInfo.name property 
    //                               represents the name of the requested data returned 
    //                               by calling the getActiveAttrib() or getActiveUniform() 
    //                               methods.

    //                         size: The read-only WebGLActiveInfo.size property is a 
    //                               Number representing the size of the requested data 
    //                               returned by calling the getActiveAttrib() or 
    //                               getActiveUniform() methods.

    //                         type: The read-only WebGLActiveInfo.type property 
    //                               represents the type of the requested data returned 
    //                               by calling the getActiveAttrib() or getActiveUniform() 
    //                               methods.
    getActiveAttrib(program, index) {
      return this.context.getActiveAttrib(program, index);
    }

    // any 

    // The WebGLRenderingContext.getActiveAttrib() method of the WebGL API returns a 
    // WebGLActiveInfo object containing size, type, and name of a vertex attribute. 
    // It is generally used when querying unknown attributes either for debugging or 
    // generic library creation.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetUniform.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniform

    // @parameter     <WebGLProgram> program
    //                               A WebGLProgram containing the uniform 
    //                               attribute.
    // @parameter
    //        <WebGLUniformLocation> location
    //                               A WebGLUniformLocation object containing
    //                               the location of the uniform attribute 
    //                               to get.

    // @return                       any 
    //                      boolean:	<GLBoolean>
    //                          int:	<GLint>
    //                         uint: <GLuint>
    //                        float:	<GLfloat>
    //                         vec2:	<Float32Array>  (with  2 elements)
    //                         vec3:	<Float32Array>  (with  3 elements)
    //                         vec4:	<Float32Array>  (with  4 elements)
    //                        bvec2:	<Array>         (with  2 booleans)
    //                        bvec3:	<Array>         (with  3 booleans)
    //                        bvec4:	<Array>         (with  4 booleans)
    //                        ivec2:	<Int32Array>    (with  2 elements)
    //                        ivec3:	<Int32Array>    (with  3 elements)
    //                        ivec4:	<Int32Array>    (with  4 elements)
    //                        uvec2: <Uint32Array>   (with  2 elements)
    //                        uvec3:	<Uint32Array>   (with  3 elements)
    //                        uvec4:	<Uint32Array>   (with  4 elements)
    //                         mat2:	<Float32Array>  (with  4 elements)
    //                         mat3:	<Float32Array>  (with  9 elements)
    //                         mat4:	<Float32Array>  (with 16 elements)        
    //                       mat2x3: <Float32Array>  (with  6 elements)
    //                       mat2x4:	<Float32Array>  (with  8 elements)
    //                       mat3x2:	<Float32Array>  (with  6 elements)
    //                       mat3x4:	<Float32Array>  (with 12 elements)
    //                       mat4x2:	<Float32Array>  (with  8 elements)
    //                       mat4x3:	<Float32Array>  (with 12 elements)
    getUniform(program, location) {
      return this.context.getUniform(program, location);
    }

    // <GLintptr>

    // return the address of the specified generic vertex attribute pointer.
    // glGetVertexAttribPointerv returns pointer information. index is the 
    // generic vertex attribute to be queried, pname is a symbolic constant 
    // indicating the pointer to be returned, and params is a pointer to a 
    // location in which to place the returned data.

    // If a non-zero named buffer object was bound to the ARRAY_BUFFER target
    // (see glBindBuffer) when the desired pointer was previously specified, 
    // the pointer returned is a byte offset into the buffer object's data store.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetVertexAttribPointerv.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getVertexAttribOffset

    // @parameter           <GLuint> index 
    //                               Specifies the generic vertex attribute 
    //                               parameter to be returned.

    // @parameter           <GLenum> pname                     
    //                               Specifies the symbolic name of the generic 
    //                               vertex attribute parameter to be returned.
    //                               Must be: VERTEX_ATTRIB_ARRAY_POINTER 

    // @return                       <GLintptr> 
    //                               Address of the specified generic vertex 
    //                               attribute pointer
    getVertexAttribOffset(index, pname) {
      return this.context.getVertexAttribOffset(index, pname != null ? pname : VERTEX_ATTRIB_ARRAY_POINTER);
    }

    // any

    // Return the information requested in pname about the vertex attribute 
    // at the passed index. The type returned is dependent on the information 
    // requested.

    // glGetVertexAttrib returns in params the value of a generic vertex 
    // attribute parameter. The generic vertex attribute to be queried is 
    // specified by index, and the parameter to be queried is specified 
    // by pname.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetVertexAttrib.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getVertexAttrib

    // @parameter           <GLuint> index 
    //                               Specifies the generic vertex attribute parameter 
    //                               to be returned.

    // @parameter           <GLenum> pname                     
    //                               Specifies the symbolic name of the generic vertex 
    //                               attribute parameter to be returned.  
    //                               Must be: 

    // @returns                      <Object> 
    //                 <WebGLBuffer> VERTEX_ATTRIB_ARRAY_BUFFER_BINDING
    //                   <GLboolean> VERTEX_ATTRIB_ARRAY_ENABLED
    //                       <GLint> VERTEX_ATTRIB_ARRAY_SIZE
    //                       <GLint> VERTEX_ATTRIB_ARRAY_STRIDE
    //                      <GLenum> VERTEX_ATTRIB_ARRAY_TYPE
    //                   <GLboolean> VERTEX_ATTRIB_ARRAY_NORMALIZED
    //                <Float32Array> CURRENT_VERTEX_ATTRIB
    getVertexAttrib(index, pname) {
      if (!(pname == null)) {
        return this.context.getVertexAttrib(index, pname);
      }
      return {
        enabled: this.getVertexAttrib(index, VERTEX_ATTRIB_ARRAY_ENABLED),
        buffer: this.getVertexAttrib(index, VERTEX_ATTRIB_ARRAY_BUFFER_BINDING),
        size: this.getVertexAttrib(index, VERTEX_ATTRIB_ARRAY_SIZE),
        type: this.getVertexAttrib(index, VERTEX_ATTRIB_ARRAY_TYPE),
        normalized: this.getVertexAttrib(index, VERTEX_ATTRIB_ARRAY_NORMALIZED),
        snapshot: this.getVertexAttrib(index, CURRENT_VERTEX_ATTRIB),
        stride: this.getVertexAttrib(index, VERTEX_ATTRIB_ARRAY_STRIDE)
      };
    }

    // void

    // Enable the vertex attribute at index as an array. WebGL imposes additional rules 
    // beyond OpenGL ES 2.0 regarding enabled vertex attributes; see Enabled Vertex 
    // Attributes and Range Checking.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glEnableVertexAttribArray.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray

    // @parameter           <GLuint> index
    //                               A GLuint specifying the index of the vertex 
    //                               attribute to get. This value is an index 0 to N-1 
    //                               as returned by gl.getProgramParameter( program, 
    //                               gl.ACTIVE_ATTRIBUTES).

    // @return                       undefined
    enableVertexAttribArray(index) {
      return this.context.enableVertexAttribArray(index);
    }

    
    // WebGLShader?

    // The WebGLRenderingContext method createShader() of the WebGL API 
    // creates a WebGLShader that can then be configured further using: 
    //  - WebGLRenderingContext.shaderSource() 
    //  - WebGLRenderingContext.compileShader()

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glCreateShader.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createShader

    // @parameter           <GLenum> type
    //                               A type of fragment or vertex shader
    //                               VERTEX_SHADER
    //                               FRAGMENT_SHADER

    // @return                       <WebGLShader>
    createShader(type) {
      return this.context.createShader(type);
    }

    // void

    // The WebGLRenderingContext.compileShader() method of the WebGL API compiles 
    // a GLSL shader into binary data so that it can be used by a WebGLProgram.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glCompileShader.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compileShader

    // @parameter      <WebGLShader> shader
    //                               A fragment or vertex WebGLShader.

    // @return                       undefined
    compileShader(shader) {
      return this.context.compileShader(shader);
    }

    // void

    // The WebGLRenderingContext.deleteShader() method of the WebGL API marks a 
    // given WebGLShader object for deletion. It will then be deleted whenever 
    // the shader is no longer in use. This method has no effect if the shader 
    // has already been deleted, and the WebGLShader is automatically marked 
    // for deletion when it is destroyed by the garbage collector.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDeleteShader.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteShader

    // @parameter      <WebGLShader> shader
    //                               A WebGLShader object to delete.

    // @return                       undefined
    deleteShader(shader) {
      return this.context.deleteShader(shader);
    }

    // void

    // The WebGLRenderingContext.shaderSource() method of the WebGL API sets 
    // the source code of a WebGLShader.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glShaderSource.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/shaderSource

    // @parameter      <WebGLShader> shader
    //                               A WebGLShader object in which to set the source 
    //                               code.

    //                   <DOMString> source
    //                               A string containing the GLSL source code to set.

    // @return                       undefined
    shaderSource(shader, source) {
      return this.context.shaderSource(shader, source);
    }

    
    // any

    // The WebGLRenderingContext.getShaderParameter() method of the WebGL API 
    // returns information about the given shader.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetShaderiv.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderParameter

    // @parameter      <WebGLShader> shader
    //                               A WebGLShader object in which to set the source 
    //                               code.

    //                      <GLenum> pname
    //                               Specifying the information to query.
    //                               Possible values:

    // @return                       any
    //                      <GLenum> SHADER_TYPE
    //                   <GLboolean> DELETE_STATUS
    //                   <GLboolean> COMPILE_STATUS
    getShaderParameter(shader, pname) {
      return this.context.getShaderParameter(shader, pname);
    }

    // void
    // The WebGLRenderingContext.vertexAttribPointer() method of the 
    // WebGL API binds the buffer currently bound to gl.ARRAY_BUFFER 
    // to a generic vertex attribute of the current vertex buffer 
    // object and specifies its layout.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glVertexAttribPointer.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer

    // @parameter           <GLuint> index
    //                               A GLuint specifying the index of the 
    //                               vertex attribute that is to be modified.
    //                               [ 0, 255 ]

    // @parameter           <GLint>  size
    //                               A GLint specifying the number of components
    //                               per vertex attribute. Must be 1, 2, 3, or 4.
    //                               [ +1, +4 ]

    // @parameter           <GLenum> type 
    //                               A GLenum specifying the data type of each 
    //                               component in the array. Possible values:
    //                               BYTE
    //                               SHORT
    //                               UNSIGNED_BYTE
    //                               UNSIGNED_SHORT
    //                               FLOAT
    //                               HALF_FLOAT
    //                               INT
    //                               UNSIGNED_INT
    //                               INT_2_10_10_10_REV
    //                               UNSIGNED_INT_2_10_10_10_REV

    // @parameter        <GLboolean> normalized 
    //                               A GLboolean specifying whether integer 
    //                               data values should be normalized into a 
    //                               certain range when being cast to a float.
    //                         BYTE: [ -1, +1 ]
    //                        SHORT: [ -1, +1 ]
    //                UNSIGNED_BYTE: [  0, +1 ]
    //               UNSIGNED_SHORT: [  0, +1 ]
    //                        FLOAT: ^effectless
    //                   HALF_FLOAT: ^effectless

    // @parameter          <GLsizei> stride
    //                               A GLsizei specifying the offset in bytes between
    //                               the beginning of consecutive vertex attributes.
    //                               Cannot be negative or larger than 255. 
    //                               [ 0, 255 ]

    // @parameter         <GLintptr> offset
    //                               A GLintptr specifying an offset in bytes of 
    //                               the first component in the vertex attribute 
    //                               array. Must be a multiple of the byte length 
    //                               of type.
    //                               [ 0, 255 ]

    // @return                       undefined
    vertexAttribPointer(index, size, type, normalized, stride, offset) {
      return this.context.vertexAttribPointer(index, size, type, normalized, stride, offset);
    }

    
    // void
    // The WebGLRenderingContext.uniform[1234][fi][v]() methods of the 
    // WebGL API specify values of uniform variables. All active uniform 
    // variables defined in a program object are initialized to 0 when 
    // the program object is linked successfully.

    // They retain the values assigned to them by a call to this method 
    // until the next successful link operation occurs on the program object, 
    // when they are once again initialized to 0.

    // * Non-normative:
    //   Performance problems have been observed on some implementations 
    //   when using uniform1i to update sampler uniforms. To change the 
    //   texture referenced by a sampler uniform, binding a new texture 
    //   to the texture unit referenced by the uniform should be preferred 
    //   over using uniform1i to update the uniform itglobal

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glUniform.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform

    // @parameter                
    //        <WebGLUniformLocation> location
    //                               A object containing the location of 
    //                               the uniform attribute to modify.

    // @parameter          <GLfloat> v0, v1, v2, v3
    //                               A new value to be used for the uniform 
    //                               variable.

    // @return                       undefined
    uniform1f(location, v0) {
      return this.context.uniform1f(location, v0);
    }

    
    // void
    //? see: uniform1f
    uniform2f(location, v0, v1) {
      return this.context.uniform2f(location, v0, v1);
    }

    
    // void
    //? see: uniform1f
    uniform3f(location, v0, v1, v2) {
      return this.context.uniform3f(location, v0, v1, v2);
    }

    
    // void
    //? see: uniform1f
    uniform4f(location, v0, v1, v2, v3) {
      return this.context.uniform4f(location, v0, v1, v2, v3);
    }

    
    // void
    // The WebGLRenderingContext.uniformMatrix[234]fv() methods of the 
    // WebGL API specify matrix values for uniform variables.

    // The three versions of this method (uniformMatrix2fv(), 
    // uniformMatrix3fv(), and uniformMatrix4fv()) take as the 
    // input value 2-component, 3-component, and 4-component 
    // square matrices, respectively. 
    // They are expected to have 4, 9 or 16 floats.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glUniform.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix

    // @parameter                
    //        <WebGLUniformLocation> location
    //                               A object containing the location of 
    //                               the uniform attribute to modify.

    // @parameter          <GLfloat> value, v0, v1, v2, v3
    //                               A new value to be used for the uniform 
    //                               variable.

    // @parameter     GLboolean> transpose
    //                           A specifying whether to transpose the matrix. 
    //                         ? Must be false.

    // @parameter        <GLboolean> value
    //                               A Float32Array or sequence of GLfloat values. 
    //                               The values are assumed to be supplied in 
    //                               column major order.

    // @return                       undefined    
    uniformMatrix2fv(location, value) {
      return this.context.uniformMatrix2fv(location, false, value);
    }

    // void
    //? see: uniformMatrix2fv 
    uniformMatrix3fv(location, value) {
      return this.context.uniformMatrix3fv(location, false, value);
    }

    
    // void
    //? see: uniformMatrix2fv
    uniformMatrix4fv(location, value) {
      return this.context.uniformMatrix4fv(location, false, value);
    }

    // void
    // The WebGLRenderingContext.drawArrays() method of the WebGL API 
    // renders primitives from array data.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDrawArrays.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays

    // @parameter           <GLenum> mode
    //                               A GLenum specifying the type primitive to render. 
    //                               Possible values are:
    //                       POINTS: Draws a single dot.
    //                   LINE_STRIP: Draws a straight line to the next vertex.
    //                    LINE_LOOP: Draws a straight line to the next vertex, and connects
    //                               the last vertex back to the first.
    //                        LINES: Draws a line between a pair of vertices.
    //               TRIANGLE_STRIP: Connected triangles that share one central vertex.
    //                 TRIANGLE_FAN: A subset in a triangle mesh with shared vertices.
    //                    TRIANGLES: Draws a triangle for a group of three vertices.

    // @parameter           <GLint>  first
    //                               The starting index in the array of vector points.

    // @parameter         <GLsizei>  count
    //                               The number of indices to be rendered.

    // @return                       undefined
    drawArrays(mode, first, count) {
      return this.context.drawArrays(mode, first, count);
    }

    // void
    // The WebGLRenderingContext.clearColor() method of the WebGL API 
    // specifies the color values used when clearing color buffers.
    // Default values of all parameters is zero (0).

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glClearColor.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor

    // @parameter         <GLclampf> red
    //!                              The red color value used when the buffers are cleared.

    // @parameter         <GLclampf> green
    //*                              The green color value used when the buffers are cleared.

    // @parameter         <GLclampf> blue
    //?                              The blue color value used when the buffers are cleared.

    // @parameter         <GLclampf> alpha
    //TODO                           Transparency value used when the buffers are cleared.

    // @return                       undefined
    clearColor(red, green, blue, alpha) {
      return this.context.clearColor(red, green, blue, alpha);
    }

    // void
    // The WebGLRenderingContext.depthFunc() method of the WebGL API 
    // specifies a function that compares incoming pixel depth to 
    // the current depth buffer value.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDepthFunc.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc

    // @parameter           <GLenum> func
    //                               Specifying the depth comparison function, 
    //                               which sets the conditions under which the pixel 
    //                               will be drawn. The default value is gl.LESS. 
    //                               Possible values are:
    //                        NEVER: never pass
    //                        *LESS: pass if incoming value == depth buffer value
    //                       LEQUAL: pass if incoming value <= depth buffer value
    //                      GREATER: pass if incoming value >  depth buffer value
    //                     NOTEQUAL: pass if incoming value != depth buffer value
    //                       GEQUAL: pass if incoming value >= depth buffer value
    //                       ALWAYS: always pass

    // @return                       undefined
    depthFunc(func) {
      return this.context.depthFunc(func);
    }

    // void
    // The WebGLRenderingContext.clearDepth() method of the WebGL API
    // specifies the clear value for the depth buffer. Default value is 1

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glClearDepthf.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth

    // @parameter         <GLclampf> depth
    //                               The depth value used when the depth buffer 
    //                               is cleared. Default value: 1.
    //                               [ 0, +1 ]

    // @return                       undefined
    clearDepth(depth) {
      return this.context.clearDepth(depth);
    }

    // DOMString?
    // The WebGLRenderingContext.getProgramInfoLog returns 
    // the information log for the specified WebGLProgram 
    // object. It contains errors that occurred during failed 
    // linking or validation of WebGLProgram objects.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetProgramInfoLog.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramInfoLog

    // @parameter     <WebGLProgram> program
    //                               The WebGLProgram to query.

    // @return                       <DOMString> 
    //                               A string that contains diagnostic 
    //                               messages, warning messages, and other 
    //                               information about the last linking or 
    //                               validation operation. When a 
    //                               WebGLProgram object is initially 
    //                               created, its information log will be 
    //                               a string of length 0.
    getProgramInfoLog(program) {
      return this.context.getProgramInfoLog(program);
    }

    // WebGLBuffer?
    // The WebGLRenderingContext.createBuffer() method of the WebGL API 
    // creates and initializes a WebGLBuffer storing data such as 
    // vertices or colors.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGenBuffers.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer 

    // @return                       <WebGLBuffer>
    //                               A buffer for storing data such as 
    //                               vertices or colors.
    createBuffer() {
      return this.context.createBuffer();
    }

    // void
    // The WebGLRenderingContext.createBuffer() method of the WebGL API 
    // creates and initializes a WebGLBuffer storing data such as 
    // vertices or colors.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGenBuffers.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer

    // @parameter           <GLenum> target 
    //                               The binding point (target). Possible 
    //                               values:
    //                 ARRAY_BUFFER: Buffer containing vertex attributes,
    //                               such as vertex coordinates, texture 
    //                               coordinate data, or vertex color data.
    //         ELEMENT_ARRAY_BUFFER: Element indices.
    //             COPY_READ_BUFFER: Copying buffer object to another.
    //            COPY_WRITE_BUFFER: Copying buffer object to another.
    //    TRANSFORM_FEEDBACK_BUFFER: Transform feedback operations.
    //               UNIFORM_BUFFER: Storing uniform blocks.
    //            PIXEL_PACK_BUFFER: Pixel transfer operations.
    //          PIXEL_UNPACK_BUFFER: Pixel transfer operations.

    // @parameter      <WebGLBuffer> buffer
    //                               A WebGLBuffer to bind.

    // @return                       undefined
    bindBuffer(target, buffer) {
      return this.context.bindBuffer(target, buffer);
    }

    // void
    // The WebGLRenderingContext.bufferData() method of the 
    // WebGL API initializes and creates the buffer object's 
    // data store.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glBufferData.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData

    // @parameter           <GLenum> target 
    //                               The binding point (target). Possible 
    //                               values:
    //                 ARRAY_BUFFER: Buffer containing vertex attributes,
    //                               such as vertex coordinates, texture 
    //                               coordinate data, or vertex color data.
    //         ELEMENT_ARRAY_BUFFER: Element indices.
    //             COPY_READ_BUFFER: Copying buffer object to another.
    //            COPY_WRITE_BUFFER: Copying buffer object to another.
    //    TRANSFORM_FEEDBACK_BUFFER: Transform feedback operations.
    //               UNIFORM_BUFFER: Storing uniform blocks.
    //            PIXEL_PACK_BUFFER: Pixel transfer operations.
    //          PIXEL_UNPACK_BUFFER: Pixel transfer operations.

    // @parameter       <GLsizeiptr> size
    //                               Setting the size in bytes of the buffer 
    //                               object's data store.

    // @parameter       <GLsizeiptr> srcData                   #? (optional) 
    //                               Will be copied into the data store. If 
    //                               null, a data store is still created, but 
    //                               the content is uninitialized and undefined. 
    //                               <ArrayBuffer>
    //                               <SharedArrayBuffer>
    //                               <TypedArray>
    //                               <DataView>

    // @parameter           <GLenum> usage
    //                               The intended usage pattern of the data store 
    //                               for optimization purposes. Possible values:

    //                  STATIC_DRAW: Specified once by the application, and used 
    //                               many times as the source for WebGL drawing 
    //                               and image specification commands.

    //                  STREAM_DRAW: Specified once by the application, and used 
    //                               at most a few times as the source for WebGL 
    //                               drawing and image specification commands.

    //                  STATIC_READ: Specified once by reading data from WebGL, 
    //                               and queried many times by the application.

    //                  STREAM_READ: Specified once by reading data from WebGL, 
    //                               and queried at most a few times by the 
    //                               application

    //                  STATIC_COPY: Specified once by reading data from WebGL, 
    //                               and used many times as the source for WebGL 
    //                               drawing and image specification commands.

    //                  STREAM_COPY: Specified once by reading data from WebGL, 
    //                               and used at most a few times as the source 
    //                               for WebGL drawing and image specification 
    //                               commands.

    //                 DYNAMIC_DRAW: Respecified repeatedly by the application, 
    //                               and used many times as the source for WebGL 
    //                               drawing and image specification commands.

    //                 DYNAMIC_READ: Respecified repeatedly by reading data from 
    //                               WebGL, and queried many times by the 
    //                               application.

    //                 DYNAMIC_COPY: Respecified repeatedly by reading data from 
    //                               WebGL, and used many times as the source 
    //                               for WebGL drawing and image specification 
    //                               commands.

    // @return                       undefined
    //TODO                   : ( target, usage, srcOffset ) ->
    //TODO                   : ( target, srcData, usage, srcOffset ) ->
    bufferData(target, srcData, usage, srcOffset, length) {
      return this.context.bufferData(target, srcData, usage, srcOffset, length);
    }

    // any
    // The WebGLRenderingContext.getProgramParameter() method of the 
    // WebGL API returns information about the given program.

    // @link https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetProgramiv.xml
    // @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramParameter

    // @parameter     <WebGLProgram> program
    //                               A WebGLProgram to get parameter  
    //                               information from.

    // @parameter           <GLenum> pname
    //                               A GLenum specifying the information 
    //                               to query. Possible values:
    //                DELETE_STATUS: Flagged for deletion. 
    //                  LINK_STATUS: Last link operation success.
    //              VALIDATE_STATUS: Last validation operation success.
    //             ATTACHED_SHADERS: Number of attached shaders.
    //            ACTIVE_ATTRIBUTES: Number of active attribute variables
    //              ACTIVE_UNIFORMS: Number of active uniform variables
    // TRANSFORM_FEEDBACK_BUFR_MODE: The buffer mode when transform feedback is active. May be gl.SEPARATE_ATTRIBS or gl.INTERLEAVED_ATTRIBS.
    //  TRANSFORM_FEEDBACK_VARYINGS: Number of varying variables to capture in transform feedback mode.
    //        ACTIVE_UNIFORM_BLOCKS: Number of uniform blocks containing active uniforms

    // @return           <GLboolean> DELETE_STATUS 
    //                   <GLboolean> LINK_STATUS 
    //                   <GLboolean> VALIDATE_STATUS 
    //                       <GLint> ATTACHED_SHADERS
    //                       <GLint> ACTIVE_ATTRIBUTES
    //                       <GLint> ACTIVE_UNIFORMS
    //                      <GLenum> TRANSFORM_FEEDBACK_BUFFER_MODE
    //                       <GLint> TRANSFORM_FEEDBACK_VARYINGS
    //                       <GLint> ACTIVE_UNIFORM_BLOCKS
    getProgramParameter(program, pname) {
      return this.context.getProgramParameter(program, pname);
    }

  };

  Display.prototype.context = WebGL2RenderingContext;

  Display.prototype.program = new Array();

  return Display;

}).call(this);

glContext = (function() {
  class glContext extends Buffer {
    constructor(options, Object = glContext) {
      super(Object).init(options);
    }

    init(options) {
      var gl, label, ref1, value;
      ref1 = this.defaults(options);
      for (label in ref1) {
        value = ref1[label];
        if (typeof this[label] === "function") {
          this[label](value);
        }
      }
      gl = this.get();
      gl.enable(DEFAULT_ENABLED_TEST);
      gl.depthFunc(DEFAULT_DEPTH_FUNCTION);
      gl.clearDepth(DEFAULT_CLEAR_DEPTH);
      gl.clearColor(0, 0.2, 0.2, .5);
      return this;
    }

    defaults(options = {}) {
      if (options instanceof HTMLCanvasElement) {
        options = new Object({
          canvas: options
        });
      }
      options = new Object({...glContext.defaults, ...options});
      if (!(options.canvas instanceof HTMLCanvasElement)) {
        options.canvas = this.create(options);
      }
      return options;
    }

    create(options) {
      var tagName;
      tagName = options.nodeTag || DEFAULT_NODETAG;
      return Object.defineProperties(document.createElement(tagName), {
        id: {
          value: options.id || this.uuid()
        }
      });
    }

    add(index) {
      index.context(this);
      return this;
    }

    append(parent = DEFAULT_ROOT) {
      return parent.appendChild(this.style().canvas());
    }

    style() {
      var element;
      element = this.canvas();
      element.width = this.pixelRatio() * this.width();
      element.height = this.pixelRatio() * this.height();
      Object.defineProperties(element.style, {
        width: {
          value: CSS.px(this.width())
        },
        height: {
          value: CSS.px(this.height())
        },
        top: {
          value: CSS.px(this.top())
        },
        right: {
          value: CSS.px(this.right())
        },
        bottom: {
          value: CSS.px(this.bottom())
        },
        left: {
          value: CSS.px(this.left())
        }
      }).position = DEFAULT_POSITION;
      return this;
    }

    canvas(canvas) {
      if (canvas == null) {
        return this.get().canvas;
      }
      this.set(canvas.getContext(this.type()));
      return this;
    }

    type(type) {
      if (type == null) {
        return glContext.type[this.getUint8(this.offsetType)];
      }
      return this.setUint8(this.offsetType, glContext.type.indexOf(type));
    }

    width(width) {
      if (width == null) {
        return this.getUint16(this.offsetWidth);
      }
      this.setUint16(this.offsetWidth, width);
      return this;
    }

    height(height) {
      if (height == null) {
        return this.getUint16(this.offsetHeight);
      }
      this.setUint16(this.offsetHeight, height);
      return this;
    }

    top(top) {
      if (top == null) {
        return this.getUint16(this.offsetTop);
      }
      this.setUint16(this.offsetTop, top);
      return this;
    }

    right(right) {
      if (right == null) {
        return this.getUint16(this.offsetRight);
      }
      this.setUint16(this.offsetRight, right);
      return this;
    }

    bottom(bottom) {
      if (bottom == null) {
        return this.getUint16(this.offsetBottom);
      }
      this.setUint16(this.offsetBottom, bottom);
      return this;
    }

    left(left) {
      if (left == null) {
        return this.getUint16(this.offsetLeft);
      }
      this.setUint16(this.offsetLeft, left);
      return this;
    }

    connected(connected) {
      if (connected == null) {
        return this.getUint8(this.offsetConnected);
      }
      this.setUint8(this.offsetConnected, connected);
      return this;
    }

    pixelRatio(pixelRatio) {
      if (pixelRatio == null) {
        return this.getUint8(this.offsetPixelRatio);
      }
      this.setUint8(this.offsetPixelRatio, pixelRatio);
      return this;
    }

    aspectRatio(aspectRatio) {
      if (aspectRatio == null) {
        return this.getFloat32(this.offsetAspectRatio);
      }
      this.setFloat32(this.offsetAspectRatio, aspectRatio);
      return this;
    }

    zIndex(zIndex) {
      if (zIndex == null) {
        return this.getUint8(this.offsetZIndex);
      }
      this.setUint8(this.offsetZIndex, zIndex);
      return this;
    }

    clearColor(index) {
      if (index == null) {
        return this.getUint32(this.offsetClearColor);
      }
      this.setUint32(this.offsetZIndex, index);
      return this;
    }

    clearMask(index) {
      if (index == null) {
        return this.getUint32(this.offsetClearMask);
      }
      this.setUint32(this.offsetClearMask, index);
      return this;
    }

    draw() {
      var drawCalls;
      return drawCalls = this.addDrawcall();
    }

    //@get().clear COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT
    setDrawcall(count) {
      return this.setUint32(this.offsetDrawcall, count);
    }

    getDrawcall() {
      return this.getUint32(this.offsetDrawcall);
    }

    addDrawcall() {
      var count;
      this.setUint32(this.offsetDrawcall, count = this.getDrawcall() + 1);
      return count;
    }

  };

  glContext.prototype.bufferType = CONTEXT_BUFFER;

  glContext.prototype.bufferSize = 64;

  glContext.type = ["webgl2", "webgl", "experimental-webgl", "2d", "webgpu", "bitmaprenderer"];

  glContext.prototype.offsetDrawcall = 4;

  glContext.prototype.offsetWidth = 36;

  glContext.prototype.offsetHeight = 38;

  glContext.prototype.offsetTop = 40;

  glContext.prototype.offsetRight = 42;

  glContext.prototype.offsetBottom = 44;

  glContext.prototype.offsetLeft = 46;

  glContext.prototype.offsetConnected = 48;

  glContext.prototype.offsetPixelRatio = 49;

  glContext.prototype.offsetAspectRatio = 50;

  glContext.prototype.offsetZIndex = 54;

  glContext.prototype.offsetType = 55;

  glContext.prototype.offsetClearColor = 56;

  glContext.prototype.offsetClearMask = 60;

  glContext.defaults = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    zIndex: DEFAULT_ZINDEX,
    pixelRatio: DEVICE_PIXEL_RATIO,
    aspectRatio: DEFAULT_ASPECT_RATIO,
    clearColor: DEFAULT_CLEAR_COLOR
  };

  return glContext;

}).call(this);

glProgram = (function() {
  class glProgram extends Buffer {
    constructor(context, Object = glProgram) {
      super(Object).init({context});
    }

    init(options = {}) {
      var label, value;
      for (label in options) {
        value = options[label];
        try {
          if (typeof this[label] === "function") {
            this[label](value);
          }
        } catch (error) {}
      }
      return this;
    }

    create() {
      this.set(this.context().get().createProgram());
      return this;
    }

    attach(shader) {
      this.context().get().attachShader(this.get(), shader);
      return this;
    }

    link() {
      this.context().get().linkProgram(this.get());
      return this;
    }

    use() {
      this.context().get().useProgram(this.get());
      return this;
    }

    attribute(glAttribute) {
      var attrib, gl, index, name, program;
      gl = this.context().get();
      name = glAttribute.name();
      index = 0;
      program = this.get();
      while (attrib = gl.getActiveAttrib(program, index++)) {
        if (attrib.name === name) {
          return glAttribute.set(Object.defineProperties(attrib, {
            index: {
              value: index
            }
          }));
        }
      }
    }

    add(index) {
      return index.program(this);
    }

    fragmentShader(shader) {
      if (shader == null) {
        return this.getUint32(this.offsetFragmentShader);
      }
      this.setUint32(this.offsetFragmentShader, shader);
      return this;
    }

    context(context) {
      if (context == null) {
        return new Index(this.getUint32(this.offsetContext));
      }
      this.setUint32(this.offsetContext, context);
      return this;
    }

    getProperties(bufferType = null) {
      var i, index, results;
      if (!this.getUint8(i = 0)) {
        return;
      }
      results = [];
      while (index = this.getUint32(this.offsetByte + (i++ * 4))) {
        results.push(new Index(index));
      }
      return results;
    }

  };

  glProgram.prototype.bufferType = PROGRAM;

  glProgram.prototype.bufferSize = 96; //? has empty slots for shaders, attrs and uniforms 

  glProgram.prototype.offsetByte = 14;

  glProgram.prototype.offsetVertexShader = 2;

  glProgram.prototype.offsetFragmentShader = 6;

  glProgram.prototype.offsetContext = 10;

  return glProgram;

}).call(this);

glColor = (function() {
  class glColor extends Buffer {
    constructor(options, Object = glColor) {
      super(Object).create(options);
    }

    create(options = {}) {
      if (options.alpha) {
        this.setAlpha(options.alpha);
      }
      if (options.red) {
        this.setRed(options.red);
      }
      if (options.green) {
        this.setGreen(options.green);
      }
      if (options.blue) {
        this.setBlue(options.blue);
      }
      if (options.constructor === Array) {
        this.fromArray(options);
      }
      options.normalize && this.normalize();
      return this;
    }

    fromArray(rgba = [0, 0, 0, 1]) {
      var index, j, len, offset, ref1;
      ref1 = [0, 4, 8, 12];
      for (index = j = 0, len = ref1.length; j < len; index = ++j) {
        offset = ref1[index];
        this.setFloat32(offset, rgba[index]);
      }
      return this;
    }

    fromHex(OxRRGGBBAA, OxRRGGBB) {
      var a, b, g, r;
      r = (OxRRGGBBAA >> 24) & 0xff / 0xff;
      g = (OxRRGGBBAA >> 16) & 0xff / 0xff;
      b = (OxRRGGBBAA >> 8) & 0xff / 0xff;
      a = (OxRRGGBBAA >> 32) & 0xff / 0xff;
      r = (OxRRGGBB >> 16) & 0xff / 0xff;
      g = (OxRRGGBB >> 8) & 0xff / 0xff;
      b = (OxRRGGBB >> 0) & 0xff / 0xff;
      return a = 0xff / 0xff;
    }

    toArray(rgba = []) {
      var index, j, len, offset, ref1;
      ref1 = [0, 4, 8, 12];
      for (index = j = 0, len = ref1.length; j < len; index = ++j) {
        offset = ref1[index];
        rgba[index] = this.getFloat32(offset);
      }
      return rgba[index];
    }

    normalize(Oxff = 255) {
      var j, len, offset, ref1;
      ref1 = [0, 4, 8, 12];
      for (j = 0, len = ref1.length; j < len; j++) {
        offset = ref1[j];
        this.setFloat32(offset, this.getFloat32(offset) / Oxff);
      }
      return this;
    }

    setRed(red = 1) {
      this.setFloat32(0, red);
      return this;
    }

    setGreen(green = 1) {
      this.setFloat32(4, green);
      return this;
    }

    setBlue(blue = 1) {
      this.setFloat32(8, blue);
      return this;
    }

    setAlpha(alpha = 1) {
      this.setFloat32(12, alpha);
      return this;
    }

    getRed() {
      return this.getFloat32(0);
    }

    getGreen() {
      return this.getFloat32(4);
    }

    getBlue() {
      return this.getFloat32(8);
    }

    getAlpha() {
      return this.getFloat32(12);
    }

  };

  glColor.prototype.bufferType = COLOR4;

  glColor.prototype.bufferSize = 16;

  glColor.prototype.typedArray = Float32Array;

  return glColor;

}).call(this);

glBlendColor = (function() {
  class glBlendColor extends glColor {
    constructor(options, Object = glBlendColor) {
      super(options, Object);
    }

  };

  glBlendColor.prototype.bufferType = BLEND_COLOR;

  return glBlendColor;

}).call(this);

glClearColor = (function() {
  class glClearColor extends glColor {
    constructor(options, Object = glClearColor) {
      super(options, Object);
    }

  };

  glClearColor.prototype.bufferType = COLOR_CLEAR_VALUE;

  return glClearColor;

}).call(this);

glState = (function() {
  class glState extends Buffer {
    // 16 <GLenum> face, <GLenum> fail, <GLenum> zfail, <GLenum> zpass

    //* ----------------------------> 216 (bytes) <-----------------------------

    // any

    // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGet.xml
    // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetString.xml
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter

    // <GLenum>
    getParameter(pname) {}

    // [WebGLHandlesContextLoss] <GLenum>

    // If the context's webgl context lost flag is set, returns CONTEXT_LOST_WEBGL 
    // the first time this method is called. Afterward, returns NO_ERROR until 
    // the context has been restored.

    // https://www.khronos.org/opengles/sdk/2.0/docs/man/xhtml/glGetError.xml
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError
    getError() {}

    // [WebGLHandlesContextLoss] <GLboolean>

    // For any isEnabled query, the same boolean value can be obtained via 
    // getParameter. Returns false if the context's webgl context lost flag is set.

    // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glIsEnabled.xml
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/isEnabled

    // <GLenum> cap
    isEnabled(cap) {}

  };

  glState.prototype.bufferType = STATE;

  glState.prototype.bufferSize = 236;

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glActiveTexture.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture
  glState.prototype.activeTexture = 0;

  
  // 4 <GLenum> texture

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glBlendColor.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendColor
  glState.prototype.blendColor = 4;

  
  // 12 <GLfloat> red, <GLfloat> green, <GLfloat> blue, <GLfloat> alpha

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glBlendEquation.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation
  glState.prototype.blendEquation = 16;

  
  // 4 <GLenum> mode) 

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glBlendEquationSeparate.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquationSeparate
  glState.prototype.blendEquationSeparate = 20;

  
  // 8 <GLenum> modeRGB, <GLenum> modeAlpha

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glBlendFunc.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc
  glState.prototype.blendFunc = 28;

  
  // 8 <GLenum> sfactor, <GLenum> dfactor

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glBlendFuncSeparate.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate
  glState.prototype.blendFuncSeparate = 36;

  // 16 <GLenum> srcRGB, <GLenum> dstRGB, <GLenum> srcAlpha, <GLenum> dstAlpha

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glClearColor.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor
  glState.prototype.clearColor = 52;

  
  // 4:index <GLclampf> red, <GLclampf> green, <GLclampf> blue, <GLclampf> alpha

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glClear.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear
  glState.prototype.clearMask = 60;

  // 4 <GLbitfield> mask ( COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT | STENCIL_BUFFER_BIT )

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glClearDepthf.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearDepth
  glState.prototype.clearDepth = 68;

  // 4 <GLclampf> depth [ 0, 1 ]

  // http://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glClearStencil.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearStencil
  glState.prototype.clearStencil = 72;

  // 1 <GLint> s ( STENCIL_CLEAR_VALUE^ = 1 )

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glColorMask.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/colorMask
  glState.prototype.colorMask = 73;

  // 4 <GLboolean> red, <GLboolean> green, <GLboolean> blue, <GLboolean> alpha ( COLOR_WRITEMASK )

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glCullFace.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace
  glState.prototype.cullFace = 77;

  // 4 <GLenum> mode ( FRONT | BACK^ | FRONT_AND_BACK )

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDepthFunc.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc
  glState.prototype.depthFunc = 81;

  // 4 <GLenum> func

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDepthMask.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthMask
  glState.prototype.depthMask = 85;

  // 1 <GLboolean> flag

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDepthRangef.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthRange
  glState.prototype.depthRange = 86;

  // 8 <GLclampf> zNear, <GLclampf> zFar

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glDisable.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/disable
  glState.prototype.disable = 92;

  // 4 + 40 <GLenum> cap

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glEnable.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enable
  glState.prototype.enable = 96;

  // 4 + 40 <GLenum> cap

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glFrontFace.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/frontFace
  glState.prototype.frontFace = 100;

  // 4 <GLenum> mode

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glHint.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/hint
  glState.prototype.hint = 104;

  // 8 <GLenum> target, <GLenum> mode

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glLineWidth.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/lineWidth
  glState.prototype.lineWidth = 112;

  // 4 <GLfloat> width

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glPixelStorei.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei
  glState.prototype.pixelStorei = 116;

  // 8 <GLenum> pname, <GLint> param

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glPolygonOffset.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/polygonOffset
  glState.prototype.polygonOffset = 124;

  // 8 <GLfloat> factor, <GLfloat> units

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glSampleCoverage.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/sampleCoverage
  glState.prototype.sampleCoverage = 132;

  // 6 <GLclampf> value, <GLboolean> invert

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glStencilFunc.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFunc
  glState.prototype.stencilFunc = 138;

  // 12 <GLenum> func, <GLint> ref, <GLuint> mask

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glStencilFuncSeparate.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilFuncSeparate
  glState.prototype.stencilFuncSeparate = 160;

  // 16 <GLenum> face, <GLenum> func, <GLint> ref, <GLuint> mask

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glStencilMask.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilMask
  glState.prototype.stencilMask = 176;

  // 4 <GLuint> mask

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glStencilMaskSeparate.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilMaskSeparate
  glState.prototype.stencilMaskSeparate = 180;

  // 8 <GLenum> face, <GLuint> mask

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glStencilOp.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilOp
  glState.prototype.stencilOp = 188;

  // 12 <GLenum> fail, <GLenum> zfail, <GLenum> zpass

  // https://khronos.org/opengles/sdk/2.0/docs/man/xhtml/glStencilOpSeparate.xml
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilOpSeparate
  glState.prototype.stencilOpSeparate = 200;

  return glState;

}).call(this);

glShader = (function() {
  class glShader extends Buffer {
    constructor(source = "", Object = glShader) {
      super(Object).setBufferType(this.bufferType).setSource(source);
    }

    compile(gl) {
      var shader;
      if (gl == null) {
        gl = this.program().context().get();
      }
      if (!this.set(shader = gl.createShader(this.getBufferType()))) {
        throw ["Failed to create shader!", this];
      }
      gl.shaderSource(shader, this.source());
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, COMPILE_STATUS)) {
        gl.deleteShader(shader);
        shader = null;
        throw ["Failed to compile shader", this.source()];
      }
      return this;
    }

    attach() {
      this.program().attach(this.get());
      return this;
    }

    enable() {
      return this.setUint8(this.enabled, 1);
    }

    disable() {
      return this.setUint8(this.enabled, 0);
    }

    setSource(source = "") {
      var buffer, length, offset;
      buffer = Text.prototype.encode(source);
      length = this.toBuffer().byteLength - this.constructor.prototype.bufferSize - this.headerSize;
      offset = this.alloc(buffer.byteLength - length, this.headerSize);
      Memory.Uint8Array.set(buffer, offset + this.constructor.prototype.bufferSize);
      return this;
    }

    source() {
      return Memory.toString(this, glShader.prototype.bufferSize);
    }

    program(program) {
      if (program == null) {
        return new Index(this.getUint32(this.offsetProgram));
      }
      this.setUint32(this.offsetProgram, program);
      return this;
    }

  };

  glShader.prototype.bufferType = SHADER;

  glShader.prototype.bufferSize = 8;

  glShader.prototype.enabled = 4;

  glShader.prototype.offsetProgram = 0;

  return glShader;

}).call(this);

glVertexShader = (function() {
  class glVertexShader extends glShader {
    constructor(source, Object = glVertexShader) {
      super(source, Object);
    }

  };

  glVertexShader.prototype.bufferType = VERTEX_SHADER;

  return glVertexShader;

}).call(this);

glFragmentShader = (function() {
  class glFragmentShader extends glShader {
    constructor(source, Object = glFragmentShader) {
      super(source, Object);
    }

  };

  glFragmentShader.prototype.bufferType = FRAGMENT_SHADER;

  return glFragmentShader;

}).call(this);

glAttribute = (function() {
  class glAttribute extends Buffer {
    constructor(name, size, type, Object = glAttribute) {
      super(Object).create({name, size, type});
    }

    create(options) {
      var label, value;
      for (label in options) {
        value = options[label];
        switch (label) {
          case "name":
            this.setAttributeName(value);
            break;
          case "size":
            this.setNumComponents(value);
            break;
          case "type":
            this.setAttrValueType(value);
            break;
          case "index":
            this.setLocationIndex(value);
            break;
          case "stride":
            this.setAttribsStride(value);
            break;
          case "offset":
            this.setAttribsOffset(value);
        }
      }
      return this;
    }

    name() {
      return this.getAttributeName();
    }

    size() {
      return this.getNumComponents();
    }

    type() {
      return this.getAttrValueType();
    }

    info() {
      var gl, program;
      gl = this.program().context().get();
      return program = this.program().get();
    }

    enable() {
      return;
      console.log(this.enableVertexAttribArray(0));
      console.log(this.getVertexAttribOffset(0));
      console.log(this.getVertexAttrib(0));
      return console.log(this.program().context().get().getActiveAttrib(this.program().get(), 0));
    }

    buffer() {
      var id;
      this.setVerticesIndex(id = ___.createBuffer());
      ___.bindBuffer(ARRAY_BUFFER, id);
      ___.bufferData(ARRAY_BUFFER, new Float32Array(this.getNumComponents() * 10), STATIC_DRAW);
      return this;
    }

    pointer() {
      ___.vertexAttribPointer(this.getLocationIndex(), this.getNumComponents(), this.getAttrValueType(), this.getNormalizeStat(), this.getAttribsStride(), this.getAttribsOffset());
      return this;
    }

    gl_Location() {
      return ___.getAttribLocation(this.getProgram(), this.getAttributeName());
    }

    setAttributeName(name) {
      return this.writeText(name, this.offsetAttributeName, this.lengthAttributeName);
    }

    setLocationIndex(index) {
      return this.setUint8(this.offsetLocationIndex, index);
    }

    setNumComponents(count) {
      return this.setUint8(this.offsetNumComponents, count);
    }

    setAttrValueType(TYPE = FLOAT) {
      return this.setUint16(this.offsetAttrValueType, TYPE);
    }

    setNormalizeStat(normalized = false) {
      return this.setUint8(this.offsetNormalizeStat, normalized);
    }

    setEnabledStatus(status = 1) {
      this.setUint8(this.offsetEnabledStatus, status);
      return this;
    }

    setAttribsStride(stride) {
      this.setUint8(this.offsetAttribsStride, stride);
      return this;
    }

    setAttribsOffset(offset) {
      this.setUint8(this.offsetAttribsOffset, offset);
      return this;
    }

    setInLeavedIndex(index) {
      this.setUint32(this.offsetInLeavedIndex, index);
      return this;
    }

    setVerticesIndex(index) {
      this.setUint32(this.offsetVerticesIndex, index);
      return this;
    }

    getAttributeName() {
      return Memory.toString(this, this.offsetAttributeName, this.lengthAttributeName);
    }

    getLocationIndex() {
      return this.getUint8(this.offsetLocationIndex);
    }

    getNumComponents() {
      return this.getUint8(this.offsetNumComponents);
    }

    getAttrValueType() {
      return this.getUint16(this.offsetAttrValueType);
    }

    getNormalizeStat() {
      return Boolean(this.getUint8(this.offsetNormalizeStat));
    }

    getAttrValueByte() {
      switch (this.getAttrValueType()) {
        case FLOAT:
        case INT:
        case UNSIGNED_INT:
          return 4;
        case SHORT:
        case UNSIGNED_SHORT:
          return 2;
        case BYTE:
        case UNSIGNED_BYTE:
          return 1;
      }
      throw /Unknown attribute value type!/;
    }

    getAttribsStride() {
      return this.getUint8(this.offsetAttribsStride);
    }

    getAttribsOffset() {
      return this.getUint8(this.offsetAttribsOffset);
    }

    getEnabledStatus() {
      return this.getUint8(this.offsetEnabledStatus);
    }

    getInLeavedIndex() {
      return this.getUint32(this.offsetInLeavedIndex);
    }

    getVerticesIndex() {
      return this.getUint32(this.offsetVerticesIndex);
    }

    delInLeavedIndex() {
      this.setUint32(this.offsetInLeavedIndex, 0);
      return this;
    }

    program(program) {
      if (program == null) {
        return new Index(this.getUint32(this.offsetProgram));
      }
      this.setUint32(this.offsetProgram, program);
      return this;
    }

  };

  glAttribute.prototype.bufferType = SEPARATE_ATTRIBS;

  glAttribute.prototype.bufferSize = 56;

  glAttribute.prototype.lengthAttributeName = 36;

  glAttribute.prototype.offsetAttributeName = 0;

  glAttribute.prototype.offsetLocationIndex = 36;

  glAttribute.prototype.offsetNumComponents = 37;

  glAttribute.prototype.offsetAttrValueType = 38;

  glAttribute.prototype.offsetNormalizeStat = 40;

  glAttribute.prototype.offsetEnabledStatus = 41;

  glAttribute.prototype.offsetAttribsStride = 42;

  glAttribute.prototype.offsetAttribsOffset = 43;

  glAttribute.prototype.offsetInLeavedIndex = 44;

  glAttribute.prototype.offsetVerticesIndex = 48;

  glAttribute.prototype.offsetProgram = 52;

  return glAttribute;

}).call(this);

glAttributes = (function() {
  class glAttributes extends Buffer {
    constructor(...attributes) {
      var Object, ref1;
      ref1 = attributes, [...attributes] = ref1, [Object] = splice.call(attributes, -1);
      if (Object === void 0) {
        Object = glAttributes;
      }
      super(Object).setContainer(new Array).addAttributes(attributes);
    }

    setContainer(container) {
      this.with = container;
      return this;
    }

    addAttributes(attributes) {
      var a, j, len;
      for (j = 0, len = attributes.length; j < len; j++) {
        a = attributes[j];
        this.addAttribute(a);
      }
      return this;
    }

    addAttribute(attr) {
      if (!this.with.includes(attr)) {
        this.with[this.getAttributes().length] = attr;
      }
      return this.recalc();
    }

    setStrideType(type) {
      this.setUint16(this.offsetStrideType, type);
      return this;
    }

    setStrideBytes(bytes) {
      this.setUint8(this.offsetStrideBytes, bytes);
      return this;
    }

    setStrideLength(stride) {
      this.setUint8(this.offsetStrideLength, stride);
      return this;
    }

    getStrideLength() {
      return this.getUint8(this.offsetStrideLength);
    }

    getStrideBytes() {
      return this.getUint8(this.offsetStrideBytes);
    }

    getStrideType() {
      return this.getUint16(this.offsetStrideType);
    }

    getAttributes() {
      return this.with.filter(Boolean);
    }

    recalc() {
      var attr, bytes, count, length, stride, type;
      length = 0;
      count = this.getAttributes().length;
      while (count--) {
        attr = this.with[count];
        attr.setAttribsOffset(length);
        length += attr.getNumComponents();
      }
      this.setStrideType(type = attr.getAttrValueType());
      this.setStrideBytes(bytes = attr.getAttrValueByte());
      this.setStrideLength(stride = length * bytes);
      count = this.getAttributes().length;
      while (count--) {
        attr = this.with[count];
        attr.setAttribsOffset(bytes * attr.getAttribsOffset());
        attr.setAttribsStride(stride);
        attr.setInLeavedIndex(this);
      }
      return this;
    }

    setProgram(index) {
      this.setUint32(this.program, index);
      return this;
    }

    getProgram(index) {
      return ___[index != null ? index : this.getUint32(this.program)];
    }

  };

  glAttributes.prototype.bufferType = INTERLEAVED_ATTRIBS;

  glAttributes.prototype.bufferSize = 8;

  glAttributes.prototype.offsetStrideType = 0;

  glAttributes.prototype.offsetStrideBytes = 2;

  glAttributes.prototype.offsetStrideLength = 3;

  glAttributes.prototype.program = 4;

  return glAttributes;

}).call(this);

glUniform = (function() {
  class glUniform extends Buffer {
    constructor(options, Object = glUniform) {
      super(Object).create(options);
    }

    create(options = {}) {
      if (options.name) {
        this.setUniformName(options.name);
      }
      if (options.index) {
        this.setUniformIndex(options.index);
      }
      return this;
    }

    name() {
      return this.getUniformName();
    }

    gl_Location() {
      return ___.getUniformLocation(this.getProgram(), this.getUniformName());
    }

    setLocationIndex(index) {
      return ___[this] = index;
    }

    getLocationIndex() {
      return ___[this];
    }

    setUniformName(name) {
      return this.writeText(name, this.offsetName, this.lengthName);
    }

    getUniformName() {
      return Memory.toString(this, this.offsetName, this.lengthName);
    }

    program(program) {
      if (program == null) {
        return this.getUint32(this.offsetProgram);
      }
      this.setUint32(this.offsetProgram, program);
      return this;
    }

  };

  glUniform.prototype.bufferType = UNIFORM_BUFFER;

  glUniform.prototype.lengthName = 32;

  glUniform.prototype.offsetName = 4;

  glUniform.prototype.offsetProgram = 0;

  return glUniform;

}).call(this);

glUniformNf = (function() {
  class glUniformNf extends glUniform {
    constructor(options, Object = glUniformNf) {
      super(options, Object);
    }

    create(options = {}) {
      super.create(options);
      if (options.v0) {
        this.setUniformV0(options.v0);
      }
      if (options.v1) {
        this.setUniformV1(options.v1);
      }
      if (options.v2) {
        this.setUniformV2(options.v2);
      }
      if (options.v3) {
        return this.setUniformV3(options.v3);
      }
    }

    setUniformV0(value) {
      return this.setFloat32(this.offsetV0, value);
    }

    setUniformV1(value) {
      return this.setFloat32(this.offsetV1, value);
    }

    setUniformV2(value) {
      return this.setFloat32(this.offsetV2, value);
    }

    setUniformV3(value) {
      return this.setFloat32(this.offsetV3, value);
    }

    getUniformV0() {
      return this.getFloat32(this.offsetV0);
    }

    getUniformV1() {
      return this.getFloat32(this.offsetV1);
    }

    getUniformV2() {
      return this.getFloat32(this.offsetV2);
    }

    getUniformV3() {
      return this.getFloat32(this.offsetV3);
    }

  };

  glUniformNf.prototype.bufferType = UNIFORMNF_BUFFER;

  glUniformNf.prototype.bufferSize = 52;

  glUniformNf.prototype.offsetV0 = 36;

  glUniformNf.prototype.offsetV1 = 40;

  glUniformNf.prototype.offsetV2 = 44;

  glUniformNf.prototype.offsetV3 = 48;

  return glUniformNf;

}).call(this);

glUniform1f = (function() {
  class glUniform1f extends glUniformNf {
    constructor(name, value, Object = glUniform1f) {
      super({name, value}, Object);
    }

    create(options = {}) {
      return super.create({
        ...options,
        v0: options.value
      });
    }

  };

  glUniform1f.prototype.bufferType = UNIFORM1F_BUFFER;

  glUniform1f.prototype.bufferSize = 40;

  return glUniform1f;

}).call(this);

glUniform2f = (function() {
  class glUniform2f extends glUniformNf {
    constructor(name, v0, v1, Object = glUniform2f) {
      super({name, v0, v1}, Object);
    }

  };

  glUniform2f.prototype.bufferType = UNIFORM2F_BUFFER;

  glUniform2f.prototype.bufferSize = 44;

  return glUniform2f;

}).call(this);

glUniform3f = (function() {
  class glUniform3f extends glUniformNf {
    constructor(name, v0, v1, v2, Object = glUniform3f) {
      super({name, v0, v1, v2}, Object);
    }

  };

  glUniform3f.prototype.bufferType = UNIFORM3F_BUFFER;

  glUniform3f.prototype.bufferSize = 48;

  return glUniform3f;

}).call(this);

glUniform4f = (function() {
  class glUniform4f extends glUniformNf {
    constructor(name, v0, v1, v2, v3, Object = glUniform4f) {
      super({name, v0, v1, v2, v3}, Object);
    }

  };

  glUniform4f.prototype.bufferType = UNIFORM4F_BUFFER;

  glUniform4f.prototype.bufferSize = 52;

  return glUniform4f;

}).call(this);

Object.defineProperties(Buffer.prototype, {
  "[[Instance]]": {
    get: function() {
      var byte, size;
      byte = Memory.offset[this];
      size = this.getBufferSize() - this.headerSize;
      return {
        object: Memory.buffer.slice(byte, byte + size),
        header: {
          buffer: Memory.buffer.slice(byte - this.headerSize, byte),
          typeof: this.getBufferType(),
          offset: byte,
          bufferSize: {
            header: this.headerSize,
            object: size
          },
          linkus: this.getBufferLink()
        },
        Memory: Memory
      };
    }
  }
});

export default exports = {Memory, Index, Matrix4, Vector3, glProgram, glAttribute, glAttributes, glVertexShader, glFragmentShader, glPerspective, glColor, glBlendColor, glClearColor, glUniform1f, glUniform2f, glUniform3f, glContext, glUniform4f, glState};
