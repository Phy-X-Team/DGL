textDecoder = new TextDecoder("UTF-8")
wasm = new Object()

console.warn wasm.memory = new WebAssembly.Memory
    initial: 100, maximum: 1000

console.warn wasm.ref = new WebAssembly.Table
    initial: 100, element: "anyfunc"

wasm.console = ( offset, length ) ->
    bytes = new Uint8Array wasm.memory.buffer, offset, length
    string = textDecoder.decode bytes
    console.log string

view = new DataView wasm.memory.buffer




OFFSET =
    pointermove       : 24    
    pointerdown       : 28    
    onpointerup         : 28    
    onpointercancel     : 32    
    onpointerenter      : 36    
    onpointerleave      : 40

    onclick             : 52
    ondblclick          : 56
    onwheel             : 60

FUNC_CONSOLE_LOG = 0


events = [
    "pointermove",
    "pointerdown"
]

self =
    requestIdleCallback : ( i ) ->
        console.warn "requestIdleCallback", ref:i
        console.warn wasm.ref.get(i)()
        #requestIdleCallback()

    requestAnimationFrame : ( i ) ->
        window.onFrame()
        global.requestAnimationFrame ( $now ) ->
            wasm.ref.get( i )( $now )
        
    addEventListener : ( i, j ) ->
        func = wasm.ref.get( i ) 
        window.addEventListener events[ j ], (e) ->
            func( e.time, e.x, e.y )

 



Promise.all([
    WebAssembly.instantiateStreaming global.fetch("wasm/core.wasm"), { wasm, self }
    WebAssembly.instantiateStreaming global.fetch("wasm/graphics.wasm"), { wasm, self }
]).then ( results ) ->

    [
        { instance: { exports: core } }, 
        { instance: { exports: graphics } }, 
    ] = results


    core.boot BigInt(Date.now()), global.performance.now()

    #do  draw = -> requestAnimationFrame ( time ) ->
    #    core.onanimationframe time ; draw()
