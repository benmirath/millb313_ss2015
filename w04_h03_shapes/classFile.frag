#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float F (float _x, float _peak, float _width) {
	return (smoothstep(_peak - (_width * 0.5), _peak, _x) + smoothstep(_peak + (_width * 0.5), _peak, _x)) - 1.0;
}

//example from online graphing
float function(in float x) {
    float y = 0.0;
    return smoothstep(0.0,1.0,sin(pow(x,6.)*3.1415));
}

float doubleExponentialSigmoid (float x, float a){
	float epsilon = 0.00001;
	float min_param_a = 0.0 + epsilon;
	float max_param_a = 1.0 - epsilon;
	a = min(max_param_a, max(min_param_a, a));
	a = 1.0-a; // for sensible results

	float y = 0.0;
	if (x <= 0.5){
		y = (pow(2.0*x, 1.0/a))/2.0;
	} else {
		y = 1.0 - (pow(2.0*(1.0-x), 1.0/a))/2.0;
	}
	return y;
}

float exponentialEasing (float x, float a){
  
	float epsilon = 0.00001;
	float min_param_a = 0.0 + epsilon;
	float max_param_a = 1.0 - epsilon;
	a = max(min_param_a, min(max_param_a, a));

	if (a < 0.5){
		// emphasis
		a = 2.0*(a);
		float y = pow(x, a);
		return y;
	} else {
		// de-emphasis
		a = 2.0*(a-0.5);
		float y = pow(x, 1.0/(1.0-a));
		return y;
	}
}


// void main() {
// 	vec2 st = gl_FragCoord.xy/u_resolution;
//  	vec3 col = vec3 (step(0.2, st.x) - step(0.8, st.x));
//  	col *= vec3 (step(0.2, st.y) - step(0.8, st.y));
//  	gl_FragColor = vec4(col,1.0);

// }
// void main() {
// 	vec2 st = gl_FragCoord.xy/u_resolution;
//  	float pct = 0.0;

 	
//  // 	st -= 0.5;
//  // 	pct = 1.0 - length (st) * 2.0;
//  // 	pct = 1.0 - length (st) * 5.0 * u_time;
//  // 	pct = 1.0 - length (st) * 5.0 - u_time;
//  // 	pct = fract (pct * 2.0);
//  // 	pct = step (.5, pct);

//  	st = st * 2.0 - 1.0;
//  	pct = 1.0 - length (abs(st) - 0.3);
//  	// pct = fract (pct * 10.0);
//  	pct = 1.0 - length (max (abs(st) - 0.3, 0.0));
//  	pct = step (.5, pct);
	 	

//  	float final = step (0.9, pct) - step (0.92, pct) * 0.5;
//  	float shadow = smoothstep (0.9, 0.4, pct);
//  	final += (1.0 - shadow) * 0.5;
//  	// gl_FragColor = vec4 (vec3 (pct), 1.0);
//  	// gl_FragColor = vec4 (vec3 (1.0 - final), 1.0);
//  	gl_FragColor = vec4 (vec3 (1.0 - final), 1.0);
//  	// gl_FragColor = vec4 (vec3 (step (.5, pct) - step ()   pct), 1.0); //broken

// }


void main () {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
 	float pct = 0.0;

 	st -= 0.5;

 	float r = length (st) * 2.0;
 	float a = atan (st.y, st.x) / 6.285 + 0.5;

 	// r = r * sin (abs (a));
 	float f = abs (cos (a * 4.0)) * .5 + .2;

 	// gl_FragColor = vec4 (vec3 (r), 1.0);
 	gl_FragColor = vec4 (vec3 (1.0 - step (0.5, r)), 1.0);

}