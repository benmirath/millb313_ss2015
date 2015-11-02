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

vec3 DistanceField_Circle (vec2 st, vec2 pos, float size, float shadowBuffer, vec3 color, float sizeAnim, vec2 posAnim) {
    float pct = 0.0;
    pct = distance(st,pos + posAnim);
    pct = smoothstep(pct, pct + shadowBuffer, size + sizeAnim);
    return color * pct;
}
float DistanceField_Circle (vec2 st, vec2 pos, float size, float shadowBuffer, float sizeAnim, vec2 posAnim) {
    float pct = 0.0;
    pct = distance(st,pos + posAnim);
    pct = 1.0 - pct;
    // vec2( posAnim + 0.5 - sin (u_time) )
    // pct = smoothstep(pct, pct + shadowBuffer, size + sizeAnim);

    pct = smoothstep(pct, pct + shadowBuffer, size + sizeAnim);         // creates dot
    // pct = smoothstep(1.0 - pct, pct + shadowBuffer, size + sizeAnim);   // splits brightness between inner and outer (stronger on inner)
    // pct = smoothstep(pct, 1.0 - pct + shadowBuffer, size + sizeAnim);   // creates dot cutout (some gray)
    // pct = smoothstep(1.0 - pct, 1.0 - pct + shadowBuffer, size + sizeAnim); //creates dot cutout
    return pct;
}



vec3 col1 = vec3 (0.0,1.0,0.0);
vec3 col2 = vec3 (1.0,0.0,1.0);
void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    st *= 4.0;
    st -= 1.5;

    vec3 color = vec3 (0.0);
    float pct = 0.0;
    // float posAnim = sin (u_time) * 0.25;
    float posAnim = sin (u_time);

    // STEP 1 - Draw same circle, animating across diffeent positions
    // pct = distance ( st, vec2(posAnim + 0.5 - sin (u_time) ) ); 
    // pct = distance ( st, vec2(posAnim + 0.5 + sin (u_time) ) );
    // pct = DistanceField_Circle (st, vec2 (0.5), 0.4, 0.05, 0.0, vec2 (posAnim));
    // pct = DistanceField_Circle (st, vec2 (0.5), 0.4, 0.05, 0.0, -vec2 (posAnim));


    // pct = min(
    //     distance (
    //         st,
    //         vec2(posAnim + 0.5 - sin (u_time))
    //     ), 
    //     distance (
    //         st,
    //         vec2(posAnim + 0.5 + sin (u_time))
    //     )
    // );

    // pct =  max (
    //     distance ( 
    //         st,
    //         vec2(posAnim + 0.4 + sin (u_time))
    //     ), 
    //     distance (
    //         st,
    //         vec2(posAnim + 0.6 + sin (u_time))
    //     )
    // );

    // pct = min(
    //     distance (
    //         st,
    //         vec2( 0.5 + posAnim - sin (u_time) )
    //     ), 
    //     distance (
    //         st,
    //         vec2( 0.5 + posAnim + sin (u_time) )
    //     )
    // );

    pct = min (
        DistanceField_Circle (st, vec2 (0.5), 0.4, 0.0, 0.0, vec2 (posAnim - sin (u_time) ) ),
        DistanceField_Circle (st, vec2 (0.5), 0.4, 0.0, 0.0, vec2 (posAnim + sin (u_time) ) )
    );


    // pct = mix ( 
    //     min(
    //         distance (
    //             st,
    //             vec2(posAnim + 0.4 - sin (u_time))
    //         ), 
    //         1.0 - distance (
    //             st,
    //             vec2(posAnim + 0.6 + sin (u_time))
    //         )
    //     ), 
    //     max (
    //         distance (
    //             st,
    //             vec2(posAnim + 0.4 + sin (u_time))
    //         ), 
    //         distance (
    //             st,
    //             vec2(posAnim + 0.6 + sin (u_time))
    //         )
    //     ), 
    //     (sin (u_time) * 0.5) + 0.5
    //     // abs (sin (u_time * 0.5)) + 0.5
    // );

    

    // pct = step (1.0 - pct, 0.5);
    // color = vec3 (pct);
    color = mix (col1, col2, sin (u_time));
    // vec3 color = vec3 (1.0);
    // gl_FragColor = vec4 (color * (1.0 - pct), 1.0);
    gl_FragColor = vec4 (pct * color, 1.0);
}