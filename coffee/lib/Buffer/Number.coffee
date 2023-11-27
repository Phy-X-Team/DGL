#* Number

# export buffer = Object.defineProperties {}, set :
#     set : -> buffer = arguments[0]


#export writer = Object.defineProperties {}, set :
#    set : -> writer = arguments[0]


# setNumber_asNUMBER
export CNat = ( buffer, offset, number = 0 ) ->
    if  Number.isSafeInteger number
        return new Uint8Array( new Uint32Array( [ number ] ).buffer ) 
    return Uint8Array.from( new Float32Array([number]).buffer ) 

# setNumber_toBUFFER_asNUMBER
export CImp = ( buffer, offset, number = 0 ) ->

    NText = "#{ number }"
    buf = new Uint8Array NText.length
    i = 0

    while code = NText.charCodeAt i
        buf[ i++ ] = code 

    return buf 

# setNumber_toBUFFER_asSTRING
export M03 = ( buffer, offset, number = 0 ) ->
    NText = "#{ number }"
    NSize = NText.length

    buffer[ offset++ ] = 0xff
    buffer[ offset++ ] = NSize
    buffer[ offset++ ] = NText.charCodeAt( NSize ) while NSize--

    return offset 

# setNumber_toBUFFER_asSTRING_ONECHAR
export M04 = ( buffer, offset, number = 0 ) ->
    NText = "#{ number }"
    NSize = NText.length

    if  1 is NSize
        buffer[ offset++ ] = number
        return offset

    buffer[ offset++ ] = 0xff
    buffer[ offset++ ] = NSize
    buffer[ offset++ ] = NText.charCodeAt( NSize ) while NSize--

    return offset 


code = {}
for c in ".-n0123456789".split ""
    code[c] = c.charCodeAt()

# setNumber_toBUFFER_asSTRING_ONECHAR_BIGINT
export M05 = ( buffer, offset, number = 0 ) ->

    for c, i in "#{ number }".split("")
        buffer[ offset + i ] = code[ c ]
        
    return offset 


# write with local dataview
export Ui8 = ( writer, offset, number ) ->
    writer.setUint8 offset, number
    return offset

# write with local dataview
export U32 = ( writer, offset, number ) ->
    writer.setUint32 offset, number
    return offset

# write with local dataview
export BRR = ( buffer, offset, number ) ->
    buffer[ offset ] = number
    return offset

export SET = ( bufferer, offset, number ) ->
    bufferer.set [ number ], offset
    return offset
    

# write with local dataview
export I32 = ( writer, offset, number ) ->
    writer.setInt32 offset, number
    return offset

# write with local dataview
export UM7 = ( writer, offset, number ) ->
    while mods  = number % 0xff
        number -= mods
        number /= 0xff
        writer.setUint8 offset++, mods
    writer.setUint8 offset++, number
    return offset

# write with local dataview
export F32 = ( writer, offset, number ) ->
    writer.setFloat32 offset, number
    return offset
