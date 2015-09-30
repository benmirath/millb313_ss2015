#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_resolution;

// vec3 colorA = vec3(0.149,0.141,0.912);
// vec3 colorB = vec3(1.000,0.833,0.224);

vec3 colorB = vec3(0.149,0.141,0.912);
vec3 colorA = vec3(1.000,0.433,0.224);

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) - 
          smoothstep( pct, pct+0.01, st.y);
}


//static approach
// void main() {
//     vec2 st = gl_FragCoord.xy/u_resolution.xy;
//     vec3 color = vec3(0.0);

//     vec3 pct = vec3(st.x);
//     pct.r = sin(st.x*PI);

//     pct.r += sin(u_time);
//     pct.r = min (1.0, pct.r);    
    
//     pct.b = sin(st.x*PI) / 0.5;
// 	// pct.b = sin(st.x*PI);

//     pct.g = 0.2;
//     pct.g = min (0.2, sin (u_time));
//     color = mix(colorA, colorB, pct);

//     // Plot transition lines for each channel
//     color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
//     color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
//     color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

//     gl_FragColor = vec4(color,1.0);
// }

float impulse( float k, float x ) {
    float h = k*x;
    return h*exp(1.0-h);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    st -= 0.5;
    // st.y += 0.5;

    float timeline = u_time * 0.25; //slow it down a bit
    float timeLineSine = abs(sin(timeline));
    st.y += timeLineSine * 0.55;    //rise/set motion

    // float r = length(st) * (timeLineSine * 0.75);
    // float r = length(st) * (impulse (timeLineSine * 0.75, st.x));
    float r = length(st) * (impulse (10.0, timeLineSine * 0.2));



    float a = atan (st.y, st.x) / 3.1415;
    a = a * 0.5 + 0.5; 
    st = vec2(a,r);



    color = mix(colorA, colorB, r * 2.0);
    // Plot transition lines for each channel
    gl_FragColor = vec4(color,1.0);
}








