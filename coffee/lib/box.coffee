import { Vertices, Geometry } from "./geometry.js"
import { gl } from "./constant.js"


export class Plane extends Geometry

    type : "plane"

    @defaults   = {
        width   : 1
        height  : 1
        size    : 1

        pointCount : 4
        pointLength : 0
        bufferLength : 0
    }

    @byteSize   = 4
    @pointCount = 4
    @attributes = {
        color   : 4  #! per vertex : XYZ + w
        vertex  : 4  #! per colour : RGB + a
    }

    constructor : ( options = {} ) ->

        options = {
            ...options, ...Plane.defaults
        }

        for attr, length of Plane.attributes
            options.pointLength += length

        options.bufferLength = options.pointLength * options.pointCount

        super options
    
    create : ->

        for i in [ 0 ... 1 ]
            1

        x = .5 * (  @options.width or @options.size )
        y = .5 * ( @options.height or @options.size )
        z = 0

        @[ 0] = x
        @[ 1] = y
        @[ 2] = z

        @[ 3] = x
        @[ 4] = -y
        @[ 5] = z

        @[ 6] = -x
        @[ 7] = -y
        @[ 8] = z

        @[ 9] = -x
        @[10] = y
        @[11] = z

        this
        

export class Box extends Geometry

    type : "box"
    bufferLength : 108

    defaults : {
        size : 1,
        width : null, 
        height : null, 
        depth : null
    }

    create : ->

        x = .5 * (  @options.width or @options.size )
        y = .5 * ( @options.height or @options.size )
        z = .5 * (  @options.depth or @options.size )

        Ax = +x    ;    Bx = +x    ;    Cx = +x    ;    Dx = +x
        Ay = +y    ;    By = -y    ;    Cy = -y    ;    Dy = +y
        Az = -z    ;    Bz = -z    ;    Cz = +z    ;    Dz = +z

        
        Ex = -x    ;    Fx = -x    ;    Gx = -x    ;    Hx = -x 
        Ey = +y    ;    Fy = +y    ;    Gy = -y    ;    Hy = -y
        Ez = -z    ;    Fz = +z    ;    Gz = -z    ;    Hz = +z

        @geometry[  0] = Bx        #! right plane A x1
        @geometry[  1] = By        #* right plane A y1
        @geometry[  2] = Bz        #? right plane A z1

        @geometry[  3] = Cx        #! right plane A x2
        @geometry[  4] = Cy        #* right plane A y2
        @geometry[  5] = Cz        #? right plane A z2

        @geometry[  6] = Dx        #! right plane A x3
        @geometry[  7] = Dy        #* right plane A y3
        @geometry[  8] = Dz        #? right plane A z3


        @geometry[  9] = Bx        #! right plane B x1
        @geometry[ 10] = By        #* right plane B y1
        @geometry[ 11] = Bz        #? right plane B z1

        @geometry[ 12] = Dx        #! right plane B x2 
        @geometry[ 13] = Dy        #* right plane B y2
        @geometry[ 14] = Dz        #? right plane B z2

        @geometry[ 15] = Ax        #! right plane B x3
        @geometry[ 16] = Ay        #* right plane B y3
        @geometry[ 17] = Az        #? right plane B z3




        @geometry[ 18] = Ax        #! back plane A x1
        @geometry[ 19] = Ay        #* back plane A y1
        @geometry[ 20] = Az        #? back plane A z1

        @geometry[ 21] = Bx        #! back plane A x2
        @geometry[ 22] = By        #* back plane A y2
        @geometry[ 23] = Bz        #? back plane A z2

        @geometry[ 24] = Gx        #! back plane A x3
        @geometry[ 25] = Gy        #* back plane A y3
        @geometry[ 26] = Gz        #? back plane A z3


        @geometry[ 27] = Ax        #! back plane B x1
        @geometry[ 28] = Ay        #* back plane B y1
        @geometry[ 29] = Az        #? back plane B z1

        @geometry[ 30] = Gx        #! back plane B x2
        @geometry[ 31] = Gy        #* back plane B y2
        @geometry[ 32] = Gz        #? back plane B z2

        @geometry[ 33] = Ex        #! back plane B x3
        @geometry[ 34] = Ey        #* back plane B y3
        @geometry[ 35] = Ez        #? back plane B z3




        @geometry[ 36] = Ex        #!  top plane A x1
        @geometry[ 37] = Ey        #*  top plane A y1
        @geometry[ 38] = Ez        #?  top plane A z1

        @geometry[ 39] = Ax        #!  top plane A x2
        @geometry[ 40] = Ay        #*  top plane A y2
        @geometry[ 41] = Az        #?  top plane A z2

        @geometry[ 42] = Dx        #!  top plane A x3
        @geometry[ 43] = Dy        #*  top plane A y3
        @geometry[ 44] = Dz        #?  top plane A z3


        @geometry[ 45] = Ex        #!  top plane B x1
        @geometry[ 46] = Ey        #*  top plane B y1
        @geometry[ 47] = Ez        #?  top plane B z1

        @geometry[ 48] = Dx        #!  top plane B x2
        @geometry[ 49] = Dy        #*  top plane B y2
        @geometry[ 50] = Dz        #?  top plane B z2

        @geometry[ 51] = Fx        #!  top plane B x3
        @geometry[ 52] = Fy        #*  top plane B y3
        @geometry[ 53] = Fz        #?  top plane B z3




        @geometry[ 54] = Fx        #!  left plane A x1
        @geometry[ 55] = Fy        #*  left plane A y1
        @geometry[ 56] = Fz        #?  left plane A z1

        @geometry[ 57] = Ex        #!  left plane A x2
        @geometry[ 58] = Ey        #*  left plane A y2
        @geometry[ 59] = Ez        #?  left plane A z2

        @geometry[ 60] = Gx        #!  left plane A x3
        @geometry[ 61] = Gy        #*  left plane A y3
        @geometry[ 62] = Gz        #?  left plane A z3


        @geometry[ 63] = Fx        #!  left plane B x1
        @geometry[ 64] = Fy        #*  left plane B y1
        @geometry[ 65] = Fz        #?  left plane B z1

        @geometry[ 66] = Gx        #!  left plane B x2
        @geometry[ 67] = Gy        #*  left plane B y2
        @geometry[ 68] = Gz        #?  left plane B z2

        @geometry[ 69] = Hx        #!  left plane B x3
        @geometry[ 70] = Hy        #*  left plane B y3
        @geometry[ 71] = Hz        #?  left plane B z3




        @geometry[ 72] = Hx        #! front plane A x1
        @geometry[ 73] = Hy        #* front plane A y1
        @geometry[ 74] = Hz        #? front plane A z1

        @geometry[ 75] = Fx        #! front plane A x2
        @geometry[ 76] = Fy        #* front plane A y2
        @geometry[ 77] = Fz        #? front plane A z2

        @geometry[ 78] = Dx        #! front plane A x3
        @geometry[ 79] = Dy        #* front plane A y3
        @geometry[ 80] = Dz        #? front plane A z3


        @geometry[ 81] = Hx        #! front plane B x1
        @geometry[ 82] = Hy        #* front plane B y1
        @geometry[ 83] = Hz        #? front plane B z1

        @geometry[ 84] = Dx        #! front plane B x2
        @geometry[ 85] = Dy        #* front plane B y2
        @geometry[ 86] = Dz        #? front plane B z2

        @geometry[ 87] = Cx        #! front plane B x3
        @geometry[ 88] = Cy        #* front plane B y3
        @geometry[ 89] = Cz        #? front plane B z3



        @geometry[ 90] = Cx        #! bottom plane A x1
        @geometry[ 91] = Cy        #* bottom plane A y1
        @geometry[ 92] = Cz        #? bottom plane A z1

        @geometry[ 93] = Hx        #! bottom plane A x2
        @geometry[ 94] = Hy        #* bottom plane A y2
        @geometry[ 95] = Hz        #? bottom plane A z2

        @geometry[ 96] = Gx        #! bottom plane A x3
        @geometry[ 97] = Gy        #* bottom plane A y3
        @geometry[ 98] = Gz        #? bottom plane A z3


        @geometry[ 99] = Cx        #! bottom plane B x1
        @geometry[100] = Cy        #* bottom plane B y1
        @geometry[101] = Cz        #? bottom plane B z1

        @geometry[102] = Gx        #! bottom plane B x2
        @geometry[103] = Gy        #* bottom plane B y2
        @geometry[104] = Gz        #? bottom plane B z2

        @geometry[105] = Bx        #! bottom plane B x3
        @geometry[106] = By        #* bottom plane B y3
        @geometry[107] = Bz        #? bottom plane B z3

        return this
