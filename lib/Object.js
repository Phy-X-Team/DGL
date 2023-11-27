var KEY_INDEX_MATCH, KEY_POINTER_MATCH, KEY_PRIMITIVE_MATCH, KEY_PRIMITIVE_WEAK_MATCH, MATCH_BY_CONTENT, MATCH_BY_INDEX, MATCH_BY_OBJECT, MATCH_BY_VALUE, MATCH_BY_WEAK, TYPE_OF_KEY, TYPE_OF_VALUE, UNMATCHED, decoder, encoder;

import * as window from "./Native.js";

export var HEADERS_LENGTH = 2;

export var HEADERS_BYTELENGTH = 8;

export var TYPE_BUFFER_POINTER = 7681;

export var BUFFER = 20;

export var BOOLEAN = 21;

export var NUMBER = 22;

export var FLOAT32 = 23;

export var UINT32 = 24;

export var STRING = 30;

export var ARRAY = 40;

export var INT8ARRAY = 41;

export var UINT8ARRAY = 42;

export var INT16ARRAY = 43;

export var UINT16ARRAY = 44;

export var INT32ARRAY = 45;

export var UINT32ARRAY = 46;

export var FLOAT32ARRAY = 47;

export var FLOAT64ARRAY = 48;

export var OBJECT = 60;

encoder = new window.TextEncoder();

decoder = new window.TextDecoder();

export var Buffer = (function() {
  class Buffer extends window.Number {
    constructor(constructor, byteLength = 0) {
      super(mem.alloc(constructor, byteLength));
    }

    toString() {
      console.error("toStringgg", this);
      return super.toString();
    }

    value() {
      return this.get();
    }

    toByteLength(length) {
      return (length * 1).toByteLength(this.constructor);
    }

    alloc(byteLength = 0) {
      return parseFloat(byteLength).alloc(this.constructor, this.headLength());
    }

  };

  window.Number[Buffer.class = BUFFER] = Buffer;

  Buffer.typedArray = window.Uint8Array;

  Buffer.byteLength = 0;

  Buffer.headLength = 2;

  window.Object.defineProperties(Buffer.prototype, {
    "[[Instance]]": {
      get: function() {
        return {
          [Symbol("Native")]: this.get(),
          [Symbol("Pointer")]: this.getPointer().dump(this),
          Buffer: this.getBuffer(),
          Headers: this.getHeaders()
        };
      }
    }
  });

  return Buffer;

}).call(this);

export var Boolean = (function() {
  class Boolean extends Buffer {
    constructor(value, constructor = Boolean) {
      super(constructor).set(value);
    }

    getBuffer() {
      return this.subUint32(this.typeOffset(4), this.typeOffset(4) + 1);
    }

    set(value) {
      if (value === void 0) {
        return this.setUint32(0, 3);
      }
      if (value === null) {
        return this.setUint32(0, 2);
      }
      if (value === true) {
        return this.setUint32(0, 1);
      }
      if (value === false) {
        return this.setUint32(0, 0);
      }
      return this.set(!!value);
    }

    get() {
      var value;
      value = this.getUint32(0);
      if (0 === value) {
        return false;
      }
      if (1 === value) {
        return true;
      }
      if (2 === value) {
        return null;
      }
      if (3 === value) {
        return void 0;
      }
      return value;
    }

  };

  window.Number[Boolean.class = BOOLEAN] = Boolean;

  Boolean.byteLength = 4;

  Boolean.typedArray = window.Uint32Array;

  window.Boolean.prototype.toPointer = function() {
    return new Boolean(this);
  };

  return Boolean;

}).call(this);

export var Number = (function() {
  var BIGINT_INDEX, TYPED_INDEX;

  class Number extends Buffer {
    constructor(value, constructor) {
      if (!constructor) {
        return value.toPointer();
      }
      super(constructor, constructor.byteLength);
    }

    //TODO.setNumberType constructor.class
    //!!.setNumberType constructor.class
    getNumberType() {
      return this.getHeader(TYPED_INDEX);
    }

    setNumberType() {
      return this.setHeader(TYPED_INDEX, arguments[0]);
    }

  };

  window.Number[Number.class = NUMBER] = Number;

  window.Number.prototype.toPointer = function() {
    if (!window.Number.isInteger(this)) {
      return new Float32(this);
    }
    return new Uint32(this);
  };

  Number.typedArray = window.Uint32Array;

  Number.byteLength = 8;

  TYPED_INDEX = 0;

  BIGINT_INDEX = 1;

  return Number;

}).call(this);

export var Float32 = (function() {
  class Float32 extends Number {
    constructor(value, constructor = Float32) {
      super(value, constructor).set(value);
    }

    set() {
      this.setFloat32(0, arguments[0]);
      return this;
    }

    get() {
      return this.getFloat32(0);
    }

  };

  window.Number[Float32.class = FLOAT32] = Float32;

  Float32.typedArray = window.Float32Array;

  return Float32;

}).call(this);

export var Uint32 = (function() {
  class Uint32 extends Number {
    constructor(value, constructor = Uint32) {
      super(value, constructor).set(value);
    }

    set() {
      this.setUint32(0, arguments[0]);
      return this;
    }

    get() {
      return this.getUint32(0);
    }

  };

  window.Number[Uint32.class = UINT32] = Uint32;

  Uint32.typedArray = window.Uint32Array;

  return Uint32;

}).call(this);

export var String = (function() {
  var LENGTH_INDEX;

  class String extends Buffer {
    constructor(value, constructor = String) {
      super(constructor).set(value);
    }

    getLength() {
      return this.getHeader(LENGTH_INDEX);
    }

    setLength(length) {
      this.setHeader(LENGTH_INDEX, arguments[0]);
      return this;
    }

    static decode(buffer) {
      return decoder.decode(buffer);
    }

    static encode(string) {
      return encoder.encode(string);
    }

    detach() {
      return this.getBuffer().slice(0, this.getLength());
    }

    set(text) {
      var buffer, length;
      buffer = String.encode(text);
      length = buffer.byteLength;
      this.resize(length).setBuffer(buffer).setLength(length);
      return this;
    }

    get() {
      return this.toString();
    }

    toString() {
      return String.decode(this.detach());
    }

  };

  window.Number[String.class = STRING] = String;

  String.typedArray = window.Uint8Array;

  LENGTH_INDEX = 0;

  window.String.prototype.toPointer = function() {
    return new String(this);
  };

  return String;

}).call(this);

export var Uint32Array = (function() {
  var LENGTH_INDEX, OFFSET_INDEX;

  class Uint32Array extends Buffer {
    constructor(length = 0, constructor = Uint32Array) {
      var byteLength;
      byteLength = length.toByteLength(constructor);
      super(constructor, byteLength).setLength(length);
    }

    getBuffer() {
      return this.subUint32();
    }

    getLength() {
      return this.getHeader(LENGTH_INDEX);
    }

    setLength(length) {
      this.setHeader(LENGTH_INDEX, arguments[0]);
      return this;
    }

    getOffset() {
      return this.getHeader(OFFSET_INDEX);
    }

    setOffset(offset) {
      this.setHeader(OFFSET_INDEX, arguments[0]);
      return this;
    }

    set(array = [], offset = 0) {
      var length;
      offset = offset || this.getOffset();
      length = array.length;
      if (!(this.getLength() > offset + length)) {
        this.resize(this.toByteLength(offset + length)).setLength(length = offset + length);
      }
      this.setOffset(offset + array.length).getBuffer().set(array, offset);
      return this;
    }

    get() {
      return this.getBuffer();
    }

    push(...items) {
      return this.set(items, this.getOffset());
    }

    at(index, value, buffer) {
      buffer = buffer || this.getBuffer();
      if (!value) {
        return buffer[index];
      }
      buffer[index] = value;
      return value;
    }

    forEach(exec = function() {}) {
      var index, item, items, j, len, ref;
      ref = items = this.get();
      for (index = j = 0, len = ref.length; j < len; index = ++j) {
        item = ref[index];
        exec(item, index, items, this);
      }
      return this;
    }

    map(exec = function() {}) {
      var index, item, items, j, len, ref;
      ref = items = this.get();
      for (index = j = 0, len = ref.length; j < len; index = ++j) {
        item = ref[index];
        items[index] = exec(item, index, items, this);
      }
      return this;
    }

  };

  window.Number[Uint32Array.class = UINT32ARRAY] = Uint32Array;

  window.Uint32Array.prototype.toPointer = function() {
    return new Uint32Array(this);
  };

  Uint32Array.typedArray = window.Uint32Array;

  LENGTH_INDEX = 0;

  OFFSET_INDEX = 1;

  return Uint32Array;

}).call(this);

export var Array = (function() {
  class Array extends Uint32Array {
    constructor(options = 0, constructor = Array) {
      var item, j, len, length, type;
      type = typeof options;
      if (type === "number") {
        length = options;
      } else if (type === "object") {
        length = options.length;
      }
      super(length, constructor);
      if (length > 0) {
        for (j = 0, len = options.length; j < len; j++) {
          item = options[j];
          this.push(item);
        }
      }
      return this.proxy();
    }

    push(...items) {
      var index, item, j, len;
      for (index = j = 0, len = items.length; j < len; index = ++j) {
        item = items[index];
        if (!(item instanceof Buffer)) {
          item = item.toPointer();
        }
        items[index] = item.index();
      }
      return this.set(items, this.getOffset());
    }

    get() {
      var buffer, index, j, len, pointer, results;
      buffer = this.getBuffer();
      results = [];
      for (index = j = 0, len = buffer.length; j < len; index = ++j) {
        pointer = buffer[index];
        if (!pointer) {
          continue;
        }
        results.push(pointer.toObject().get());
      }
      return results;
    }

    forEach(exec = function() {}) {
      var buffer, index, j, len, pointer, results;
      buffer = this.getBuffer();
      results = [];
      for (index = j = 0, len = buffer.length; j < len; index = ++j) {
        pointer = buffer[index];
        if (!pointer) {
          continue;
        }
        results.push(exec(pointer.toObject(), index, buffer));
      }
      return results;
    }

    map(exec = function() {}) {
      var buffer, j, len, object, offset, pointer;
      buffer = this.getBuffer();
      for (offset = j = 0, len = buffer.length; j < len; offset = ++j) {
        pointer = buffer[offset];
        if (!pointer) {
          continue;
        }
        object = pointer.toObject();
        object.set(exec(object, offset, buffer));
        buffer[offset] = object.index();
      }
      return this;
    }

    at() {
      return super.at(...arguments).toObject();
    }

    proxy() {
      return new Proxy(this, {
        get: ($, key) => {
          var e, index;
          if ("function" === typeof (e = this[key])) {
            return (function(c) {
              return function() {
                return e.apply(c, arguments);
              };
            })(this);
          }
          if (!(this.getLength() > (index = key * 1))) {
            return;
          }
          return this.getUint32(index).toObject();
        },
        set: ($, key, value) => {
          var index;
          index = key * 1;
          if (!(this.getLength() > index)) {
            throw /BOUNDING_BOUNCE_OFFSET/ + key;
          }
          return this.at(index, value);
        }
      });
    }

    children() {
      var buffer;
      buffer = this.getBuffer();
      return this.getOffset().iterate((i) => {
        return buffer[i].getPointer().getObject();
      });
    }

  };

  window.Number[Array.class = ARRAY] = Array;

  return Array;

}).call(this);

UNMATCHED = new (UNMATCHED = class UNMATCHED extends window.Number {})(81);

MATCH_BY_INDEX = new (MATCH_BY_INDEX = class MATCH_BY_INDEX extends window.Number {})(86);

MATCH_BY_VALUE = new (MATCH_BY_VALUE = class MATCH_BY_VALUE extends window.Number {})(87);

MATCH_BY_WEAK = new (MATCH_BY_WEAK = class MATCH_BY_WEAK extends window.Number {})(88);

MATCH_BY_OBJECT = new (MATCH_BY_OBJECT = class MATCH_BY_OBJECT extends window.Number {})(89);

MATCH_BY_CONTENT = new (MATCH_BY_CONTENT = class MATCH_BY_CONTENT extends window.Number {})(88);

KEY_INDEX_MATCH = new (MATCH_BY_CONTENT = class MATCH_BY_CONTENT extends window.Number {})(88);

KEY_POINTER_MATCH = new (MATCH_BY_CONTENT = class MATCH_BY_CONTENT extends window.Number {})(88);

KEY_PRIMITIVE_MATCH = new (MATCH_BY_CONTENT = class MATCH_BY_CONTENT extends window.Number {})(88);

KEY_PRIMITIVE_WEAK_MATCH = new (MATCH_BY_CONTENT = class MATCH_BY_CONTENT extends window.Number {})(88);

TYPE_OF_KEY = new (TYPE_OF_KEY = class TYPE_OF_KEY extends window.Number {})(88);

TYPE_OF_VALUE = new (TYPE_OF_VALUE = class TYPE_OF_VALUE extends window.Number {})(89);

export var Obsect = (function() {
  var LENGTH_INDEX, OFFSET_INDEX;

  class Obsect extends Array {
    constructor(object = {}, constructor = Obsect) {
      var j, key, keys, len, length;
      keys = window.Object.keys(object);
      length = keys.length * 2; //? key & value
      super(length, constructor);
      for (j = 0, len = keys.length; j < len; j++) {
        key = keys[j];
        this.assign(key, object[key]);
      }
      return this.proxy();
    }

    proxy() {
      return new Proxy(this, {
        get: ($, key) => {
          var e, index, length;
          if ("function" === typeof (e = this[key])) {
            return (function(c) {
              return function() {
                return e.apply(c, arguments);
              };
            })(this);
          }
          index = 0;
          if (index === (length = this.getLength())) {
            return;
          }
          while (index < length) {
            if (key === this.getUint32(index).toPrimitive()) {
              return this.getUint32(index + 1).toObject();
            } else {
              index = index + 2;
            }
          }
          return void 0;
        },
        set: ($, key, value) => {
          var find;
          if (!!(find = this.find(key))) {
            return find.value.set(value);
          }
          return this.assign(key, value);
        }
      });
    }

    assign(key, value) {
      if (!(key instanceof Buffer)) {
        key = key.toPointer();
      }
      if (!(value instanceof Buffer)) {
        value = value.toPointer();
      }
      return this.push(key, value);
    }

    toPrimitive() {
      return this.get();
    }

    get(pointers = false) {
      var i, item, j, key, len, object, ref;
      object = {};
      key = null;
      ref = this.children();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (!(i % 2)) {
          key = item;
        } else {
          if (pointers) {
            object[key * 1] = item;
          } else {
            object[key.get()] = item.get();
          }
        }
      }
      return object;
    }

    findKey(key) {
      var i, item, j, len, ref;
      ref = this.getBuffer();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (item.toPrimitive() !== key) {
          continue;
        }
        return this.at(i + 1);
      }
      return void 0;
    }

    find(search, weak = false) {
      var i, index, item, j, len, list, ref, result, value;
      index = 0;
      value = search;
      if (search instanceof Buffer) {
        index = search.index();
        value = search.get();
      }
      result = {
        i: -1,
        key: null,
        match: UNMATCHED,
        value: void 0,
        pointer: void 0
      };
      ref = list = this.children();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (!value) {
          break;
        } else if (item === search) {
          result.match = MATCH_BY_OBJECT;
        } else if (item.index() === index) {
          result.match = MATCH_BY_INDEX;
        } else if (item.value() === value) {
          result.match = MATCH_BY_VALUE;
        } else if (item.value() == value && weak) {
          result.match = MATCH_BY_WEAK;
        } else {
          continue;
        }
        if ((result.i = i) % 2) {
          result.key = list[i - 1];
          result.type = TYPE_OF_VALUE;
          result.value = item;
        } else {
          result.key = item;
          result.type = TYPE_OF_KEY;
          result.value = list[i + 1];
        }
        result.pointer = result.value.getPointer();
        result.data = {
          [result.key.get()]: result.value.get()
        };
        return result;
      }
      return void 0;
    }

  };

  window.Number[Obsect.class = OBJECT] = Obsect;

  window.Object.prototype.toPointer = function() {
    return new Obsect(this);
  };

  Obsect.typedArray = window.Uint32Array;

  LENGTH_INDEX = 0;

  OFFSET_INDEX = 1;

  return Obsect;

}).call(this);

export var Object = class Object extends Obsect {};

export default Buffer;
