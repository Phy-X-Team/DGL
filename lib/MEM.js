var BYTE_OFFSET, BufferObject, Handler, Headers, INDEX_OFFSET, POINTER_LINK_JUMP, Pointer, ROOT, headers, pointerOffset;

export var HEADERS_LENGTH = 8;

export var HEADERS_BYTELENGTH = 16;

export var OFFSET_INDEX = 1;

export var FINISH_INDEX = 2;

export var LENGTH_INDEX = 3;

export var OBJECT_TYPE_INDEX = 4;

export var TYPED_ARRAY_INDEX = 5;

export var HEAD_LENGTH_INDEX = 6;

export var BODY_LENGTH_INDEX = 7;

export var POINTER = 6647;

ROOT = (0/0).constructor;

POINTER_LINK_JUMP = true; //* /ACTIVE/

import * as window from "./Native.js";

window.Uint8Array.objectType = 8001;

window.Uint32Array.objectType = 32001;

window.Float32Array.objectType = 32003;

headers = new (Headers = class Headers extends window.Uint32Array {})(1e5);

console.error({
  headers: headers
});

BYTE_OFFSET = 0;

INDEX_OFFSET = 0;

Handler = Pointer = (function() {
  class Pointer extends window.Number {
    get() {
      var e, i, key, object, proxy, ref, result;
      [object, key, proxy] = arguments;
      console.warn(key, this, object, proxy);
      if (key === "index") {
        i = headers[object * 1];
        while (i - headers[i]) {
          i = headers[i];
        }
        return i;
      }
      if (key === "pointer") {
        return this;
      }
      if (key === "proxy") {
        return proxy;
      }
      if (key === "object") {
        return object;
      }
      //! Object.hasOwn(@, key) and
      if (e = object[key]) {
        if (typeof e !== "function") {
          result = e;
        } else {
          try {
            result = function() {
              return e.call(proxy, ...arguments);
            };
          } catch (error) {
            e = error;
            result = e;
          }
        }
      } else if (e = object.GET[key]) {
        try {
          result = e.call(proxy, ...arguments);
        } catch (error) {
          e = error;
          result = e;
        }
      } else if (e = this.GET[key]) {
        try {
          result = e.call(proxy, ...arguments);
        } catch (error) {
          e = error;
          result = e;
        }
      } else if (e = this[key]) {
        if (typeof e !== "function") {
          result = e;
        } else {
          try {
            result = function() {
              return e.call(proxy, ...arguments);
            };
          } catch (error) {
            e = error;
            result = e;
          }
        }
      } else {
        result = object[key];
      }
      console.error({
        e: e
      }, (ref = object[key]) != null ? ref.name : void 0, {
        object: object,
        result: result
      });
      return result;
    }

    byteLength() {
      return this.GET.byteLength();
    }

    byteOffset() {
      return this.GET.byteOffset();
    }

    byteFinish() {
      return this.GET.byteFinish();
    }

    set() {
      return console.log("setting from pointer", this, {
        arguments: arguments
      });
    }

    put(value) {
      return console.log("putting from pointer", this, {
        arguments: arguments
      });
    }

    toPrimitive() {
      return console.log("to primitive from pointer", ...arguments);
    }

    toString() {
      console.error("To strinnngngngngn", ...arguments, this);
      return super.toString();
    }

    alloc(byteLength) {
      var byteFinish, byteOffset, index;
      byteLength = byteLength;
      byteOffset = BYTE_OFFSET;
      byteFinish = BYTE_OFFSET += byteLength;
      index = INDEX_OFFSET += HEADERS_LENGTH;
      headers[index] = index;
      headers[index + OFFSET_INDEX] = byteOffset;
      headers[index + FINISH_INDEX] = byteFinish;
      headers[index + LENGTH_INDEX] = byteLength;
      return new Pointer(index);
    }

    resize(byteLength) {
      var i, pointer;
      if (byteLength) {
        pointer = this.alloc(byteLength);
        console.log("pointer:", pointer, headers[pointer]);
      }
      if (this.byteLength !== byteLength) {
        if (this.byteLength || byteLength) {
          this.memory.copyWithin(pointer.byteOffset, this.byteOffset, this.byteFinish);
        }
        headers.copyWithin(this.index, i = pointer.index, i + HEADERS_LENGTH);
      }
      return this.proxy;
    }

    valueOf() {
      return headers[this.index];
    }

  };

  Pointer.prototype.GET = {
    byteLength: function() {
      console.warn(this.index, this.index + LENGTH_INDEX);
      return headers[this.index + LENGTH_INDEX];
    },
    byteFinish: function() {
      return headers[this.index + FINISH_INDEX];
    },
    byteOffset: function() {
      return headers[this.index + OFFSET_INDEX];
    },
    index: function() {
      var i;
      i = headers[this.pointer];
      while (i - headers[i]) {
        i = headers[i];
      }
      return i;
    }
  };

  return Pointer;

}).call(this);

pointerOffset = 0;

BufferObject = (function() {
  class BufferObject extends window.Number {
    constructor(value, index) {
      var revoc;
      if (!index) {
        index = INDEX_OFFSET += HEADERS_LENGTH;
        revoc = Proxy.revocable(super(index), new Handler(index));
      } else {
        Proxy.revocable(super(index), new Handler(index));
      }
      this.put.call(revoc.proxy, value);
      return revoc.proxy;
    }

    valueO2f() {
      return headers[this * 1];
    }

  };

  //revoc.revoke
  BufferObject.prototype.GET = {
    length: function() {
      return this.byteLength / this.BYTES_PER_ELEMENT;
    }
  };

  return BufferObject;

}).call(this);

window.Object.defineProperties(window.Number.prototype, {
  toChar: {
    value: function() {
      return window.String.fromCharCode(this);
    }
  },
  toStrin2g: {
    value: function() {
      console.error("To strinnngngngngn", ...arguments, this);
      return headers[this * 1] + "";
    }
  },
  valueO2f: {
    value: function() {
      console.error("valueofff", this * 1);
      return headers[this * 1];
    }
  }
});

window.Object.defineProperties(BufferObject.prototype, {
  isObject: {
    enumerable: false,
    writable: true,
    value: true
  },
  isPointer: {
    enumerable: false,
    writable: true,
    value: false
  },
  isPrimitive: {
    enumerable: false,
    writable: true,
    value: false
  }
});

window.Object.defineProperties(Pointer.prototype, {
  isObject: {
    enumerable: false,
    writable: true,
    value: false
  },
  isPointer: {
    enumerable: false,
    writable: true,
    value: true
  },
  isPrimitive: {
    enumerable: false,
    writable: true,
    value: false
  }
});

window.Object.defineProperties(window.Object.prototype, {
  isObject: {
    enumerable: false,
    writable: false,
    value: false
  },
  isPointer: {
    enumerable: false,
    writable: false,
    value: false
  },
  isPrimitive: {
    enumerable: false,
    writable: false,
    value: true
  }
});

export var Memory = (function() {
  var Float32Array, Map, String, TypedArray, Uint16Array, Uint32Array, Uint8Array;

  class Memory extends ArrayBuffer {
    constructor() {
      var f32, u16, u32;
      if (!!window.Object.hasOwn(ROOT.prototype, "alloc")) {
        throw /MULTIPLE_MEMORIES_NOT_IMPLEMENTED_YET/;
      }
      super(1e6, {
        maxByteLength: 1e8
      });
      u32 = new window.Uint32Array(this);
      u16 = new window.Uint16Array(this);
      f32 = new window.Float32Array(this);
      this.constructor.prototype.Uint8Array.prototype.memory = new window.Uint8Array(this);
    }

  };

  Memory.prototype.BufferObject = BufferObject;

  Memory.prototype.TypedArray = (TypedArray = class TypedArray extends Memory.prototype.BufferObject {});

  Memory.prototype.Uint8Array = Uint8Array = (function() {
    class Uint8Array extends Memory.prototype.TypedArray {};

    Uint8Array.prototype.BYTES_PER_ELEMENT = 1;

    return Uint8Array;

  }).call(this);

  Memory.prototype.Uint16Array = Uint16Array = (function() {
    class Uint16Array extends Memory.prototype.TypedArray {};

    Uint16Array.prototype.BYTES_PER_ELEMENT = 2;

    return Uint16Array;

  }).call(this);

  Memory.prototype.Uint32Array = Uint32Array = (function() {
    class Uint32Array extends Memory.prototype.TypedArray {};

    Uint32Array.prototype.BYTES_PER_ELEMENT = 4;

    return Uint32Array;

  }).call(this);

  Memory.prototype.Float32Array = Float32Array = (function() {
    class Float32Array extends Memory.prototype.TypedArray {};

    Float32Array.prototype.BYTES_PER_ELEMENT = 4;

    return Float32Array;

  }).call(this);

  Memory.prototype.String = String = (function() {
    class String extends Memory.prototype.Uint8Array {
      value(value) {
        return console.log("set from string", ...arguments);
      }

      encode(string) {
        var array, char, code, j, len, length, next, ref;
        array = [];
        length = 0;
        ref = string.split("");
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
        return [array, length];
      }

      decode(buffer) {
        var code, i, length, string;
        length = buffer.length;
        i = 0;
        string = "";
        while (i < length) {
          if (!(code = buffer[i++])) {
            code = 0xff + buffer[i++];
          }
          string = string + code.toChar();
        }
        return string;
      }

      put(value) {
        if (value.isObject) {
          return this.setObject(value);
        }
        if (value.isPointer) {
          return this.setPointer(value);
        }
        if (value.isPrimitive) {
          return this.setPrimitive(value);
        }
        throw /UNDEFINED_KIND_OF_OBJECT/ + value;
      }

      setPrimitive(string) {
        var array, length;
        [array, length] = this.encode(string);
        console.warn(this.resize(length));
        return this.buffer;
      }

      setPointer(pointer) {
        return console.log("put pointer", pointer);
      }

      setObject(object) {
        return console.log("put object", object);
      }

      toPrimitive() {
        return this.decode(this.buffer());
      }

    };

    String.fromCharCode = window.String.fromCharCode;

    return String;

  }).call(this);

  Memory.prototype.Object = Map = class Map extends BufferObject {
    set(value) {
      return console.log("set from object", ...arguments);
    }

    get(value) {
      return console.log("get from object", ...arguments);
    }

    put(value) {
      return console.log("put from object", ...arguments);
    }

    toPrimitive() {
      return console.log("to primitive from object buffer", ...arguments);
    }

  };

  return Memory;

}).call(this);

/*
class Pointer extends ROOT

ROOT[ @class = POINTER ] = this

@typedArray = Uint8Array
@byteLength = 0
@headLength = 0

getHeaders      : ->
    pointers.subarray @index(), @index() + HEADERS_LENGTH

toPrimitive     : ->
    @getObject().get()

window.Object.defineProperties Pointer::, {
    dump     :
value    : ( object ) ->
    index       : @index()
    buffer      : @getBuffer()

    object          : object
    objectBuffer    : object.getBuffer()
    objectHeaders   : object.getHeaders()
    objectPointer   : object.getPointer()

    headers     : @getHeaders()
    byteOffset  : @byteOffset()
    byteLength  : @byteLength()
    byteFinish  : @byteFinish()
    objectType  : @objectType()

    Uint8Array : try ui8.subarray @byteOffset(), @byteFinish()
    Uint32Array : try u32.subarray @typeOffset(4), @typeFinish(4)
    Float32Array : try f32.subarray @typeOffset(4), @typeFinish(4)

}

window.Object.defineProperties Memory::,

alloc           :
    value       : ( constructor = Pointer, byteLength = 0 ) ->
++memory.pointerCount

memory.pointerOffset += HEADERS_LENGTH
memory.pointerOffset += constructor.headLength or 0
memory.pointerOffset += 4 - memory.pointerOffset % 4

index = memory.pointerOffset

unless byteLength

    byteOffset =
    byteFinish = memory.byteOffset

else if byteLength % constructor.typedArray.BYTES_PER_ELEMENT
    throw /BYTELENGTH_MUST_BE_MULTIPLE_OF_/ + constructor.name

else
    byteOffset = memory.byteOffset += 8 - memory.byteOffset % 8
    byteFinish = memory.byteOffset += byteLength

pointers[ index ] = 0

pointers[ index + OFFSET_INDEX ] = byteOffset
pointers[ index + FINISH_INDEX ] = byteFinish
pointers[ index + LENGTH_INDEX ] = byteLength

pointers[ index + OBJECT_TYPE_INDEX ] = constructor . class
pointers[ index + TYPED_ARRAY_INDEX ] = constructor . typedArray . objectType

pointers[ index + HEAD_LENGTH_INDEX ] = constructor . headLength
pointers[ index + BODY_LENGTH_INDEX ] = byteLength

new Pointer index 

window.Object.defineProperties ROOT::, {

testOffset      : 
    value       : ( num ) ->
unless ROOT.isInteger num
    throw /NUMBER_IS_FLOATED_/ + num
return num

toByteLength    : 
    value       : ( constructor = Uint8Array, align ) ->
return 0 unless length = this * 1
return length if 1 is bytes = constructor.typedArray.BYTES_PER_ELEMENT
unless no is align then length += bytes - length % bytes
return length * bytes

toObject        :
    value       : ->
return unless index = this * 1
object = index.getPointer().getObject()
return object unless object.proxy
object.proxy()

toPrimitive     :
    value       : ->
( this * 1 ).getPointer().getObject().get()

alloc           :
    value       : ( constructor = Pointer ) ->
Memory::alloc constructor , this * 1

copy            :
    value       : ( target ) ->
@getPointer().copy( target )

iterate         :
    value       : ( exec = -> ) ->
exec i for i in [ 0 ... this ]

resize          :
    value       : ( byteLength ) ->
constructor = @getConstructor()
pointer = byteLength.alloc constructor

ui8.copyWithin( pointer.byteOffset()
    @byteOffset(), @byteFinish()
)

@setPointer pointer

align           :
    value       : ( number ) ->
unless this % number
    return this
this + number - this % number

index           :
    value       : ( i = this * 1 ) ->
return i unless POINTER_LINK_JUMP 
i = pointers[i] while pointers.at i ; i

setPrototype    :
    value       : ( prototype ) ->
window.Object.setPrototypeOf this , prototype

getPrototype    :
    value       : ->
@getConstructor() . prototype

getConstructor  :
    value       : ->
ROOT[ @objectType() ] ? Pointer

getObject       :
    value       : ->
@setPrototype @getPrototype()

getPointer      :
    value       : ->
new Pointer( this * 1 )

setPointer      :
    value       : ( object ) ->
index = @index()
pointer = object.getPointer()

if   POINTER_LINK_JUMP
     pointers[ index ] = pointer
else 
     pointers.set pointer.getHeaders(), index

return this
#@getPointer().getHeaders().set pointer.getHeaders() ; this

getHeaders      :
    value       : ->
offset = @index()

headLength = @headLength() + HEADERS_LENGTH
headers = pointers.subarray offset , offset + headLength

headLength = @headLength() or HEADERS_LENGTH
headers.subarray -headLength 

setHeaders      :
    value       : ( arrayLike ) -> 
@getHeaders().set arrayLike ; this
 * [ index, offset, length, end ]

setHeader       :
    value       : ( index, value ) -> 
@getHeaders()[ index ] = value

getHeader       :
    value       : ( index ) -> 

@getHeaders()[ index ]

getBuffer       :
    value       : -> @subUint8()

setBuffer       :
    value       : -> @getBuffer().set ...arguments ; this

byteOffset      :
    value       : -> pointers[ @index() + OFFSET_INDEX ]

byteFinish      :
    value       : -> pointers[ @index() + FINISH_INDEX ]

byteLength      :
    value       : -> pointers[ @index() + LENGTH_INDEX ]

objectType      :
    value       : -> pointers[ @index() + OBJECT_TYPE_INDEX ]

typedArray      :
    value       : -> pointers[ @index() + TYPED_ARRAY_INDEX ]

headLength      :
    value       : -> pointers[ @index() + HEAD_LENGTH_INDEX ]

bodyLength      :
    value       : -> pointers[ @index() + BODY_LENGTH_INDEX ]

typeOffset      :
    value       : ( byte ) -> @testOffset @byteOffset() / byte

typeFinish      :
    value       : ( byte ) -> @testOffset @byteFinish() / byte

typeLength      :
    value       : ( byte ) -> @testOffset @byteLength() / byte

subUint8        :
    value       : ( begin, end ) -> ui8.subarray begin ? @byteOffset(), end ? @byteFinish()

getUint8        :
    value       : ( index ) -> ui8[ index + @byteOffset() ]

setUint8        :
    value       : ( index, value ) -> ui8[ index + @byteOffset() ] = value ; value

getUint16       :
    value       : ( index ) -> u16[ index + @typeOffset(2) ]

setUint16       :
    value       : ( index, value ) -> u16[ index + @typeOffset(2) ] = value

subUint32       :
    value       : ( begin, end ) -> u32.subarray begin ? @typeOffset(4), end ? @typeFinish(4)

getUint32       :
    value       : ( index ) -> u32[ index + @typeOffset(4) ]

setUint32       :
    value       : ( index, value ) -> u32[ index + @typeOffset(4) ] = value

subFloat32      :
    value       : ( begin, end ) -> f32.subarray begin ? @typeOffset(4), end ? @typeFinish(4)

getFloat32      :
    value       : ( index ) -> f32[ index + @typeOffset(4) ]

setFloat32      :
    value       : ( index, value ) -> f32[ index + @typeOffset(4) ] = value

}
 */
export default Memory;
