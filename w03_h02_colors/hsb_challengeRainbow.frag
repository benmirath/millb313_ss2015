#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_resolution;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) - 
          smoothstep( pct, pct+0.01, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.x);



    // int st.x / 7.0;
    float val = st.x / 0.144;

    vec3 colA = vec3 (1.0,0.0,0.0);
    vec3 colB = vec3 (1.0,0.5,0.0);
    vec3 colC = vec3 (1.0,1.0,0.0);
    vec3 colD = vec3 (0.0,1.0,0.0);
    vec3 colE = vec3 (0.0,0.0,1.0);
    vec3 colF = vec3 (0.25,0.0,0.5);
    vec3 colG = vec3 (0.5,0.0,1.0);

    color = mix (colA, colB, st.x);
    color += mix (colB, colC, st.x);
    color += mix (colC, colD, st.x);
    color += mix (colD, colE, st.x);
    color += mix (colE, colF, st.x);
    color += mix (colF, colG, st.x);


    // if (val <= 1.0) {
    //     color = vec3 (1.0,0.0,0.0);
    // } else if (val <= 2.0) {
    //     color = vec3 (1.0,0.5,0.0);
    // } else if (val <= 3.0) {
    //     color = vec3 (1.0,1.0,0.0);
    // } else if (val <= 4.0) {
    //     color = vec3 (0.0,1.0,0.0);
    // } else if (val <= 5.0) {
    //     color = vec3 (0.0,0.0,1.0);
    // } else if (val <= 6.0) {
    //     color = vec3 (0.25,0.0,0.5);
    // } else {
    //     color = vec3 (0.5,0.0,1.0);
    // }

    gl_FragColor = vec4(color,1.0);
}