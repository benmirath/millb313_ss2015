// Author: Ben Miller
// twitter: @diaBeets - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec4 DrawCircle (vec2 st, vec2 coord, float divisions, float dropShadow) {
    float pct = distance(st, coord) / divisions;
    vec3 color = vec3(1.0 - smoothstep (1.0 - dropShadow,1.0,pct));
    return vec4 (color, 1.0);
}

vec4 DrawCircle_Animdated (vec2 st, vec2 coord, float divisions, float dropShadow, float animMagnitude) {
    float pct = (distance(st, coord) / divisions) + animMagnitude;
    vec3 color = vec3(1.0 - smoothstep (1.0 - dropShadow,1.0,pct));
    return vec4 (color, 1.0);
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;

    //half gradient
    // float pct = distance(st,vec2(0.5)) * 2.0;
    // vec3 color = vec3(pct);

    //solid circle
    // float pct = distance(st,vec2(0.5)) * 4.0;
    // vec3 color = vec3(step (1.0,pct));

    //inverse
    // float pct = distance(st,vec2(0.5)) * 4.0;
    // vec3 color = vec3(1.0 - step (1.0,pct));

    //smoothstep
    // float pct = distance(st,vec2(0.5)) * 3.0;
    // vec3 color = vec3(1.0 - smoothstep (0.95,1.0,pct));

    // gl_FragColor = DrawCircle (st, vec2 (0.3), 0.2, 0.1);


    gl_FragColor = DrawCircle_Animdated (st, vec2 (0.3), 0.2, 0.1, abs (sin(u_time) * 0.1));
    gl_FragColor += DrawCircle (st, vec2 (0.7), 0.3, 0.3);
	// gl_FragColor = vec4( color, 1.0 );
}