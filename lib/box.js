import {
  Vertices,
  Geometry
} from "./geometry.js";

import {
  gl
} from "./constant.js";

export var Plane = (function() {
  class Plane extends Geometry {
    constructor(options = {}) {
      var attr, length, ref;
      options = {...options, ...Plane.defaults};
      ref = Plane.attributes;
      for (attr in ref) {
        length = ref[attr];
        options.pointLength += length;
      }
      options.bufferLength = options.pointLength * options.pointCount;
      super(options);
    }

    create() {
      var i, j, x, y, z;
      for (i = j = 0; j < 1; i = ++j) {
        1;
      }
      x = .5 * (this.options.width || this.options.size);
      y = .5 * (this.options.height || this.options.size);
      z = 0;
      this[0] = x;
      this[1] = y;
      this[2] = z;
      this[3] = x;
      this[4] = -y;
      this[5] = z;
      this[6] = -x;
      this[7] = -y;
      this[8] = z;
      this[9] = -x;
      this[10] = y;
      this[11] = z;
      return this;
    }

  };

  Plane.prototype.type = "plane";

  Plane.defaults = {
    width: 1,
    height: 1,
    size: 1,
    pointCount: 4,
    pointLength: 0,
    bufferLength: 0
  };

  Plane.byteSize = 4;

  Plane.pointCount = 4;

  Plane.attributes = {
    color: 4, //! per vertex : XYZ + w
    vertex: 4 //! per colour : RGB + a
  };

  return Plane;

}).call(this);

export var Box = (function() {
  class Box extends Geometry {
    create() {
      var Ax, Ay, Az, Bx, By, Bz, Cx, Cy, Cz, Dx, Dy, Dz, Ex, Ey, Ez, Fx, Fy, Fz, Gx, Gy, Gz, Hx, Hy, Hz, x, y, z;
      x = .5 * (this.options.width || this.options.size);
      y = .5 * (this.options.height || this.options.size);
      z = .5 * (this.options.depth || this.options.size);
      Ax = +x;
      Bx = +x;
      Cx = +x;
      Dx = +x;
      Ay = +y;
      By = -y;
      Cy = -y;
      Dy = +y;
      Az = -z;
      Bz = -z;
      Cz = +z;
      Dz = +z;
      Ex = -x;
      Fx = -x;
      Gx = -x;
      Hx = -x;
      Ey = +y;
      Fy = +y;
      Gy = -y;
      Hy = -y;
      Ez = -z;
      Fz = +z;
      Gz = -z;
      Hz = +z;
      this.geometry[0] = Bx; //! right plane A x1
      this.geometry[1] = By; //* right plane A y1
      this.geometry[2] = Bz; //? right plane A z1
      this.geometry[3] = Cx; //! right plane A x2
      this.geometry[4] = Cy; //* right plane A y2
      this.geometry[5] = Cz; //? right plane A z2
      this.geometry[6] = Dx; //! right plane A x3
      this.geometry[7] = Dy; //* right plane A y3
      this.geometry[8] = Dz; //? right plane A z3
      this.geometry[9] = Bx; //! right plane B x1
      this.geometry[10] = By; //* right plane B y1
      this.geometry[11] = Bz; //? right plane B z1
      this.geometry[12] = Dx; //! right plane B x2 
      this.geometry[13] = Dy; //* right plane B y2
      this.geometry[14] = Dz; //? right plane B z2
      this.geometry[15] = Ax; //! right plane B x3
      this.geometry[16] = Ay; //* right plane B y3
      this.geometry[17] = Az; //? right plane B z3
      this.geometry[18] = Ax; //! back plane A x1
      this.geometry[19] = Ay; //* back plane A y1
      this.geometry[20] = Az; //? back plane A z1
      this.geometry[21] = Bx; //! back plane A x2
      this.geometry[22] = By; //* back plane A y2
      this.geometry[23] = Bz; //? back plane A z2
      this.geometry[24] = Gx; //! back plane A x3
      this.geometry[25] = Gy; //* back plane A y3
      this.geometry[26] = Gz; //? back plane A z3
      this.geometry[27] = Ax; //! back plane B x1
      this.geometry[28] = Ay; //* back plane B y1
      this.geometry[29] = Az; //? back plane B z1
      this.geometry[30] = Gx; //! back plane B x2
      this.geometry[31] = Gy; //* back plane B y2
      this.geometry[32] = Gz; //? back plane B z2
      this.geometry[33] = Ex; //! back plane B x3
      this.geometry[34] = Ey; //* back plane B y3
      this.geometry[35] = Ez; //? back plane B z3
      this.geometry[36] = Ex; //!  top plane A x1
      this.geometry[37] = Ey; //*  top plane A y1
      this.geometry[38] = Ez; //?  top plane A z1
      this.geometry[39] = Ax; //!  top plane A x2
      this.geometry[40] = Ay; //*  top plane A y2
      this.geometry[41] = Az; //?  top plane A z2
      this.geometry[42] = Dx; //!  top plane A x3
      this.geometry[43] = Dy; //*  top plane A y3
      this.geometry[44] = Dz; //?  top plane A z3
      this.geometry[45] = Ex; //!  top plane B x1
      this.geometry[46] = Ey; //*  top plane B y1
      this.geometry[47] = Ez; //?  top plane B z1
      this.geometry[48] = Dx; //!  top plane B x2
      this.geometry[49] = Dy; //*  top plane B y2
      this.geometry[50] = Dz; //?  top plane B z2
      this.geometry[51] = Fx; //!  top plane B x3
      this.geometry[52] = Fy; //*  top plane B y3
      this.geometry[53] = Fz; //?  top plane B z3
      this.geometry[54] = Fx; //!  left plane A x1
      this.geometry[55] = Fy; //*  left plane A y1
      this.geometry[56] = Fz; //?  left plane A z1
      this.geometry[57] = Ex; //!  left plane A x2
      this.geometry[58] = Ey; //*  left plane A y2
      this.geometry[59] = Ez; //?  left plane A z2
      this.geometry[60] = Gx; //!  left plane A x3
      this.geometry[61] = Gy; //*  left plane A y3
      this.geometry[62] = Gz; //?  left plane A z3
      this.geometry[63] = Fx; //!  left plane B x1
      this.geometry[64] = Fy; //*  left plane B y1
      this.geometry[65] = Fz; //?  left plane B z1
      this.geometry[66] = Gx; //!  left plane B x2
      this.geometry[67] = Gy; //*  left plane B y2
      this.geometry[68] = Gz; //?  left plane B z2
      this.geometry[69] = Hx; //!  left plane B x3
      this.geometry[70] = Hy; //*  left plane B y3
      this.geometry[71] = Hz; //?  left plane B z3
      this.geometry[72] = Hx; //! front plane A x1
      this.geometry[73] = Hy; //* front plane A y1
      this.geometry[74] = Hz; //? front plane A z1
      this.geometry[75] = Fx; //! front plane A x2
      this.geometry[76] = Fy; //* front plane A y2
      this.geometry[77] = Fz; //? front plane A z2
      this.geometry[78] = Dx; //! front plane A x3
      this.geometry[79] = Dy; //* front plane A y3
      this.geometry[80] = Dz; //? front plane A z3
      this.geometry[81] = Hx; //! front plane B x1
      this.geometry[82] = Hy; //* front plane B y1
      this.geometry[83] = Hz; //? front plane B z1
      this.geometry[84] = Dx; //! front plane B x2
      this.geometry[85] = Dy; //* front plane B y2
      this.geometry[86] = Dz; //? front plane B z2
      this.geometry[87] = Cx; //! front plane B x3
      this.geometry[88] = Cy; //* front plane B y3
      this.geometry[89] = Cz; //? front plane B z3
      this.geometry[90] = Cx; //! bottom plane A x1
      this.geometry[91] = Cy; //* bottom plane A y1
      this.geometry[92] = Cz; //? bottom plane A z1
      this.geometry[93] = Hx; //! bottom plane A x2
      this.geometry[94] = Hy; //* bottom plane A y2
      this.geometry[95] = Hz; //? bottom plane A z2
      this.geometry[96] = Gx; //! bottom plane A x3
      this.geometry[97] = Gy; //* bottom plane A y3
      this.geometry[98] = Gz; //? bottom plane A z3
      this.geometry[99] = Cx; //! bottom plane B x1
      this.geometry[100] = Cy; //* bottom plane B y1
      this.geometry[101] = Cz; //? bottom plane B z1
      this.geometry[102] = Gx; //! bottom plane B x2
      this.geometry[103] = Gy; //* bottom plane B y2
      this.geometry[104] = Gz; //? bottom plane B z2
      this.geometry[105] = Bx; //! bottom plane B x3
      this.geometry[106] = By; //* bottom plane B y3
      this.geometry[107] = Bz; //? bottom plane B z3
      return this;
    }

  };

  Box.prototype.type = "box";

  Box.prototype.bufferLength = 108;

  Box.prototype.defaults = {
    size: 1,
    width: null,
    height: null,
    depth: null
  };

  return Box;

}).call(this);
