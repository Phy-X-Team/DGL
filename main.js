var decode, encode;

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

encode = new BufferEncoder();

decode = new BufferDecoder();

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
window.addEventListener("click", function() {
  console.log("dump defined!");
  return Object.defineProperties(Buffer.prototype, {
    dump: {
      get: function() {
        return this.forEach(function(offset, byteLength, bufferType, index) {
          var buffer, object;
          buffer = this.buffer.slice(offset, offset + byteLength);
          if (!(object = Buffer.prototype[bufferType])) {
            return buffer;
          }
          return new object(buffer);
        });
      }
    }
  });
});

export var Buffer = (function() {
  class Buffer extends DataView {
    static getPropertyName(definition) {
      var def, key, ref;
      ref = this.prototype;
      for (key in ref) {
        def = ref[key];
        if (definition === def) {
          return key;
        }
      }
      return null;
    }

    static register(object, bufferType) {
      return Buffer.prototype[object.prototype.bufferType = bufferType] = object;
    }

    constructor(buffer = new ArrayBuffer(0, {
        maxByteLength: 1e6
      }), offset, length) {
      super(buffer, offset, length).byteLength || this.createBuffer();
    }

    createBuffer(type = this.constructor.prototype.bufferType, size = this.constructor.prototype.bufferSize) {
      var length, offset;
      length = this.headLength + (size || 0);
      offset = this.allocate(length);
      this.setBufferType(type != null ? type : TYPE.BUFFER, offset);
      this.setBufferSize(length, offset);
      return offset;
    }

    allocate(byteLength) {
      var length, offset;
      this.buffer.resize(length = byteLength + (offset = this.byteLength));
      this.setBufferSize(length);
      return offset;
    }

    getBufferType(offset = 0) {
      return this.getUint16(offset);
    }

    getBufferSize(offset = 0) {
      return this.getUint32(offset + 2);
    }

    setBufferType(type, offset = 0) {
      this.setUint16(offset, type);
      return this;
    }

    setBufferSize(size = this.byteLength, offset = 0) {
      this.setUint32(offset + 2, size);
      return this;
    }

    forEach(handler, start = this.headLength, end = this.byteLength) {
      var i, offset, result, size, type;
      offset = start;
      result = new Array();
      while (offset < end) {
        type = this.getBufferType(offset);
        size = this.getBufferSize(offset);
        if (!!type) {
          result[i = result.length] = handler.call(this, offset, size, type, i);
        }
        offset = offset + size;
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
        this.setUint8(offset + i, uint);
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
        this.setUint8(offset + i, buffer.getUint8(i));
      }
      return this;
    }

  };

  Buffer.prototype.headLength = 6;

  return Buffer;

}).call(this);

export var glProgram = class glProgram extends Buffer {
  addShader(buffer) {
    return this.writeBuffer(buffer);
  }

  addAttrib(buffer) {
    return this.writeBuffer(buffer);
  }

};

export var glShader = class glShader extends Buffer {
  setShaderSource(source) {
    return this.writeString(source);
  }

};

export var glVertexShader = class glVertexShader extends glShader {};

export var glFragmentShader = class glFragmentShader extends glShader {};

export var glAttribute = (function() {
  class glAttribute extends Buffer {
    setAttribName(name) {
      return this.writeString(name, this.nameOffset, 32);
    }

    setAttribType(type = gl.FLOAT) {
      return this.setUint16(this.typeOffset, type);
    }

    setAttribSlot(slot = 0) {
      return this.setUint8(this.slotOffset, slot);
    }

    setAttribSize(size = 1) {
      return this.setUint8(this.sizeOffset, size);
    }

  };

  glAttribute.prototype.bufferSize = 48;

  glAttribute.prototype.nameOffset = 16;

  glAttribute.prototype.typeOffset = 14;

  glAttribute.prototype.slotOffset = 13;

  glAttribute.prototype.sizeOffset = 12;

  return glAttribute;

}).call(this);

export var glInterleavedAttribute = (function() {
  class glInterleavedAttribute extends glAttribute {
    setAttribStride(stride = 0) {
      return this.setUint8(this.strideOffset, stride);
    }

    setAttribOffset(offset = 0) {
      return this.setUint8(this.offsetOffset, offset);
    }

  };

  glInterleavedAttribute.prototype.strideOffset = 10;

  glInterleavedAttribute.prototype.offsetOffset = 9;

  return glInterleavedAttribute;

}).call(this);

Buffer.register(glProgram, TYPE.GL_PROGRAM);

Buffer.register(glShader, gl.ATTACHED_SHADERS);

Buffer.register(glVertexShader, gl.VERTEX_SHADER);

Buffer.register(glFragmentShader, gl.FRAGMENT_SHADER);

Buffer.register(glAttribute, gl.SEPARATE_ATTRIBS);

Buffer.register(glInterleavedAttribute, gl.INTERLEAVED_ATTRIBS);

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
        @setUint16 offset, type ; type

    setBufferSize           : ( size, offset = 0 ) -> 
        @setUint32 offset + 2, size ; size

    setByteOffset           : ( byte, offset = 0 ) -> 
        @setUint32 offset + 6, byte ; byte

    addUint8                : ( value ) -> 
        offset = @allocate(1)
        @setUint8 offset, value ; offset

    addUint16               : ( value ) -> 
        offset = @allocate(2)
        @setUint16 offset, value ; offset

    addUint32               : ( value ) -> 
        offset = @allocate(4)
        @setUint32 offset, value ; offset

    addFloat32              : ( value ) -> 
        @setFloat32 @allocate(4), value

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
            @setUint8 offset + i, buffer.getUint8 i
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
            @setUint8 offset + index, uint8

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
            @setUint8 offset + i, uint8

        offset

    setAttributeSize        : ( size, offset ) ->
        @setUint8 offset + @maxNameLength, size

    setAttributeType        : ( type = @FLOAT, offset ) ->
        @setUint16 offset + @maxNameLength + 1, type

    setAttributeStride      : ( stride, offset ) ->
        @setUint8 offset + @maxNameLength + 3, stride

    setAttributeOffset      : ( Offset, offset ) ->
        @setUint8 offset + @maxNameLength + 4, Offset

    setAttirbuteIndex       : ( index, offset ) ->
        @setUint8 offset + @maxNameLength + 5, index

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

    nameLength              : 32

    nameOffset              : 12

    sizeOffset              : 44

    typeOffset              : 46

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
        @setUint8 @locationOffset, location

    getAttribLocation       : ->
        @getUint8 @locationOffset

    setAttribName           : ( name ) ->
        buffer = encode.string name
        length = Math.min @nameLength, buffer.byteLength
        tarray = new Uint8Array buffer, 0, length 

        for uint8, index in tarray
            @setUint8 @nameOffset + index, uint8
        @

    getAttribName           : ->
        decode.string @buffer, @nameOffset, @nameLength

    setAttribSize           : ( size ) ->
        @setUint8 @sizeOffset, size ; @

    getAttribSize           : ->
        @getUint8 @sizeOffset

    setAttribType           : ( type ) ->
        @setUint16 @typeOffset, type; @

    getAttribType           : ->
        @getUint16 @typeOffset

    setAttribStride         : ( size = @getAttributeSize(), bytes = @BYTES_PER_ELEMENT ) ->
        @setUint8( @strideOffset, stride = size * bytes ); stride

    getAttribStride         : ->
        @getUint8 @strideOffset

    setAttribOffset         : ( prev_attrib_sizes = 0, bytes = @BYTES_PER_ELEMENT ) ->
        @setUint8( @offsetOffset, offset = prev_attrib_sizes * bytes ); offset

    getAttribOffset         : ->
        @getUint8 @offsetOffset

#TypedBuffer.registerType glAttribute, glProgram::CURRENT_VERTEX_ATTRIB
#TypedBuffer.registerType glSerperateAttrib, glProgram::SEPARATE_ATTRIBS
#TypedBuffer.registerType glInterleavedAttrib, glProgram::INTERLEAVED_ATTRIBS
 */
