(module
    (memory (import "imports" "memory") 1)
    (import "imports" "console" (func $console (param i32 i32)))
    (table (import "imports" "table") 10 funcref)






    (global $OFFSET_TIME    i32 (i32.const 0))
    (global $OFFSET_NOW     i32 (i32.const 4))
    (global $OFFSET_FRAME   i32 (i32.const 8))

    (global $OFFSET_X       i32 (i32.const 12))
    (global $OFFSET_Y       i32 (i32.const 16))    

    (global $TYPE_ONFRAME   i32 (i32.const 8))
    (global $ARG0           (mut i32) (i32.const 0))

 

    (func $updatetime (param $time f32)
        (f32.store (global.get $OFFSET_TIME) (local.get $time))
    )


    (func $onevent
        (param $time f32)
        (param $TYPE i32)

        (f32.store (global.get $OFFSET_NOW) (local.get $time))
        (i32.store (local.get $TYPE) (i32.add (i32.load (local.get $TYPE)) (i32.const 1)))

    )

    (func $onpointerevent
        (param $type i32)
        (param $time f32)
        (param $x f32)
        (param $y f32)
        
        (f32.store (global.get $OFFSET_X) (local.get $x))
        (f32.store (global.get $OFFSET_Y) (local.get $y))
        
        (call $onevent (local.get $time) (local.get $type))
    )


    (func $onanimationframe (param $time f32)
        (call $onevent (local.get $time) (global.get $TYPE_ONFRAME))
    )

    (export "onanimationframe" (func $onanimationframe))
    (export "onpointerevent" (func $onpointerevent))



    (data (i32.const 0) "Hi")
    (func $writeHi
        (call $console (i32.const 0) (global.get $ARG0))
    )

    (elem (i32.const 0)
        $writeHi
    )

    (func $call (export "call")
        (param $func i32)
        (param $arg0 i32)
        
        (global.set $ARG0 (local.get $arg0))
        (call_indirect (local.get $func))
    )

)