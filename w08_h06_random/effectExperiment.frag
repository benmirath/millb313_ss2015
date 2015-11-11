// Author: @diaBEETS (ben miller) - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
float _AnimSpeed = 5.;

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}
mat2 scale (vec2 f) { return mat2 ( vec2 (f.x, 0.0), vec2 (0.0, f.y)); }
mat2 translate (vec2 f) { return mat2 ( vec2 (0.0, 1.0), vec2 (f.x, f.y) ); }
mat2 rotate (float a) { return mat2 ( vec2 (cos(a), -sin(a)), vec2 (sin (a), cos(a))); }
mat2 identityMatrix () { return mat2 ( vec2 (1.0, 0.0), vec2 (0.0, 1.0)); }

float random (float _x) {
	return fract(sin(_x)*10e5);
}
float random (in vec2 _st) { 
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise (float _x) {
    float i = floor(_x);  // integer
	float f = fract(_x);  // fraction
	float y = mix(random(i), random(i + 1.0), smoothstep(0.,1.,f));
	return y;
}
float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st); //1e-4 == 0.00004;
    uv *= smoothstep(_size,_size+vec2(1e-4), vec2(1.0) - _st);
    return uv.x * uv.y;
}
// vec3 returnColor (vec2 _st) {
//     vec3 colorOptions[8];
//     colorOptions[0] = vec3 (.7, .89, .81);
//     colorOptions[1] = vec3 (.99, .8, .67);
//     colorOptions[2] = vec3 (.8, .84, .91);
//     colorOptions[3] = vec3 (.96, .79, .89);
//     colorOptions[4] = vec3 (.9, .96, .79);
//     colorOptions[5] = vec3 (1., .95, .68);
//     colorOptions[6] = vec3 (.95, .88, .8);
//     colorOptions[7] = vec3 (.8, .8, .8);
//     float targVal = random (_st) * 8.;
//     return colorOptions [int (floor (targVal))];
    
// }

void main () {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float mousePct = clamp (smoothstep (0.05, 0.95, u_mouse.x / u_resolution.x), 0.0, 0.7);

    st *= scale (vec2( 200., 100.) );
    // float time = u_time * (_AnimSpeed * random (floor (u_time)));
    float time = u_time * (random (floor (st.y)) * 5.);
    // st.x += (time * (1. - (step(1., st.y) * 2.)));
    // st.x += u_time * mousePct;
    st.x -= time;
    vec2 ipos = floor(st); 
    // vec3 color = vec3(step (0.2, random( ipos ))); 
    vec3 color = vec3(step (mousePct, random( ipos))); 
    gl_FragColor = vec4(color,1.0);
}