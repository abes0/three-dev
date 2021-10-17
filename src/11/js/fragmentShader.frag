uniform sampler2D tDiffuse;
uniform float time;

varying vec2 vUv;

void main() {
  vec2 zure = vec2(sin(vUv.y * 12.0 + time * 0.1) * 0.02, sin(vUv.x * 12.0 + time * 0.1) * 0.1);
  vec4 dest = texture2D(tDiffuse, vUv + zure);

  dest.rg += cos(vUv.y * 12.0 + time * 0.1) * 0.1;
  dest.rg += sin(vUv.x * 12.0 + time * 0.1) * 0.1;

  gl_FragColor = dest;
}