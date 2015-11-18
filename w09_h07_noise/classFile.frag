// Author: @diaBEETS (ben miller) - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//interesting experiment
float random (float x) {
    return fract (cos(x) * 10e4);
}
float random (vec2 st) {
	
}
vec2 random (vec2 st) {

}

float function(in float x) {
    float y = 0.0;
    x *= 1.;
    float i = floor (x);
    float f = fract (x);
    y = mix (random (i), random (f), smoothstep (0., 1., f));
//     y = x;
    return y;
}

float valueNoise () {
	return 0;
}
float gradientNoise () {
	return 0;
}

void main () {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
   
    vec3 color = vec3(st.x); 
    gl_FragColor = vec4(color,1.0);
}