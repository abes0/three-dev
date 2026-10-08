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

float noise(vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);
    float a = rnd(i);
    float b = rnd(i + vec2(1., 0.));
    float c = rnd(i + vec2(0., 1.));
    float d = rnd(i + vec2(1., 1.));

    vec2 u = f * f * (3. - 2. * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1. - u.x) + (d - b) * u.x * u.y;
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

void main(){
    vec2 coord = aspectCalc(resolution);
    vec2 mouseCoord = (mouse * 2. -1.);
    if(max(resolution.x, resolution.y) == resolution.x){
        mouseCoord.x *= max(resolution.x, resolution.y) / min(resolution.x, resolution.y);
    }else{
        mouseCoord.y *= max(resolution.x, resolution.y) / min(resolution.x, resolution.y);
    }
    vec2 p = coord;

    float circle = .05 / abs(1.1 - length(p));
    float white = 0.3 / length(coord - mouseCoord);

    circle /= noise(vec2(p.x - time, p.y));
    vec4 color = vec4(vec3(circle - .1, circle - .4, circle - .6), 1.) + vec4(vec3(white), 1.);

    //color = vec4(vec3(white), 1.);
    //color = vec4(coord, 0., 1.);
    //color = vec4(coord, 0., 1.);

    // 取り出した色に明るさ係数を乗算してから出力する
    gl_FragColor = color;
}

