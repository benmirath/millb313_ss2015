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

mat2 rotationMatrix(float a) {
    return mat2(vec2(cos(a),-sin(a)),
            vec2(sin(a),cos(a)));
}

float random (vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))* 
        43758.5453123);
}
float random (float st) { 
    return fract(sin(dot(vec2 (st),
                         vec2(12.9898,78.233)))* 
        43758.5453123);
}

vec3 returnColor (vec2 _st) {
    vec3 colorOptions[8];
    colorOptions[0] = vec3 (.7, .89, .81);
    colorOptions[1] = vec3 (.99, .8, .67);
    colorOptions[2] = vec3 (.8, .84, .91);
    colorOptions[3] = vec3 (.96, .79, .89);
    colorOptions[4] = vec3 (.9, .96, .79);
    colorOptions[5] = vec3 (1., .95, .68);
    colorOptions[6] = vec3 (.95, .88, .8);
    colorOptions[7] = vec3 (.8, .8, .8);
    float targVal = random (_st) * 8.;
    return colorOptions [int (floor (targVal))];
    
}
vec3 returnColor (float x) {
    return returnColor (vec2 (x));
}


vec3 col1 = vec3(0.075,0.514,0.329);
vec3 col2 = vec3(0.973,0.843,0.675);
vec3 col3 = vec3(0.761,0.247,0.102);

float curRotation = 0.0;
float curRotationContra = 0.0;


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float time = u_time;

    float time_anim1 = time * .5;
    vec3 col = vec3(0.);
                    
    // float d = distance(st,vec2(.5));

    vec2 toCenter = vec2(0.5)-st;
    vec2 center = vec2 (0.5);
    float magnitude = distance (st,vec2(.5));
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;
//                  d = sin(d*3.14*5.-_Time.y*3.);
    // d = sin(d* 3.14 *5. - time * 3.);
//                  d = d*3.14*5. - _Time.y*3.;
    // col += magnitude;
    
    //initial resize
    st *= 30.;
    
    //determine arrangement layer
    vec2 st_i = floor(st);
    if (mod(st_i.y,2.) == 1.) { //create x offset every other row
        st.x += .5;
    }
    
    //determine pattern layer
    // vec2 st_f = fract(st);      //create pattern
    // st_f -= .5;
    // st_f = rotationMatrix(magnitude*3.14)*st_f;
    // st_f += .5;

    // vec3 layer1 = returnColor (magnitude * 0.0) * circle ( toCenter + center, magnitude * 0.4 );
    

    
    

    float circ1 = circle ( toCenter + center, magnitude * 0.4 );
    vec3 layer1 = mix (col1, col2, fract (angle * (PI * 0.25)));

    col  += layer1 * circ1;

    float circ2 = circle ( toCenter + center, magnitude * 0.8 );
    vec3 layer2 = mix (col1, col2, fract (angle * (PI * 0.25)));
    
    col = mix (col, layer2 * circ2, step (magnitude, 0.2));

    // vec3 layer2 = returnColor (toCenter) * circlePattern (center + center, magnitude * 2. );
    // vec3 layer1 = vec3 (1.,0.,0.) * circle (st, magnitude );

    // col = mix (returnColor (floor (st_i)), returnColor (toCenter * magnitude), circle (st, magnitude * .25 ));
    
    // col += layer1;
    // col += layer2;

    // vec2 tileAmount = vec2 (10., 10.);
    // vec2 grid1 = tileOffset(toCenter,  tileAmount);


    // col += vec3 (1.,0.,0.) * toCenter.x;


    // col = mix(col1, col2, circlePattern(grid1, 0.75 + (sin (time_anim1) * .1), 0.10 + (cos (time_anim1) * .05)));
    
    //draw pattern
//                  float pct = stripes(st_f);
//                  col += pct;                 
    
    // col *= 1. - step (0.5, magnitude);
    gl_FragColor = vec4(col,1.0);
}