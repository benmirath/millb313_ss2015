// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#define PI 3.14159265359
#define TWO_PI 6.28318530718

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

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

void resetMatrix () {
    matrix = mat3 ( vec3 (1.0, 0.0, 0.0), vec3 (0.0, 1.0, 0.0), vec3 (0.0, 0.0, 1.0));
}

vec4 DrawSquare (vec2 st, vec2 pos1, vec2 pos2) {
    vec2 bl = floor(st + 1.0 - pos1);    // bottom-left
    vec2 tr = floor(1.0 - st + pos2);   // top-right     
    vec3 color = vec3(bl.x * bl.y * tr.x * tr.y);
    return vec4(color,1.0);
}
float DrawPolygon (vec2 st, int sides, float size, float blur) {
   float d = 0.0;

  // Remap the space to -1. to 1.
  st = st *2.0 - 1.0;

  // Angle and radius from the current pixel
  float angle = atan(st.x,st.y)+PI;
  float radius = TWO_PI/float(sides);
  
  // Shaping function that modulate the distance
  d = cos( floor ( 0.5 + angle / radius) * radius - angle) * length( st );

  return 1.0 - smoothstep( size, size + blur ,d);
}
float DrawPolygonFract (vec2 st, int sides, float size, float blur) {
   float d = 0.0;

  // Remap the space to -1. to 1.
  st = st *2.0 - 1.0;

  // Angle and radius from the current pixel
  float angle = atan(st.x,st.y)+PI;
  float radius = TWO_PI/float(sides);

  // radius = fract (radius);
  
  // Shaping function that modulate the distance
  d = cos( floor ( 0.5 + angle / radius) * radius - angle) * length( st );

  return 1.0 - smoothstep( size, size + blur , d);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3 (0.0);
    vec3 pos = vec3 (st, 1.0);
    vec3 translationPos = vec3 (st, 1.0);

    float timePulse = sin (u_time * 0.25);
    timePulse += 1.0;
    timePulse *= 0.5;

    translate (vec2(-0.5, -0.5));
    scale (vec2 (80.0));

    rotate (u_time * 0.1);
    translationPos = matrix * pos;
    float tri1 = (DrawPolygonFract (translationPos.xy, 3, 1.0 + (timePulse * 50.1), 100.0));

    rotate (-u_time * 0.2);
    translationPos = matrix * pos;
    float tri2 = (DrawPolygonFract (translationPos.xy, 3, 1.0 + (timePulse * 50.1), 100.0));

    color +=  max (tri1, tri2);

   
    color *= hsb2rgb (vec3 (u_time * 0.05, 1.0, 1.0));
    // gl_FragColor = vec4( vec3( cross(pos.xy,0.4) ) ,1.0);
    gl_FragColor = vec4( fract (color * 10.0),1.0);
}