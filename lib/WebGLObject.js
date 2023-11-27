var Buffer, decoder, encoder;

import GL_CONSTANT from "./GL_CONSTANT.js";

export var WEBGL_OBJECT_BUFFER = 1440;

export var HEADER_BYTELENGTH = 48;

import {
  WenGLBuffer,
  TypedBuffer,
  HeaderBuffer,
  OffsetArray,
  ObjectArray,
  HEADER_INDEX_OBJECT_SELF,
  HEADER_INDEX_OBJECT_CONTEXT
} from "./WebGLMemory.js";

export var BLEND = class BLEND extends GL_CONSTANT {
  constructor() {
    super(3042);
  }

};

export var WebGLMemory = new WenGLBuffer({});

//import memory from "./WebGLMemory.js"
//console.error "memory:", memory
encoder = new TextEncoder();

decoder = new TextDecoder();

export var WebGLObject = Buffer = (function() {
  class Buffer extends Number {
    constructor(constructor = WebGLObject, parent) {
      //console.log "creating:", constructor.name, WebGLMemory.byteLength
      super(ObjectArray.length);
      if (!(this instanceof constructor)) {
        Object.setPrototypeOf(this, constructor.prototype);
      }
      if (ObjectArray.at(this) == null) {
        if (parent) {
          this.relocate(parent);
        } else {
          this.allocate(constructor.BUFFER_BYTELENGTH);
        }
        this.setHeaders(constructor, parent);
      }
      return this;
    }

    initialize(options = {}) {
      return this;
    }

    setParent(parent) {
      var context;
      if (!!(context = parent != null ? parent.getHeaders().indexContext : void 0)) {
        this.getHeaders().indexContext = context;
      }
      this.getHeaders().indexParent = parent;
      return this;
    }

    allocate(byteLength) {
      OffsetArray.it(this, HEADER_BYTELENGTH + WebGLMemory.allocate(byteLength));
      return ObjectArray.it(this, this);
    }

    relocate(parent) {
      OffsetArray.it(this, HEADER_BYTELENGTH + parent.offsetProperty(this));
      return ObjectArray.it(this, this);
    }

    realloc(byteLength) {
      var offset;
      return offset = WebGLMemory.allocate(byteLength);
    }

    getHeaders() {
      return HeaderBuffer.buffer(this);
    }

    setHeaders(constructor, parent) {
      var context, headers, offset;
      offset = OffsetArray.at(this);
      headers = HeaderBuffer.buffer(this);
      if (!(ObjectArray.at(parent) == null)) {
        headers.indexParent = parent;
        if (!(context = parent.indexContext())) {
          headers.context = context;
        }
      }
      headers.bufferType = constructor.bufferType;
      headers.bufferSize = constructor.BUFFER_BYTELENGTH;
      headers.offsetEnd = offset + constructor.bufferSize;
      headers.offsetData = offset;
      headers.offsetStart = offset - constructor.HEADER_BYTELENGTH;
      if (/context/i.test(constructor.name)) {
        headers.indexContext = this;
      }
      headers.indexSelf = this;
      return this;
    }

    offsetChild(prevChild) {
      if (!(prevChild == null)) {
        return prevChild.offsetEnd() + HEADER_BYTELENGTH;
      }
      return this.offsetData() + this.constructor.bufferSize + HEADER_BYTELENGTH;
    }

    offsetProperty(property) {
      return OffsetArray.at(this) + this.attrsOffset[property.constructor.bufferType];
    }

    bufferSize() {
      return HeaderBuffer.getBufferSize(this);
    }

    bufferType() {
      return HeaderBuffer.getBufferType(this);
    }

    offsetStart() {
      return HeaderBuffer.getOffsetStart(this);
    }

    offsetData() {
      return HeaderBuffer.getOffsetData(this);
    }

    offsetEnd() {
      return HeaderBuffer.getOffsetEnd(this);
    }

    indexContext() {
      return HeaderBuffer.getIndexContext(this);
    }

    indexParent() {
      return HeaderBuffer.getIndexParent(this);
    }

    indexSelf() {
      return HeaderBuffer.getIndexSelf(this);
    }

    context() {
      return HeaderBuffer.objectContext(this);
    }

    parent() {
      return HeaderBuffer.objectParent(this);
    }

    object() {
      return HeaderBuffer.objectSelf(this);
    }

    buffer(TypedArray = this.TypedArray, trimEnd = 0, skipStart = 0) {
      var divisor, end, start;
      divisor = TypedArray.BYTES_PER_ELEMENT;
      start = skipStart + this.offsetData() / divisor;
      end = -trimEnd + this.offsetEnd() / divisor;
      switch (TypedArray) {
        case Uint8Array:
          return TypedBuffer.Ui8.subarray(start, end);
        case Uint16Array:
          return TypedBuffer.U16.subarray(start, end);
        case Uint32Array:
          return TypedBuffer.U32.subarray(start, end);
        case Float32Array:
          return TypedBuffer.F32.subarray(start, end);
      }
    }

    get(index = 0, typedArray = this.TypedArray) {
      var offset;
      offset = HeaderBuffer.getOffsetData(this);
      index += offset / typedArray.BYTES_PER_ELEMENT;
      return typedArray.buffer[index];
    }

    set(index, value, typedArray = this.TypedArray) {
      var offset;
      offset = HeaderBuffer.getOffsetData(this);
      index += offset / typedArray.BYTES_PER_ELEMENT;
      return typedArray.buffer[index] = value;
    }

    run(func, ...args) {
      console.warn(`gl.${func}(`, args.join(", "), ")");
      return gl[func].apply(gl, args);
    }

    add(index) {
      var children, i, length, start, stride, target;
      length = this.bufferSize() + index.bufferSize();
      target = WebGLMemory.allocate(length);
      stride = target - this.offsetStart();
      TypedBuffer.Ui8.copyWithin(target, this.offsetStart(), this.offsetEnd());
      HeaderBuffer.setOffsetStart(this, target);
      HeaderBuffer.setOffsetData(this, start = target + HEADER_BYTELENGTH);
      HeaderBuffer.setOffsetEnd(this, target + length);
      HeaderBuffer.setBufferSize(this, length);
      OffsetArray.it(this, start);
      start += this.constructor.OBJECT_BYTELENGTH;
      TypedBuffer.Ui8.copyWithin(start, index.offsetStart(), index.offsetEnd());
      i = 0;
      children = null;
      while (true) {
        console.log(i, index.offsetData());
        if (i++ > 0) {
          break;
        }
      }
      index.setParent(this);
      return this;
    }

    //@copy index.buffer(), offset ; @

    //memory.merge this, i
    copy(buffer, offset = this.offsetData()) {
      TypedBuffer.Ui8.set(buffer, offset);
      return this;
    }

    move(target, bufferSize = this.bufferSize()) {
      var moveLength, offsetStart;
      offsetStart = this.offsetStart();
      moveLength = target - offsetStart;
      TypedBuffer.Ui8.copyWithin(target, offsetStart, this.offsetEnd());
      HeaderBuffer.moveOffset(this, moveLength).setBufferSize(this, bufferSize);
      return this;
    }

    static object(index) {
      if (index) {
        return ObjectArray.at(index);
      }
    }

    encode(text) {
      return encoder.encode(text);
    }

    decode(data) {
      return decoder.decode(data);
    }

    //TODO too many calls in here
    toString() {
      if (typeof this.buffer !== "function") {
        return Number.prototype.toString.call(this);
      }
      return this.decode(this.buffer().slice());
    }

    children() {
      return ObjectArray.at(OffsetArray.indexOf(this.offsetData() + this.constructor.bufferSize + HEADER_BYTELENGTH));
    }

  };

  Buffer.prototype.TypedArray = Uint8Array;

  Buffer.bufferType = WEBGL_OBJECT_BUFFER;

  Buffer.prototype.attrsOffset = new Object();

  Buffer.prototype.attrsObject = new Object();

  return Buffer;

}).call(this);

Object.defineProperties(WebGLObject.prototype, {
  ["__proto__"]: {
    get: function() {
      return {
        offsetStart: this.offsetStart(),
        offsetData: this.offsetData(),
        offsetEnd: this.offsetEnd(),
        indexContext: this.indexContext(),
        indexParent: this.indexParent(),
        indexSelf: this.indexSelf(),
        objectContext: this.context(),
        objectParent: this.parent(),
        objectSelf: this.object(),
        headerBuffer: HeaderBuffer.buffer(this),
        buffer: {
          Ui8: this.buffer(Uint8Array),
          U16: this.buffer(Uint16Array),
          U32: this.buffer(Uint32Array),
          F32: this.buffer(Float32Array)
        },
        bufferType: this.bufferType(),
        bufferSize: this.bufferSize(),
        typedArray: this.TypedArray,
        dataBuffer: this.buffer(),
        dataBufferByte: this.bufferSize() - this.constructor.HEADER_BYTELENGTH,
        dataBufferLength: (this.bufferSize() - this.constructor.HEADER_BYTELENGTH) / this.TypedArray.BYTES_PER_ELEMENT,
        dataBufferOffsets: [this.offsetData(), this.offsetEnd()]
      };
    }
  }
});

Object.defineProperties(WebGLObject, {
  BUFFER_BYTELENGTH: {
    get: function() {
      return this.OBJECT_BYTELENGTH + this.HEADER_BYTELENGTH;
    }
  },
  HEADER_BYTELENGTH: {
    get: function() {
      return HEADER_BYTELENGTH;
    }
  },
  OBJECT_BYTELENGTH: {
    get: function() {
      var prototype;
      prototype = Object.getPrototypeOf(this);
      if (!Object.hasOwn(this, "bufferSize")) {
        if (Number !== this) {
          return this.bufferSize || 0;
        }
        return prototype.OBJECT_BYTELENGTH;
      }
      return prototype.OBJECT_BYTELENGTH + this.bufferSize;
    }
  },
  defineProperty: {
    value: function() {
      var constructor, definition, offset, property, type;
      [constructor, property, definition] = arguments;
      (offset = constructor.bufferSize || (constructor.bufferSize = 0));
      (type = definition.class.bufferType);
      Object.defineProperties(constructor.prototype, new Object({
        [property]: {
          get: function() {
            var index, u32index;
            u32index = offset / 4 + OffsetArray.u32(this);
            u32index += HEADER_INDEX_OBJECT_SELF;
            if (!(index = TypedBuffer.U32[u32index])) {
              return new WebGLObject(definition.class, this);
            }
            return ObjectArray.at(index);
          },
          set: function(value) {
            console.warn((typeof value.getValue === "function" ? value.getValue() : void 0) || value);
            return this[property].setValue((typeof value.getValue === "function" ? value.getValue() : void 0) || value);
          }
        }
      }));
      Object.defineProperties(constructor.prototype.attrsOffset, {
        [type]: {
          value: offset
        }
      });
      Object.defineProperties(constructor.prototype.attrsObject, {
        [type]: {
          value: definition.class
        }
      });
      constructor.bufferSize += definition.class.BUFFER_BYTELENGTH;
      return constructor.bufferSize += 8 - constructor.bufferSize % 8;
    }
  },
  defineProperties: {
    value: function() {
      var constructor, definition, definitions, property;
      [constructor, definitions] = arguments;
      for (property in definitions) {
        definition = definitions[property];
        this.defineProperty(constructor, property, definition);
      }
      return constructor;
    }
  }
});

export var WebGLParameter = class WebGLParameter extends WebGLObject {
  fetch() {
    return this.run("getParameter", this.bufferType());
  }

  apply() {
    console.warn("applying parameter", ...arguments);
    return this;
  }

};

export var WebGLCapability = (function() {
  class WebGLCapability extends WebGLParameter {
    check() {
      return this.run("isEnabled", this.bufferType());
    }

    apply() {
      if (this.getValue()) {
        return this.enable();
      } else {
        this.disable();
        return this;
      }
    }

    enable() {
      this.run("enable", this.bufferType());
      return true;
    }

    disable() {
      this.run("disable", this.bufferType());
      return false;
    }

    setValue() {
      return this.isEnabled = arguments[0];
    }

    getValue() {
      return this.isEnabled;
    }

  };

  WebGLCapability.prototype.TypedArray = Uint32Array;

  WebGLCapability.bufferSize = 2 * Uint32Array.BYTES_PER_ELEMENT;

  WebGLCapability.gl = [GL_CONSTANT];

  Object.defineProperty(WebGLCapability.prototype, "isEnabled", {
    get: function() {
      if (!this.get(0) && this.set(0, 1)) {
        return this.set(1, this.fetch());
      }
      return Boolean(this.get(1));
    },
    set: function(value) {
      return this.set(1, value);
    }
  });

  return WebGLCapability;

}).call(this);

export var WebGLCampledFloat = (function() {
  class WebGLCampledFloat extends WebGLParameter {};

  WebGLCampledFloat.prototype.TypedArray = Float32Array;

  WebGLCampledFloat.bufferSize = 2 * Float32Array.BYTES_PER_ELEMENT;

  return WebGLCampledFloat;

}).call(this);

export var WebGLColor = (function() {
  class WebGLColor extends WebGLParameter {
    setValue() {
      return this.rgb = arguments[0];
    }

    getValue() {
      return this.rgb;
    }

    static toDecimal(rgba, alpha = true) {
      return Array.from(rgba).slice(0, alpha && 4 || 3).map(function(n) {
        return Math.round(n * 0xff);
      });
    }

    static toHexadec(rgba, prefix = "#") {
      return prefix + Array.from(rgba).map(function(n) {
        return n.toString(16).padStart(2, 0);
      }).join("");
    }

    static rgba2hexa(rgba, alpha, prefix) {
      return WebGLColor.toHexadec(WebGLColor.toDecimal(rgba, alpha), prefix);
    }

  };

  WebGLColor.prototype.TypedArray = Float32Array;

  WebGLColor.bufferSize = 16;

  Object.defineProperties(WebGLColor.prototype, {
    rgb: {
      get: function() {
        return Array.from(this.buffer);
      },
      set: function() {
        return this.buffer = arguments[0];
      }
    },
    hex: {
      get: function() {
        return WebGLColor.rgba2hexa(this.buffer);
      }
    },
    css: {
      get: function() {
        return `rgba(${WebGLColor.toDecimal(this.buffer, false).join(', ')}, ${this.get(3)})`;
      }
    },
    buffer: {
      get: function() {
        return WebGLObject.prototype.buffer.call(this, Float32Array);
      },
      set: function() {
        return this.buffer.set(Array.from(arguments[0]).flat());
      }
    }
  });

  return WebGLColor;

}).call(this);

export default WebGLObject;
