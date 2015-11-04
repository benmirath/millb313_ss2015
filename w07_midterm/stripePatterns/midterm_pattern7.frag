// Author: @diaBEETS (ben miller) - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// uniform vec2 tileAmount;

vec2 tile(vec2 st, float zoom){
    st *= zoom;
    return fract(st);
}
vec2 tile(vec2 st, vec2 zoom){
    // st *= zoom;
    st.xy *= zoom.xy;
    return fract(st);
}
vec2 tileOffset (vec2 _st, float _zoom) {
    _st *= _zoom;

    vec2 st_i = floor(_st);
    if (mod(st_i.y,2.) == 1.) { //create x offset every other row
        _st.x += .5;
    }

    return fract(_st);
}
vec2 tileOffset (vec2 _st, vec2 _zoom) {
    _st *= _zoom;

    vec2 st_i = floor(_st);
    if (mod(st_i.y,2.) == 1.) { //create x offset every other row
        _st.x += .5;
    }

    return fract(_st);
}

float circle(vec2 st, float radius){
    vec2 pos = vec2(0.5)-st;
    radius *= 0.75;
    return 1.-smoothstep(radius-(radius*0.05),radius+(radius*0.05),dot(pos,pos)*3.14);
}
float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st); //1e-4 == 0.00004;
    uv *= smoothstep(_size,_size+vec2(1e-4), vec2(1.0) - _st);
    return uv.x*uv.y;
}
float box(vec2 _st, float _sizeF){
    vec2 _size = vec2 (_sizeF);
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st); //1e-4 == 0.00004;
    uv *= smoothstep(_size,_size+vec2(1e-4), vec2(1.0) - _st);
    return uv.x*uv.y;
}





float circlePattern(vec2 st, float radius) {
    return  circle(st+vec2(0.,-.5), radius)+
            circle(st+vec2(0.,.5), radius)+
            circle(st+vec2(-.5,0.), radius)+
            circle(st+vec2(.5,0.), radius);
}
float circlePattern(vec2 st, float radius, float radius2) {
    return  circle(st+vec2(0.,-.5), radius)+
            circle(st+vec2(0.,.5), radius)+
            circle(st+vec2(-.5,0.), radius2)+
            circle(st+vec2(.5,0.), radius2);
}
float boxPattern(vec2 st, vec2 size) {
    return  box(st+vec2(0.,-.5), size)+
            box(st+vec2(0.,.5), size)+
            box(st+vec2(-.5,0.), size)+
            box(st+vec2(.5,0.), size);
}
float boxPattern(vec2 st, vec2 size, vec2 size2) {
    return  box(st+vec2(0.,-.5), size)+
            box(st+vec2(0.,.5), size)+
            box(st+vec2(-.5,0.), size2)+
            box(st+vec2(.5,0.), size2);
}

mat2 rotationMatrix(float a) {
    return mat2(vec2(cos(a),-sin(a)),
            vec2(sin(a),cos(a)));
}

float pulse (vec2 _st, vec2 _origin, float _magnitude, float _speed) {
    float d = distance(_st, _origin);
    d = sin(d * _magnitude - (u_time * _speed));
    return d;
} 

vec4 col1 = vec4(0.075,0.114,0.329, 1.0);
vec4 col2 = vec4(0.973,0.843,0.675, 1.0);
vec4 col3 = vec4(0.761,0.247,0.102, 1.);
// vec4 col3 = vec4(0.761,0.247,0.102, 1.);

float curRotation = 0.0;
float curRotationContra = 0.0;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // st.x *= u_resolution.x/u_resolution.y;
    vec4 color = vec4(0.0);

    float time = u_time * 0.25;
    // float time = pulse (st, vec2 (st.x, 0.), vec2 (0, 0.05));

    float time_anim1 = pulse (st, vec2 (st.x, 0.), 10., 5.);
    // float time_scroll1 = time * .25;

    // float timeFrag = fract (time);
    vec2 tileAmount = vec2 (15, 15);
    st -= .5;
    st *= rotationMatrix ((PI * 0.5));
    st +=  (.5 * st.y);
    // st.x -= time_scroll1;
    
    vec2 grid1 = st;
    grid1 = tileOffset(st,  tileAmount);

    color = mix(col1, col2, circlePattern(grid1, 0.75 + (sin (time_anim1) * .3), 0.10 + (cos (time_anim1) * .05)));

    gl_FragColor = vec4(color);
}