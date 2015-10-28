// Author @patriciogv - 2015    //modified by Ben...
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


//====================================================================================
//COLOR FUNCTIONS
//====================================================================================
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

//====================================================================================
//MATRIX FUNCTIONS
//====================================================================================
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
mat3 identityMatrix () {
    return mat3 (
        vec3 (1.0, 0.0, 0.0), 
        vec3 (0.0, 1.0, 0.0), 
        vec3 (0.0, 0.0, 1.0)
    );
}
mat3 matrix = mat3 ( vec3 (1.0, 0.0, 0.0), vec3 (0.0, 1.0, 0.0), vec3 (0.0, 0.0, 1.0));

void scale (in vec2 f) { matrix = scaleMatrix (f) * matrix; }
void translate (in vec2 f) { matrix = translationMatrix (f) * matrix; }
void rotate (float a) { matrix = rotationMatrix (a) * matrix; }
void resetMatrix () { matrix = identityMatrix(); }

//====================================================================================
//TRANSFORMATION FUNCTIONS
//====================================================================================
vec2 ModifyScreenSpace (vec2 st, vec2 scale, vec2 translate) {
  vec2 newSt = st;
  newSt *= scale;
  newSt -= translate; //positive vals cause going up and to right
  return newSt;
}

vec2 ModifyScreenSpace (vec2 st, float scale, float translate) {
  vec2 newSt = st;
  newSt *= scale;
  newSt -= translate; //positive vals cause going up and to right
  return newSt;
}

//====================================================================================
//PATTERN FUNCTIONS
//====================================================================================
vec2 tile(vec2 _st, vec2 _zoom){
    _st.xy *= _zoom.xy;
    return fract(_st);
}
vec2 tile(vec2 _st, float _zoom){
    return tile (_st, vec2 (_zoom));
}
vec2 tileOffset (vec2 _st, vec2 _zoom) {
    _st.xy *= _zoom.xy;

    vec2 st_i = floor(_st);
    if (mod(st_i.y,2.) == 1.) { //create x offset every other row
        _st.x += .5;
    }

    return fract(_st);
}
vec2 tileOffset (vec2 _st, float _zoom) {
    return tileOffset (_st, vec2 (_zoom));
}
vec2 tileMove(vec2 _st, vec2 _zoom, float _speed){
    _st.xy *= _zoom.xy;

    float time = u_time * _speed;
    if( fract(time)>0.5 ){
        if (fract( _st.y * 0.5) > 0.5){
            _st.x += fract(time)*2.0;
        } else {
            _st.x -= fract(time)*2.0;
        } 
    } else {
        if (fract( _st.x * 0.5) > 0.5){
            _st.y += fract(time)*2.0;
        } else {
            _st.y -= fract(time)*2.0;
        } 
    }

    return fract(_st);
}
vec2 tileMove(vec2 _st, float _zoom, float _speed){
    return tileMove (_st, vec2 (_zoom), _speed);
}

float addBorder (vec2 _st, float _thickness) {
    float col = 0.;
    col += step (_st.x, _thickness);
    col += 1. - step (_st.x, 1. - _thickness);
    col += step (_st.y, _thickness);
    col += 1. - step (_st.y, 1. - _thickness);
    return col;
}

//====================================================================================
//SHAPING FUNCTIONS
//====================================================================================
//Use on a variable you want to animate in a pulsing manner
float pulse (vec2 _st, vec2 _origin, float _magnitude, float _speed) {
    float d = distance(_st, _origin);
    d = sin(d * _magnitude - (u_time * _speed));
    return d;
} 

//====================================================================================
//DRAWING FUNCTIONS
//====================================================================================

//STANDALONE
float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st); //1e-4 == 0.00004;
    uv *= smoothstep(_size,_size+vec2(1e-4), vec2(1.0) - _st);
    return uv.x * uv.y;
}
float circle(vec2 st, float radius){
    vec2 pos = vec2(0.5)-st;
    radius *= 0.75;
    return 1.-smoothstep(radius-(radius*0.05),radius+(radius*0.05),dot(pos,pos)*3.14);
}
float polygon (vec2 st, int sides, float size, float blur) {
  st = st *2.0 - 1.0; // Remap the space to -1. to 1.
  float angle = atan(st.x,st.y)+PI;   // Angle and radius from the current pixel
  float radius = TWO_PI/float(sides);
  float d = cos( floor ( 0.5 + angle / radius) * radius - angle) * length( st );      // Shaping function that modulate the distance
  return 1.0 - smoothstep( size, size + blur ,d);
}

//PATTERNS
float boxPattern(vec2 st, vec2 size) {
    return  box(st+vec2(0.,-.5), size)+
            box(st+vec2(0.,.5), size)+
            box(st+vec2(-.5,0.), size)+
            box(st+vec2(.5,0.), size);
}
float circlePattern(vec2 st, float radius) {
    return  circle(st+vec2(0.,-.5), radius)+
            circle(st+vec2(0.,.5), radius)+
            circle(st+vec2(-.5,0.), radius)+
            circle(st+vec2(.5,0.), radius);
}



//crop first value with second value
float DistanceField_Min (float fieldVal1, float fieldVal2) {
    return min( fieldVal1, fieldVal2 );
}

//add first value onto second value
float DistanceField_Max (float fieldVal1, float fieldVal2) {
    return max( fieldVal1, fieldVal2 );
}


void main(){

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // gl_FragColor = DrawSquare (st, vec2 (0.3,0.2), vec2 (0.9,0.9));

    vec3 color = vec3 (0.0);
    // color = vec3 (DrawPolygon (st, 2, 0.4, 0.01));
    // color = vec3 (DrawPolygon (st, 8, 0.4, 0.01));
    // color = vec3( 
    //     DistanceField_Min ( 
    //         DrawPolygon (st, 5, 0.4, 0.01), 
    //         // DrawPolygon (st, 2, 0.4, 0.01)
    //         DrawPolygon (ModifyScreenSpace (st, 2.0, 0.25), 5, 0.4, 0.01)
    //     ) 
    // );
    gl_FragColor = vec4 (color, 1.0);





    // vec3 color = vec3(0.0);
    
    // // bottom-left
    // vec2 bl = floor(st + 1.0 - vec2(0.3,0.2));
    // float pct = bl.x * bl.y;

    // // top-right 
    // vec2 tr = floor(1.0 - st + vec2 (0.9,0.9)); 
    // pct *= tr.x * tr.y;
    
    // color = vec3(pct);

    // gl_FragColor = vec4(color,1.0);
}