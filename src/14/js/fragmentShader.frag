// #ifdef GL_ES
// precision highp float;
// #endif

// varying vec2 vUv;
// uniform sampler2D u_texture;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
varying vec2 vColor;
//varying vec2 vUv;

const float PI = 3.1415926;

vec2 aspectCalc(vec2 res) {
    return (gl_FragCoord.xy * 2. - res) / min(res.x, res.y);
}

// 乱数生成器（その3）
float rnd(vec2 n){
    float a = 1.29898;
    float b = 7.8233;
    float c = 4375.85453;
    float dt= dot(n ,vec2(a, b));
    float sn= mod(dt, 3.14);
    // 整数部分を除いた小数点以下を抽出
    return fract(sin(sn) * c);
}

vec2 rndV2(vec2 n){
    return vec2(-1. + 2. * rnd(n));
}


vec2 polar(vec2 texCoord, float coefficient, float speed) {
    float s = (atan(texCoord.y, texCoord.x) + PI) / (PI * 2.);
    float t = length(texCoord * coefficient);
    return vec2(s, fract(t - time * speed));
}

vec2 polarReverse(vec2 texCoord, float coefficient, float speed) {
    float s = (atan(texCoord.y, texCoord.x) + PI) / (PI * 2.);
    float t = 1. - length(texCoord * coefficient);
    return vec2(s, fract(t - time * speed));
}

mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

mat2 scale(vec2 _scale) {
    return mat2(_scale.x, 0., 0., _scale.y);
}

// ブロックノイズ
// 4点間を補完して滑らかに
float noise(vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);
    float a = rnd(i);// 基準点
    float b = rnd(i + vec2(1., 0.)); // 左
    float c = rnd(i + vec2(0., 1.)); // 上
    float d = rnd(i + vec2(1., 1.)); // 右上

    vec2 u = f * f * (3. - 2. * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1. - u.x) + (d - b) * u.x * u.y;
}

float noiseF(float _time) {
    float i = floor(time);
    float f = fract(time);
    float u = f * f * (3. - 2. * f);
    return mix(rnd(vec2(i)), rnd(vec2(i + 1.)), u);
}

float noise2(vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);
    vec2 u = f * f * (3. - 2. * f);

    float a = rnd(i + vec2(0., 0.));
    float b = rnd(i + vec2(1., 0.));
    float c = rnd(i + vec2(0., 1.));
    float d = rnd(i + vec2(1., 1.));

    float e = mix(a, b, u.x);
    float g = mix(c, d, u.x);

    return mix(e, g, u.y);
}

// グラデーションノイズ
// vec2を返すランダム関数で
float noise3(vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);
    vec2 u = f * f * (3. - 2. * f);

    float a = dot(rndV2(i + vec2(0., 0.)), f - vec2(0., 0.));
    float b = dot(rndV2(i + vec2(1., 0.)), f - vec2(1., 0.));
    float c = dot(rndV2(i + vec2(0., 1.)), f - vec2(0., 1.));
    float d = dot(rndV2(i + vec2(1., 1.)), f - vec2(1., 1.));

    float e = mix(a, b, u.x);
    float g = mix(c, d, u.x);

    return mix(e, g, u.y);
}

float lines(vec2 pos, float b) {
    float scale = 10.;
    pos *= scale;
    return smoothstep(0.0, .5 + b * .5, abs((sin(pos.x * PI) + b * 2.)) * .5);
}

vec2 aspectCalcMouse(vec2 mouseCoord, vec2 res) {
    vec2 coord = mouseCoord * 2. - 1.;
    if(max(res.x, res.y) == res.x){
        coord.x *= max(res.x, res.y) / min(res.x, res.y);
    }else{
        coord.y *= max(res.x, res.y) / min(res.x, res.y);
    }
    return coord;
}

void main(){
    vec2 st = aspectCalc(resolution);
    vec2 mouseCoord = aspectCalcMouse(mouse, resolution);

    vec2 pos = noise3(st * 2.) + st;
    vec3 color = vec3(0.);
    color += vec3(1.) * smoothstep(.18, .2, noise3(pos + mouseCoord));
    color += smoothstep(.15, .2, noise3(pos * 10. + mouseCoord));
    color -= smoothstep(.35, .4, noise3(pos * 10. + mouseCoord));

    // 取り出した色に明るさ係数を乗算してから出力する
    gl_FragColor = vec4(1. - color, 1.);
}

