#: Learn_webgl_vector3.js, By Wayne Brown, Spring 2015
class Vector3

    constructor                 : ( x, y, z ) -> @create x, y, z

    create                      : ( x = 0, y = 0, z = 0 ) ->
        new Float32Array [ x, y, z ]

    #. Create a new 3-component vector and set its components equal to an existing vector.
    createFrom                  : ( From ) ->
        ###
        * @param from Float32Array An existing vector.
        * @return Float32Array A new 3-component vector with the same values as "from"        
        ###
        @create From[0], From[1], From[2]

    #. Create a vector using two existing points.
    createFrom2Points           : ( tail, head ) ->
        ###
        * @param tail Float32Array A 3-component point.
        * @param head Float32Array A 3-component point.
        * @return Float32Array A new 3-component vector defined by 2 points        
        ###
        v = new Float32Array 3
        @subtract v, head, tail
        v

    #. Copy a 3-component vector into another 3-component vector
    copy                        : ( To, From ) ->
        ###
        * @param to Float32Array A 3-component vector that you want changed.
        * @param from Float32Array A 3-component vector that is the source of data
        * @returns Float32Array The "to" 3-component vector        
        ###
        To[0] = From[0] ; To[1] = From[1] ; To[2] = From[2] ; To 

    #. Set the components of a 3-component vector.
    set                         : ( v, dx, dy, dz ) ->
        ###
        * @param v Float32Array The vector to change.
        * @param dx Number The change in x of the vector.
        * @param dy Number The change in y of the vector.
        * @param dz Number The change in z of the vector.                
        ###
        v[0] = dx ; v[1] = dy ; v[2] = dz ; v

    #. Calculate the length of a vector.
    length                      : ( v ) ->
        ###
        * @param v Float32Array A 3-component vector.
        * @return Number The length of a vector
        ###
        Math.sqrt v[0] * v[0]  +  v[1] * v[1]  +  v[2] * v[2]

    #. Make a vector have a length of 1.
    normalize                   : ( v ) ->
        ###
        * @param v Float32Array A 3-component vector.
        * @return Float32Array The input vector normalized to unit length. Or null if the vector is zero length.        
        ###
        length = @length v
        return if 0.0000001 > Math.abs length
        
        percent = 1.0 / length
        v[0] *= percent
        v[1] *= percent
        v[2] *= percent

        v

    #. Add two vectors:  result = V0  +  v1
    add                         : ( result, v0, v1 ) ->
        ###
        * @param result Float32Array A 3-component vector.
        * @param v0 Float32Array A 3-component vector.
        * @param v1 Float32Array A 3-component vector.        
        ###
        result[0] = v0[0]  +  v1[0]
        result[1] = v0[1]  +  v1[1]
        result[2] = v0[2]  +  v1[2]
        result

    #. Subtract two vectors:  result = v0 - v1
    subtract                    : ( result, v0, v1 ) ->
        ###
        * @param result Float32Array A 3-component vector.
        * @param v0 Float32Array A 3-component vector.
        * @param v1 Float32Array A 3-component vector.        
        ###
        result[0] = v0[0]  -  v1[0]
        result[1] = v0[1]  -  v1[1]
        result[2] = v0[2]  -  v1[2]
        result

    #. Scale a vector:  result = s * v0
    scale                       : ( result, v0, s ) ->
        ###
        * @param result Float32Array A 3-component vector.
        * @param v0 Float32Array A 3-component vector.
        * @param s Number A scale factor.        
        ###
        result[0] = v0[0] * s
        result[1] = v0[1] * s
        result[2] = v0[2] * s
        result

    #. Calculate the cross product of 2 vectors: result = v0 x v1 (order matters)
    crossProduct                : ( result, v0, v1 ) ->
        ###
        * @param result Float32Array A 3-component vector.
        * @param v0 Float32Array A 3-component vector.
        * @param v1 Float32Array A 3-component vector.        
        ###
        result[0] = v0[1] * v1[2]  -  v0[2] * v1[1]
        result[1] = v0[2] * v1[0]  -  v0[0] * v1[2]
        result[2] = v0[0] * v1[1]  -  v0[1] * v1[0]

        result

    #. Calculate the dot product of 2 vectors
    dotProduct                  : ( v0, v1 ) ->
        ###
        * @param v0 Float32Array A 3-component vector.
        * @param v1 Float32Array A 3-component vector.
        * @return Number Float32Array The dot product of v0 and v1        
        ###
        v0[0] * v1[0]  +  
        v0[1] * v1[1]  +  
        v0[2] * v1[2]

    #. Print a vector on the console.
    print                       : ( name, v ) ->
        ###
        * @param name String A description of the vector to be printed.
        * @param v Float32Array A 3-component vector.        
        ###
        maximum = Math.max v[0], v[1], v[2]
        order   = Math.floor( Math.log(maximum) / Math.LN10  +  1e-9)
        digits  = if order <= 0 then 5 else if order > 5 then 0 else 5 - order
        
        console.log "Vector3: #{name}: ", [ 
            v[0].toFixed(digits), v[1].toFixed(digits),v[2].toFixed(digits)
        ]

#: Learn_webgl_point4.js,  By Wayne Brown,   Fall 2015
class Point4

    constructor                 : ( x, y, z, w ) -> @create x, y, z, w 

    #. @return Float32Array A new 4-component vector
    create                      : ( x, y, z, w ) ->
        p = new Float32Array [ 0, 0, 0, 1 ]
        l = arguments.length

        p[0] = x if l >= 1
        p[1] = y if l >= 2
        p[2] = z if l >= 3
        p[3] = w if l >= 4
        
        p

    #. @return Float32Array A new 4-component point that has the same values as the input argument
    createFrom                  : ( From ) ->
        new Float32Array [ From[0], From[1], From[2], From[3] ]
        
    #. to = from (copy the 2nd argument point to the first argument)
    copy                        : ( To, From ) ->
        To[0] = From[0] ; To[1] = From[1] 
        To[2] = From[2] ; To[3] = From[3] 
        To

    #. @return Number The distance between 2 points
    distanceBetween             : ( p1, p2 ) ->
        dx = p1[0] - p2[0]
        dy = p1[1] - p2[1]
        dz = p1[2] - p2[2]
        
        Math.sqrt dx * dx  +  dy * dy  +  dz * dz
        
    #. Normalize the point by dividing by its homogeneous coordinate w
    normalize                   : ( p ) ->
        unless p[3] is 0
            p[0] = p[0] / p[3]
            p[1] = p[1] / p[3]
            p[2] = p[2] / p[3]
            p[3] = 1
        p

#: Learn_webgl_matrix.js,  By Wayne Brown, Spring 2015
class Matrix4 extends Float32Array

    P   = new Point4()
    p4  = new Point4()

    T1  = new Matrix4()
    T2  = new Matrix4()

    V   = new Vector3()
    v3  = new Vector3()

    u   = new Vector3()
    v   = new Vector3()
    n   = new Vector3()

    axis_of_rotation = new Vector3()
    center           = new Vector3()
    eye              = new Vector3()
    up               = new Vector3()

    constructor                 : ( data, size = 16 ) ->
        super data or size

    #. @return Float32Array returns an uninitialized matrix.
    create                      : ( data, size ) ->
        new Matrix4 data, size

    #. To = From (an element-by-element copy) @return To (a 16 element Float32Array)
    copy                        : ( To, From ) ->
        To[j] = From[j] for j in [ 0 ... 16 ] ; To
        
    #. @return number Convert the input angle in radians to degrees
    toDegrees                   : ( angleInRadians ) ->
        angleInRadians * 57.29577951308232

    #. @return number Convert the input angle in degrees to radians
    toRadians                   : ( angleInDegrees ) ->
        angleInDegrees * 0.017453292519943295

    #. M = I (identity Matrix)
    setIdentity                 : ( M ) ->
        M[0] = 1;   M[4] = 0;   M[ 8] = 0;   M[12] = 0
        M[1] = 0;   M[5] = 1;   M[ 9] = 0;   M[13] = 0
        M[2] = 0;   M[6] = 0;   M[10] = 1;   M[14] = 0
        M[3] = 0;   M[7] = 0;   M[11] = 0;   M[15] = 1
        M        

    #. R = A * B (Matrix Multiplication); NOTE: order matters!
    multiply                    : ( R, A, B ) ->
        #? A and B can NOT change during the operation.
        #? If R is the same as A and/or B, Make copies of A and B
        #? The comparison must use ==, not ===. We are comparing for identical
        #? objects, not if two objects might have the same values.
        A = @copy T1, A if `A == R`
        B = @copy T2, B if `B == R`
    
        R[ 0] = A[0] * B[ 0]  +  A[4] * B[ 1]  +  A[ 8] * B[ 2]  +  A[12] * B[ 3];
        R[ 1] = A[1] * B[ 0]  +  A[5] * B[ 1]  +  A[ 9] * B[ 2]  +  A[13] * B[ 3];
        R[ 2] = A[2] * B[ 0]  +  A[6] * B[ 1]  +  A[10] * B[ 2]  +  A[14] * B[ 3];
        R[ 3] = A[3] * B[ 0]  +  A[7] * B[ 1]  +  A[11] * B[ 2]  +  A[15] * B[ 3];
    
        R[ 4] = A[0] * B[ 4]  +  A[4] * B[ 5]  +  A[ 8] * B[ 6]  +  A[12] * B[ 7];
        R[ 5] = A[1] * B[ 4]  +  A[5] * B[ 5]  +  A[ 9] * B[ 6]  +  A[13] * B[ 7];
        R[ 6] = A[2] * B[ 4]  +  A[6] * B[ 5]  +  A[10] * B[ 6]  +  A[14] * B[ 7];
        R[ 7] = A[3] * B[ 4]  +  A[7] * B[ 5]  +  A[11] * B[ 6]  +  A[15] * B[ 7];
    
        R[ 8] = A[0] * B[ 8]  +  A[4] * B[ 9]  +  A[ 8] * B[10]  +  A[12] * B[11];
        R[ 9] = A[1] * B[ 8]  +  A[5] * B[ 9]  +  A[ 9] * B[10]  +  A[13] * B[11];
        R[10] = A[2] * B[ 8]  +  A[6] * B[ 9]  +  A[10] * B[10]  +  A[14] * B[11];
        R[11] = A[3] * B[ 8]  +  A[7] * B[ 9]  +  A[11] * B[10]  +  A[15] * B[11];
    
        R[12] = A[0] * B[12]  +  A[4] * B[13]  +  A[ 8] * B[14]  +  A[12] * B[15];
        R[13] = A[1] * B[12]  +  A[5] * B[13]  +  A[ 9] * B[14]  +  A[13] * B[15];
        R[14] = A[2] * B[12]  +  A[6] * B[13]  +  A[10] * B[14]  +  A[14] * B[15];
        R[15] = A[3] * B[12]  +  A[7] * B[13]  +  A[11] * B[14]  +  A[15] * B[15];
        R

    #. R = A * B * C * D ... (Matrix Multiplication); NOTE: order matters!
    multiplySeries              : ->
        length = arguments.length
        if  length >= 3
            @multiply arguments[0], arguments[1], arguments[2]
            for i in [ 3 ... length ]
                @multiply arguments[0], arguments[0], arguments[i]
        this

    #. r = M * v (M is a 4x4 matrix, v is a 3-component vector)
    multiplyV3                  : (r, M, v) ->
        # v can NOT change during the operation. If r and v are the same, make a copy of v
        v = V.copy v3, v if `r == v`
  
        r[0] = M[0] * v[0]  +  M[4] * v[1]  +  M[ 8] * v[2]
        r[1] = M[1] * v[0]  +  M[5] * v[1]  +  M[ 9] * v[2]
        r[2] = M[2] * v[0]  +  M[6] * v[1]  +  M[10] * v[2]
        
        r

    #. r = M * p (M is a 4x4 matrix, p is a 4-component point)
    multiplyP4                  : ( r, M, p ) ->
        # p can NOT change during the operation, so make a copy of p.
        P.copy p4, p

        r[0] = M[0] * p4[0]  +  M[4] * p4[1]  +  M[ 8] * p4[2]  +  M[12] * p4[3]
        r[1] = M[1] * p4[0]  +  M[5] * p4[1]  +  M[ 9] * p4[2]  +  M[13] * p4[3]
        r[2] = M[2] * p4[0]  +  M[6] * p4[1]  +  M[10] * p4[2]  +  M[14] * p4[3]
        r[3] = M[3] * p4[0]  +  M[7] * p4[1]  +  M[11] * p4[2]  +  M[15] * p4[3]

        r

    #. M = M` (transpose the matrix)
    transpose                   : ( M ) ->
        # The diagonal values do NOT move
        # 6 non-diagonal elements are swapped.
        
        t = M[ 1];   M[ 1] = M[ 4];   M[ 4] = t
        t = M[ 2];   M[ 2] = M[ 8];   M[ 8] = t
        t = M[ 3];   M[ 3] = M[12];   M[12] = t
        t = M[ 6];   M[ 6] = M[ 9];   M[ 9] = t
        t = M[ 7];   M[ 7] = M[13];   M[13] = t
        t = M[11];   M[11] = M[14];   M[14] = t

        M

    #. Inv = M(-1) (Inv is set to the inverse of M)
    inverse                     : ( Inv, M ) ->
        ###
          Structure of matrix

                0   1   2   3
            ______________
            0 | 0   4   8  12
            1 | 1   5   9  13
            2 | 2   6  10  14
            3 | 3   7  11  15
        ###

        #: Factored out common terms
        t9_14_13_10 = M[ 9] * M[14]  -  M[13] * M[10]
        t13_6_5_14  = M[13] * M[ 6]  -  M[ 5] * M[14]
        t5_10_9_6   = M[ 5] * M[10]  -  M[ 9] * M[ 6]
        t12_10_8_14 = M[12] * M[10]  -  M[ 8] * M[14]
        t4_14_12_6  = M[ 4] * M[14]  -  M[12] * M[ 6]
        t8_6_4_10   = M[ 8] * M[ 6]  -  M[ 4] * M[10]
        t8_13_12_9  = M[ 8] * M[13]  -  M[12] * M[ 9]
        t12_5_4_13  = M[12] * M[ 5]  -  M[ 4] * M[13]
        t4_9_8_5    = M[ 4] * M[ 9]  -  M[ 8] * M[ 5]
        t1_14_13_2  = M[ 1] * M[14]  -  M[13] * M[ 2]
        t9_2_1_10   = M[ 9] * M[ 2]  -  M[ 1] * M[10]
        t12_2_0_14  = M[12] * M[ 2]  -  M[ 0] * M[14]
        t0_10_8_2   = M[ 0] * M[10]  -  M[ 8] * M[ 2]
        t0_13_12_1  = M[ 0] * M[13]  -  M[12] * M[ 1]
        t8_1_0_9    = M[ 8] * M[ 1]  -  M[ 0] * M[ 9]
        t1_6_5_2    = M[ 1] * M[ 6]  -  M[ 5] * M[ 2]
        t4_2_0_6    = M[ 4] * M[ 2]  -  M[ 0] * M[ 6]
        t0_5_4_1    = M[ 0] * M[ 5]  -  M[ 4] * M[ 1]

        Inv[ 0]     = M[7] *  t9_14_13_10  +  M[11] *  t13_6_5_14  +  M[15] *  t5_10_9_6
        Inv[ 4]     = M[7] *  t12_10_8_14  +  M[11] *  t4_14_12_6  +  M[15] *  t8_6_4_10
        Inv[ 8]     = M[7] *   t8_13_12_9  +  M[11] *  t12_5_4_13  +  M[15] *   t4_9_8_5
        Inv[12]     = M[6] *  -t8_13_12_9  +  M[10] * -t12_5_4_13  +  M[14] *  -t4_9_8_5
        Inv[ 1]     = M[3] * -t9_14_13_10  +  M[11] *  t1_14_13_2  +  M[15] *  t9_2_1_10
        Inv[ 5]     = M[3] * -t12_10_8_14  +  M[11] *  t12_2_0_14  +  M[15] *  t0_10_8_2
        Inv[ 9]     = M[3] *  -t8_13_12_9  +  M[11] *  t0_13_12_1  +  M[15] *   t8_1_0_9
        Inv[13]     = M[2] *   t8_13_12_9  +  M[10] * -t0_13_12_1  +  M[14] *  -t8_1_0_9
        Inv[ 2]     = M[3] *  -t13_6_5_14  +  M[ 7] * -t1_14_13_2  +  M[15] *   t1_6_5_2
        Inv[ 6]     = M[3] *  -t4_14_12_6  +  M[ 7] * -t12_2_0_14  +  M[15] *   t4_2_0_6
        Inv[10]     = M[3] *  -t12_5_4_13  +  M[ 7] * -t0_13_12_1  +  M[15] *   t0_5_4_1
        Inv[14]     = M[2] *   t12_5_4_13  +  M[ 6] *  t0_13_12_1  +  M[14] *  -t0_5_4_1
        Inv[ 3]     = M[3] *   -t5_10_9_6  +  M[ 7] *  -t9_2_1_10  +  M[11] *  -t1_6_5_2
        Inv[ 7]     = M[3] *   -t8_6_4_10  +  M[ 7] *  -t0_10_8_2  +  M[11] *  -t4_2_0_6
        Inv[11]     = M[3] *    -t4_9_8_5  +  M[ 7] *   -t8_1_0_9  +  M[11] *  -t0_5_4_1
        Inv[15]     = M[2] *     t4_9_8_5  +  M[ 6] *    t8_1_0_9  +  M[10] *   t0_5_4_1

        det =
            M[ 3] * ( M[6] *  -t8_13_12_9  +  M[10] * -t12_5_4_13  +  M[14] *  -t4_9_8_5 ) +
            M[ 7] * ( M[2] *   t8_13_12_9  +  M[10] * -t0_13_12_1  +  M[14] *  -t8_1_0_9 ) +
            M[11] * ( M[2] *   t12_5_4_13  +  M[ 6] *  t0_13_12_1  +  M[14] *  -t0_5_4_1 ) +
            M[15] * ( M[2] *     t4_9_8_5  +  M[ 6] *    t8_1_0_9  +  M[10] *   t0_5_4_1 )

        unless det is 0
            Inv[j] *= 1/det for j in [ 0 ... 16 ]

        Inv

    #. Set the matrix for scaling.
    scale                       : ( sx, sy, sz, M = new Matrix4() ) ->
        ###
        * @param M The matrix to set to a scaling matrix
        * @param sx The scale factor along the x-axis
        * @param sy The scale factor along the y-axis
        * @param sz The scale factor along the z-axis
        ###
        M[0] = sx;   M[4] =  0;   M[ 8] =  0;   M[12] = 0
        M[1] =  0;   M[5] = sy;   M[ 9] =  0;   M[13] = 0
        M[2] =  0;   M[6] =  0;   M[10] = sz;   M[14] = 0
        M[3] =  0;   M[7] =  0;   M[11] =  0;   M[15] = 1
        
        @multiply this, this, M
    
    #. Set the matrix for translation.
    translate                   : ( dx, dy, dz, M = new Matrix4() ) ->
        ###
        * @param M The matrix to set to a translation matrix.
        * @param dx The X value of a translation.
        * @param dy The Y value of a translation.
        * @param dz The Z value of a translation.        
        ###
        M[0] = 1;   M[4] = 0;   M[ 8] = 0;   M[12] = dx
        M[1] = 0;   M[5] = 1;   M[ 9] = 0;   M[13] = dy
        M[2] = 0;   M[6] = 0;   M[10] = 1;   M[14] = dz
        M[3] = 0;   M[7] = 0;   M[11] = 0;   M[15] =  1

        @multiply this, this, M

    rotateX                     : ( angle, M = this ) -> @rotation( angle, 1, 0, 0 )
    rotateY                     : ( angle, M = this ) -> @rotation( angle, 0, 1, 0 )
    rotateZ                     : ( angle, M = this ) -> @rotation( angle, 0, 0, 1 )

    rotate                      : ( x, y, z ) ->
        @rotateX( x ) if x
        @rotateY( y ) if y
        @rotateZ( z ) if z
        this

    #. Set the matrix to a rotation matrix. The axis of rotation axis may not be normalized.
    rotation                    : ( angle, x_axis, y_axis, z_axis, M = new Matrix4() ) ->

        ###
        * @paraM angle The angle of rotation (degrees)
        * @paraM x_axis The X coordinate of axis vector for rotation.
        * @paraM y_axis The Y coordinate of axis vector for rotation.
        * @paraM z_axis The Z coordinate of axis vector for rotation.        
        ###
        
        angle = @toRadians angle

        s = Math.sin angle
        c = Math.cos angle

        
        if       x_axis isnt 0 and y_axis is 0 and z_axis is 0          #* Rotation around X axis
            s = -s if x_axis < 0

            M[0] =  1;   M[4] =  0;   M[ 8] =  0;   M[12] =  0
            M[1] =  0;   M[5] =  c;   M[ 9] = -s;   M[13] =  0
            M[2] =  0;   M[6] =  s;   M[10] =  c;   M[14] =  0
            M[3] =  0;   M[7] =  0;   M[11] =  0;   M[15] =  1
        
        
        else if  y_axis isnt 0 and x_axis is 0 and z_axis is 0          #? Rotation around Y axis
            s = -s if y_axis < 0

            M[0] =  c;   M[4] =  0;   M[ 8] =  s;   M[12] =  0
            M[1] =  0;   M[5] =  1;   M[ 9] =  0;   M[13] =  0
            M[2] = -s;   M[6] =  0;   M[10] =  c;   M[14] =  0
            M[3] =  0;   M[7] =  0;   M[11] =  0;   M[15] =  1

        
        else if  z_axis isnt 0 and x_axis is 0 and y_axis is 0          #! Rotation around Z axis
            s = -s if z_axis < 0
            
            M[0] =  c;   M[4] = -s;   M[8]  =  0;   M[12] =  0
            M[1] =  s;   M[5] =  c;   M[9]  =  0;   M[13] =  0
            M[2] =  0;   M[6] =  0;   M[10] =  1;   M[14] =  0
            M[3] =  0;   M[7] =  0;   M[11] =  0;   M[15] =  1

            
        else                                                            #: Rotation around any arbitrary axis
            axis_of_rotation[0] = x_axis
            axis_of_rotation[1] = y_axis
            axis_of_rotation[2] = z_axis
            
            V.normalize axis_of_rotation
            
            ux = axis_of_rotation[0]
            uy = axis_of_rotation[1]
            uz = axis_of_rotation[2]

            c1 = 1 - c
            
            M[ 0] =  c + ux * ux * c1
            M[ 1] = uy * ux * c1 + uz * s
            M[ 2] = uz * ux * c1 - uy * s
            M[ 3] =  0
            
            M[ 4] = ux * uy * c1 - uz * s
            M[ 5] =  c + uy * uy * c1
            M[ 6] = uz * uy * c1 + ux * s
            M[ 7] =  0
            
            M[ 8] = ux * uz * c1 + uy * s
            M[ 9] = uy * uz * c1 - ux * s
            M[10] =  c + uz * uz * c1
            M[11] =  0
            
            M[12] =  0
            M[13] =  0
            M[14] =  0
            M[15] =  1
        
        @multiply this, this, M

    #. Set a camera matrix.
    lookAt                      : ( M, eye_x, eye_y, eye_z, center_x, center_y, center_z, up_dx, up_dy, up_dz ) ->
        ###
        * @param M Float32Array The matrix to contain the camera transformation.
        * @param eye_x Number The x component of the eye point.
        * @param eye_y Number The y component of the eye point.
        * @param eye_z Number The z component of the eye point.
        * @param center_x Number The x component of a point being looked at.
        * @param center_y Number The y component of a point being looked at.
        * @param center_z Number The z component of a point being looked at.
        * @param up_dx Number The x component of a vector in the up direction.
        * @param up_dy Number The y component of a vector in the up direction.
        * @param up_dz Number The z component of a vector in the up direction.
        ###

        # Local coordinate system for the camera:
        #*                      u    to      x-axis
        #?                      v    to      y-axis
        #!                      n    to      z-axis

        V.set center,   center_x,   center_y,   center_z
        V.set eye,      eye_x,      eye_y,      eye_z
        V.set up,       up_dx,      up_dy,      up_dz

        V.subtract      n,   eye,  center                       # n = eye - center
        V.normalize     n
        
        V.crossProduct  u,   up,   n
        V.normalize     u
        
        V.crossProduct  v,   n,    u
        V.normalize     v
        
        tx = - V.dotProduct  u,  eye
        ty = - V.dotProduct  v,  eye
        tz = - V.dotProduct  n,  eye
        
        #: Set the camera matrix
        M[0] = u[0];   M[4] = u[1];   M[ 8] = u[2];   M[12] = tx
        M[1] = v[0];   M[5] = v[1];   M[ 9] = v[2];   M[13] = ty
        M[2] = n[0];   M[6] = n[1];   M[10] = n[2];   M[14] = tz
        M[3] =    0;   M[7] =    0;   M[11] =    0;   M[15] =  1

        M


export {
    Vector3, Point4, Matrix4
}
