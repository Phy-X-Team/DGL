// Vertex Shader
// By: Dr. Wayne Brown, Spring 2016

precision mediump int;
precision mediump float;

uniform   mat4 u_Transform;
uniform  float u_PointSize;

attribute vec3 a_Vertex;
attribute vec3 a_Color;

varying vec4 v_Color;

void main() {
  gl_Position = u_Transform * vec4(a_Vertex, 1.0);
  gl_PointSize = u_PointSize;
  v_Color = vec4(a_Color, 1.0);
}

