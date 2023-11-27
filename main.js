var glShader, glUniform;

import TYPE from "./lib/constants.js";

import {
  BufferEncoder,
  BufferDecoder
} from "../BufferControl/buffer.js";

import {
  BufferObject
} from "../BufferObject/object.js";

import {
  get
} from "./lib/fetch.js";

import {
  gl
} from "./lib/canvas.js";

/*
do ->
    bobject = new BufferObject()

    for v, i in float32Array = new Float32Array(10)
        float32Array[ i ] = (Math.random()*100).toPrecision(
            Math.floor( 1 + Math.random()*10 )
        ) * 1

    for v, i in uInt16Array = new Uint16Array(10)
        uInt16Array[ i ] = (Math.random()*255) * 255

    object = {
        float32Array,
        uInt16Array
    }

    console.warn "untouch:", object
    console.warn "encoded:", encoded = encode.encode object
    console.warn "decoded:", decoder.decode encoded

    console.error "bobject:", bobject
    console.warn "_setter (a):", bobject.a = 1123
    console.log "_getter (a):", bobject.a
    console.error "_resetter (a):", bobject.a = 2241
    console.error "_resetter (a):", bobject.a = 55111
    console.error "_resetter (a):", bobject.a = 14
    console.error "_resetter (a):", bobject.a = { a: 5555 }
    console.error "_resetter (a):", bobject.a.a
    console.error "_resetter (a):", bobject.a = "özgür"
    console.error "_resetter (a):", bobject
*/
global.setTimeout(function() {
  return Object.defineProperties(Buffer.prototype, {
    dump: {
      get: function() {
        return this.forEach(function(object) {
          return (typeof object.detach === "function" ? object.detach() : void 0) || object;
        });
      }
    }
  });
});

export var Buffer = (function() {
  class Buffer extends DataView {
    static register(object, bufferType) {
      return Buffer.prototype[object.prototype.bufferType = bufferType] = object;
    }

    constructor(buffer = new ArrayBuffer(0, {
        maxByteLength: 1e6
      }), offset, length) {
      super(buffer, offset, length).byteLength || this.create();
    }

    create(type = this.constructor.prototype.bufferType, size = 0) {
      var length, offset;
      length = size + Math.max(this.headLength, this.constructor.prototype.headLength);
      offset = this.allocate(length);
      this.setBufferType(type != null ? type : TYPE.BUFFER, offset);
      this.setBufferSize(length, offset);
      return offset;
    }

    allocate(byteLength) {
      var buffer, length, offset, ref, shifts;
      if (!!this.link) {
        this.link = (ref = this.link) != null ? ref.allocate(byteLength) : void 0;
      }
      length = this.byteLength + byteLength;
      offset = this.byteLength + this.byteOffset;
      this.buffer.resize(byteLength + this.buffer.byteLength);
      this.setBufferSize(length);
      if (!!this.byteOffset) {
        buffer = new Uint8Array(this.buffer, offset);
        shifts = buffer.byteLength;
        while (shifts--) {
          buffer[shifts] = buffer[shifts - byteLength];
        }
        buffer = shifts = null;
        return new this.constructor(this.buffer, this.byteOffset, length);
      }
      return offset;
    }

    getBufferType(offset = 0) {
      return this.getUint16(offset);
    }

    getBufferSize(offset = 0) {
      return this.getUint32(offset + 2);
    }

    setBufferType(type, offset = 0) {
      this.setU16(offset, type);
      return this;
    }

    setBufferSize(size = this.byteLength, offset = 0) {
      this.setU32(offset + 2, size);
      return this;
    }

    getLoopOffset(offset = 0, finish = this.byteLength) {
      var ref;
      return [offset + Math.max(this.headLength, (ref = Buffer.prototype[this.bufferType]) != null ? ref.prototype.headLength : void 0), finish];
    }

    getLoopValues(offset) {
      var size;
      return [this.getBufferType(offset), size = this.getBufferSize(offset), offset + size];
    }

    object(offset, type, size) {
      var base;
      if (type == null) {
        type = this.getBufferType(offset);
      }
      if (size == null) {
        size = this.getBufferSize(offset);
      }
      return (typeof (base = Buffer.prototype)[type] === "function" ? new base[type](this.buffer, offset, size) : void 0) || this.slice(offset, size);
    }

    detach(offset = this.byteOffset, length = this.byteLength) {
      return new this.constructor(this.slice(offset, length));
    }

    slice(offset = 0, length = this.byteLength) {
      return this.buffer.slice(offset, offset + length);
    }

    forEach(handler, offset, finish) {
      var index, next, result, size, type;
      [offset, finish] = this.getLoopOffset(offset, finish);
      (result = new Array());
      while (offset < finish) {
        [type, size, next] = this.getLoopValues(offset);
        if (type) {
          if (!(result[index = result.length] = handler.call(this, this.object(offset, type, size), index))) {
            break;
          }
        }
        offset = next;
      }
      return result;
    }

    filter(bufferType, offset, finish) {
      var next, result, size, type;
      [offset, finish] = this.getLoopOffset(offset, finish);
      (result = new Array());
      while (offset < finish) {
        [type, size, next] = this.getLoopValues(offset);
        if (bufferType === type) {
          result.push(this.object(offset, type, size));
        }
        offset = next;
      }
      return result;
    }

    find(bufferType, offset, finish) {
      var next, result, size, type;
      [offset, finish] = this.getLoopOffset(offset, finish);
      (result = new Array());
      while (offset < finish) {
        [type, size, next] = this.getLoopValues(offset);
        if (bufferType === type) {
          return this.object(offset, type, size);
        }
        offset = next;
      }
      return result;
    }

    writeString(string, offset = this.byteLength, maxByteLength) {
      var buffer, char, code, i, j, k, len, len1, length, ref, uint;
      buffer = new Array();
      ref = string.split("");
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        char = ref[i];
        code = char.charCodeAt(0);
        if (!(0xff < code)) {
          buffer.push(code);
        } else {
          buffer.push(1, code >>> 8 & 0xff, code & 0xff);
        }
        if (maxByteLength === (length = buffer.length)) {
          break;
        }
      }
      if (offset + length > this.byteLength) {
        offset = this.allocate(length);
      }
      for (i = k = 0, len1 = buffer.length; k < len1; i = ++k) {
        uint = buffer[i];
        this.setUi8(offset + i, uint);
      }
      return this;
    }

    readString(offset = 0, maxByteLength = this.byteLength) {
      var code, string;
      string = "";
      while (offset < maxByteLength) {
        if (!(1 - (code = this.getUint8(offset)))) {
          code = this.getUint16(offset + 1);
          offset = offset + 2;
        }
        offset = offset + 1;
        string = string + String.fromCharCode(code);
      }
      return string;
    }

    writeBuffer(buffer, isView = true) {
      var i, j, length, offset, reader, ref;
      offset = this.allocate(length = buffer.byteLength);
      reader = isView && buffer || new DataView(buffer);
      for (i = j = 0, ref = length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        this.setUi8(offset + i, reader.getUint8(i));
      }
      return new buffer.constructor(this.buffer, offset, length);
    }

    writeArray(array, TypedArray = Float32Array) {
      var buffer, l, length, object, offset, writer;
      buffer = new TypedArray(array);
      offset = this.byteLength;
      object = this.allocate(l = buffer.byteLength);
      length = TypedArray.BYTES_PER_ELEMENT;
      writer = (function() {
        switch (TypedArray) {
          case Float32Array:
            return this.setF32;
          case Uint32Array:
            return this.setU32;
          case Uint16Array:
            return this.setU16;
          case Uint8Array:
            return this.setUi8;
        }
      }).call(this);
      while (l -= length) {
        writer.call(this, offset + l, buffer[l / length]);
      }
      return object;
    }

    setUi8(offset, value) {
      this.setUint8(offset, value);
      if (this.link) {
        this.link.setUint8(offset, value);
      }
      return value;
    }

    setU16(offset, value) {
      this.setUint16(offset, value);
      if (this.link) {
        this.link.setUint16(offset, value);
      }
      return value;
    }

    setU32(offset, value) {
      this.setUint32(offset, value);
      if (this.link) {
        this.link.setUint32(offset, value);
      }
      return value;
    }

    setF32(offset, value) {
      this.setFloat32(offset, value);
      if (this.link) {
        this.link.setFloat32(offset, value);
      }
      return value;
    }

  };

  Buffer.prototype.headLength = 6;

  return Buffer;

}).call(this);

export var glProgram = class glProgram extends Buffer {
  addBuffer(buffer) {
    return buffer.link = this.writeBuffer(buffer);
  }

  addShader(buffer) {
    return this.addBuffer(buffer);
  }

  addAttrib(buffer) {
    return this.addBuffer(buffer);
  }

  addUniform(buffer) {
    return this.addBuffer(buffer);
  }

  getVertexShader() {
    return this.find(gl.VERTEX_SHADER, ...arguments);
  }

  getFragmentShader() {
    return this.find(gl.FRAGMENT_SHADER, ...arguments);
  }

};

glShader = class glShader extends Buffer {
  setShaderSource(source) {
    return this.writeString(source);
  }

};

export var glVertexShader = class glVertexShader extends glShader {};

export var glFragmentShader = class glFragmentShader extends glShader {};

export var glAttribute = (function() {
  class glAttribute extends Buffer {
    setAttribName(name) {
      return this.writeString(name, this.offsetName, this.lengthName);
    }

    setAttribType(type = gl.FLOAT) {
      return this.setU16(this.offsetType, type);
    }

    setAttribSlot(slot = 0) {
      return this.setUi8(this.offsetSlot, slot);
    }

    setAttribSize(size = 1) {
      return this.setUi8(this.offsetSize, size);
    }

    setAttribSkip(skip = 0) {
      return this.setUi8(this.offsetSkip, skip);
    }

    getAttribName() {
      return this.readString(this.offsetName, this.lengthName);
    }

    getAttribType() {
      return this.getUint16(this.offsetType);
    }

    getAttribSlot() {
      return this.getUint8(this.offsetSlot);
    }

    getAttribSize() {
      return this.getUint8(this.offsetSize);
    }

    getAttribSkip() {
      return this.getUint8(this.offsetSkip);
    }

  };

  glAttribute.prototype.headLength = 48;

  glAttribute.prototype.lengthName = 32;

  glAttribute.prototype.offsetName = 16;

  glAttribute.prototype.offsetType = 14;

  glAttribute.prototype.offsetSlot = 13;

  glAttribute.prototype.offsetSize = 12;

  glAttribute.prototype.offsetSkip = 11;

  return glAttribute;

}).call(this);

export var glInterleavedAttribute = (function() {
  class glInterleavedAttribute extends Buffer {
    addAttrib(buffer) {
      var length;
      length = this.typeLength[buffer.getAttribType()];
      buffer.setAttribSkip(this.getStride() * length);
      this.setStride(this.getStride() + buffer.getAttribSize());
      this.setLength(this.getStride() * length);
      return this.writeBuffer(buffer);
    }

    setStride(stride) {
      this.setUi8(this.strideOffset, stride);
      return stride;
    }

    setLength(length) {
      this.setUi8(this.lengthOffset, length);
      return length;
    }

    getStride() {
      return this.getUint8(this.strideOffset);
    }

    getLength() {
      return this.getUint8(this.lengthOffset);
    }

  };

  glInterleavedAttribute.prototype.strideOffset = 8;

  glInterleavedAttribute.prototype.lengthOffset = 9;

  glInterleavedAttribute.prototype.headLength = 10;

  glInterleavedAttribute.prototype.typeLength = {
    [gl.FLOAT]: 4,
    [gl.INT]: 4,
    [gl.UNSIGNED_INT]: 4,
    [gl.BYTE]: 1,
    [gl.UNSIGNED_BYTE]: 1,
    [gl.SHORT]: 2,
    [gl.UNSIGNED_SHORT]: 2
  };

  return glInterleavedAttribute;

}).call(this);

glUniform = (function() {
  class glUniform extends Buffer {
    setUniformName(name) {
      return this.writeString(name, this.offsetName, this.lengthName);
    }

    getUniformName() {
      return this.readString(this.offsetName, this.lengthName);
    }

  };

  glUniform.prototype.headLength = 38;

  glUniform.prototype.lengthName = 32;

  glUniform.prototype.offsetName = 6;

  return glUniform;

}).call(this);

export var glUniform1f = (function() {
  class glUniform1f extends glUniform {
    setUniformValue(value) {
      this.setF32(this.ufv0Offset, value);
      return value;
    }

    getUniformValue() {
      return this.getFloat32(this.ufv0Offset);
    }

  };

  glUniform1f.prototype.headLength = 42;

  glUniform1f.prototype.ufv0Offset = 38;

  return glUniform1f;

}).call(this);

export var glColor = (function() {
  class glColor extends Buffer {
    setHEXColor(hex) {
      var c;
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      this.setF32(this.redOffset, ((c >> 16) & 255) / 255);
      this.setF32(this.greenOffset, ((c >> 8) & 255) / 255);
      return this.setF32(this.blueOffset((c & 255) / 255));
    }

    setRGBAColor(red, green, blue, alpha = 1) {
      this.setF32(this.redOffset, red);
      this.setF32(this.greenOffset, green);
      this.setF32(this.blueOffset, blue);
      return this.setF32(this.alphaOffset, alpha);
    }

    setRGBColor(red, green, blue) {
      this.setF32(this.redOffset, red);
      this.setF32(this.greenOffset, green);
      return this.setF32(this.blueOffset, blue);
    }

    setRedColor(red) {
      return this.setF32(this.redOffset, red);
    }

    setGreenColor(green) {
      return this.setF32(this.greenOffset, green);
    }

    setBlueColor(blue) {
      return this.setF32(this.blueOffset, blue);
    }

    setColorAlpha(alpha) {
      return this.setF32(this.alphaOffset, alpha);
    }

    getRGBAColor() {
      return new Float32Array(this.slice(this.colorOffset, this.rgbaLength));
    }

    getRGBColor() {
      return new Float32Array(this.slice(this.colorOffset, this.rgbLength));
    }

    getRedColor() {
      return this.getFloat32(this.redOffset);
    }

    getGreenColor() {
      return this.getFloat32(this.greenOffset);
    }

    getBlueColor() {
      return this.getFloat32(this.blueOffset);
    }

    getColorAlpha() {
      return this.getFloat32(this.alphaOffset);
    }

  };

  glColor.prototype.headLength = 24;

  glColor.prototype.colorOffset = 8;

  glColor.prototype.rgbLength = 12;

  glColor.prototype.rgbaLength = 16;

  glColor.prototype.redOffset = 8;

  glColor.prototype.blueOffset = 16;

  glColor.prototype.greenOffset = 12;

  glColor.prototype.alphaOffset = 20;

  return glColor;

}).call(this);

export var glUniformMatrix4fv = class glUniformMatrix4fv extends glUniform {};

export var glObject = (function() {
  class glObject extends Buffer {
    needsUpdate(mark) {
      if (mark == null) {
        this.setUi8(this.offsetUpdateMark, 0);
        return Boolean(this.getUint8(this.offsetChangeMark)); //TODO mark changed when asked 
      }
      this.setUi8(this.offsetUpdateMark, Number(mark));
      return mark;
    }

    setName(name) {
      return this.writeString(name, this.offsetName, this.lengthName);
    }

    setRotateX(radians) {
      return this.setF32(this.offsetRotateX, radians);
    }

    setRotateY(radians) {
      return this.setF32(this.offsetRotateY, radians);
    }

    setRotateZ(radians) {
      return this.setF32(this.offsetRotateZ, radians);
    }

    setScaleX(ratio) {
      return this.setF32(this.offsetScaleX, ratio);
    }

    setScaleY(ratio) {
      return this.setF32(this.offsetScaleY, ratio);
    }

    setScaleZ(ratio) {
      return this.setF32(this.offsetScaleZ, ratio);
    }

    setTranslateX(distance) {
      return this.setF32(this.offsetTranslateX, distance);
    }

    setTranslateY(distance) {
      return this.setF32(this.offsetTranslateY, distance);
    }

    setTranslateZ(distance) {
      return this.setF32(this.offsetTranslateZ, distance);
    }

    setPointCount(count) {
      return this.setU32(this.offsetPointCount, count);
    }

    setBufferData(data, TYPE) {
      return this.writeArray(data, TYPE);
    }

    getName() {
      return this.readString(this.offsetName, this.lengthName);
    }

    getRotateX() {
      return this.getFloat32(this.offsetRotateX);
    }

    getRotateY() {
      return this.getFloat32(this.offsetRotateY);
    }

    getRotateZ() {
      return this.getFloat32(this.offsetRotateZ);
    }

    getScaleX() {
      return this.getFloat32(this.offsetScaleX);
    }

    getScaleY() {
      return this.getFloat32(this.offsetScaleY);
    }

    getScaleZ() {
      return this.getFloat32(this.offsetScaleZ);
    }

    getTranslateX() {
      return this.getFloat32(this.offsetTranslateX);
    }

    getTranslateY() {
      return this.getFloat32(this.offsetTranslateY);
    }

    getTranslateZ() {
      return this.getFloat32(this.offsetTranslateZ);
    }

    getPointCount() {
      return this.getUint32(this.offsetPointCount);
    }

  };

  glObject.prototype.headLength = 90;

  glObject.prototype.lengthName = 36;

  glObject.prototype.offsetName = 10;

  glObject.prototype.offsetRotateX = 46;

  glObject.prototype.offsetRotateY = 50;

  glObject.prototype.offsetRotateZ = 54;

  glObject.prototype.offsetScaleX = 58;

  glObject.prototype.offsetScaleY = 62;

  glObject.prototype.offsetScaleZ = 62;

  glObject.prototype.offsetTranslateX = 66;

  glObject.prototype.offsetTranslateY = 70;

  glObject.prototype.offsetTranslateZ = 74;

  glObject.prototype.offsetPointCount = 78;

  glObject.prototype.offsetChangeMark = 82;

  glObject.prototype.offsetBufferData = 90;

  return glObject;

}).call(this);

Buffer.register(glProgram, TYPE.GL_PROGRAM);

Buffer.register(glShader, gl.ATTACHED_SHADERS);

Buffer.register(glVertexShader, gl.VERTEX_SHADER);

Buffer.register(glFragmentShader, gl.FRAGMENT_SHADER);

Buffer.register(glAttribute, gl.SEPARATE_ATTRIBS);

Buffer.register(glInterleavedAttribute, gl.INTERLEAVED_ATTRIBS);

Buffer.register(glUniform1f, TYPE.GL_UNIFORM_1F);

Buffer.register(glColor, gl.COLOR);

Buffer.register(glUniformMatrix4fv, TYPE.GL_UNIFORM_MATRIX4FV);

Buffer.register(glObject, TYPE.GL_OBJECT);

/*

console.log TYPE.PROGRAM

export class TypedBuffer extends DataView

    @getPropertyName        = ( definition ) ->
        for key, def of @prototype
            return key if definition is def
        return null

    @registerType           = ( object, type ) =>
        Object.defineProperties object.prototype, {
            bufferType : value : type
        }

        Object.defineProperty this::, type, value : object

    bufferType              : TYPE.TYPED_BUFFER

    bufferSize              : 1e6

    headerSize              : 10

    constructor             : ( buffer = new ArrayBuffer(0, { maxByteLength: 1e8 }), offset, length) ->

        super buffer, offset, length

        unless  @byteLength
            if  @byteLength  < @bufferSize
                @buffer.resize @bufferSize

            @setBufferSize @bufferSize
            @setBufferType @bufferType
            @setByteOffset @headerSize

    getBufferType           : ( offset = 0 ) -> 
        @getUint16 offset

    getBufferSize           : ( offset = 0 ) -> 
        @getUint32 offset + 2

    getByteOffset           : -> 
        @getUint32 6

    setBufferType           : ( type, offset = 0 ) -> 
        @setU16 offset, type ; type

    setBufferSize           : ( size, offset = 0 ) -> 
        @setU32 offset + 2, size ; size

    setByteOffset           : ( byte, offset = 0 ) -> 
        @setU32 offset + 6, byte ; byte

    addUint8                : ( value ) -> 
        offset = @allocate(1)
        @setUi8 offset, value ; offset

    addUint16               : ( value ) -> 
        offset = @allocate(2)
        @setU16 offset, value ; offset

    addUint32               : ( value ) -> 
        offset = @allocate(4)
        @setU32 offset, value ; offset

    addFloat32              : ( value ) -> 
        @setF32 @allocate(4), value

    allocateBuffer          : ( type, size ) ->
        offset = @allocate size + @headerSize
        @setBufferType type, offset
        @setBufferSize size, offset
        offset + @headerSize

    allocate                : ( length ) ->
        offset = @getByteOffset()
        length = length + offset

        console
        @resize length if length > @byteLength
        @setByteOffset length

        offset

    resize                  : ( byteLength, transfer = no ) ->
        return this if @byteLength is byteLength

        unless @buffer.maxByteLength > byteLength
            throw "Max byte length exceed! #{byteLength}"

        @buffer.resize byteLength

        this

    slice                   : ( byteLength = @bufferLength, offset ) ->
        new @constructor @buffer, byteLength, offset

    values                  : ( handle, start, end = @byteLength ) ->
        offset = start ? @headerSize
        result = []

        while end > offset

            type = @getBufferType offset
            size = @getBufferSize offset

            if type then result.push(
                handle.call(
                    this, offset, type, size
                )
            )

            offset = offset + size + @headerSize

        return result

    find                    : ( type, start, end = @byteLength ) ->
        offset = start ? @headerSize

        while end > offset

            size = @getBufferSize offset

            if  type is @getBufferType offset
                return new @[ type ] @buffer, offset, size + @headerSize

            offset = offset + size + @headerSize

        return null

    copy                    : ( buffer, offset ) ->
        length = buffer.byteLength
        for i in [ 0 ... buffer.byteLength ]
            @setUi8 offset + i, buffer.getUint8 i
        offset + length

    readString              : ( offset, length ) ->
        length ?= @byteLength - offset
        decode.string @buffer, offset, length

    writeString             : ( string, offset, maxByteLength ) ->
        buffer = encode.string string
        length = buffer.byteLength

        if  maxByteLength?
            length = Math.min length, maxByteLength ? length

        @writeBuffer buffer, offset ? @allocate length

    writeBuffer             : ( buffer, offset ) ->
        offset ?= @allocate buffer.byteLength

        for uint8, index in new Uint8Array buffer 
            @setUi8 offset + index, uint8

        offset

    mergeBuffers            : ( type, buffer1, bufferN ) ->
        cache1 = []
        cache2 = []
        offsets = []
        buffers = [ ...arguments ].slice 1
        minOffset = @byteLength

        for buffer in buffers
            left = buffer.byteOffset
            size = buffer.byteLength

            offsets.push buffer.byteOffset

        @values ( offset, t, length ) =>
            if !offsets.includes offset
                while length--
                    cache2.push @getUint8 offset + length
            else
                while length--
                    cache1.push @getUint8 offset + length

            console.warn offset, length

        { cache1, cache2 }

Object.defineProperties TypedBuffer::, {
    debug : get : ->
        buffer : @buffer.slice @byteOffset, @byteOffset + @byteLength
        values : @values ( offset, type, byteLength ) =>
            name = glProgram.getPropertyName( type )
            return [ name ] : { offset, type, byteLength }
}

export class glProgram2 extends TypedBuffer

    bufferType              : TYPE.GL_PROGRAM_BUFFER

    FLOAT                   : 5126

    ATTACHED_SHADERS        : 35717

    VERTEX_SHADER           : 35633

    FRAGMENT_SHADER         : 35632

    SEPARATE_ATTRIBS        : 35981

    INTERLEAVED_ATTRIBS     : 35980

    CURRENT_VERTEX_ATTRIB   : 34342

    bufferSize              : 256

    attribSize              : 52

    maxNameLength           : 32

    setShaderSource         : ( source, SHADER_TYPE ) ->
        buffer = @[ SHADER_TYPE ].encode source
        offset = @allocateBuffer SHADER_TYPE, buffer.byteLength
        @writeBuffer buffer, offset

    setVertexShader         : ( source ) ->
        @setShaderSource source, @VERTEX_SHADER

    setFragmentShader       : ( source ) ->
        @setShaderSource source, @FRAGMENT_SHADER

    getVertexShader         : ->
        @find @VERTEX_SHADER

    getFragmentShader       : ->
        @find this.FRAGMENT_SHADER

    getAttribute            : ( offset ) ->
        new this[ @getBufferType offset ] @buffer, offset, @attribSize

    setAttirbute            : ( name, size, type, stride = 0, Offset = 0 ) ->
        offset = @allocateBuffer @SEPARATE_ATTRIBS, @attribSize

        @setAttributeName name, offset
        @setAttributeSize size, offset
        @setAttributeType type, offset

        @setAttributeStride stride, offset if stride
        @setAttributeOffset Offset, offset if Offset

        offset

    mergeAttributes         : ( attr1, attrN ) ->
        @mergeBuffers @INTERLEAVED_ATTRIBS, ...arguments

    setAttributeName        : ( name, offset ) ->
        buffer = encode.string name
        length = buffer.byteLength

        for uint8, i in new Uint8Array buffer
            @setUi8 offset + i, uint8

        offset

    setAttributeSize        : ( size, offset ) ->
        @setUi8 offset + @maxNameLength, size

    setAttributeType        : ( type = @FLOAT, offset ) ->
        @setU16 offset + @maxNameLength + 1, type

    setAttributeStride      : ( stride, offset ) ->
        @setUi8 offset + @maxNameLength + 3, stride

    setAttributeOffset      : ( Offset, offset ) ->
        @setUi8 offset + @maxNameLength + 4, Offset

    setAttirbuteIndex       : ( index, offset ) ->
        @setUi8 offset + @maxNameLength + 5, index

    setUniform1f            : ( label, value ) ->

    setUniformMatrix4fv     : ( label, value, transpose = no ) ->

    getAttribLocation       : ( label ) ->

    getUniformLocation      : ( label ) ->

export class glShader2 extends TypedBuffer
    @encode = ( source ) -> encode.string source                        
    @decode = ( buffer ) -> decode.string buffer                        

export class glVertexShader2 extends glShader
export class glFragmentShader2 extends glShader

#TypedBuffer.registerType glShader, glProgram::ATTACHED_SHADERS
#TypedBuffer.registerType glVertexShader, glProgram::VERTEX_SHADER
#TypedBuffer.registerType glFragmentShader, glProgram::FRAGMENT_SHADER

export class glAttribute extends TypedBuffer
    maxNameLength           : 32

    attribNameOffset        : 10
    attribSizeOffset        : 42
    attribTypeOffset        : 43

    getAttribName           : ->
        @readString @byteOffset + @attribNameOffset, @maxNameLength

    getAttribSize           : ->
        @getUint8 @attribSizeOffset

    getAttribType           : ->
        @getUint16 @attribTypeOffset

export class glSerperateAttrib extends glAttribute
export class glInterleavedAttrib extends glAttribute

export class glAttrib extends TypedBuffer

    #sizeOption              : [ 1, 2, 3, 4 ]

    #typeOption              : [ 5126 ]

    FLOAT                   : 5126

    GL_NORMALIZED           : no

    BYTES_PER_ELEMENT       : Float32Array.BYTES_PER_ELEMENT

    bufferType              : TYPE.GL_ATTRIB_BUFFER

    lengthName              : 32

    offsetName              : 12

    offsetSize              : 44

    offsetType              : 46

    strideOffset            : 48

    offsetOffset            : 49

    locationOffset          : 50

    location                : ( gl, program ) ->
        @setAttribLocation gl.getAttribLocation program, @getAttribName()

    enable                  : ( gl ) ->
        gl.enableVertexAttribArray @getAttribName()

    bind                    : ->

    pointer                 : ( gl ) ->
        gl.vertexAttribPointer(
            @getAttribLocation(), @getAttribSize(), @getAttribType(), 
            @GL_NORMALIZED, @getAttribStride(), @getAttribOffset()
        )

    setAttribLocation       : ( location ) ->
        @setUi8 @locationOffset, location

    getAttribLocation       : ->
        @getUint8 @locationOffset

    setAttribName           : ( name ) ->
        buffer = encode.string name
        length = Math.min @lengthName, buffer.byteLength
        tarray = new Uint8Array buffer, 0, length 

        for uint8, index in tarray
            @setUi8 @offsetName + index, uint8
        @

    getAttribName           : ->
        decode.string @buffer, @offsetName, @lengthName

    setAttribSize           : ( size ) ->
        @setUi8 @offsetSize, size ; @

    getAttribSize           : ->
        @getUint8 @offsetSize

    setAttribType           : ( type ) ->
        @setU16 @offsetType, type; @

    getAttribType           : ->
        @getUint16 @offsetType

    setAttribStride         : ( size = @getAttributeSize(), bytes = @BYTES_PER_ELEMENT ) ->
        @setUi8( @strideOffset, stride = size * bytes ); stride

    getAttribStride         : ->
        @getUint8 @strideOffset

    setAttribOffset         : ( prev_attrib_sizes = 0, bytes = @BYTES_PER_ELEMENT ) ->
        @setUi8( @offsetOffset, offset = prev_attrib_sizes * bytes ); offset

    getAttribOffset         : ->
        @getUint8 @offsetOffset

#TypedBuffer.registerType glAttribute, glProgram::CURRENT_VERTEX_ATTRIB
#TypedBuffer.registerType glSerperateAttrib, glProgram::SEPARATE_ATTRIBS
#TypedBuffer.registerType glInterleavedAttrib, glProgram::INTERLEAVED_ATTRIBS
 */
