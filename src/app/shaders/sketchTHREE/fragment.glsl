uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

void main () {
  vec2 st = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y ;

  gl_FragColor = vec4(vec3(st, 1.0), 1.0);
}