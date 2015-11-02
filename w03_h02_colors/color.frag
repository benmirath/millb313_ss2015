// Author: Ben Miller
// twitter: @diaBeets - 2015
// http://fabraz.com

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


vec3 colorA = vec3(0.07,0.84,0.85);		//0.07, 0.84, 0.85
vec3 colorB = vec3(0.65,0.05,0.00);		//0.65, 0.05, 0.00

void main() {
	vec3 color = vec3(0.0);

    float controller = abs (sin(u_time));
    float pct = 0.0;
    if (controller > 0.95) {	
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