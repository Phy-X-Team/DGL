var Container, Memory, memory, ref;

export var NAVIGATOR_GBMEMORY = (typeof self !== "undefined" && self !== null ? (ref = self.navigator) != null ? ref.deviceMemory : void 0 : void 0) || 2;

export var INITIAL_BYTELENGTH = 0;

export var MAXIMUM_BYTELENGTH = 1e9 * Math.max(NAVIGATOR_GBMEMORY, 1);

export var HEADER_INDEX_BUFFER_TYPE = 1;

export var HEADER_INDEX_BUFFER_SIZE = 2;

export var HEADER_INDEX_OFFSET_START = 3;

export var HEADER_INDEX_OFFSET_DATA = 4;

export var HEADER_INDEX_OFFSET_END = 5;

export var HEADER_INDEX_OBJECT_CONTEXT = 6;

export var HEADER_INDEX_OBJECT_PARENT = 7;

export var HEADER_INDEX_OBJECT_SELF = 8;

Container = class Container extends Array {
  at(index) {
    return this[index * 1];
  }

  it(index, value) {
    return this[index * 1] = value;
  }

  of(offset) {
    return this.indexOf(offset).object();
  }

  u32(index, value) {
    if (value == null) {
      return this.at(index) / 4;
    }
    return this.it(index * 4, value);
  }

};

export var OffsetArray = new (OffsetArray = (function() {
  class OffsetArray extends Container {
    constructor() {
      super(1);
    }

  };

  OffsetArray.prototype.type = "offset";

  return OffsetArray;

}).call(this));

export var ObjectArray = new (ObjectArray = (function() {
  class ObjectArray extends Container {
    constructor() {
      super(1);
    }

  };

  ObjectArray.prototype.type = "object";

  return ObjectArray;

}).call(this));

export var TypedBuffer = {
  F32: 4,
  U32: 4,
  Ui8: 1,
  U16: 2
};

export var HeaderBuffer = null;

Number.prototype.object = function() {
  return ObjectArray.at(this);
};

export var MemoryBuffer = class MemoryBuffer extends ArrayBuffer {};

export var WebGLHeaders = class WebGLHeaders extends Uint32Array {
  buffer(index, offset) {
    var header, starts;
    offset = offset != null ? offset : OffsetArray.at(index);
    header = index.constructor.HEADER_BYTELENGTH;
    starts = offset - header;
    return this.subarray(starts / 4, offset / 4);
  }

  offset(index, HEADER_INDEX = 12, HEADER_COUNT = 12) {
    return (OffsetArray.at(index) / 4) + (HEADER_INDEX - HEADER_COUNT);
  }

  moveOffset(index, length) {
    var offsetData, offsetEnd, offsetStart;
    offsetStart = this.getOffsetStart(index);
    offsetData = this.getOffsetData(index);
    offsetEnd = this.getOffsetEnd(index);
    OffsetArray.it(index, length + offsetData);
    this.setOffsetStart(index, length + offsetStart);
    this.setOffsetData(index, length + offsetData);
    this.setOffsetEnd(index, length + offsetEnd);
    return this;
  }

  getBufferType(index) {
    return this[this.offset(index, HEADER_INDEX_BUFFER_TYPE)];
  }

  setBufferType(index, value) {
    return this[this.offset(index, HEADER_INDEX_BUFFER_TYPE)] = value;
  }

  getBufferSize(index) {
    return this[this.offset(index, HEADER_INDEX_BUFFER_SIZE)];
  }

  setBufferSize(index, value) {
    return this[this.offset(index, HEADER_INDEX_BUFFER_SIZE)] = value;
  }

  getOffsetStart(index) {
    return this[this.offset(index, HEADER_INDEX_OFFSET_START)];
  }

  setOffsetStart(index, value) {
    return this[this.offset(index, HEADER_INDEX_OFFSET_START)] = value;
  }

  getOffsetData(index) {
    return this[this.offset(index, HEADER_INDEX_OFFSET_DATA)];
  }

  setOffsetData(index, value) {
    return this[this.offset(index, HEADER_INDEX_OFFSET_DATA)] = value;
  }

  getOffsetEnd(index) {
    return this[this.offset(index, HEADER_INDEX_OFFSET_END)];
  }

  setOffsetEnd(index, value) {
    return this[this.offset(index, HEADER_INDEX_OFFSET_END)] = value;
  }

  getIndexContext(index) {
    return this[this.offset(index, HEADER_INDEX_OBJECT_CONTEXT)];
  }

  setIndexContext(index, value) {
    return this[this.offset(index, HEADER_INDEX_OBJECT_CONTEXT)] = value;
  }

  getIndexParent(index) {
    return this[this.offset(index, HEADER_INDEX_OBJECT_PARENT)];
  }

  setIndexParent(index, value) {
    return this[this.offset(index, HEADER_INDEX_OBJECT_PARENT)] = value;
  }

  getIndexSelf(index) {
    return this[this.offset(index, HEADER_INDEX_OBJECT_SELF)];
  }

  setIndexSelf(index, value) {
    return this[this.offset(index, HEADER_INDEX_OBJECT_SELF)] = value;
  }

  objectContext(index) {
    return ObjectArray.at(this.getIndexContext(index));
  }

  objectParent(index) {
    return ObjectArray.at(this.getIndexParent(index));
  }

  objectSelf(index) {
    return ObjectArray.at(this.getIndexSelf(index));
  }

};

Object.defineProperties(WebGLHeaders.prototype, {
  bufferType: {
    get: function() {
      return this[HEADER_INDEX_BUFFER_TYPE];
    },
    set: function() {
      return this[HEADER_INDEX_BUFFER_TYPE] = arguments[0];
    }
  },
  bufferSize: {
    get: function() {
      return this[HEADER_INDEX_BUFFER_SIZE];
    },
    set: function() {
      return this[HEADER_INDEX_BUFFER_SIZE] = arguments[0];
    }
  },
  offsetStart: {
    get: function() {
      return this[HEADER_INDEX_OFFSET_START];
    },
    set: function() {
      return this[HEADER_INDEX_OFFSET_START] = arguments[0];
    }
  },
  offsetData: {
    get: function() {
      return this[HEADER_INDEX_OFFSET_DATA];
    },
    set: function() {
      return this[HEADER_INDEX_OFFSET_DATA] = arguments[0];
    }
  },
  offsetEnd: {
    get: function() {
      return this[HEADER_INDEX_OFFSET_END];
    },
    set: function() {
      return this[HEADER_INDEX_OFFSET_END] = arguments[0];
    }
  },
  indexContext: {
    get: function() {
      return this[HEADER_INDEX_OBJECT_CONTEXT];
    },
    set: function() {
      return this[HEADER_INDEX_OBJECT_CONTEXT] = arguments[0];
    }
  },
  indexParent: {
    get: function() {
      return this[HEADER_INDEX_OBJECT_PARENT];
    },
    set: function() {
      return this[HEADER_INDEX_OBJECT_PARENT] = arguments[0];
    }
  },
  indexSelf: {
    get: function() {
      return this[HEADER_INDEX_OBJECT_SELF];
    },
    set: function(index = Number(this)) {
      if (this.indexSelf && this.indexSelf === index) {
        throw /OBJECT_INDEX_HAS_TO_BE_SAME/;
      }
      return this[HEADER_INDEX_OBJECT_SELF] = arguments[0];
    }
  }
});

export var F32Buffer = class F32Buffer extends Float32Array {};

export var U32Buffer = class U32Buffer extends Uint32Array {};

export var U16Buffer = class U16Buffer extends Uint16Array {};

export var Ui8Buffer = class Ui8Buffer extends Uint8Array {};

export var WenGLBuffer = class WenGLBuffer extends MemoryBuffer {
  constructor(options) {
    super(...WenGLBuffer.initialize(options));
    TypedBuffer.F32 = new F32Buffer(this);
    TypedBuffer.U32 = new U32Buffer(this);
    TypedBuffer.Ui8 = new Ui8Buffer(this);
    TypedBuffer.U16 = new U16Buffer(this);
    (Float32Array.buffer = TypedBuffer.F32);
    (Uint32Array.buffer = TypedBuffer.U32);
    (Uint16Array.buffer = TypedBuffer.U16);
    (Uint8Array.buffer = TypedBuffer.Ui8);
    HeaderBuffer = new WebGLHeaders(this);
  }

  static initialize(options = {}) {
    var maxByteLength, ref1, ref2, ref3, ref4;
    OffsetArray = (ref1 = options.OffsetArray) != null ? ref1 : OffsetArray;
    ObjectArray = (ref2 = options.ObjectArray) != null ? ref2 : ObjectArray;
    INITIAL_BYTELENGTH = (ref3 = options.byteLength) != null ? ref3 : INITIAL_BYTELENGTH;
    MAXIMUM_BYTELENGTH = (ref4 = options.maxByteLength) != null ? ref4 : MAXIMUM_BYTELENGTH;
    maxByteLength = function(length = MAXIMUM_BYTELENGTH) {
      var b, e;
      try {
        b = new ArrayBuffer(0, {
          maxByteLength: length
        });
      } catch (error) {
        e = error;
        return maxByteLength(length / 1e1);
      }
      return MAXIMUM_BYTELENGTH = length;
    };
    return [
      INITIAL_BYTELENGTH,
      {
        maxByteLength: maxByteLength()
      }
    ];
  }

  allocate(byteLength) {
    var length, offset;
    offset = this.byteLength;
    length = byteLength + offset;
    length += 8 - length % 8;
    this.resize(length);
    return offset;
  }

};

export default memory = new (Memory = (function() {
  class Memory extends ArrayBuffer {
    constructor() {
      super(9182, {
        maxByteLength: 1e9
      }).createViews();
    }

    createViews() {
      return Object.assign(this, {
        f32: new F32Buffer(this),
        u32: new U32Buffer(this),
        u16: new U16Buffer(this),
        ui8: new Ui8Buffer(this)
      });
    }

    merge(...objects) {
      return console.log(objects);
    }

  };

  Memory.prototype.allocLength = 1024;

  return Memory;

}).call(this));
