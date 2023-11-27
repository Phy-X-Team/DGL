import {
  WebGLColor,
  WebGLObject,
  WebGLParameter,
  WebGLCapability,
  WebGLCampledFloat
} from "./WebGLObject.js";

import GL_CONSTANT from "./GL_CONSTANT.js";

export var GL_DEPTH_FUNC = class GL_DEPTH_FUNC extends GL_CONSTANT {
  constructor(GL_CONST = 2932) {
    super(GL_CONST);
  }

};

export var BLEND = class BLEND extends GL_DEPTH_FUNC {
  constructor() {
    super(3042);
  }

};

export var NEVER = class NEVER extends GL_DEPTH_FUNC {
  constructor() {
    super(512);
  }

};

export var LESS = class LESS extends GL_DEPTH_FUNC {
  constructor() {
    super(513);
  }

};

export var EQUAL = class EQUAL extends GL_DEPTH_FUNC {
  constructor() {
    super(514);
  }

};

export var LEQUAL = class LEQUAL extends GL_DEPTH_FUNC {
  constructor() {
    super(515);
  }

};

export var GREATER = class GREATER extends GL_DEPTH_FUNC {
  constructor() {
    super(516);
  }

};

export var NOTEQUAL = class NOTEQUAL extends GL_DEPTH_FUNC {
  constructor() {
    super(517);
  }

};

export var GEQUAL = class GEQUAL extends GL_DEPTH_FUNC {
  constructor() {
    super(518);
  }

};

export var ALWAYS = class ALWAYS extends GL_DEPTH_FUNC {
  constructor() {
    super(519);
  }

};

export var CONTEXT = 549;

export var CLEAR = 359;

export var DEPTH_FUNC = 2932;

export var DEPTH_CLEAR_VALUE = 2931;

export var COLOR_CLEAR_VALUE = 3106;

export var DEPTH_TEST = 2929;

//export BLEND                    = 3042
export var CULL_FACE = 2284;

export var DITHER = 3024;

export var POLYGON_OFFSET_FILL = 32823;

export var SAMPLE_ALPHA_TO_COVERAGE = 32926;

export var SAMPLE_COVERAGE = 32928;

export var SCISSOR_TEST = 3089;

export var STENCIL_TEST = 2960;

export var RASTERIZER_DISCARD = 35977;

export var WebGLContext = (function() {
  class WebGLContext extends WebGLObject {
    constructor(options = {}, prototype = WebGLContext) {
      super(prototype).initialize(options);
    }

    context() {
      return WebGL2RenderingContext;
    }

  };

  WebGLContext.bufferType = CONTEXT;

  return WebGLContext;

}).call(this);

export var WebGLContextCapability = (function() {
  class WebGLContextCapability extends WebGLCapability {};

  WebGLContextCapability.gl = {BLEND, DEPTH_TEST, CULL_FACE, POLYGON_OFFSET_FILL, SAMPLE_ALPHA_TO_COVERAGE, SAMPLE_COVERAGE, SCISSOR_TEST, STENCIL_TEST, RASTERIZER_DISCARD};

  return WebGLContextCapability;

}).call(this);

export var WebGLClearColor = (function() {
  class WebGLClearColor extends WebGLColor {
    apply() {
      return this.run("clearColor", ...arguments[0]);
    }

    constructor(options = {}, prototype = WebGLClearColor) {
      super(prototype).initialize(options);
    }

  };

  WebGLClearColor.bufferType = COLOR_CLEAR_VALUE;

  return WebGLClearColor;

}).call(this);

export var WebGLDepthTest = (function() {
  class WebGLDepthTest extends WebGLContextCapability {
    constructor(options = {}, prototype = WebGLDepthTest) {
      super(prototype).initialize(options);
    }

  };

  WebGLDepthTest.bufferType = WebGLContextCapability.gl.DEPTH_TEST;

  return WebGLDepthTest;

}).call(this);

export var WebGLDepthFunc = (function() {
  class WebGLDepthFunc extends WebGLParameter {
    apply() {
      return this.run("depthFunc", this.value(arguments[0]));
    }

    value() {
      var ref, v;
      return (ref = WebGLDepthFunc.gl[v = arguments[0]]) != null ? ref : v;
    }

    setValue() {
      return this.function = arguments[0];
    }

    getValue() {
      return this.function;
    }

    constructor(options = {}, prototype = WebGLDepthFunc) {
      super(prototype).initialize(options);
    }

  };

  WebGLDepthFunc.prototype.TypedArray = Uint16Array;

  WebGLDepthFunc.gl = {
    512: new NEVER,
    513: new LESS,
    514: new EQUAL,
    515: new LEQUAL,
    518: new GEQUAL,
    519: new ALWAYS,
    516: new GREATER,
    517: new NOTEQUAL
  };

  WebGLDepthFunc.bufferSize = 2 * Uint16Array.BYTES_PER_ELEMENT;

  WebGLDepthFunc.bufferType = new GL_DEPTH_FUNC;

  Object.defineProperty(WebGLDepthFunc.prototype, "function", {
    get: function() {
      if (!this.get(0) && this.set(0, 1)) {
        return this.value(this.set(1, this.fetch()));
      }
      return this.value(this.get(1));
    },
    set: function(value) {
      return this.set(1, value);
    }
  });

  return WebGLDepthFunc;

}).call(this);

export var WebGLClearDepth = (function() {
  class WebGLClearDepth extends WebGLCampledFloat {
    apply() {
      return this.run("clearDepth", ...arguments[0]);
    }

    setValue() {
      return this.depth = arguments[0];
    }

    getValue() {
      return this.depth;
    }

    constructor(options = {}, prototype = WebGLClearDepth) {
      super(prototype).initialize(options);
    }

  };

  WebGLClearDepth.bufferType = DEPTH_CLEAR_VALUE;

  Object.defineProperty(WebGLClearDepth.prototype, "depth", {
    get: function() {
      if (!this.get(0) && this.set(0, 1)) {
        return this.set(1, this.fetch());
      }
      return this.get(1);
    },
    set: function(value) {
      return this.set(1, value);
    }
  });

  return WebGLClearDepth;

}).call(this);

export var WebGLClear = (function() {
  class WebGLClear extends WebGLObject {
    constructor(options = {}, prototype = WebGLClear) {
      super(prototype).initialize(options);
    }

  };

  WebGLClear.bufferSize = 4;

  WebGLClear.bufferType = CLEAR;

  return WebGLClear;

}).call(this);

WebGLObject.defineProperties(WebGLContext, {
  depthTest: {
    class: WebGLDepthTest
  },
  depthFunc: {
    class: WebGLDepthFunc
  },
  clearColor: {
    class: WebGLClearColor
  },
  clearDepth: {
    class: WebGLClearDepth
  },
  clear: {
    class: WebGLClear
  }
});

export default WebGLContext;
