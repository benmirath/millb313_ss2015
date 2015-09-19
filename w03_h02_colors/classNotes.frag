#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time; 
uniform vec2 u_resolution; 
uniform vec2 u_mouse; 

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) - 
          smoothstep( pct, pct+0.01, st.y);
}




void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec3 color = vec3 (0.0);
	st -= 0.5;
	float r = length(st);
	// float a = atan (st.y, st.x);
	float a = atan (st.y, st.x) / 3.1415;
	a = a * 0.5 + 0.5; 
	st = vec2(a,r);

	//controller variables
	// float y = st.x;
	vec3 pct = vec3 (st.x);

	pct.r = pow (pct.r, 0.2);
	pct.g = sin (pct.g * 3.14);
	pct.b = pow (pct.b, 2.0);

	//color transforms
	vec3 colA = vec3 (0.765, 0.110, 0.231);
	vec3 colB = vec3 (0.078, 0.388, 0.467);
	// color.x = 0.5;
	// color = mix (colA,colB, abs(sin(u_time)));		//slow pan back and forth
	//color = mix (colA,colB, mod(u_time, 1.0));		//quick flash
	// color = mix (colA,colB, fract(u_time));			//quick flash alt
	color = mix (colA,colB, pct);				//static gradient
	// color += (plot(st, y) * vec3 (1.0,0.0,0.0));
	color.r += plot(st, pct.r);
	color.g += plot(st, pct.g);
	color.b += plot(st, pct.b);

	gl_FragColor = vec4(color,1.0);
}