export default class GL_CONSTANT extends Number

export GL = new Proxy WebGL2RenderingContext, get : ( gl ) ->
    console.log gl.VERTEX_SHADER