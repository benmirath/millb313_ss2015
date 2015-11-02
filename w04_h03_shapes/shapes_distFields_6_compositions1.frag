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

// vec4 DrawCircle_Animdated (vec2 st, vec2 coord, float divisions, float dropShadow, float animMagnitude) {
//     float pct = (distance(st, coord) / divisions) + sin(u_time) * animMagnitude;
//     vec3 color = vec3(1.0 - smoothstep (1.0 - dropShadow,1.0,pct));
//     return vec4 (color, 1.0);
// }

vec4 DrawCircle_Animdated (vec2 st, vec2 coord, float divisions, float dropShadow, float animMagnitude) {
    float pct = (distance(st, coord) / divisions) + animMagnitude;
    vec3 color = vec3(1.0 - smoothstep (1.0 - dropShadow,1.0,pct));
    return vec4 (color, 1.0);
}

vec4 DrawCircle_Manual (vec2 st, vec2 coord, float pct, float size, float dropShadow, float animMagnitude) {
    float newPct = (pct + animMagnitude) * size;
    vec3 color = vec3(1.0 - smoothstep (1.0 - dropShadow,1.0,newPct));
    return vec4 (color, 1.0);
}

float Patricircle (in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
}


void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    st *= 2.0;
    st -= 0.5;

    float pct = 0.0;
    pct = distance(st,vec2(0.4)) + distance(st,vec2(0.6));
    // pct = distance(st,vec2(0.4)) * distance(st,vec2(0.6));
    // pct = min(distance(st,vec2(0.4)),distance(st,vec2(0.6)));   //min causes overlaps
    // pct = max(distance(st,vec2(0.4)),distance(st,vec2(0.6)));   //max causes cutouts
    // pct = pow(distance(st,vec2(0.4)),distance(st,vec2(0.6)));

    float posAnim = sin (u_time) * 0.25;
    // pct = mix (
    //     min(distance(st,vec2(posAnim + 0.5)),distance(st,vec2(posAnim + 0.7))), 
    //     max(distance(st,vec2(posAnim + 0.4)),distance(st,vec2(posAnim + 0.6))), 
    //     (sin (u_time) * 0.5) + 0.5
    //     // abs (sin (u_time * 0.5)) + 0.5
    // );

    pct = step (1.0 - pct, 0.5);

    // gl_FragColor = DrawCircle_Animdated (st, vec2 (0.3), 0.2, 0.1, abs (sin(u_time) * 0.1));
    // gl_FragColor += DrawCircle (st, vec2 (0.7), 0.4, 0.3);
    // gl_FragColor = DrawCircle_Manual (st, pct / 0.25, 0.0);
    // gl_FragColor = (DrawCircle_Manual (st, vec2 (0.3), pct, 2.5, 0.0, 0.0) * vec4 (1.0,0.0,0.5,1.0));
    // gl_FragColor += Patricircle (st - vec2 (0.25), 0.01);
	// gl_FragColor = vec4( color, 1.0 );

    gl_FragColor = vec4 (vec3 (pct), 1.0);
}