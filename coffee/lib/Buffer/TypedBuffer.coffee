import * as N from "./Number.js"

buffer = new Uint8Array 256
writer = new DataView buffer.buffer

randoms = crypto.getRandomValues(new Uint32Array(10)).buffer
results = {}

i =
time =
offsets =
iteration = null
numberCount = 8

reset = ->
    i = iteration
    t = performance . now()
    e = t - time ; time = t
    return e

test = ( count, alternative, buffferer, numbers ) ->
    iteration = count
    results = {
        
        [ alternative ] : [],
        BRR : [],
        SET : [],
        M05 : [],
        
        #CNat : [], CImp : []
    }

    offsets = []

    pcsnums = ( j = 0 ) ->

        return unless number = numbers[ j++ ]

        offset = Math.floor Math.random() * 12
        offsets.push offset

        for fn of results

            argc = switch fn
                when alternative then writer
                when "SET", "BRR" then buffferer
                else buffer 

            reset()
            N[ fn ]( argc, offset, number ) while i--
            results[fn].push reset()
        
        return pcsnums j
    pcsnums()


    for key, obj of results
        avg = 0
        avg += t for t, i in obj
        avg /= i ; obj.avg = avg

        for t, i in obj
            obj[i] = t.toFixed(3) * 1
        obj.avg = obj.avg.toFixed(3) * 1
        
    results.value = [ ...numbers ]
    results.index = offsets
    results


setTimeout ->
    console.warn now: Date.now()
    console.error numberCount:numberCount = 6, count: (count = 1e6).toExponential()

    console.group "Int32"
    console.table test count, "I32", new Int32Array(buffer.buffer), new Int32Array( randoms ).subarray -numberCount
    console.groupEnd "Int32"


    console.group "Uint32"
    console.table test count, "U32", new Uint32Array(buffer.buffer), new Uint32Array( randoms ).subarray -numberCount
    console.groupEnd "Uint32"


    console.group "Float32"
    console.table test count, "F32", new Float32Array(buffer.buffer), new Float32Array( randoms ).subarray -numberCount
    console.groupEnd "Float32"

    
    console.warn now: Date.now()
, 1000
