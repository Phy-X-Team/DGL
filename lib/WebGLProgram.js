var WebGLProgram;

import WebGLObject from "./WebGLObject.js";

import * as Shader from "./WebGLShader.js";

import GL_CONSTANT from "./GL_CONSTANT.js";

import {
  GL
} from "./GL_CONSTANT.js";

export var PROGRAM = class PROGRAM extends GL_CONSTANT {
  constructor(CONST = 536) {
    super(CONST);
  }

};

export default WebGLProgram = (function() {
  class WebGLProgram extends WebGLObject {
    constructor(options = {}, prototype = WebGLProgram) {
      super(prototype).initialize(options);
    }

  };

  WebGLProgram.bufferType = new PROGRAM; //TODO GL.PROGRAM

  WebGLProgram.bufferSize = 32;

  return WebGLProgram;

}).call(this);

export {
  WebGLProgram
};
