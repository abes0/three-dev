uniform sampler2D tDiffuse;
uniform float time;

varying vec2 vUv;

void main() {
  float kakeA = sin(time * 0.02) * 1000.0;
  float kakeB = cos(time * 0.01) * 1.0;

  vec2 zure1 = vec2(sin(vUv.x * kakeA + time * 0.1) * sin(vUv.x * kakeA + time * 0.1) * kakeB, 0.0);
  vec2 zure2 = vec2(cos(vUv.x * kakeA + time * 0.1) * cos(vUv.x * kakeA + time * 0.1) * kakeB, 0.0);
  vec2 zure3 = vec2(0.0, sin(vUv.x * kakeA + time * 0.1) * cos(vUv.x * kakeA + time * 0.1) * kakeB);

  vec4 dest = abs(texture2D(tDiffuse, vUv + zure1) - texture2D(tDiffuse, vUv + zure1 * -1.0));

  // dest.rg += sin(vUv.y * 12.0 + time * 0.1) * 0.1;
  // dest.rb += cos(vUv.x * 12.0 + time * 0.1) * 0.1;

  dest *= abs(texture2D(tDiffuse, vUv + zure3) - texture2D(tDiffuse, vUv + zure1 * -1.0));

  dest += texture2D(tDiffuse, vUv + zure2);
  dest -= texture2D(tDiffuse, vUv + zure1);
  dest.b *= texture2D(tDiffuse, vUv + zure3).r;

  dest.a = 1.0;
  float kakeC = 10000.0;
  dest.r += step(0.25, sin(vUv.y * 10.0 * kakeC + time * 0.01));
  dest.g += step(0.5, cos(vUv.y * 10.0 * kakeC + time * -0.02));
  dest.b += step(0.5, cos(vUv.y * 10.0 * kakeC + time * 0.01));

  // dest.rgb -= (1.0 - dest.rgb) * step(0.75, dest.r);

  dest.rgb = 1.0 - dest.rgb;
  // dest.rgb += pow(dest.r, 10.0);

  gl_FragColor = dest;
}