(module
    (memory (import "wasm" "memory") 1)
    (import "wasm" "console" (func $console (param i32 i32)))
    (table (import "wasm" "ref") 10 funcref)


    (import "self" "requestIdleCallback" (func $requestIdleCallback (param i32)))
    (import "self" "requestAnimationFrame" (func $requestAnimationFrame (param i32)))
    (import "self" "addEventListener" (func $addEventListener (param i32 i32)))

    (global $OFFSET_CLEARCOLOR              (mut i32) (i32.const 0))
    (global $FINISH_CLEARCOLOR              (mut i32) (i32.const 0))
    (global $LENGTH_CLEARCOLOR              (mut i32) (i32.const 12))

    (global $OFFSET_CLEARCOLOR_RED          (mut i32) (i32.const 0))
    (global $LENGTH_CLEARCOLOR_RED          (mut i32) (i32.const 4))

    (global $OFFSET_CLEARCOLOR_GREEN        (mut i32) (i32.const 0))
    (global $LENGTH_CLEARCOLOR_GREEN        (mut i32) (i32.const 4))

    (global $OFFSET_CLEARCOLOR_BLUE         (mut i32) (i32.const 0))
    (global $LENGTH_CLEARCOLOR_BLUE         (mut i32) (i32.const 4))

    (global $OFFSET_CLEARCOLOR_ALPHA        (mut i32) (i32.const 0))
    (global $LENGTH_CLEARCOLOR_ALPHA        (mut i32) (i32.const 4))

    (global $ARG0                       (mut i32) (i32.const 0))
    (global $OFFSET_TIME                (mut i32) (i32.const 0))

    (global $OFFSET_NOW                 i32 (i32.const 8))
    (global $OFFSET_FRAME               i32 (i32.const 12))
    (global $OFFSET_X                   i32 (i32.const 16))
    (global $OFFSET_Y                   i32 (i32.const 20))    
    
    (global $OFFSET                     i32 (i32.const 48))


    (global $REF_RENDER             i32 (i32.const 0))
    (global $EVENTID_ONPOINTERMOVE      i32 (i32.const 0))
    (global $REF_ONPOINTERMOVE      i32 (i32.const 1))
    (global $EVENTID_ONPOINTERDOWN      i32 (i32.const 1))
    (global $REF_ONPOINTERDOWN      i32 (i32.const 2))
 



    (func $writeHi
        (call $console (i32.const 0) (i32.const 2))
    )


    (func $onpointerevent
        (param $now f32)
        (param $x f32)
        (param $y f32)

        (call $setNow (local.get $now))
        (call $setX (local.get $x))
        (call $setY (local.get $y))
    )

    (func $render
        (param $now f32)
        
        (call $setNow (local.get $now))
        (call $setFrame (i32.add (i32.const 1) (call $frame)))
        (call $requestAnimationFrame (global.get $REF_RENDER))
    )


    (func $setTimeOffset (export "setTimeOffset")
        (param $offset i32)
        (result i32)
        
        (global.set $OFFSET_TIME (local.get $offset))
        (local.get $offset)
    )


    (func $setBigUint64 (export "setBigUint64")
        (param $offset i32)
        (param $value i64)
        (result i64)
        
        (i64.store (local.get $offset) (local.get $value))
        (local.get $value)
    )
    

    (func $getBigUint64 (export "getBigUint64")
        (param $offset i32)
        (result i64)
        
        (i64.load (local.get $offset))
    )
    
    (func $setTime (param $time i64) (i64.store (global.get $OFFSET_TIME) (local.get $time)))
    (func $time (export "time") (result i64) (i64.load (global.get $OFFSET_TIME)))

    (func $setX (param $x f32) (f32.store (global.get $OFFSET_X) (local.get $x)))
    (func $x (result f32) (f32.load (global.get $OFFSET_X)))

    (func $setY (param $y f32) (f32.store (global.get $OFFSET_Y) (local.get $y)))
    (func $y (result f32) (f32.load (global.get $OFFSET_Y)))

    (func $setNow (param $now f32) (f32.store (global.get $OFFSET_NOW) (local.get $now)))
    (func $now (result f32) (f32.load (global.get $OFFSET_NOW)))

    (func $setFrame (param $frame i32) (i32.store (global.get $OFFSET_FRAME) (local.get $frame)))
    (func $frame (result i32) (i32.load (global.get $OFFSET_FRAME)))



    (func $alloc (export "alloc")
        (param $byteLength i32)
        (result i32) 
        
        (local $offset i32)
        (local.set $offset (i32.load (global.get $OFFSET)))
        (i32.store (global.get $OFFSET) (i32.add (local.get $byteLength) (local.get $offset)))

        (local.get $offset)
    )

    (func $boot (export "boot")
        (param $time i64)
        (param $now f32)

        (call $setTime (local.get $time))
        (call $setNow (local.get $now))


        (call $addEventListener
            (global.get $REF_ONPOINTERMOVE)
            (global.get $EVENTID_ONPOINTERMOVE))
        
        (call $addEventListener
            (global.get $REF_ONPOINTERDOWN)
            (global.get $EVENTID_ONPOINTERDOWN))

        (call $render (local.get $now))
    )

    (func $onpointermove
        (param $now f32)
        (param $x f32)
        (param $y f32)

        (call $setNow (local.get $now))
        (call $setX (local.get $x))
        (call $setY (local.get $y))
    )

    (func $onpointerdown
        (param $now f32)
        (param $x f32)
        (param $y f32)

        (call $setNow (local.get $now))
        (call $setX (local.get $x))
        (call $setY (local.get $y))
    )

    (elem (i32.const 0)
        $render
        $time
        $onpointermove
        $onpointerdown
        $writeHi
    )

    (func $call (export "call")
        (param $func i32)
        (param $arg0 i32)
        
        (global.set $ARG0 (local.get $arg0))
        (call_indirect (local.get $func))
    )

)