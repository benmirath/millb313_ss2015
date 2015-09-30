#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_resolution;




vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.433,0.224);

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) - 
          smoothstep( pct, pct+0.01, st.y);
}


    
//approach 1
// void main() {
//     vec2 st = gl_FragCoord.xy/u_resolution.xy;
//     vec3 color = vec3(0.0);

//     vec3 pct = vec3(st.x);
//     pct.r = sin(st.x*PI);
//     pct.b = sin(st.x*PI) / 0.5;

//     pct.g = 0.2;
// 	color = mix(colorA, colorB, pct);

//     // Plot transition lines for each channel
//     color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
//     color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
//     color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

//     gl_FragColor = vec4(color,1.0);
// }

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    st -= 0.5;

    float r = length(st);
    float a = atan (st.y, st.x) / 3.1415;
    a = a * 0.5 + 0.5; 
    st = vec2(a,r);

    color = mix(colorB, colorA, r * 2.0);
    // Plot transition lines for each channel
    color = mix(color,vec3(1.0,0.0,0.0),plot(st,color.r));
    color = mix(color,vec3(0.0,1.0,0.0),plot(st,color.g));
    color = mix(color,vec3(0.0,0.0,1.0),plot(st,color.b));

    gl_FragColor = vec4(color,1.0);
}