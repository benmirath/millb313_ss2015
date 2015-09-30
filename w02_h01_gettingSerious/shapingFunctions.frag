#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
// uniform vec2 u_mouse;

float F (float _x, float _peak, float _width) {
	return (smoothstep(_peak - (_width * 0.5), _peak, _x) * (smoothstep(_peak + (_width * 0.5), _peak, _x)));
}

//example from online graphing
float function(in float x) {
    float y = 0.0;
    return smoothstep(0.0,1.0,sin(pow(x,6.)*3.1415));
}


//================================
// Golan Function
//================================
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

//==============================
// Inigo Quiles Functions
//==============================
float impulse( float k, float x ) {
    float h = k*x;
    return h*exp(1.0-h);
}
	
//c == x offset / cutoff
//w == width
float cubicPulse( float c, float w, float x ) {
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}

float parabola( float k, float x ) {
    return pow( 4.0*x*(1.0-x), k );
}

float pcurve( float a, float b, float x ) {
    float k = pow(a+b,a+b) / (pow(a,a)*pow(b,b));
    return k * pow( x, a ) * pow( 1.0-x, b );
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	vec3 col = vec3(0.0);

	// float x = impulse (8.1, st.x);
	// float x = cubicPulse (0.5, 0.5, st.x);
	// float y = cubicPulse (0.5, 0.5, st.y);
	// float x = parabola (0.8, st.x);
	// float x = pcurve (0.4, 0.9, st.x);
	// col = vec3(F(st.y,x,0.03)) * (vec3 (1.0) - vec3(F(st.y,x,0.03)));
	// col = vec3(F(st.y,x,0.03));
	// col *= vec3(F(st.x,y,0.03));
	col = vec3(F(st.y,x,0.03));

	gl_FragColor = vec4(col, 1.0);

}