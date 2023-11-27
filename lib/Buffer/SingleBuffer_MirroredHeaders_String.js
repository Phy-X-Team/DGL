//* OneBuffer_MirrorHead_StringEncodedNumber
export var setNumber_asNUMBER = function(buffer, offset, number = 0) {
  var mods;
  while (mods = number % 0xff) {
    number -= mods;
    number /= 0xff;
    buffer[offset++] = mods;
  }
  buffer[offset++] = number;
  return offset;
};

export var setNumber_asSTRING = function(buffer, offset, number = 0) {
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

export var setNumber_asSTRING_ONECHAR = function(buffer, offset, number = 0) {
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

export var setNumber_asSTRING_ONECHAR_BIGINT = function(buffer, offset, number = 0) {
  var NSize, NText;
  NText = `${number}`;
  NSize = NText.length;
  if (1 === NSize) {
    buffer[offset++] = NText * 1; //bigint conv.
    return offset;
  }
  buffer[offset++] = 0xff;
  buffer[offset++] = NSize;
  while (NSize--) {
    buffer[offset++] = NText.charCodeAt(NSize);
  }
  return offset;
};
