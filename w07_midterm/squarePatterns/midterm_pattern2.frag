// Author: @diaBeets (ben miller) - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 tile(vec2 st, float zoom){
    st *= zoom;
    return fract(st);
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

float circlePattern(vec2 st, float radius) {
    return  circle(st+vec2(0.,-.5), radius)+
            circle(st+vec2(0.,.5), radius)+
            circle(st+vec2(-.5,0.), radius)+
            circle(st+vec2(.5,0.), radius);
}
float boxPattern(vec2 st, vec2 size) {
    return  box(st+vec2(0.,-.5), size)+
            box(st+vec2(0.,.5), size)+
            box(st+vec2(-.5,0.), size)+
            box(st+vec2(.5,0.), size);
}

mat2 rotationMatrix(float a) {
    return mat2(vec2(cos(a),-sin(a)),
            vec2(sin(a),cos(a)));
}


vec4 col1 = vec4(0.075,0.114,0.329, 1.0);
vec4 col2 = vec4(0.973,0.843,0.675, 1.0);
vec4 col3 = vec4(0.761,0.247,0.102, 1.);
// vec4 col3 = vec4(0.761,0.247,0.102, 1.);

float curRotation = 0.0;
float curRotationContra = 0.0;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec4 color = vec4(0.0);
    float time = u_time * 0.25;
    float timeFrag = fract (time);


    // if (timeFrag > 0.5) {
    curRotation += (u_time - curRotation);
    curRotationContra -= (u_time + curRotationContra);
    // } else {

    // }


    //LAYER 1
    vec2 coordSys1 = st;
    if (timeFrag > 0.5) {
        coordSys1 -= .5;
        coordSys1 *= rotationMatrix ((PI * 0.25) * curRotation);
        coordSys1 += .5;
    } else {
        // coordSys1 += timeFrag;    
    }
    
    vec2 grid1 = tile(coordSys1, 3.);
    if (timeFrag <= 0.5) {
        grid1 -= .5;
        grid1 *= rotationMatrix ((PI * 0.25) * curRotationContra);
        grid1 += .5;

    }
    color = mix(col1, col2, boxPattern(grid1, vec2 (0.75)));

    vec2 coordSys2 = st;
    if (timeFrag <= 0.5) {
        coordSys2 -= .5;
        coordSys2 *= rotationMatrix ((PI * 0.25) * curRotationContra);
        coordSys2 += .5;
    } else {
        // coordSys2 -= timeFrag;    
    }
    
    vec2 grid2 = tile(coordSys2, 6.);
    if (timeFrag > 0.5) {
        grid2 -= .5;
        grid2 *= rotationMatrix ((PI * 0.25) * curRotation);
        grid2 += .5;

    }
    color = mix(color, col3, boxPattern(grid2, vec2 (0.75)));
    gl_FragColor = vec4(color);
}