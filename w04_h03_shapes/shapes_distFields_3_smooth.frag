// Author: Ben Miller
// twitter: @diaBeets - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
 	vec2 st = gl_FragCoord.xy/u_resolution;
	st *= 2.0;
	st -= 0.5;
	float pct = 0.0;
	float _buffer = 0.1;

	pct = distance(st,vec2(0.5));
	pct = smoothstep(pct, pct + _buffer, 0.5);

	gl_FragColor = vec4( vec3 (pct), 1.0 );
}