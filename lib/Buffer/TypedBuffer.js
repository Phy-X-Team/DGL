var buffer, i, iteration, numberCount, offsets, randoms, reset, results, test, time, writer;

import * as N from "./Number.js";

buffer = new Uint8Array(256);

writer = new DataView(buffer.buffer);

randoms = crypto.getRandomValues(new Uint32Array(10)).buffer;

results = {};

i = time = offsets = iteration = null;

numberCount = 8;

reset = function() {
  var e, t;
  i = iteration;
  t = performance.now();
  e = t - time;
  time = t;
  return e;
};

test = function(count, alternative, buffferer, numbers) {
  var avg, k, key, l, len, len1, obj, pcsnums, t;
  iteration = count;
  results = {
    [alternative]: [],
    BRR: [],
    SET: [],
    M05: []
  };
  
  //CNat : [], CImp : []
  offsets = [];
  pcsnums = function(j = 0) {
    var argc, fn, number, offset;
    if (!(number = numbers[j++])) {
      return;
    }
    offset = Math.floor(Math.random() * 12);
    offsets.push(offset);
    for (fn in results) {
      argc = (function() {
        switch (fn) {
          case alternative:
            return writer;
          case "SET":
          case "BRR":
            return buffferer;
          default:
            return buffer;
        }
      })();
      reset();
      while (i--) {
        N[fn](argc, offset, number);
      }
      results[fn].push(reset());
    }
    return pcsnums(j);
  };
  pcsnums();
  for (key in results) {
    obj = results[key];
    avg = 0;
    for (i = k = 0, len = obj.length; k < len; i = ++k) {
      t = obj[i];
      avg += t;
    }
    avg /= i;
    obj.avg = avg;
    for (i = l = 0, len1 = obj.length; l < len1; i = ++l) {
      t = obj[i];
      obj[i] = t.toFixed(3) * 1;
    }
    obj.avg = obj.avg.toFixed(3) * 1;
  }
  results.value = [...numbers];
  results.index = offsets;
  return results;
};

setTimeout(function() {
  var count;
  console.warn({
    now: Date.now()
  });
  console.error({
    numberCount: numberCount = 6,
    count: (count = 1e6).toExponential()
  });
  console.group("Int32");
  console.table(test(count, "I32", new Int32Array(buffer.buffer), new Int32Array(randoms).subarray(-numberCount)));
  console.groupEnd("Int32");
  console.group("Uint32");
  console.table(test(count, "U32", new Uint32Array(buffer.buffer), new Uint32Array(randoms).subarray(-numberCount)));
  console.groupEnd("Uint32");
  console.group("Float32");
  console.table(test(count, "F32", new Float32Array(buffer.buffer), new Float32Array(randoms).subarray(-numberCount)));
  console.groupEnd("Float32");
  return console.warn({
    now: Date.now()
  });
}, 1000);
