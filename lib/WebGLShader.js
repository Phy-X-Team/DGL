var WebGLShader;

import WebGLObject from "./WebGLObject.js";

import GL_CONSTANT from "./GL_CONSTANT.js";

export var SHADER_TYPE = class SHADER_TYPE extends GL_CONSTANT {
  constructor(GL_CONST = 35663) {
    super(GL_CONST);
  }

};

export var VERTEX_SHADER = class VERTEX_SHADER extends SHADER_TYPE {
  constructor() {
    super(35633);
  }

};

export var FRAGMENT_SHADER = class FRAGMENT_SHADER extends SHADER_TYPE {
  constructor() {
    super(35632);
  }

};

export default WebGLShader = (function() {
  class WebGLShader extends WebGLObject {
    constructor(options, prototype = WebGLShader) {
      super(prototype).setOptions(options);
    }

    setOptions(options = {}) {
      if (typeof options === "string") {
        options = {
          source: options
        };
      }
      if (!!options.source) {
        this.source = options.source;
      }
      return this;
    }

  };

  WebGLShader.bufferType = new SHADER_TYPE;

  WebGLShader.bufferSize = 8;

  Object.defineProperty(WebGLShader.prototype, "source", {
    get: function() {
      return this.decode(this.buffer(Uint8Array, this.get(0, Uint16Array), this.get(1, Uint16Array)));
    },
    set: function(value) {
      var bufferSize, byteLength, offset, skipStart, textBuffer, textLength, textOffset, trimEnd;
      bufferSize = this.bufferSize();
      textBuffer = this.encode(value);
      textLength = textBuffer.byteLength;
      byteLength = bufferSize + textLength;
      offset = this.realloc(byteLength);
      textOffset = offset + bufferSize;
      this.move(offset, byteLength);
      this.copy(textBuffer, textOffset);
      skipStart = this.constructor.OBJECT_BYTELENGTH;
      trimEnd = this.offsetEnd() - textOffset - textLength;
      this.set(0, trimEnd, Uint16Array);
      return this.set(1, skipStart, Uint16Array);
    }
  });

  return WebGLShader;

}).call(this);

export var WebGLVertexShader = (function() {
  class WebGLVertexShader extends WebGLShader {
    constructor(options, prototype = WebGLVertexShader) {
      super(options, prototype);
    }

  };

  WebGLVertexShader.bufferType = new VERTEX_SHADER;

  return WebGLVertexShader;

}).call(this);

export var WebGLFragmentShader = (function() {
  class WebGLFragmentShader extends WebGLShader {
    constructor(options, prototype = WebGLFragmentShader) {
      super(options, prototype);
    }

  };

  WebGLFragmentShader.bufferType = new FRAGMENT_SHADER;

  return WebGLFragmentShader;

}).call(this);

export {
  WebGLShader
};
