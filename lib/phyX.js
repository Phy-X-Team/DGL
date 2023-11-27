var BufferStorage, NUMBER_RESIZE_NOT_LOGICAL, OBJECT_RESIZED_FOR_ALIGN, PhyX, bridge, buffer, error, headerLength, headerOffset, headers, log, memoryOffset, next, warn;

import TYPE from "./constants.js";

global.cache = new (BufferStorage = class BufferStorage extends window.Array {
  add() {
    return this[this.length] = arguments[0];
  }

  get(i) {
    var j, len, o, ref;
    ref = this;
    for (j = 0, len = ref.length; j < len; j++) {
      o = ref[j];
      if (i === o.id) {
        return o;
      }
    }
  }

});

log = function() {
  return console.log(...arguments);
};

warn = function() {
  return console.warn("\t", ...arguments);
};

error = function() {
  return console.error("".padStart(5, "-") + ">", ...arguments);
};

Object.defineProperties(window.Object.prototype, {
  ["#encode"]: {
    get: function() {
      return root.encode(this);
    }
  }
});

Object.defineProperties(window.Uint8Array.prototype, {
  ["{{textEncode}}"]: {
    get: function() {
      return this.slice().join(" ");
    }
  },
  ["{{textDecode}}"]: {
    get: function() {
      return root.decodeString(this.slice());
    }
  },
  ["#decode"]: {
    get: function() {
      return root.decode(this.slice());
    }
  },
  toString: {
    value: function() {
      return PhyX.prototype.String.decode(this.slice());
    }
  },
  stringify: {
    value: function() {
      return PhyX.prototype.String.decode(this.slice());
    }
  }
});

Object.defineProperty(Function.prototype, "static", {
  value: function() {
    var definitions, n, ref, results;
    ref = arguments[0];
    results = [];
    for (n in ref) {
      definitions = ref[n];
      results.push((function(name, exec) {
        return window.Object.defineProperty(this.prototype, name, {
          get: function() {
            return exec.get.call(this, ...arguments);
          },
          set: function() {
            return exec.set.call(this, ...arguments);
          }
        });
      }).call(this, n, definitions));
    }
    return results;
  }
});

OBJECT_RESIZED_FOR_ALIGN = new (OBJECT_RESIZED_FOR_ALIGN = class OBJECT_RESIZED_FOR_ALIGN extends Number {})(TYPE.OBJECT_RESIZED_FOR_ALIGN);

NUMBER_RESIZE_NOT_LOGICAL = new (NUMBER_RESIZE_NOT_LOGICAL = class NUMBER_RESIZE_NOT_LOGICAL extends Number {})(TYPE.NUMBER_RESIZE_NOT_LOGICAL);

next = 0;

headers = new window.Uint32Array(new ArrayBuffer(1e6));

buffer = new ArrayBuffer(1e8);

headerLength = 4;

headerOffset = 4;

memoryOffset = 0;

bridge = function(id, prototype) {
  var memory;
  memory = prototype.MEMORY;
  return {
    get: function(object, key, proxy) {
      var ref, value;
      if (!!PhyX.DEBUG) {
        console.log("");
        console.log("");
        console.group("🤷‍♂️", "object[key]:", [object != null ? (ref = object[key]) != null ? ref.toString().replace(/\r|\n|\s+/g, " ").substr(0, 40) : void 0 : void 0]);
        console.warn({
          GET: key,
          typeofKey: typeof key
        });
        warn({
          proto: prototype.name,
          id,
          storage: memory.constructor.name,
          object,
          proxy: proxy
        });
        console.groupEnd();
      }
      if ("symbol" !== typeof key) {
        if (!(isNaN(key) && prototype.isArray)) {
          return memory.at(headers[id + 1] + key * 1);
        }
      }
      switch (key) {
        case "id":
          return id; //! [105, 100]
        case "value":
        case "get":
          value = prototype.decode(memory.subarray(headers[id + 1], headers[id + 2]));
          if (key === "value") {
            return value;
          } else {
            return function() {
              return value;
            };
          }
          break;
        case "begin":
          return headers[id + 1];
        case "end":
          return headers[id + 2];
        case "length":
          return headers[id + 3];
        case "byteOffset":
          return headers[id + 1] * prototype.BYTES_PER_ELEMENT;
        case "byteFinish":
          return headers[id + 2] * prototype.BYTES_PER_ELEMENT;
        case "byteLength":
          return headers[id + 3] * prototype.BYTES_PER_ELEMENT;
        case "buffer":
          return memory.subarray(headers[id + 1], headers[id + 2]);
        case "setBuffer":
          return (buffer) => {
            memory.set(buffer, headers[id + 1]);
            return proxy;
          };
        case "headers":
          return headers.subarray(id, id + headerLength);
        default:
          return Reflect.get(...arguments);
      }
    },
    set: function(object, key, value, proxy) {
      if (!!PhyX.DEBUG) {
        console.group("💁🏻‍♂️");
        console.error({
          SET: key
        });
        warn({
          proto: prototype.name,
          id,
          storage: memory.constructor.name,
          object,
          proxy
        });
        console.groupEnd();
      }
      if ("value" === key) {
        return proxy.set.call(proxy, value);
      }
      return Reflect.set(object, key, value, proxy);
    },
    has: function() {
      return /has/.then(arguments, () => {
        return Reflect.has(...arguments);
      });
    },
    apply: function() {
      return /apply/.then(arguments, () => {
        return Reflect.apply(...arguments);
      });
    },
    ownKeys: function() {
      return /ownKeys/.then(arguments, () => {
        return Reflect.ownKeys(...arguments);
      });
    },
    construct: function() {
      return /construct/.then(arguments, () => {
        return Reflect.construct(...arguments);
      });
    },
    isExtensible: function() {
      return /isExtensible/.then(arguments, () => {
        return Reflect.isExtensible(...arguments);
      });
    },
    getPrototypeOf: function(value) {
      return window.Object.getPrototypeOf(value);
    },
    setPrototypeOf: function() {
      return /setPrototypeOf/.then(arguments, () => {
        return Reflect.setPrototypeOf(...arguments);
      });
    },
    defineProperty: function() {
      return [
        {
          defineProperty: this
        },
        "args ->",
        ...arguments
      ].log(Reflect.defineProperty(...arguments));
    },
    deleteProperty: function() {
      return /deleteProperty/.then(arguments, () => {
        return Reflect.deleteProperty(...arguments);
      });
    },
    preventExtensions: function() {
      return /preventExtensions/.then(arguments, () => {
        return Reflect.preventExtensions(...arguments);
      });
    },
    getOwnPropertyDescriptor: function() {
      return [
        {
          getOwnPropertyDescriptor: this
        },
        "args ->",
        ...arguments
      ].log(Reflect.getOwnPropertyDescriptor(...arguments));
    }
  };
};

export default PhyX = PhyX = (function() {
  var Array, Boolean, Float32Array, Number, Shadow, String, TypedArray, Uint32Array, Uint8Array;

  class PhyX {};

  PhyX.DEBUG = false;

  PhyX.prototype.__proto__ = null;

  PhyX.prototype.dataOffset = 0;

  PhyX.prototype.headOffset = 8;

  PhyX.prototype.indexCount = 1;

  PhyX.prototype.headerSize = 8;

  PhyX.prototype.buffer = buffer;

  PhyX.prototype.headers = headers;

  PhyX.prototype.Shadow = Shadow = (function() {
    class Shadow extends window.Number {
      constructor(value, proto = Shadow) {
        var id, proxy;
        if (!proto.BYTES_PER_ELEMENT) {
          throw /Root object constructed!/;
        }
        headers[id = headerOffset] = id;
        headerOffset = id + headerLength;
        proxy = new global.Proxy(super(id), bridge(id, proto));
        //if  value instanceof Shadow
        //    value = value.value
        //! if value instanceof proto
        value = proto.encode.call(proxy, value);
        Shadow.prototype.resize.call(proxy, (value != null ? value.length : void 0) || 0);
        proxy.buffer.set(value);
        global.cache.push(proxy);
        return proxy;
      }

      set(value) {
        buffer = this.constructor.encode(value);
        if (buffer.length !== this.length) {
          this.resize.call(this, buffer.length);
        }
        this.buffer.set(buffer);
        return this;
      }

      resize(length) {
        var aligns, itembyte, offset, pointer;
        offset = memoryOffset;
        pointer = this.headers;
        itembyte = this.constructor.BYTES_PER_ELEMENT;
        if (!(1 - itembyte)) {
          if (aligns = offset % itembyte) {
            offset = offset + itembyte - aligns;
          }
          if (aligns = length % itembyte) {
            length = length + itembyte - aligns;
            error(OBJECT_RESIZED_FOR_ALIGN, this);
          }
        }
        pointer[1] = offset;
        pointer[3] = length;
        pointer[2] = pointer[1] + pointer[3];
        memoryOffset = pointer[2];
        return this;
      }

      toString() {
        return `${this.value}`;
      }

      toArray() {
        return window.Array.from(this.buffer);
      }

      stringify() {
        return this.toString();
      }

      bufferize() {
        return new window.Uint8Array(this.buffer.slice().buffer);
      }

      is(object) {
        return this.id === object.id;
      }

      eq(object) {
        return this.value === object.value;
      }

    };

    Shadow.prototype.u = true;

    Shadow.prototype.resizable = true;

    Shadow.MEMORY = new window.Uint8Array(buffer);

    Shadow.OBJECT_BYTELENGTH = 0;

    Shadow.BYTES_PER_ELEMENT = 0;

    Shadow.instanceof = Shadow;

    return Shadow;

  }).call(this);

  PhyX.prototype.Boolean = Boolean = (function() {
    class Boolean extends Shadow {
      constructor(value, proto = Boolean) {
        super(value, proto);
      }

      static encode(value, array = []) {
        array[0] = (value === true ? 1 : value === (0/0) ? 4 : value === void 0 ? 3 : value === null ? 2 : value === false ? 0 : value.u ? value.buffer[0] : typeof value === "object" ? window.Object.keys(value).length > 0 : 1 * window.Boolean(value));
        return array;
      }

      static decode(array) {
        return [false, true, null, void 0, 0/0][array[0]];
      }

      [Symbol.toPrimitive](hint) {
        console.log("[Symbol.toPrimitive]", this, {
          hint: hint
        });
        try {
          if (hint === "number") {
            return this.value * 1;
          }
          if (hint === "string") {
            return `${this.value}`;
          }
          if (hint === "default") {
            return this.value;
          }
        } catch (error1) {}
        return this.value;
      }

    };

    Boolean.prototype.resizable = false;

    Boolean.OBJECT_BYTELENGTH = 1;

    Boolean.BYTES_PER_ELEMENT = 1;

    Boolean.instanceof = window.Boolean;

    return Boolean;

  }).call(this);

  PhyX.prototype.TypedArray = TypedArray = (function() {
    class TypedArray extends Shadow {
      valueOf() {
        return this.buffer;
      }

      static encode(value = 0) {
        if (typeof value === "number") {
          return new window.Array(value).fill(0);
        }
        if (typeof value === "object") {
          return window.Object.values(value);
        }
        return new window.Array();
      }

      static decode(value) {
        return value;
      }

      fill(value) {
        return this.buffer.fill(value);
      }

      sum(start = 0) {
        var j, len, num, ref;
        ref = this.buffer;
        for (j = 0, len = ref.length; j < len; j++) {
          num = ref[j];
          start += num;
        }
        return start;
      }

      [Symbol.toPrimitive](hint) {
        console.log("[Symbol.toPrimitive]", this, {
          hint: hint,
          arguments: arguments
        });
        if (hint === "number") {
          return this.id;
        }
        if (hint === "string") {
          return this.toString();
        }
        if (hint === "default") {
          return this.buffer;
        }
      }

    };

    TypedArray.prototype.resizable = true;

    TypedArray.isArray = true;

    return TypedArray;

  }).call(this);

  PhyX.prototype.Uint8Array = Uint8Array = (function() {
    class Uint8Array extends TypedArray {
      constructor(value, proto = Uint8Array) {
        super(value, proto);
      }

    };

    Uint8Array.MEMORY = new window.Uint8Array(buffer);

    Uint8Array.BYTES_PER_ELEMENT = 1;

    Uint8Array.OBJECT_BYTELENGTH = 1;

    Uint8Array.instanceof = window.Uint8Array;

    return Uint8Array;

  }).call(this);

  PhyX.prototype.Uint32Array = Uint32Array = (function() {
    class Uint32Array extends TypedArray {
      constructor(value, proto = Uint32Array) {
        super(value, proto);
      }

    };

    Uint32Array.MEMORY = new window.Uint32Array(buffer);

    Uint32Array.BYTES_PER_ELEMENT = 4;

    Uint32Array.OBJECT_BYTELENGTH = 4;

    Uint32Array.instanceof = window.Uint32Array;

    return Uint32Array;

  }).call(this);

  PhyX.prototype.Float32Array = Float32Array = (function() {
    class Float32Array extends TypedArray {
      constructor(value, proto = Float32Array) {
        super(value, proto);
      }

    };

    Float32Array.MEMORY = new window.Float32Array(buffer);

    Float32Array.BYTES_PER_ELEMENT = 4;

    Float32Array.OBJECT_BYTELENGTH = 4;

    Float32Array.instanceof = window.Float32Array;

    return Float32Array;

  }).call(this);

  PhyX.prototype.Array = Array = (function() {
    class Array extends Uint32Array {
      constructor(value = [], proto = Array) {
        super(value, proto);
      }

      push(value) {
        return console.log(this, value);
      }

      static encode(value, array = []) {
        var BufferObject, index, item, j, len;
        if (!(value instanceof Array)) {
          if (!(value instanceof window.Array)) {
            value = [value];
          }
        }
        for (index = j = 0, len = value.length; j < len; index = ++j) {
          item = value[index];
          if (!(item instanceof Shadow)) {
            if (!(BufferObject = PhyX.prototype[item.constructor.name])) {
              throw "Type error";
            }
            item = new BufferObject(item);
          }
          array[index] = item.id;
        }
        return array;
      }

    };

    Array.instanceof = window.Array;

    return Array;

  }).call(this);

  PhyX.prototype.Number = Number = (function() {
    class Number extends Uint8Array {
      [Symbol.toStringTag]() {
        console.log("[Symbol.toStringTag]", this, {
          arguments: arguments
        });
        return `${this.value}`;
      }

      [Symbol.toPrimitive](hint) {
        console.log("[Symbol.toPrimitive]", this, {
          hint: hint
        });
        try {
          if (hint === "number") {
            return this.value;
          }
          if (hint === "string") {
            return `${this.value}`;
          }
          if (hint === "default") {
            return this.value;
          }
        } catch (error1) {}
        return this.value;
      }

      constructor(value = 0, proto = Number) {
        super(value, proto);
      }

      valueOf() {
        return Number.decode(this.buffer);
      }

      resize() {
        return this;
      }

      static encode(value, array = []) {
        if (window.Number.isNaN(value)) {
          array[0] = 1; //! NaN
        } else if (window.Number.isFinite(value)) {
          if (!value) {
            array[0] = 0; //! zero
          } else if (window.Number.isInteger(value)) {
            array[0] = 4; //! uint
            array.push(0, 0, 0, ...window.Array.from(new window.Uint8Array(new window.Uint32Array([value]).buffer)));
          } else {
            array[0] = 5; //! float
            array.push(0, 0, 0, ...window.Array.from(new window.Uint8Array(new window.Float32Array([value]).buffer)));
          }
        } else if (value < 0) {
          array[0] = 2; //! -Infinity
        } else {
          array[0] = 3; //! +Infinity
        }
        return array;
      }

      static decode(array) {
        if (array[0] < 4) {
          return [0, 0/0, -2e308, +2e308][array[0]];
        }
        buffer = new window.Uint8Array(array.slice(4)).buffer;
        if (array[0] === 4) {
          return new window.Uint32Array(buffer)[0];
        }
        if (array[0] === 5) {
          return new window.Float32Array(buffer)[0];
        }
      }

    };

    Number.prototype.resizable = false;

    Number.BYTES_PER_ELEMENT = 1;

    Number.OBJECT_BYTELENGTH = 8;

    //TODO Could GL.buffer catch in this trap
    Number.instanceof = window.Number;

    return Number;

  }).call(this);

  PhyX.prototype.String = String = (function() {
    class String extends Uint8Array {
      constructor(value = "", proto = String) {
        super(value, proto);
      }

      static encode(string) {
        var array, char, code, j, len, length, ref;
        array = [];
        length = 0;
        ref = `${string}`.split("");
        for (j = 0, len = ref.length; j < len; j++) {
          char = ref[j];
          code = char.charCodeAt(0);
          next = code % 0xff;
          if (!(next - code)) {
            array[length] = code;
            length = length + 1;
          } else {
            array[length + 1] = next;
            length = length + 2;
          }
        }
        return array;
      }

      static decode(buffer) {
        var code, i, length, string, toChar;
        length = buffer.length;
        i = 0;
        string = "";
        toChar = window.String.fromCharCode;
        while (i < length) {
          if (!(code = buffer[i++])) {
            code = 0xff + buffer[i++];
          }
          string = string + toChar(code);
        }
        return string;
      }

      [Symbol.toPrimitive](hint) {
        console.log("[Symbol.toPrimitive]", this, {
          hint: hint
        });
        try {
          if (hint === "number") {
            return this.id;
          }
          if (hint === "string") {
            return `${this.value}`;
          }
          if (hint === "default") {
            return this.value;
          }
        } catch (error1) {}
        return this.value;
      }

    };

    String.instanceof = window.String;

    return String;

  }).call(this);

  return PhyX;

}).call(this);

//TODO Could GL.buffer catch in this trap
