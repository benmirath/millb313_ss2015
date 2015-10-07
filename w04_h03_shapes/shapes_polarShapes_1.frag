// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plotF (vec2 st, float pct, float thickness){
  return  smoothstep( pct - thickness, pct, st.y) - smoothstep( pct, pct + thickness, st.y);
}
vec2 plot2 (vec2 st, float pct){
  return vec2 (
  	smoothstep( pct-0.01, pct, st.x) - smoothstep( pct, pct+0.01, st.x),
  	smoothstep( pct-0.01, pct, st.y) - smoothstep( pct, pct+0.01, st.y));
}

vec4  DrawShape (vec2 st, vec2 coord, float animSpeed_rotation, float animRange_radius) {
	vec3 color = vec3(0.0);

    vec2 pos = coord-st;

    float r = length(pos)*2.0 + (abs(sin (u_time) * animRange_radius));
    // float a = atan(pos.y,pos.x) + (u_time * animSpeed_rotation);
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
    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x) + (u_time * animSpeed_rotation);
    // float a = atan(pos.y,pos.x) + (u_time * animSpeed_rotation);

    float f = cos(a*3.);		//triple petal
    // f = abs(cos(a*3.));		//sextuple petal
    // f = abs(cos(a*2.5))*.5+.3;	//five petal + larger center
    // f = abs(cos(a*12.)*sin(a*3.))*.8+.1;	//sextuple diminishing burst
    f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;		//ten tooth large gear
    // f = plot (st, f);

    color = vec3( 1.0-smoothstep(f,f+0.02,r) );
    // color = vec3(plotF(st, f));
    // color = vec3 (1.0 - plot (st, f));

    return vec4 (color, 1.0);
}

vec3 DrawShape2 (vec2 st, vec2 coord, float animSpeed_rotation, float animRange_radius) {
    vec2 pos = coord-st;

    float r = length(pos)*2.0 + animRange_radius;
    float a = atan(pos.y,pos.x) + animSpeed_rotation;

    float f = cos(a*3.);

    // f = abs(cos(a*3.));
    f = abs( 
            cos( 
                a * 2.5     //describes number of petals
            ) 
        ) 
    * 0.5   //size
    + 0.3;  //size

    f = abs ( 
        sin (a * .5)
    );
    // f = abs(cos(a*12.)*sin(a*3.))*.8+.1;
    // f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

    return vec3( 1.-smoothstep(f,f+0.02,r) );
}
vec3 DrawShapeOutline (vec2 st, vec2 coord, float animSpeed_rotation, float animRange_radius) {
    vec2 pos = coord-st;

    float r = length(pos)*2.0 + animRange_radius;
    float a = atan(pos.y,pos.x) + animSpeed_rotation;

    float f = cos(a*3.);
    f = abs(cos(a*3.));
    f = abs(cos(a*2.5))*.5+.3;
    f = abs(cos(a*12.)*sin(a*3.))*.8+.1;
    f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

    return vec3( plotF (coord ,1.0 - smoothstep(f,f+0.02,r), 0.5 ) );
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // vec3 color = vec3(0.0);

    
    vec3 color = DrawShape2 (st, vec2 (0.5), u_time, abs (sin (u_time)) * 0.25 );
    // color *= plotF (st, );
    // color = vec3( 1.-smoothstep(f,f+0.02,r) );

    gl_FragColor = vec4(color,1.0);
}