#* OneBuffer_MirrorHead_StringEncodedNumber

export setNumber_asNUMBER = ( buffer, offset, number = 0 ) ->

    while mods  = number % 0xff
        number -= mods
        number /= 0xff
        buffer[ offset++ ] = mods
    buffer[ offset++ ] = number 

    return offset 

export setNumber_asSTRING = ( buffer, offset, number = 0 ) ->
    NText = "#{ number }"
    NSize = NText.length

    buffer[ offset++ ] = 0xff
    buffer[ offset++ ] = NSize
    buffer[ offset++ ] = NText.charCodeAt( NSize ) while NSize--

    return offset 

export setNumber_asSTRING_ONECHAR = ( buffer, offset, number = 0 ) ->
    NText = "#{ number }"
    NSize = NText.length

    if  1 is NSize
        buffer[ offset++ ] = number
        return offset

    buffer[ offset++ ] = 0xff
    buffer[ offset++ ] = NSize
    buffer[ offset++ ] = NText.charCodeAt( NSize ) while NSize--

    return offset 

export setNumber_asSTRING_ONECHAR_BIGINT = ( buffer, offset, number = 0 ) ->
    NText = "#{ number }"
    NSize = NText.length

    if  1 is NSize
        buffer[ offset++ ] =
            NText * 1 #bigint conv.
        return offset

    buffer[ offset++ ] = 0xff
    buffer[ offset++ ] = NSize
    buffer[ offset++ ] = NText.charCodeAt( NSize ) while NSize--

    return offset 
