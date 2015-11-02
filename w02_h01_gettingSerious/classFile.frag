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
	// return 1.0 - pow ((_x - 1.0), peak);
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

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) - 
          smoothstep( pct, pct+0.01, st.y);
}


void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	vec3 col = vec3(0.0);
	
	// float pct = st.x;
	// float pct = F(st.x, abs(sin(u_time)), 0.02);
	// vec2 p = vec2(abs(sin(u_time*0.5)), abs(sin(u_time*0.5)));
	vec2 p = vec2(cos(u_time*0.5), sin(u_time*0.5) * .25 + .5);
	
	//draw dot
	float pct = F(st.y, abs(sin(u_time)), 0.1);
	// pct *= F(st.x, abs(sin(u_time)), 0.1);

	// float pct = F(st.x, p.x, 0.1);
	
	// pct += F(st.x, abs(sin(u_time)), 0.02);
	// pct *= F(st.x, abs(sin(u_time)), 0.1);
	
	// pct *= F(st.y, p.y, 0.1);
	
	// pct / 2;
	col = vec3(pct);
	// col = vec3(pct * 0.5);
	// col = vec3(step (0.8, pct*0.5));
	// float x = pow(st.x, 10.0);
	// col = vec3(F(st.y,x,0.03));
	gl_FragColor = vec4(col, 1.0);

}