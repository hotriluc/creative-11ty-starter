precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;

void main () {
  vec2 st = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y ;

  gl_FragColor = vec4(uColor, 1.0);
}