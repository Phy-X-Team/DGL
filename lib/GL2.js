var BYTE_LENGTH, HEADERS_LENGTH, HEADER_BYTELENGTH, HEADER_INDEX_END, HEADER_INDEX_LENGTH, decoder, encoder;

encoder = new TextEncoder();

decoder = new TextDecoder();

export var VECTOR3 = 518;

export var CONTEXT = 549;

export var PROGRAM = 536;

BYTE_LENGTH = "BYTE_LENGTH";

HEADER_BYTELENGTH = 12;

HEADERS_LENGTH = 3;

HEADER_INDEX_END = 2;

HEADER_INDEX_LENGTH = 3;

export var SHADER_SOURCE = 999;

export var SHADER_STATUS = 1018;

export var GL2 = class GL2 {
  constructor(memory) {
    var Bool, Float32Object, Headers, Pointer, ShaderSource, ShaderStatus, Text, Uint32Object, Uint8Object, WebGL2, WebGL2Context, WebGL2FragmentShader, WebGL2Object, WebGL2Program, WebGL2Shader, WebGL2Vector, WebGL2VertexShader;
    if (!memory) {
      return;
    }
    Headers = class Headers extends Uint32Array {};
    Pointer = class Pointer extends Number {};
    WebGL2Object = (function() {
      class WebGL2Object extends Number {
        encode() {
          return encoder.encode(arguments[0]);
        }

        decode() {
          return decoder.decode(arguments[0].slice());
        }

        constructor(prototype, pointer) {
          var headers;
          super(pointer != null ? pointer : pointer = memory.allocate(HEADER_BYTELENGTH, prototype.bufferType));
          headers = this.getHeaders();
          headers[0] = pointer.index();
          headers[1] = this.byteLength();
          headers[2] = this.OBJECT_TYPE;
        }

        //OBJECT_TYPE : prototype.objectType
        //@objectSize = byteLength - prototype.headerSize
        static property(type) {
          return this.prototype.properties[type];
        }

        static lengthOf(property) {
          var prototype;
          prototype = Object.getPrototypeOf(this);
          if (!Object.hasOwn(this, property)) {
            if (Number !== this) {
              return this[property] || 0;
            }
            return prototype[property];
          }
          return prototype[property] + this[property];
        }

        static register(type, constructor) {
          return this.prototype.properties[type] = constructor;
        }

        static define(property, constructor) {
          Object.defineProperty(this.prototype, property, {
            get: function() {
              var index;
              return console.warn("getting property object", index = this.findPointer(constructor.prototype.OBJECT_TYPE));
            },
            set: function() {
              var index, object, offset, pointer;
              console.error("SETting property object");
              if (!(index = this.findPointer(constructor.prototype.OBJECT_TYPE))) {
                object = new constructor();
                console.warn("property not found at index creted:", object);
                pointer = object.getPointer();
                offset = this.resize(this.byteLength() + 8);
                index = this.byteLength() / 8;
                console.warn("pointer.index()", pointer.index(), {
                  offset: offset,
                  index: index
                });
                this.setUint32(index + 1, constructor.prototype.OBJECT_TYPE);
                this.setUint32(index + 2, pointer.index());
                object.value = arguments[0];
                console.log({object, offset, pointer});
                return console.log("pointerheaders:", Array.from(pointer.headers));
              } else {
                //TODO move children pointers AFTER RESIZE
                //TODO move children pointers AFTER RESIZE
                //TODO move children pointers AFTER RESIZE
                //TODO move children pointers AFTER RESIZE
                return console.error("property found at index", index);
              }
            }
          });
          Object.defineProperty(constructor.prototype, "value", {
            get: function() {
              console.error("getting property VALUE", this);
              return this.get();
            },
            set: function() {
              console.error("setting property VALUE");
              return this.set(arguments[0]);
            }
          });
          return this.register(constructor.prototype.OBJECT_TYPE, constructor);
        }

        static defineProperties(properties = {}) {
          var constructor, property;
          for (property in properties) {
            constructor = properties[property];
            this.define(property, constructor);
          }
          return this;
        }

        setUint32(index = 0, value) {
          index += memory.headers[this.HEADER_INDEX_BEGIN()] / 4;
          index += HEADERS_LENGTH;
          memory.U32Data[index] = value;
          return this;
        }

        getUint32(index = 0) {
          index += memory.headers[this.HEADER_INDEX_BEGIN()] / 4;
          index += HEADERS_LENGTH;
          return memory.U32Data[index];
        }

        setUint32(index = 0, value) {
          return memory.setUint32(this, index, value);
        }

        getUint32(index = 0) {
          return memory.getUint32(this, index);
        }

        children() {}

        findPointer(OBJECT_TYPE, offset = 0) {
          var child;
          offset += HEADER_BYTELENGTH;
          child = this.getHeaders(offset);
          console.warn(this.getBuffer(Uint32Array));
          //console.error @getHeaders( offset )
          //console.error length = memory.headers.at( child[0] + 3 )
          //console.error offset,child[0], @getHeaders( offset + length + HEADER_BYTELENGTH )
          return false;
        }

        resize(byteLength) {
          var byteOffset, headers, pointer;
          headers = this.getHeaders();
          pointer = this.getPointer();
          byteOffset = headers[1];
          byteLength += HEADER_BYTELENGTH; //TODO self header realloc
          pointer.byteLength = byteLength;
          headers[0] = pointer.index();
          headers[1] = byteLength;
          return byteOffset;
        }

      };

      WebGL2Object.byteLength = 0;

      WebGL2Object.headerSize = 12;

      WebGL2Object.prototype.properties = new Object;

      WebGL2Object.prototype.HEADERS_LENGTH = HEADERS_LENGTH;

      return WebGL2Object;

    }).call(this);
    Uint8Object = (function() {
      class Uint8Object extends WebGL2Object {};

      Uint8Object.prototype.bufferType = Uint8Array;

      Uint8Object.prototype.BYTES_PER_ELEMENT = Uint8Array.BYTES_PER_ELEMENT;

      return Uint8Object;

    }).call(this);
    Uint32Object = (function() {
      class Uint32Object extends WebGL2Object {};

      Uint32Object.prototype.bufferType = Uint32Array;

      Uint32Object.prototype.BYTES_PER_ELEMENT = Uint32Array.BYTES_PER_ELEMENT;

      return Uint32Object;

    }).call(this);
    Float32Object = (function() {
      class Float32Object extends WebGL2Object {};

      Float32Object.prototype.bufferType = Float32Array;

      Float32Object.prototype.BYTES_PER_ELEMENT = Float32Array.BYTES_PER_ELEMENT;

      return Float32Object;

    }).call(this);
    Object.defineProperties(WebGL2Object, {
      BYTES_PER_ELEMENT: {
        get: function() {
          return Object.getPrototypeOf(this).BYTES_PER_ELEMENT;
        }
      }
    });
    Object.defineProperties(WebGL2Object.prototype, {
      getBuffer: {
        value: function(TypedArray = this.bufferType, length, offset) {
          var finish;
          if (offset == null) {
            offset = this.getPointer().byteOffset + HEADER_BYTELENGTH;
          }
          offset /= TypedArray.BYTES_PER_ELEMENT;
          if (length == null) {
            length = this.getPointer().byteLength - HEADER_BYTELENGTH;
          }
          length /= TypedArray.BYTES_PER_ELEMENT;
          finish = offset + length;
          switch (TypedArray) {
            case Uint32Array:
              return memory.U32Data.subarray(offset, finish);
            case Float32Array:
              return memory.F32Data.subarray(offset, finish);
            default:
              return memory.Ui8Data.subarray(offset, finish);
          }
        }
      },
      byteLength: {
        value: function() {
          return this.getPointer().getByteLength() - HEADER_BYTELENGTH;
        }
      },
      getPointer: {
        value: function() {
          return new memory.Pointer(this * 1);
        }
      },
      getHeaders: {
        value: function(offset = 0) {
          var begin, end;
          begin = this.getPointer().byteOffset;
          if (offset) {
            begin = begin + offset;
          }
          end = begin + HEADER_BYTELENGTH;
          return memory.U32Data.subarray(begin / 4, end / 4);
        }
      }
    });
    WebGL2Vector = (function() {
      class WebGL2Vector extends Float32Object {
        constructor(options = {}, prototype = WebGL2Vector) {
          super(prototype);
        }

      };

      WebGL2Vector.prototype.OBJECT_TYPE = VECTOR3;

      return WebGL2Vector;

    }).call(this);
    WebGL2Context = (function() {
      class WebGL2Context extends Uint8Object {
        constructor(options = {}, prototype = WebGL2Context) {
          super(prototype);
        }

      };

      WebGL2Context.prototype.OBJECT_TYPE = CONTEXT;

      return WebGL2Context;

    }).call(this);
    WebGL2Program = (function() {
      class WebGL2Program extends Uint8Object {
        constructor(options = {}, prototype = WebGL2Program) {
          super(prototype);
        }

      };

      WebGL2Program.prototype.OBJECT_TYPE = PROGRAM;

      return WebGL2Program;

    }).call(this);
    Text = class Text extends Uint8Object {
      constructor(text, prototype = Text) {
        var buffer, pointer;
        buffer = prototype.prototype.encode(text);
        pointer = memory.allocate(buffer.byteLength);
        super(prototype, pointer).set(buffer);
      }

      encode(string) {
        return encoder.encode(string);
      }

      decode(buffer) {
        return decoder.decode(buffer.slice());
      }

    };
    Bool = class Bool extends Uint8Object {
      constructor(bool, prototype = Bool) {
        super(prototype, memory.allocate(4)).set(bool);
      }

    };
    ShaderStatus = (function() {
      class ShaderStatus extends Bool {
        constructor(status, prototype = ShaderSource) {
          super(status, prototype);
        }

        get() {
          console.error("property primitive value requested:", Boolean(this.getUint32(0)));
          return Boolean(this.getUint32(0));
        }

        set() {
          console.error("property primitive value SET", arguments[0]);
          return this.setUint32(0, arguments[0]);
        }

      };

      ShaderStatus.prototype.OBJECT_TYPE = SHADER_STATUS;

      return ShaderStatus;

    }).call(this);
    ShaderSource = (function() {
      class ShaderSource extends Text {
        constructor(source, prototype = ShaderSource) {
          super(source, prototype);
        }

        get() {
          return this.decode(this.getBuffer());
        }

        set(source) {
          if (source == null) {
            source = new Uint8Array(0);
          } else if ("string" === typeof source) {
            source = this.encode(source);
          } else if (source instanceof Uint8Array) {
            source = source;
          } else if (source instanceof memory.Pointer) {
            source = memory.getBuffer(source);
          }
          this.resize(source.byteLength.align(12));
          return this.getBuffer().set(source);
        }

      };

      ShaderSource.prototype.OBJECT_TYPE = SHADER_SOURCE;

      return ShaderSource;

    }).call(this);
    WebGL2Shader = (function() {
      class WebGL2Shader extends Uint8Object {
        constructor(options = {}, prototype = WebGL2Shader) {
          super(prototype).setOptions(options);
          this.status = true;
        }

        setOptions(options) {
          var property, value;
          for (property in options) {
            value = options[property];
            this[property] = value;
          }
          return this;
        }

      };

      WebGL2Shader.defineProperties({
        source: ShaderSource,
        status: ShaderStatus
      });

      return WebGL2Shader;

    }).call(this);
    WebGL2VertexShader = (function() {
      class WebGL2VertexShader extends WebGL2Shader {
        constructor(source, prototype = WebGL2VertexShader) {
          super({source}, prototype);
        }

      };

      WebGL2VertexShader.prototype.OBJECT_TYPE = WebGL2RenderingContext.VERTEX_SHADER;

      return WebGL2VertexShader;

    }).call(this);
    WebGL2FragmentShader = class WebGL2FragmentShader extends WebGL2Shader {
      constructor(source, prototype = WebGL2FragmentShader) {
        super({source}, prototype);
      }

    };
    WebGL2 = (function() {
      class WebGL2 extends WebGL2Object {};

      WebGL2.prototype.Context = WebGL2Context;

      WebGL2.prototype.Program = WebGL2Program;

      WebGL2.prototype.VertexShader = WebGL2VertexShader;

      WebGL2.prototype.FragmentShader = WebGL2FragmentShader;

      WebGL2.prototype.Vector = WebGL2Vector;

      return WebGL2;

    }).call(this);
    return new WebGL2(WebGL2);
  }

};

export default GL2;
