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

vec3 DistanceField_Circle (vec2 st, vec2 pos, float size, float shadowBuffer, vec3 color, float sizeAnim, vec2 posAnim) {
	float pct = 0.0;
	pct = distance(st,pos + posAnim);
	pct = smoothstep(pct, pct + shadowBuffer, size + sizeAnim);
	return color * pct;
}

void main(){
 	vec2 st = gl_FragCoord.xy/u_resolution;
	

	// gl_FragColor = vec4( vec3 (DistanceField_Circle (st, vec2 (0.3, 0.2), 0.2, 0.05)), 1.0 );
	gl_FragColor = vec4( DistanceField_Circle ( st, 
												vec2 (0.3, 0.2), //pos
												0.2,	//size	
												0.05, 	//shadow
												vec3 (1.0,1.0,0.0),	//color
												abs (sin(u_time) * 0.25), //size anim
												vec2 ( 0.0, abs (sin(u_time) * 0.5) )	//pos anim 
												), 
					1.0);
}