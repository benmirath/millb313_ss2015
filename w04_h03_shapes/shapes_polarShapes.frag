// Author: Ben Miller
// twitter: @diaBeets - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plotF (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) - smoothstep( pct, pct+0.01, st.y);
}
vec2 plot (vec2 st, float pct){
  return vec2 (
  	smoothstep( pct-0.01, pct, st.x) - smoothstep( pct, pct+0.01, st.x),
  	smoothstep( pct-0.01, pct, st.y) - smoothstep( pct, pct+0.01, st.y));
}

vec4  DrawShape (vec2 st, vec2 coord, float animSpeed_rotation, float animRange_radius) {
	vec3 color = vec3(0.0);

    vec2 pos = coord-st;

    float r = length(pos)*2.0 + (abs(sin (u_time) * animRange_radius));
    float a = atan(pos.y,pos.x) + (u_time * animSpeed_rotation);

    float f = cos(a*3.);		//triple petal
    // f = abs(cos(a*3.));		//sextuple petal
    // f = abs(cos(a*2.5))*.5+.3;	//five petal + larger center
    // f = abs(cos(a*12.)*sin(a*3.))*.8+.1;	//sextuple diminishing burst
    f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;		//ten tooth large gear

    color = vec3( 1.0-smoothstep(f,f+0.02,r) );

    return vec4 (color, 1.0);
}

//DA FUQ?!?
vec4  DrawShape_Contour (vec2 st, vec2 coord, float animSpeed_rotation, float animRange_radius) {
	vec3 color = vec3(0.0);

    vec2 pos = coord - st;
    float r = length(pos)*2.0 + (abs(sin (u_time) * animRange_radius));
    float a = atan(pos.y,pos.x) + (u_time * animSpeed_rotation);

    float f = cos(a*3.);		//triple petal
    // f = abs(cos(a*3.));		//sextuple petal
    // f = abs(cos(a*2.5))*.5+.3;	//five petal + larger center
    // f = abs(cos(a*12.)*sin(a*3.))*.8+.1;	//sextuple diminishing burst
    f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;		//ten tooth large gear
    // f = plot (st, f);

    // color = vec3( 1.0-smoothstep(f,f+0.02,r) );
    color = vec3( 1.0 - plotF(st, f));
    // color = vec3 (1.0 - plot (st, f));

    return vec4 (color, 1.0);
}



void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    gl_FragColor = DrawShape_Contour (st, vec2 (0.5), 0.4, 0.2);
}