// Author: Ben Miller
// twitter: @diaBeets - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
// uniform vec2 u_mouse;

float F (float _x, float _peak, float _width) {
	// _x = (_x>.5) ? smoothstep(_peak,_width,_x) : _x = smoothstep(_width,_peak,_x);
	// return _x;
	// return smoothstep(0.0,1.0,sin(_x*3.1415));
	// return smoothstep(_width / 2.0,_peak,_x) - smoothstep(_peak,_width * 2.0,_x);
	return (smoothstep(_peak - (_width * 0.5), _peak, _x) + smoothstep(_peak + (_width * 0.5), _peak, _x)) - 1.0;
}

//example from online graphing
float function(in float x) {
    float y = 0.0;
//     y = x;
//     if (x > .5) {
//        y = smoothstep(1.0,0.5,x);
//     } else {
// 	   y = smoothstep(0.0,0.5,x);
//     }
//     y = (x>.5) ? smoothstep(1.0,0.5,x) : y = smoothstep(0.0,0.5,x);
//     y = sin(y);
//     y = smoothstep(sin(01.0),0.5,x);
//     return y;
//     return smoothstep(1.0,0.5,x) - smoothstep(0.5,0.0,x);
//     return smoothstep(0.0,1.0,sin(x*3.1415));
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


vec3 colorA = vec3(0.07,0.84,0.85);		//0.07, 0.84, 0.85
vec3 colorB = vec3(0.65,0.05,0.00);		//0.65, 0.05, 0.00



void main() {
	vec3 color = vec3(0.0);

    float controller = abs (sin(u_time));
    float pct = 0.0;
    if (controller > 0.95) {
    	// controller = smoothstep(0.0,1.0, st.x);
    	controller = abs (sin(u_time * 10.0));
    } else {
    	controller = abs (sin(u_time * 0.25));
    }
    pct = controller;
    
    // Mix uses pct (a value from 0-1) to 
    // mix the two colors
    color = mix(colorA, colorB, pct);
    gl_FragColor = vec4(color,1.0);

}