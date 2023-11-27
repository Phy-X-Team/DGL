var FUNC_CONSOLE_LOG, OFFSET, events, self, textDecoder, view, wasm;

textDecoder = new TextDecoder("UTF-8");

wasm = new Object();

console.warn(wasm.memory = new WebAssembly.Memory({
  initial: 100,
  maximum: 1000
}));

console.warn(wasm.ref = new WebAssembly.Table({
  initial: 100,
  element: "anyfunc"
}));

wasm.console = function(offset, length) {
  var bytes, string;
  bytes = new Uint8Array(wasm.memory.buffer, offset, length);
  string = textDecoder.decode(bytes);
  return console.log(string);
};

view = new DataView(wasm.memory.buffer);

OFFSET = {
  pointermove: 24,
  pointerdown: 28,
  onpointerup: 28,
  onpointercancel: 32,
  onpointerenter: 36,
  onpointerleave: 40,
  onclick: 52,
  ondblclick: 56,
  onwheel: 60
};

FUNC_CONSOLE_LOG = 0;

events = ["pointermove", "pointerdown"];

self = {
  requestIdleCallback: function(i) {
    console.warn("requestIdleCallback", {
      ref: i
    });
    return console.warn(wasm.ref.get(i)());
  },
  //requestIdleCallback()
  requestAnimationFrame: function(i) {
    window.onFrame();
    return global.requestAnimationFrame(function($now) {
      return wasm.ref.get(i)($now);
    });
  },
  addEventListener: function(i, j) {
    var func;
    func = wasm.ref.get(i);
    return window.addEventListener(events[j], function(e) {
      return func(e.time, e.x, e.y);
    });
  }
};

Promise.all([WebAssembly.instantiateStreaming(global.fetch("wasm/core.wasm"), {wasm, self}), WebAssembly.instantiateStreaming(global.fetch("wasm/graphics.wasm"), {wasm, self})]).then(function(results) {
  var core, graphics;
  [
    {
      instance: {
        exports: core
      }
    },
    {
      instance: {
        exports: graphics
      }
    }
  ] = results;
  return core.boot(BigInt(Date.now()), global.performance.now());
});

//do  draw = -> requestAnimationFrame ( time ) ->
//    core.onanimationframe time ; draw()
