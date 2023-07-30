var id;

import EventControl from "./event.js";

import {
  gl
} from "./constant.js";

id = 0;

export var Vertices = class Vertices extends Float32Array {};

export var Geometry = (function() {
  class Geometry extends Float32Array {
    constructor(options = {}) {
      super(options.bufferLength);
      Object.defineProperties(this, {
        gl: {
          value: options.gl
        },
        id: {
          value: id++
        },
        uuid: {
          value: crypto.randomUUID()
        }
      });
      this.options = {...options, ...this.defaults};
      this.create();
    }

    setAttribute(location, size = 3, offset = this.attribsByte) {
      this.attribsLength += size;
      return gl.vertexAttribPointer(location, size, gl.FLOAT, false, this.attribsLength * 4, offset);
    }

    create() {
      return this;
    }

  };

  Geometry.prototype.type = "raw";

  Geometry.prototype.attribOffset = 0;

  Geometry.prototype.attribsLength = 0;

  Geometry.prototype.defaults = {
    color: "#bb0ca4",
    drawMode: gl.TRIANGLES
  };

  return Geometry;

}).call(this);
