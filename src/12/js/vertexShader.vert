// varying vec2 vUv;
// uniform vec2 u_uvPosition;
// uniform vec2 u_uvSize;
// uniform vec2 u_resolution;
// uniform vec2 u_imageResolution;

// THREE.ShaderMaterialで事前に定義されている
// ◆変数
// position, normal, uv
// 

attribute vec2 color;
varying vec2 vColor;
//varying vec2 vUv;

void main() {
  //vUv = uv;
  // vec2 ratio = vec2(
  //   min((u_resolution.x / u_resolution.y) / (u_imageResolution.x / u_imageResolution.y), 1.0),
  //   min((u_resolution.y / u_resolution.x) / (u_imageResolution.y / u_imageResolution.x), 1.0)
  // );
  // vUv = vec2(
  //   vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
  //   vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  // );
  // vUv.x /= u_uvSize.x;
  // vUv.y /= u_uvSize.y;
  // vUv.x += u_uvPosition.x - 0.075;
  // vUv.y += u_uvPosition.y - 0.1;
  vColor = color;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}