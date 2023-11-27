//!console.log console:console

//window.queryObjects = 
//window.getEventListeners = self
var constructor, d, desc, descs, k, keyref, ref, textDecoder, view, wasm;

export var console = window.console;

export var Proxy = window.Proxy;

export var Reflect = window.Reflect;

export var Date = window.Date;

export var BigInt = window.BigInt;

export var WebAssembly = window.WebAssembly;

export var fetch = window.fetch;

export var requestIdleCallback = window.requestIdleCallback;

export var requestAnimationFrame = window.requestAnimationFrame;

export var addEventListener = window.addEventListener;

export var setTimeout = window.setTimeout;

export var Uint32Array = window.Uint32Array;

export var BigUint64Array = window.BigUint64Array;

export var Promise = window.Promise;

export var Boolean = window.Boolean;

export var log = console.warn;

keyref = {
  log: 0
};

ref = [
  (function() {
    return log(...arguments);
  })
];

delete window.__proto__.__proto__.__proto__[Symbol.toStringTag];

delete window.__proto__.__proto__.__proto__.constructor;

delete window.__proto__.__proto__[Symbol.toStringTag];

delete window.__proto__[Symbol.toStringTag];

delete window.__proto__.constructor;

constructor = {}.constructor;

for (k in Object.getOwnPropertyDescriptors(d = Function.constructor.__proto__)) {
  window.setTimeout(function() {
    try {
      return delete d[k];
    } catch (error) {}
  });
}

delete Array.prototype[Symbol.unscopables];

delete Function.prototype.constructor;

delete Location.prototype.constructor;

delete Location.prototype[Symbol.toStringTag];

delete location.__proto__;

delete location.reload.length;

delete location.reload.name;

delete location.assign.length;

delete location.assign.name;

delete location.replace.length;

delete location.replace.name;

delete location.toString.length;

delete location.toString.name;

delete location.valueOf.length;

delete location.valueOf.name;

delete Function.prototype.name;

delete Function.prototype.caller;

delete Function.prototype.arguments;

delete Function.prototype.length;

Function.prototype.$ = Function.prototype.call;

Function.prototype.call = function() {
  return this.$(window, ...arguments);
};

delete Function.prototype.apply;

if (typeof chrome !== "undefined" && chrome !== null) {
  window.chrome = top;
}

desc = constructor.getOwnPropertyDescriptor;

descs = constructor.getOwnPropertyDescriptors;

window.setTimeout(function() {
  var v;
  v = function(o) {
    var results;
    try {
      for (k in descs(d = o.__proto__)) {
        try {
          delete d[k];
        } catch (error) {}
      }
      for (k in descs(d = o.__proto__.__proto__)) {
        try {
          delete d[k];
        } catch (error) {}
      }
      for (k in descs(d = o.__proto__.__proto__.__proto__)) {
        try {
          delete d[k];
        } catch (error) {}
      }
      results = [];
      for (k in descs(d = o.__proto__.__proto__.__proto__.__proto__)) {
        try {
          results.push(delete d[k]);
        } catch (error) {}
      }
      return results;
    } catch (error) {}
  };
  for (k in d = window.__proto__.__proto__.__proto__) {
    delete d[k];
  }
  v([]);
  v(window);
  return v({});
});

textDecoder = new TextDecoder("UTF-8");

wasm = new Object();

log(wasm.memory = new WebAssembly.Memory({
  initial: 100,
  maximum: 65535
}));

log(wasm.ref = new WebAssembly.Table({
  initial: 100,
  element: "anyfunc"
}));

wasm.console = function(offset, length) {
  var bytes, string;
  bytes = new global.Uint8Array(wasm.memory.buffer, offset, length);
  string = textDecoder.decode(bytes);
  return log(string);
};

view = new DataView(wasm.memory.buffer);

setTimeout(function() {
  log(new Uint32Array(view.buffer));
  return log(new BigUint64Array(view.buffer));
});

export var OFFSET_TIME = 0;

export var LENGTH_TIME = 8;

export var Window = (function() {
  class Window {
    constructor(global) {
      var Handler, proxy;
      this.global = global;
      proxy = new Proxy(this, new (Handler = class Handler {
        get() {
          if (!arguments[0][arguments[1]]) {
            return ref[keyref[arguments[1]]];
          }
          return Reflect.get(arguments[0], arguments[1]);
        }

      }));
      delete Handler.prototype.constructor;
      delete Handler.prototype.get.name;
      delete Handler.prototype.get.length;
      return proxy;
    }

    get(url = "dev://address/method") {
      var address, base, method;
      [base, address, method] = url.split(/\:\/\/|\//g);
      return new Promise((done) => {
        if (!/127|::1/.test(address)) {
          return;
        }
        switch (base) {
          case "dev": //! real machine query
            return done(this[method]());
          case "mem": //? virtual machine query
            return done(this[method](this.core[method]()));
        }
        throw [base, address, method];
      });
    }

    clear() {
      var description, descriptions, i, key, object, value;
      object = this.global;
      i = 42;
      for (key in object) {
        value = object[key];
        if (!Object.hasOwn(object, key)) {
          continue;
        }
        description = Object.getOwnPropertyDescriptor(object, key);
        if (!description.configurable) {
          continue;
        }
        if (object[key] != null) {
          keyref[key] = ++i;
          ref[i] = object[key];
        }
        delete object[key];
      }
      descriptions = Object.getOwnPropertyDescriptors(this.global);
      for (key in descriptions) {
        description = descriptions[key];
        if (!description.configurable) {
          continue;
        }
        if (object[key] != null) {
          keyref[key] = ++i;
          ref[i] = object[key];
        }
        delete object[key];
      }
      delete this.constructor;
      return this.global;
    }

    init() {
      return WebAssembly.instantiateStreaming(fetch("./wasm/core.wasm"), {
        wasm,
        self: {
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
        }
      }).then(({
          instance: {
            exports: core
          }
        }) => {
        return this.core = core;
      });
    }

    time(value) {
      if (value == null) {
        return Date.now();
      }
      return new Date(`${value}` * 1).getTime();
    }

    date(value) {
      return new Date(value != null ? value : Date.now());
    }

  };

  Window.prototype.__proto__ = null;

  return Window;

}).call(this);
