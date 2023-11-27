//* Number

// export buffer = Object.defineProperties {}, set :
//     set : -> buffer = arguments[0]

//export writer = Object.defineProperties {}, set :
//    set : -> writer = arguments[0]

// setNumber_asNUMBER
var c, code, j, len, ref;

export var CNat = function(buffer, offset, number = 0) {
  if (Number.isSafeInteger(number)) {
    return new Uint8Array(new Uint32Array([number]).buffer);
  }
  return Uint8Array.from(new Float32Array([number]).buffer);
};


// setNumber_toBUFFER_asNUMBER
export var CImp = function(buffer, offset, number = 0) {
  var NText, buf, code, i;
  NText = `${number}`;
  buf = new Uint8Array(NText.length);
  i = 0;
  while (code = NText.charCodeAt(i)) {
    buf[i++] = code;
  }
  return buf;
};


// setNumber_toBUFFER_asSTRING
export var M03 = function(buffer, offset, number = 0) {
  var NSize, NText;
  NText = `${number}`;
  NSize = NText.length;
  buffer[offset++] = 0xff;
  buffer[offset++] = NSize;
  while (NSize--) {
    buffer[offset++] = NText.charCodeAt(NSize);
  }
  return offset;
};


// setNumber_toBUFFER_asSTRING_ONECHAR
export var M04 = function(buffer, offset, number = 0) {
  var NSize, NText;
  NText = `${number}`;
  NSize = NText.length;
  if (1 === NSize) {
    buffer[offset++] = number;
    return offset;
  }
  buffer[offset++] = 0xff;
  buffer[offset++] = NSize;
  while (NSize--) {
    buffer[offset++] = NText.charCodeAt(NSize);
  }
  return offset;
};

code = {};

ref = ".-n0123456789".split("");
for (j = 0, len = ref.length; j < len; j++) {
  c = ref[j];
  code[c] = c.charCodeAt();
}

// setNumber_toBUFFER_asSTRING_ONECHAR_BIGINT
export var M05 = function(buffer, offset, number = 0) {
  var i, k, len1, ref1;
  ref1 = `${number}`.split("");
  for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
    c = ref1[i];
    buffer[offset + i] = code[c];
  }
  return offset;
};


// write with local dataview
export var Ui8 = function(writer, offset, number) {
  writer.setUint8(offset, number);
  return offset;
};

// write with local dataview
export var U32 = function(writer, offset, number) {
  writer.setUint32(offset, number);
  return offset;
};

// write with local dataview
export var BRR = function(buffer, offset, number) {
  buffer[offset] = number;
  return offset;
};

export var SET = function(bufferer, offset, number) {
  bufferer.set([number], offset);
  return offset;
};


// write with local dataview
export var I32 = function(writer, offset, number) {
  writer.setInt32(offset, number);
  return offset;
};

// write with local dataview
export var UM7 = function(writer, offset, number) {
  var mods;
  while (mods = number % 0xff) {
    number -= mods;
    number /= 0xff;
    writer.setUint8(offset++, mods);
  }
  writer.setUint8(offset++, number);
  return offset;
};

// write with local dataview
export var F32 = function(writer, offset, number) {
  writer.setFloat32(offset, number);
  return offset;
};
