#!console.log console:console


#window.queryObjects = 
#window.getEventListeners = self

export console = window.console
export Proxy = window.Proxy
export Reflect = window.Reflect
export Date = window.Date
export BigInt = window.BigInt
export WebAssembly = window.WebAssembly
export fetch = window.fetch
export requestIdleCallback = window.requestIdleCallback
export requestAnimationFrame = window.requestAnimationFrame
export addEventListener = window.addEventListener
export setTimeout = window.setTimeout
export Uint32Array = window.Uint32Array
export BigUint64Array = window.BigUint64Array
export Promise = window.Promise
export Boolean = window.Boolean
export log = console.warn
keyref = { log: 0 }
ref = [ (-> log ...arguments) ]


delete window.__proto__.__proto__.__proto__[ Symbol.toStringTag ]
delete window.__proto__.__proto__.__proto__.constructor

delete window.__proto__.__proto__[ Symbol.toStringTag ]

delete window.__proto__[ Symbol.toStringTag ]
delete window.__proto__.constructor

constructor = ({}).constructor

for k of Object.getOwnPropertyDescriptors d = Function.constructor.__proto__
    window.setTimeout -> try delete d[k]



delete Array::[ Symbol.unscopables ]
delete Function::constructor
delete Location::constructor
delete Location::[Symbol.toStringTag]
delete location.__proto__

delete location.reload.length
delete location.reload.name

delete location.assign.length
delete location.assign.name

delete location.replace.length
delete location.replace.name

delete location.toString.length
delete location.toString.name
delete location.valueOf.length
delete location.valueOf.name



delete Function::name
delete Function::caller
delete Function::arguments
delete Function::length

Function::$ = Function::call
Function::call = ->
    @$ window, ...arguments

delete Function::apply


if chrome? then window.chrome = top


desc = constructor.getOwnPropertyDescriptor
descs = constructor.getOwnPropertyDescriptors 

window.setTimeout ->
    v = ( o ) ->
        try
            for k of descs d = o.__proto__
                try delete d[k]

            for k of descs d = o.__proto__.__proto__
                try delete d[k]
            
            for k of descs d = o.__proto__.__proto__.__proto__
                try delete d[k]
                
            for k of descs d = o.__proto__.__proto__.__proto__.__proto__
                try delete d[k]

    for k of d = window.__proto__.__proto__.__proto__
        delete d[k]

    v []
    v window
    v {}

textDecoder = new TextDecoder("UTF-8")
wasm = new Object()

log wasm.memory = new WebAssembly.Memory
    initial: 100, maximum: 65535

log wasm.ref = new WebAssembly.Table
    initial: 100, element: "anyfunc"

wasm.console = ( offset, length ) ->
    bytes = new global.Uint8Array wasm.memory.buffer, offset, length
    string = textDecoder.decode bytes
    log string

view = new DataView wasm.memory.buffer


 



setTimeout ->
    log new Uint32Array view.buffer
    log new BigUint64Array view.buffer

export OFFSET_TIME = 0
export LENGTH_TIME = 8


export class Window

    __proto__   : null

    constructor : ( global ) ->
            
        @global = global

        proxy = new Proxy this, new (class Handler
            get : ->
                unless arguments[0][ arguments[1] ]
                    return ref[ keyref[ arguments[ 1 ] ] ]
                Reflect.get arguments[0], arguments[1]
        )

        delete Handler::constructor
        delete Handler::get.name
        delete Handler::get.length

        return proxy

    get : ( url = "dev://address/method" ) ->

        [ base, address, method ] = url.split /\:\/\/|\//g

        new Promise ( done ) =>
            return unless /127|::1/.test address
            switch base
                when "dev" #! real machine query
                    return done @[ method ]()
                when "mem" #? virtual machine query
                    return done @[ method ]( @core[ method ]() )

            throw [ base, address, method ]

    clear : ->
        object = @global ; i = 42
        for key, value of object
            continue unless Object.hasOwn object, key
            description = Object.getOwnPropertyDescriptor object, key

            continue unless description . configurable
            if  object[ key ]?
                keyref[ key ] = ++i
                ref[ i ] = object[ key ]
            delete object[ key ]

        descriptions = Object.getOwnPropertyDescriptors @global
        for key, description of descriptions
            continue unless description . configurable

            if  object[ key ]?
                keyref[ key ] = ++i
                ref[ i ] = object[ key ]

            delete object[ key ]

        delete @constructor
        return @global

    init : ->
        WebAssembly.instantiateStreaming(
            fetch( "./wasm/core.wasm" ), { wasm, self: {
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

            } }
        ).then( ({ instance: exports: core }) =>
            @core = core
        )


    time : ( value ) ->
        return Date.now() unless value?
        new Date( "#{value}" * 1 ).getTime()

    date : ( value ) -> new Date( value ? Date.now() )