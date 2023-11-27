var BIGINT64, BIGUINT64, FLOAT32, FLOAT64, INT16, INT32, INT8, TYPED_VALUE, UINT16, UINT32, UINT8;

import {
  WebGLObject,
  WebGLParameter,
  WebGLCapability,
  WebGLCampledFloat
} from "./WebGLObject.js";

import GL_CONSTANT from "./GL_CONSTANT.js";

export var ATTRIBUTE = new (ATTRIBUTE = class ATTRIBUTE extends GL_CONSTANT {
  constructor(GL_CONST = 692) {
    super(GL_CONST);
  }

});

export var OPTIONS = class OPTIONS extends ATTRIBUTE.constructor {
  constructor(GL_CONST = 556) {
    super(GL_CONST);
  }

};

export var FLOAT = new (FLOAT = class FLOAT extends GL_CONSTANT {
  constructor() {
    super(5126);
  }

});

export var WebGLAttribute = (function() {
  class WebGLAttribute extends WebGLObject {
    constructor(name, size, type, location, normalize, stride, offset) {
      super(WebGLAttribute).setOptions({name, size, type, location, normalize, stride, offset});
    }

    setOptions(options = {}) {
      var key;
      for (key in this.options) {
        this[key] = options[key] != null ? this.options[key] : options[key];
      }
      return this;
    }

  };

  WebGLAttribute.bufferType = ATTRIBUTE;

  WebGLAttribute.prototype.defaults = {
    size: 1,
    type: FLOAT,
    location: 0,
    normalize: false,
    stride: 0,
    offset: 0
  };

  return WebGLAttribute;

}).call(this);

export var WebGLAttributeParameter = class WebGLAttributeParameter extends WebGLParameter {};

export var NAME = new (NAME = class NAME extends OPTIONS {
  constructor() {
    super(1076);
  }

});

export var AttributeName = (function() {
  class AttributeName extends WebGLAttributeParameter {
    constructor(name = "", prototype = AttributeName) {
      super(prototype).setValue(name);
    }

    setValue() {
      return this.text = arguments[0];
    }

    getValue() {
      return this.text;
    }

  };

  AttributeName.bufferType = NAME;

  AttributeName.bufferSize = 32;

  Object.defineProperty(AttributeName.prototype, "text", {
    get: function() {
      return this.decode(this.buffer.slice(0, this.byteLength));
    },
    set: function(value) {
      var buffer;
      buffer = this.encode(value.trim());
      return this.buffer.fill(0).set(buffer.slice(0, AttributeName.bufferSize));
    }
  });

  Object.defineProperty(AttributeName.prototype, "byteLength", {
    get: function() {
      var buffer, i, j, ref;
      buffer = this.buffer;
      for (j = i = ref = buffer.byteLength; (ref <= 0 ? i <= 0 : i >= 0); j = ref <= 0 ? ++i : --i) {
        if (buffer[j]) {
          break;
        }
      }
      return j + 1;
    }
  });

  Object.defineProperty(AttributeName.prototype, "buffer", {
    get: function() {
      return WebGLObject.prototype.buffer.call(this, Uint8Array);
    }
  });

  return AttributeName;

}).call(this);

export var SIZE = new (SIZE = class SIZE extends OPTIONS {
  constructor() {
    super(1102);
  }

});

export var AttributeSize = (function() {
  class AttributeSize extends WebGLAttributeParameter {
    constructor(size = 3, prototype = AttributeSize) {
      super(prototype).setValue(size);
    }

    setValue() {
      return this.value = arguments[0];
    }

    getValue() {
      return this.value;
    }

  };

  AttributeSize.bufferType = SIZE;

  AttributeSize.bufferSize = 1;

  Object.defineProperty(AttributeSize.prototype, "value", {
    get: function() {
      return this.get(0);
    },
    set: function(value) {
      return this.set(0, value);
    }
  });

  return AttributeSize;

}).call(this);

export var TYPE = new (TYPE = class TYPE extends OPTIONS {
  constructor() {
    super(1109);
  }

});

export var AttributeType = (function() {
  class AttributeType extends WebGLAttributeParameter {
    constructor(type = FLOAT, prototype = AttributeType) {
      super(prototype).setValue(type);
    }

    setValue() {
      return this.value = arguments[0];
    }

    getValue() {
      return this.value;
    }

  };

  AttributeType.prototype.TypedArray = Uint32Array;

  AttributeType.bufferType = TYPE;

  AttributeType.bufferSize = 1 * Uint32Array.BYTES_PER_ELEMENT;

  AttributeType.gl = [FLOAT];

  Object.defineProperty(AttributeType.prototype, "value", {
    get: function() {
      return this.get(0);
    },
    set: function(value) {
      return this.set(0, value);
    }
  });

  return AttributeType;

}).call(this);

export var NORMALIZE = new (NORMALIZE = class NORMALIZE extends OPTIONS {
  constructor() {
    super(1476);
  }

});

export var AttributeNormalize = (function() {
  class AttributeNormalize extends WebGLAttributeParameter {
    constructor(normalize = false, prototype = AttributeNormalize) {
      super(prototype).setValue(normalize);
    }

    setValue() {
      return this.isNormalized = arguments[0];
    }

    getValue() {
      return this.isNormalized;
    }

  };

  AttributeNormalize.bufferType = NORMALIZE;

  AttributeNormalize.bufferSize = 1;

  Object.defineProperty(AttributeNormalize.prototype, "isNormalized", {
    get: function() {
      return Boolean(this.get(0));
    },
    set: function(value) {
      return this.set(0, value);
    }
  });

  return AttributeNormalize;

}).call(this);

export var LOCATION = new (LOCATION = class LOCATION extends OPTIONS {
  constructor() {
    super(1388);
  }

});

export var AttributeLocation = (function() {
  class AttributeLocation extends WebGLAttributeParameter {
    constructor(location, prototype = AttributeLocation) {
      super(prototype).setValue(location);
    }

    setValue() {
      return this.index = arguments[0];
    }

    getValue() {
      return this.index;
    }

  };

  AttributeLocation.bufferType = LOCATION;

  AttributeLocation.bufferSize = 2;

  Object.defineProperty(AttributeLocation.prototype, "isLocated", {
    get: function() {
      return Boolean(this.get(0));
    },
    set: function(value) {
      return this.set(0, Boolean(value != null));
    }
  });

  Object.defineProperty(AttributeLocation.prototype, "index", {
    get: function() {
      return this.get(1);
    },
    set: function(value) {
      return this.isLocated = this.set(1, value);
    }
  });

  return AttributeLocation;

}).call(this);

export var STRIDE = new (STRIDE = class STRIDE extends OPTIONS {
  constructor() {
    super(1246);
  }

});

export var AttributeStride = (function() {
  class AttributeStride extends WebGLAttributeParameter {
    constructor(stride = 0, prototype = AttributeStride) {
      super(prototype).setValue(stride);
    }

    setValue() {
      return this.byteLength = arguments[0];
    }

    getValue() {
      return this.byteLength;
    }

  };

  AttributeStride.bufferType = STRIDE;

  AttributeStride.bufferSize = 1;

  Object.defineProperty(AttributeStride.prototype, "byteLength", {
    get: function() {
      return this.get(0);
    },
    set: function(value) {
      return this.set(0, value);
    }
  });

  return AttributeStride;

}).call(this);

export var OFFSET = new (OFFSET = class OFFSET extends OPTIONS {
  constructor() {
    super(1242);
  }

});

export var AttributeOffset = (function() {
  class AttributeOffset extends WebGLAttributeParameter {
    constructor(offset = 0, prototype = AttributeOffset) {
      super(prototype).setValue(offset);
    }

    setValue() {
      return this.skipOffset = arguments[0];
    }

    getValue() {
      return this.skipOffset;
    }

  };

  AttributeOffset.bufferType = OFFSET;

  AttributeOffset.bufferSize = 1;

  Object.defineProperty(AttributeOffset.prototype, "skipOffset", {
    get: function() {
      return this.get(0);
    },
    set: function(value) {
      return this.set(0, value);
    }
  });

  return AttributeOffset;

}).call(this);

export var OBJECT = new (OBJECT = class OBJECT extends OPTIONS {
  constructor() {
    super(1226);
  }

});

export var AttributeBuffer = (function() {
  class AttributeBuffer extends WebGLAttributeParameter {
    constructor(index = 0, prototype = AttributeBuffer) {
      super(prototype).setValue(index);
    }

    setValue() {
      return this.index = arguments[0];
    }

    getValue() {
      return this.index;
    }

  };

  AttributeBuffer.prototype.TypedArray = Uint32Array;

  AttributeBuffer.bufferType = OBJECT;

  AttributeBuffer.bufferSize = 1 * Uint32Array.BYTES_PER_ELEMENT;

  Object.defineProperty(AttributeBuffer.prototype, "index", {
    get: function() {
      return this.get(0);
    },
    set: function(value) {
      return this.set(0, value);
    }
  });

  Object.defineProperty(AttributeBuffer.prototype, "object", {
    get: function() {
      return this.constructor.object(this.index);
    },
    set: function(value) {
      return this.index = value;
    }
  });

  return AttributeBuffer;

}).call(this);

export var INTERLEAVE = new (INTERLEAVE = class INTERLEAVE extends OPTIONS {
  constructor() {
    super(1225);
  }

});

TYPED_VALUE = class TYPED_VALUE extends GL_CONSTANT {};

export var u8 = new (UINT8 = (function() {
  class UINT8 extends TYPED_VALUE {
    constructor() {
      super(+8);
    }

  };

  UINT8.prototype.TypedArray = Uint8Array;

  UINT8.prototype.BYTES_PER_ELEMENT = Uint8Array.BYTES_PER_ELEMENT;

  return UINT8;

}).call(this));

export var i8 = new (INT8 = (function() {
  class INT8 extends TYPED_VALUE {
    constructor() {
      super(-8);
    }

  };

  INT8.prototype.TypedArray = Int8Array;

  INT8.prototype.BYTES_PER_ELEMENT = Int8Array.BYTES_PER_ELEMENT;

  return INT8;

}).call(this));

export var u16 = new (UINT16 = (function() {
  class UINT16 extends TYPED_VALUE {
    constructor() {
      super(+16);
    }

  };

  UINT16.prototype.TypedArray = Uint16Array;

  UINT16.prototype.BYTES_PER_ELEMENT = Uint16Array.BYTES_PER_ELEMENT;

  return UINT16;

}).call(this));

export var i16 = new (INT16 = (function() {
  class INT16 extends TYPED_VALUE {
    constructor() {
      super(-16);
    }

  };

  INT16.prototype.TypedArray = Int16Array;

  INT16.prototype.BYTES_PER_ELEMENT = Int16Array.BYTES_PER_ELEMENT;

  return INT16;

}).call(this));

export var u32 = new (UINT32 = (function() {
  class UINT32 extends TYPED_VALUE {
    constructor() {
      super(+32);
    }

  };

  UINT32.prototype.TypedArray = Uint32Array;

  UINT32.prototype.BYTES_PER_ELEMENT = Uint32Array.BYTES_PER_ELEMENT;

  return UINT32;

}).call(this));

export var i32 = new (INT32 = (function() {
  class INT32 extends TYPED_VALUE {
    constructor() {
      super(-32);
    }

  };

  INT32.prototype.TypedArray = Int32Array;

  INT32.prototype.BYTES_PER_ELEMENT = Int32Array.BYTES_PER_ELEMENT;

  return INT32;

}).call(this));

export var b64 = new (BIGINT64 = (function() {
  class BIGINT64 extends TYPED_VALUE {
    constructor() {
      super(-64);
    }

  };

  BIGINT64.prototype.TypedArray = BigInt64Array;

  BIGINT64.prototype.BYTES_PER_ELEMENT = BigInt64Array.BYTES_PER_ELEMENT;

  return BIGINT64;

}).call(this));

export var u64 = new (BIGUINT64 = (function() {
  class BIGUINT64 extends TYPED_VALUE {
    constructor() {
      super(64);
    }

  };

  BIGUINT64.prototype.TypedArray = BigUint64Array;

  BIGUINT64.prototype.BYTES_PER_ELEMENT = BigUint64Array.BYTES_PER_ELEMENT;

  return BIGUINT64;

}).call(this));

export var f32 = new (FLOAT32 = (function() {
  class FLOAT32 extends TYPED_VALUE {
    constructor() {
      super(0.32);
    }

  };

  FLOAT32.prototype.TypedArray = Float32Array;

  FLOAT32.prototype.BYTES_PER_ELEMENT = Float32Array.BYTES_PER_ELEMENT;

  return FLOAT32;

}).call(this));

export var f64 = new (FLOAT64 = (function() {
  class FLOAT64 extends TYPED_VALUE {
    constructor() {
      super(0.64);
    }

  };

  FLOAT64.prototype.TypedArray = Float64Array;

  FLOAT64.prototype.BYTES_PER_ELEMENT = Float32Array.BYTES_PER_ELEMENT;

  return FLOAT64;

}).call(this));

export var AttributeInterleave = (function() {
  class AttributeInterleave extends WebGLAttributeParameter {
    constructor(index = 0, prototype = AttributeInterleave) {
      super(prototype).setValue(index);
    }

    setValue() {
      return this.index = arguments[0];
    }

    getValue() {
      return this.index;
    }

  };

  AttributeInterleave.prototype.TypedArray = Uint32Array;

  AttributeInterleave.bufferType = INTERLEAVE;

  AttributeInterleave.bufferSize = 2 * Uint32Array.BYTES_PER_ELEMENT;

  Object.defineProperty(AttributeInterleave.prototype, "index", {
    get: function() {
      return this.get(0);
    },
    set: function(value) {
      return this.set(0, value);
    }
  });

  Object.defineProperty(AttributeInterleave.prototype, "object", {
    get: function() {
      return this.constructor.object(this.index);
    },
    set: function(value) {
      return this.index = value;
    }
  });

  Object.defineProperty(AttributeInterleave.prototype, "order", {
    get: function() {
      return this.constructor.object(this.index);
    }
  });

  Object.defineProperty(AttributeInterleave.prototype, "bytes", {
    get: function() {
      return this.constructor.object(this.index);
    }
  });

  return AttributeInterleave;

}).call(this);

export var SHADER = new (SHADER = class SHADER extends OPTIONS {
  constructor() {
    super(1227);
  }

});

export var AttributeShader = (function() {
  class AttributeShader extends WebGLAttributeParameter {
    constructor(index = 0, prototype = AttributeShader) {
      super(prototype).setValue(index);
    }

    setValue() {
      return this.index = arguments[0];
    }

    getValue() {
      return this.index;
    }

  };

  AttributeShader.prototype.TypedArray = Uint32Array;

  AttributeShader.bufferType = SHADER;

  AttributeShader.bufferSize = 1 * Uint32Array.BYTES_PER_ELEMENT;

  Object.defineProperty(AttributeShader.prototype, "index", {
    get: function() {
      return this.get(0);
    },
    set: function(value) {
      return this.set(0, value);
    }
  });

  Object.defineProperty(AttributeShader.prototype, "object", {
    get: function() {
      return this.constructor.object(this.index);
    },
    set: function(value) {
      return this.index = value;
    }
  });

  Object.defineProperty(AttributeShader.prototype, "isCompiled", {
    get: function() {
      return this.object.isCompiled;
    }
  });

  Object.defineProperty(AttributeShader.prototype, "isReady", {
    get: function() {
      return this.isCompiled && this.isAttached;
    }
  });

  Object.defineProperty(AttributeShader.prototype, "isAttached", {
    get: function() {
      return this.object.isAttached;
    }
  });

  return AttributeShader;

}).call(this);

WebGLObject.defineProperties(WebGLAttribute, {
  name: {
    class: AttributeName
  },
  size: {
    class: AttributeSize
  },
  type: {
    class: AttributeType
  },
  data: {
    class: AttributeBuffer
  },
  shader: {
    class: AttributeShader
  },
  normalize: {
    class: AttributeNormalize
  },
  location: {
    class: AttributeLocation
  },
  interleave: {
    class: AttributeInterleave
  },
  stride: {
    class: AttributeStride
  },
  offset: {
    class: AttributeOffset
  }
});

export default WebGLAttribute;
