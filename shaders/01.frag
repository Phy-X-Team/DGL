// Fragment shader
// By: Dr. Wayne Brown, Spring 2016

precision mediump int;
precision mediump float;

varying vec4 v_Color;

void main() {
  gl_FragColor = v_Color;
}

