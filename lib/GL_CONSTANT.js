var GL_CONSTANT;

export default GL_CONSTANT = class GL_CONSTANT extends Number {};

export var GL = new Proxy(WebGL2RenderingContext, {
  get: function(gl) {
    return console.log(gl.VERTEX_SHADER);
  }
});
