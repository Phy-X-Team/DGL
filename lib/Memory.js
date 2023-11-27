var BUFFER_FLOAT32, BUFFER_UINT16, BUFFER_UINT32, BUFFER_UINT8, DEVICE_MAXBYTELENGTH, DEVICE_MAXINDEXCOUNT, DEVICE_MEMORY_LENGTH, F32Data, HEADERS_LENGTH, HEADER_BYTELENGTH, HEADER_INDEX_BEGIN, HEADER_INDEX_END, HEADER_INDEX_LENGTH, HEADER_INDEX_POINTER, U16Data, U32Data, Ui8Data, ref;

import "./__proto__.js";

Object.prototype.toNumber = function() {
  return this.constructor.name.toNumber();
};

String.prototype.toNumber = function(sum = 0) {
  this.split("").map(function(char) {
    return sum += char.charCodeAt(0);
  });
  return sum;
};

DEVICE_MEMORY_LENGTH = (typeof self !== "undefined" && self !== null ? (ref = self.navigator) != null ? ref.deviceMemory : void 0 : void 0) || 1;

DEVICE_MAXBYTELENGTH = Math.imul(DEVICE_MEMORY_LENGTH, 1e6);

DEVICE_MAXINDEXCOUNT = DEVICE_MAXBYTELENGTH / 1e3;

HEADERS_LENGTH = 4;

BUFFER_UINT8 = 913;

BUFFER_UINT16 = 960;

BUFFER_UINT32 = 958;

BUFFER_FLOAT32 = 1012;

HEADER_INDEX_POINTER = 0;

HEADER_INDEX_BEGIN = 1;

HEADER_INDEX_END = 2;

HEADER_INDEX_LENGTH = 3;

HEADER_BYTELENGTH = 12;

Ui8Data = class Ui8Data extends Uint8Array {};

U16Data = class U16Data extends Uint16Array {};

U32Data = class U32Data extends Uint32Array {};

F32Data = class F32Data extends Float32Array {};

Object.defineProperties(Number.prototype, {
  add: {
    value: function(num) {
      return num + this * 1;
    }
  },
  offset: {
    value: function(stride = 0) {
      return (stride * 1) + (this * 1);
    }
  },
  begin: {
    value: function() {
      return 1 + this * 1;
    }
  },
  align: {
    value: function(num = 1) {
      var mod;
      if (!(mod = this % num)) {
        return this;
      }
      return this + num - mod;
    }
  },
  index: {
    value: function() {
      return this * 1;
    }
  },
  HEADER_INDEX_BEGIN: {
    value: function() {
      return this + HEADER_INDEX_BEGIN;
    }
  },
  HEADER_INDEX_END: {
    value: function() {
      return this + HEADER_INDEX_END;
    }
  },
  HEADER_INDEX_LENGTH: {
    value: function() {
      return this + HEADER_INDEX_LENGTH;
    }
  }
});

export var Memory = (function() {
  class Memory extends ArrayBuffer {
    constructor(maxByteLength = DEVICE_MAXBYTELENGTH) {
      var Headers, Pointer, memory;
      memory = super(4096 * 512, {maxByteLength});
      Object.defineProperties(this, {
        Ui8Data: {
          enumerate: false,
          wrieable: false,
          value: new Ui8Data(this, 4096)
        },
        U16Data: {
          enumerate: false,
          wrieable: false,
          value: new U16Data(this, 4096)
        },
        U32Data: {
          enumerate: false,
          wrieable: false,
          value: new U32Data(this, 4096)
        },
        F32Data: {
          enumerate: false,
          wrieable: false,
          value: new F32Data(this, 4096)
        },
        Pointer: {
          enumerate: false,
          configurable: false,
          value: Pointer = (function() {
            class Pointer extends Number {
              getMemory() {
                return memory;
              }

              getBuffer() {
                return memory.getBuffer(this);
              }

              getHeader() {
                return memory.getHeaders(this)[arguments[0]];
              }

              getHeaders() {
                return memory.getHeaders(this);
              }

              setHeader(hIndex, hValue) {
                memory.getHeaders(this)[hIndex] = hValue;
                return this;
              }

              setType(bufferType) {
                memory.getHeaders(this)[3] = bufferType;
                return this;
              }

              index() {
                var index;
                index = this;
                while (index - memory.headers[index]) {
                  index = memory.headers[index];
                }
                return index;
              }

              setIndex(pointer) {
                return memory.headers[this] = pointer;
              }

              getByteLength() {
                return memory.headers[this.index() + HEADER_INDEX_LENGTH];
              }

              setByteLength(byteLength) {
                var byteOffset, hIndex, pointer;
                hIndex = this.index() + HEADER_INDEX_LENGTH;
                if (byteLength === this.byteLength) {
                  return byteLength;
                } else {
                  memory.headers[hIndex] = byteLength;
                }
                byteLength && (byteLength = byteLength.align(12));
                pointer = memory.allocate(byteLength);
                if (!(byteOffset = this.byteOffset)) {
                  byteOffset = pointer.byteOffset;
                } else {
                  pointer.setIndex(this);
                }
                this.setByteBegin(byteOffset);
                this.setByteEnd(byteOffset + byteLength);
                this.setIndex(pointer.index());
                return this;
              }

              move(offset) {}

              copy(buffer, byteLength) {
                var begin, i;
                begin = this.getByteBegin();
                buffer = new Uint8Array(buffer);
                if (byteLength == null) {
                  byteLength = buffer.byteLength;
                }
                while (i = byteLength--) {
                  memory.Ui8Data[begin + i] = buffer[i];
                }
                return this;
              }

              set(buffer) {
                var begin, i, j, len, ref1, value;
                begin = this.getByteBegin();
                ref1 = new Uint8Array(buffer);
                for (i = j = 0, len = ref1.length; j < len; i = ++j) {
                  value = ref1[i];
                  memory.Ui8Data[begin + i] = value;
                }
                return this;
              }

              getByteBegin() {
                return memory.headers[this.index() + HEADER_INDEX_BEGIN];
              }

              setByteBegin(byteOffset) {
                var begin, end, index, length;
                [index, begin, end, length] = this.headers;
                if (begin && byteOffset !== begin) {
                  memory.Ui8Data.copyWithin(byteOffset, begin, end);
                }
                memory.headers[this.index() + HEADER_INDEX_BEGIN] = byteOffset;
                this.setByteEnd(byteOffset + length);
                return this;
              }

              getByteEnd() {
                return memory.headers[this.index() + HEADER_INDEX_END];
              }

              setByteEnd(byteOffset) {
                return memory.headers[this.index() + HEADER_INDEX_END] = byteOffset;
              }

            };

            Pointer.prototype.HEADERS_LENGTH = HEADERS_LENGTH;

            return Pointer;

          }).call(this)
        },
        Headers: {
          enumerate: false,
          configurable: false,
          value: Headers = class Headers extends Uint32Array {}
        }
      });
      Object.defineProperties(this, {
        pointers: {
          enumerate: false,
          wrieable: false,
          value: new U32Data(this, 0, 12)
        },
        headers: {
          enumerate: false,
          wrieable: false,
          value: new Headers(this, 48, 512)
        }
      });
      Object.defineProperties(Pointer.prototype, {
        buffer: {
          get: function() {
            return memory.Ui8Data.subarray(this.byteOffset, this.byteOffset + this.byteLength);
          },
          set: function() {
            return this.buffer.set(arguments[0]);
          }
        },
        dataU32: {
          get: function() {
            var begin, end;
            begin = this.byteOffset / 4 + 3;
            end = begin + this.byteLength / 4;
            return memory.U32Data.subarray(begin, end);
          },
          set: function() {
            return this.buffer.set(arguments[0]);
          }
        },
        headers: {
          get: function() {
            var begin;
            return memory.headers.subarray(begin = memory.headers[this.index()], begin + HEADERS_LENGTH);
          },
          set: function() {
            return this.headers.set(arguments[0]);
          }
        },
        byteOffset: {
          get: function() {
            return this.getByteBegin();
          },
          set: function() {
            return this.setByteBegin(arguments[0]);
          }
        },
        byteLength: {
          get: function() {
            return this.getByteLength();
          },
          set: function() {
            return this.setByteLength(arguments[0]);
          }
        }
      });
      Object.defineProperties(Headers.prototype, {
        bufferLength: {
          get: function() {
            return this[HEADER_INDEX_LENGTH];
          },
          set: function() {
            return this[HEADER_INDEX_LENGTH] = arguments[0];
          }
        },
        bufferBegin: {
          get: function() {
            return this[HEADER_INDEX_BEGIN];
          },
          set: function() {
            return this[HEADER_INDEX_BEGIN] = arguments[0];
          }
        },
        bufferType: {
          get: function() {
            return this[HEADER_INDEX_TYPE];
          },
          set: function() {
            return this[HEADER_INDEX_TYPE] = arguments[0];
          }
        },
        bufferEnd: {
          get: function() {
            return this[HEADER_INDEX_END];
          },
          set: function() {
            return this[HEADER_INDEX_END] = arguments[0];
          }
        }
      });
      this.pointers[0] = 12; //TODO inital index
      this.pointers[1] = 12; //TODO allocated
      this.pointers[2] = 4096; //TODO data offset
    }

    allocate(byteLength, TypedArray = Uint8Array) {
      var begin, end, length, pointer;
      length = byteLength && byteLength.align(12);
      begin = this.pointers[1].align(12);
      end = this.pointers[1] = (begin + length || 0).align(12);
      this.headers[pointer = this.pointers[0]] = this.pointers[0] += HEADERS_LENGTH;
      this.headers[pointer + HEADER_INDEX_POINTER] = pointer;
      this.headers[pointer + HEADER_INDEX_LENGTH] = length;
      this.headers[pointer + HEADER_INDEX_BEGIN] = begin;
      this.headers[pointer + HEADER_INDEX_END] = end;
      return new this.Pointer(pointer);
    }

    relocate(bufferSize, index) {
      var begin;
      if (!(begin = this.headers[index + 1])) {
        throw /UNDEFINED_BEGIN:/ + index;
      } else if (this.headers[index + 3] - bufferSize) {
        throw /UNMATCHED_LENGTH:/ + bufferSize;
      }
      return new this.Pointer(index);
    }

    merge(...pointers) {
      var $index, begin, end, headers, i, j, k, len, len1, length, target;
      length = 0;
      for (j = 0, len = pointers.length; j < len; j++) {
        i = pointers[j];
        length += this.getHeader(i, HEADEr(this.headers.at(i + 3)));
      }
      $index = this.allocate(length);
      target = this.headers.at($index + 1);
      for (k = 0, len1 = pointers.length; k < len1; k++) {
        i = pointers[k];
        [begin, end, length] = headers = this.getHeaders(i);
        this.Ui8Data.copyWithin(target, begin, end);
        headers[0] = target;
        headers[1] = target += length;
      }
      return $index;
    }

    add(pointer, buffer) {
      var $begin, $end, $index, $length, begin, end, length;
      [begin, end, length] = this.getHeaders(pointer);
      $index = this.grow(pointer, length + buffer.byteLength);
      [$begin, $end, $length] = this.getHeaders($index);
      $index.buffer.set(buffer, length);
      return $index;
    }

    gro2w(index, byteLength) {
      var $index, begin, end, length;
      length = this.headers[index.offset(HEADER_INDEX_LENGTH)];
      length = byteLength + length;
      $index = this.allocate(length);
      this.Ui8Data.copyWithin(this.headers[index.offset(HEADER_INDEX_LENGTH)], this.headers[index.offset(HEADER_INDEX_BEGIN)], this.headers[index.offset(HEADER_INDEX_END)]);
      [begin, end, length] = this.getHeaders($index);
      this.headers[index.offset(HEADER_INDEX_LENGTH)] = length;
      this.headers[index.offset(HEADER_INDEX_BEGIN)] = begin;
      this.headers[index.offset(HEADER_INDEX_END)] = end;
      this.headers[index] = this.headers[$index];
      return $index;
    }

    setUint32(pointer, index, value) {
      var offset;
      offset = this.headers[this.headers[pointer] + HEADER_INDEX_BEGIN];
      offset /= 4;
      offset += HEADERS_LENGTH;
      this.U32Data[offset + index] = value;
      return pointer;
    }

    getUint32(pointer, index) {
      var offset;
      offset = this.headers[this.headers[pointer] + HEADER_INDEX_BEGIN];
      offset /= 4;
      offset += HEADERS_LENGTH;
      return this.U32Data[offset + index];
    }

    getBuffer(pointer, TypedArray = Uint8Array, offset = 0, length) {
      var $length, begin, end;
      [begin, end, $length] = this.getHeaders(pointer);
      if (length == null) {
        length = $length;
      }
      begin += offset;
      end = begin + length;
      if (TypedArray === Uint8Array) {
        return this.Ui8Data.subarray(begin, end);
      }
      if (TypedArray === Float32Array) {
        return this.F32Data.subarray(begin / 4, end / 4);
      }
    }

    getHeaders(pointer) {
      return this.headers.subarray(pointer.offset(), this.headers[pointer]);
    }

    getLength(index) {
      var length, type;
      length = this.getHeader(2);
      type = this.getHeader(3);
      if (type === BUFFER_UINT8) {
        return length;
      }
      length /= 2;
      if (type === BUFFER_UINT16) {
        return length;
      }
      length /= 2;
      if (type === BUFFER_FLOAT32) {
        return length;
      }
      if (type === BUFFER_UINT32) {
        return length;
      }
      return length;
    }

    getHeader(index, hIndex) {
      return this.getHeaders(index)[hIndex];
    }

    setHeader(index, hIndex, hValue) {
      return this.getHeaders(index)[hIndex] = hValue;
    }

  };

  Memory.prototype.BUFFER_UINT8 = 913;

  Memory.prototype.BUFFER_UINT16 = 960;

  Memory.prototype.BUFFER_UINT32 = 958;

  Memory.prototype.BUFFER_FLOAT32 = 1012;

  return Memory;

}).call(this);

export default Memory;
