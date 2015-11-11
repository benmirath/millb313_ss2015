// Author: @diaBEETS (ben miller) - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float random (float _x) {
	return fract(sin(_x)*10e5);
}
float random (in vec2 _st) { 
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise (float _x) {
    float i = floor(_x);  // integer
	float f = fract(_x);  // fraction

	// float y = random(i); //rand() is described in the previous chapter
	// y = mix(random(i), random(i + 1.0), f);
	float y = mix(random(i), random(i + 1.0), smoothstep(0.,1.,f));
	return y;
}
float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st); //1e-4 == 0.00004;
    uv *= smoothstep(_size,_size+vec2(1e-4), vec2(1.0) - _st);
    return uv.x * uv.y;
}

// float noise (in vec2 _st) {
    
// }

// void main () {
// 	vec2 st = gl_FragCoord.xy/u_resolution.xy;
//     // vec3 color =  hsb2rgb (vec3 (noise (u_time), noise (u_time), 1.));
//     st *= 10.;
//     vec2 i_st = floor (st);
//     vec2 f_st = fract (st);
//     // vec3 color = vec3 (f_st, random (st.y));
//     float time = floor (u_time * 8.);
//     vec3 color = vec3 (random (floor(time * 0.5) + i_st.x));

//     gl_FragColor = vec4 (color, 1.0);
// }

// float random (vec2 xy) {

// }

void main () {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // vec3 color =  hsb2rgb (vec3 (noise (u_time), noise (u_time), 1.));
    st -= .5;
    st *= 50.;



    // float time = u_time * 0.25;

    
    vec2 i_st = floor (st);
    // vec2 f_st = fract (st);
    // // vec3 color = vec3 (f_st, random (st.y));
    float time = floor (u_time * 05.);
    // float time2 = random (u_time * 0.5);
    // float time3 = floor (u_time * 0.5);

    // st.y *= smoothstep (0., random (u_time), random (-u_time));
    // vec3 color = vec3 (random (floor(time * 0.5) + i_st.x));
    float lastY = 10.;
    // lastY += random (st.x + time) * 30.;
    // lastY += random (i_st.x + time) * 30.;
    lastY += random (i_st.x) * 30.;
    // lastY *= abs (sin (u_time * random (i_st.x)) * random (i_st.x));
    lastY *= abs (sin (u_time * random (i_st.x)) * random (st.x));
    // lastY *= 5.;
    
    float pct = box (st, vec2 (50., 1. + lastY));

    gl_FragColor = vec4 (vec3 (pct), 1.0);
}

//ordered
void main2 (){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= vec2 (30., 2.);
    vec2 i_st = floor (st);
    vec2 f_st = fract (st);

    float time = floor (u_time * 8.);
    float pct = random (time + i_st.x);

    if (i_st.y == 1.) {
        f_st.y = 1.-f_st.y;
    }

    vec3 color = vec3 (step (pct, f_st.y) - step (.7,f_st.x));

    gl_FragColor = vec4 (color, 1.0);

}

void main3 () {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= vec2 (20.);
    vec2 i_st = floor (st);
    vec2 f_st = fract (st);


    float time = floor (u_time * 10.);
    float pct = random (i_st + vec2 (0., time * 2.1));

    // if (i_st.y == 1.) {
    //     f_st.y = 1.-f_st.y;
    // }

    vec3 color = vec3 (pct);
    gl_FragColor = vec4 (color, 1.0);
}