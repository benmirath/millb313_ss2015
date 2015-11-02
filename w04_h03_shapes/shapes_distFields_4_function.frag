// Author: Ben Miller
// twitter: @diaBeets - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float DistanceField_Circle (vec2 st, vec2 pos, float size, float shadowBuffer) {
	float pct = 0.0;
	pct = distance(st,pos);
	pct = smoothstep(pct, pct + shadowBuffer, size);
	return pct;
}

vec3 DistanceField_Circle (vec2 st, vec2 pos, float size, float shadowBuffer, vec3 color) {
	float pct = 0.0;
	pct = distance(st,pos);
	pct = smoothstep(pct, pct + shadowBuffer, size);
	return color * pct;
}

void main(){
 	vec2 st = gl_FragCoord.xy/u_resolution;
	

	// gl_FragColor = vec4( vec3 (DistanceField_Circle (st, vec2 (0.3, 0.2), 0.2, 0.05)), 1.0 );
	gl_FragColor = vec4( DistanceField_Circle (st, vec2 (0.3, 0.2), 0.2, 0.05, vec3 (1.0,1.0,0.0)), 1.0 );
}