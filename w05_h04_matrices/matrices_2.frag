// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float _box(in vec2 st, in vec2 size){

    // size = vec2(0.5) - size*0.5;
    // size = size;
    st += 0.5;      //draw in center
    vec2 uv = smoothstep(size,
                        size+vec2(0.001),
                        st);
    uv *= smoothstep(size,
                    size+vec2(0.001),
                    vec2(1.0)-st);
    return uv.x*uv.y;
}
float box2(in vec2 st, in vec2 size){

    // size = vec2(0.5) - size*0.5;
    // size = size;
    size = size * 0.25;
    st += 0.5;      //draw in center
    vec2 uv = smoothstep(size,
                        size+vec2(0.001),
                        st);
    uv *= smoothstep(size,
                    size+vec2(0.001),
                    vec2(1.0)-st);
    return uv.x*uv.y;
}


float cross(in vec2 st, float size) {
    return  _box(st, vec2(size,size/4.)) + 
            _box(st, vec2(size/4.,size));
}
// float box(in vec2 st, float size) {
//     return  _box(st, vec2(size,size/4.));;
// }
float box(in vec2 st, vec2 size) {
    return  _box(st, vec2(size));;
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

mat3 matrix = mat3 ( vec3 (1.0, 0.0, 0.0), vec3 (0.0, 1.0, 0.0), vec3 (0.0, 0.0, 1.0));

//USER FRIENDLY VERSION
// vec3 scale (vec2 f, vec3 pos) {
//     return scaleMatrix (f) * pos;
// }
// void scale (in vec2 f, inout vec3 pos) {
//     pos = scaleMatrix (f) * pos;
// }
void scale (in vec2 f) {
    matrix = scaleMatrix (f) * matrix;
}
// vec3 translate (vec2 f, vec3 pos) {
//     return translationMatrix (f) * pos;
// }
// void translate (in vec2 f, inout vec3 pos) {
//     pos = translationMatrix (f) * pos;
// }
void translate (in vec2 f) {
    matrix = translationMatrix (f) * matrix;
}
// vec3 rotate (float a, vec3 pos) {
//     return rotationMatrix (a) * pos;
// }
void rotate (float a) {
    matrix = rotationMatrix (a) * matrix;
}

vec4 DrawSquare (vec2 st, vec2 pos1, vec2 pos2) {
    vec2 bl = floor(st + 1.0 - pos1);    // bottom-left
    vec2 tr = floor(1.0 - st + pos2);   // top-right     
    vec3 color = vec3(bl.x * bl.y * tr.x * tr.y);
    return vec4(color,1.0);
}


void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3 (0.0);
    vec3 pos = vec3 (st, 1.0);
    vec3 translationPos = vec3 (st, 1.0);

    translate (vec2(-0.5));
    scale (vec2 (15.0));
    translationPos = matrix * pos;

    vec3 hitCol = vec3 (1.0, 1.0, 1.0);
    if (distance(u_mouse, vec2 (0.5)) < 0.75) {
        hitCol = vec3 (1.0, 0.0, 0.0);
    }

    color += (cross (translationPos.xy, 0.45) * hitCol);
    scale (vec2 (0.35));

    translate (vec2 (2.25,-1.0));
    translationPos = matrix * pos;
    color += box (translationPos.xy, vec2 (0.49, -0.3));

    translate (vec2 (-4.5,0.0));
    translationPos = matrix * pos;
    color += box (translationPos.xy, vec2 (0.49, -0.3));


    translate (vec2 (0.25,0.25));
    translationPos = matrix * pos;
    color += box (translationPos.xy, vec2 (0.49, -0.2));

    translate (vec2 (4.0,0.0));
    translationPos = matrix * pos;
    color += box (translationPos.xy, vec2 (0.49, -0.2));


    translate (vec2 (-0.25,0.25));
    translationPos = matrix * pos;
    color += box (translationPos.xy, vec2 (0.49, -0.1));

    translate (vec2 (-3.5,0.0));
    translationPos = matrix * pos;
    color += box (translationPos.xy, vec2 (0.49, -0.1));

    translate (vec2 (1.0,0.5));
    translationPos = matrix * pos;
    color += (box (translationPos.xy, vec2 (0.49, -0.1)) * vec3 (1.0,0.0,0.0));

    translate (vec2 (1.5,0.0));
    translationPos = matrix * pos;
    color += (box (translationPos.xy, vec2 (0.49, -0.1)) * vec3 (1.0,0.0,0.0));

    // gl_FragColor = vec4( vec3( cross(pos.xy,0.4) ) ,1.0);
    gl_FragColor = vec4( color ,1.0);
}