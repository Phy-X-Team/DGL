var Frustum, Orthographic, Perspective;

import {
  Matrix4
} from "./math.js";

//: Learn_webgl_matrix.js, By Wayne Brown, Spring 2015
Frustum = class Frustum extends Matrix4 {
  //. Set a perspective projection matrix based on limits of a frustum.
  constructor(near, far, right, bottom, top = 0, left = 0) {
    var c1, c2, h, matrix, sx, sy, tx, ty, w;
    /*
    * @param left   Number Farthest left on the x-axis
    * @param right  Number Farthest right on the x-axis
    * @param bottom Number Farthest down on the y-axis
    * @param top    Number Farthest up on the y-axis
    * @param near   Number Distance to the near clipping plane along the -Z axis
    * @param far    Number Distance to the far clipping plane along the -Z axis
    * @return Float32Array A perspective transformation matrix
     */
    if (!left) {
      left = -(right /= 2);
    }
    if (!top) {
      top = -(bottom /= 2);
    }
    
    //. Make sure there is no division by zero
    if (left === right || bottom === top || near === far) {
      throw ["Invalid frustrum parameters:", ...arguments];
    }
    if (near <= 0 || far <= 0 || near >= far) {
      throw ["Distance near >= far and must be positive:", {near, far}];
    }
    w = right - left;
    h = top - bottom;
    sx = 2 * near / w;
    sy = 2 * near / h;
    c2 = -(far + near) / (far - near);
    c1 = 2 * near * far / (near - far);
    tx = -near * (left + right) / w;
    ty = -near * (bottom + top) / h;
    matrix = [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, c2, -1, tx, ty, c1, 0];
    super(matrix);
  }

};

Perspective = (function() {
  //: Perspective projection camera from frusrum
  class Perspective extends Frustum {
    
    //. Matrix using a field-of-view and an aspect ratio.
    constructor(fovy, aspect, near = 0.01, far = 1000) {
      var bottom, half_fovy, left, right, top;
      if (fovy <= 0 || fovy >= 180 || aspect <= 0) {
        throw ["Invalid parameters to perspective", {fovy, aspect}];
      }
      half_fovy = .5 * Matrix4.prototype.toRadians(fovy);
      bottom = -(top = near * Math.tan(half_fovy));
      left = -(right = top * aspect);
      super(near, far, right, bottom, top, left);
    }

  };

  Perspective.prototype.fovy = 60;

  Perspective.prototype.near = .01;

  Perspective.prototype.far = 1000;

  return Perspective;

}).call(this);

//: Orthographic projection camera from matrix4
Orthographic = class Orthographic extends Matrix4 {
  
  //. Create an orthographic projection matrix.
  constructor(near, far, right, bottom, top, left) {
    var depthRatio, heightRatio, sx, sy, sz, tx, ty, tz, widthRatio;
    if (left === right || bottom === top || near === far) {
      throw ["Invalid parameters to orthographic", ...arguments];
    }
    widthRatio = 1 / (right - left);
    heightRatio = 1 / (top - bottom);
    depthRatio = 1 / (far - near);
    sx = 2 * widthRatio;
    sy = 2 * heightRatio;
    sz = -2 * depthRatio;
    tz = -(near + far) * depthRatio;
    tx = -(right + left) * widthRatio;
    ty = -(bottom + top) * heightRatio;
    super([sx, 0, 0, tx, 0, sy, 0, ty, 0, 0, sz, tz, 0, 0, 0, 1]);
  }

};

export {
  Frustum,
  Perspective,
  Orthographic
};
