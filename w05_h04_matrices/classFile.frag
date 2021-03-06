// Author: Ben Miller
// twitter: @diaBeets - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float box(in vec2 st, in vec2 size){

    // size = vec2(0.5) - size*0.5;
    size = size;
    vec2 uv = smoothstep(size,
                        size+vec2(0.001),
                        st);
    uv *= smoothstep(size,
                    size+vec2(0.001),
                    vec2(1.0)-st);
    return uv.x*uv.y;
}

float cross(in vec2 st, float size) {
    return  box(st, vec2(size,size/4.)) + 
            box(st, vec2(size/4.,size));
}


//HARDCORE VERSION
//f == factor
mat3 scaleMatrix (vec2 f) {
    return mat3 (
        vec3 (f.x, 0.0, 0.0), 
        vec3 (0.0, f.y, 0.0), 
        vec3 (0.0, 0.0, 1.0)
    );
}
mat3 translationMatrix (vec2 f) {
    return mat3 (
        vec3 (1.0, 0.0, 0.0), 
        vec3 (0.0, 1.0, 0.0), 
        vec3 (f.x, f.y, 1.0)
    );
}
//a == angle
mat3 rotationMatrix (float a) {
    return mat3 (
        vec3 (cos(a), -sin(a), 0.0), 
        vec3 (sin (a), cos(a), 0.0), 
        vec3 (0.0, 0.0, 1.0)
    );
}

//USER FRIENDLY VERSION
// vec3 scale (vec2 f, vec3 pos) {
//     return scaleMatrix (f) * pos;
// }
void scale (in vec2 f, inout vec3 pos) {
    pos = scaleMatrix (f) * pos;
}
// vec3 translate (vec2 f, vec3 pos) {
//     return translationMatrix (f) * pos;
// }
void translate (in vec2 f, inout vec3 pos) {
    pos = translationMatrix (f) * pos;
}
vec3 rotate (float a, vec3 pos) {
    return rotationMatrix (a) * pos;
}


void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    // pos = scaleMatrix (vec2 (1.0, 1.0)) * pos;
    vec3 color = vec3 (0.0);
    vec3 pos = vec3 (st, 1.0);
    // pos -= 0.5;     //important, surrounding addition/subtraction to center shape to matrix
    // pos = rotationMatrix (u_time) * pos;
    // pos += 0.5;

    // pos = translationMatrix ()
    // pos = translationMatrix (vec2 (0.0, 0.0)) * pos;
    // pos = translate (vec2 ())
    // translate (vec2 (0.5), pos);
    // scale (vec2 (sin (u_time)), pos);

    mat3 universe = rotationMatrix (u_time) *
                    scaleMatrix (vec2 (sin (u_time))) *
                    translationMatrix (vec2(-0.5));

    pos = universe * pos;
    color += cross (pos.xy, 0.4);

    // gl_FragColor = vec4( vec3( cross(pos.xy,0.4) ) ,1.0);
    gl_FragColor = vec4( color ,1.0);
}