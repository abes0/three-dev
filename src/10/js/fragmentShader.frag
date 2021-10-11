#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform sampler2D u_texture;

void main() {
  vec4 _texture = texture2D(u_texture, vUv);
  gl_FragColor = _texture;
}

