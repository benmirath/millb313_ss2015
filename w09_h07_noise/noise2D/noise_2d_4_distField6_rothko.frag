// Author: @diaBEETS (ben miller) - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// mat3 scale (vec2 f) { return mat3 ( vec3 (f.x, 0.0, 0.0), vec3 (0.0, f.y, 0.0), vec3 (0.0, 0.0, 1.0) ); }
// mat3 translate (vec2 f) { return mat3 ( vec3 (1.0, 0.0, 0.0), vec3 (0.0, 1.0, 0.0), vec3 (f.x, f.y, 1.0) ); }
// mat3 rotate (float a) { return mat3 ( vec3 (cos(a), -sin(a), 0.0), vec3 (sin (a), cos(a), 0.0), vec3 (0.0, 0.0, 1.0) ); }
// mat2 rotationMatrix(float a) { return mat2 ( vec2 (cos(a), -sin(a)), vec2(sin(a),cos(a))); }
mat2 scale (vec2 f) { return mat2 ( vec2 (f.x, 0.0), vec2 (0.0, f.y)); }
// mat2 translate (vec2 f) { return mat2 ( vec2 (0.0, 1.0), vec2 (f.x, f.y) ); }
mat2 translate (vec2 f) { return mat2 ( vec2 (0.0, 1.0), vec2 (f.x, f.y) ); }
// vec2 translate (vec2 f) { return  }
mat2 rotate (float a) { return mat2 ( vec2 (cos(a), -sin(a)), vec2 (sin (a), cos(a))); }

mat3 identityMatrix () { return mat3 ( vec3 (1.0, 0.0, 0.0), vec3 (0.0, 1.0, 0.0), vec3 (0.0, 0.0, 1.0) ); }

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float random (float _x) {
	return fract(sin(_x)*100000.0);
}
float random (in vec2 _st) { 
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise (float _x) {
    float i = floor(_x);  // integer
	float f = fract(_x);  // fraction
	float y = mix(random(i), random(i + 1.0), smoothstep(0.,1.,f));
	return y;
}
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    u = smoothstep(0.,1.,f);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}

float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st); //1e-4 == 0.00004;
    uv *= smoothstep(_size,_size+vec2(1e-4), vec2(1.0) - _st);
    return uv.x * uv.y;
}

float polygon (vec2 st, int sides, float size, float blur) {
  st = st *2.0 - 1.0; // Remap the space to -1. to 1.
  float angle = atan(st.x,st.y)+PI;   // Angle and radius from the current pixel
  float radius = TWO_PI/float(sides);
  float d = cos( floor ( 0.5 + angle / radius) * radius - angle) * length( st );      // Shaping function that modulate the distance
  return 1.0 - smoothstep( size, size + blur ,d);
}
float circle(vec2 st, float radius){
    vec2 pos = vec2(0.5)-st;
    radius *= 0.75;
    return 1.-smoothstep(radius-(radius*0.05),radius+(radius*0.05),dot(pos,pos)*3.14);
}

float addBlur (vec2 _st, float intensity) {
    return noise (random (_st) * intensity);
}
float addSmudge (vec2 _st, float intensity, float freq) {
    return noise (sin (dot (_st.x, _st.y)) * freq);
}
float addStroke (vec2 _st, float intensity, float freq) {
    return addBlur (_st, intensity) * addSmudge (_st, intensity, freq);
}
float addGyration (vec2 _st, float intensity, float freq, float speed, float range) {
    // return noise (sin (u_time * dot (_st.x, _st.y)) * 5.) * noise (random (_st) * intensity);
    return noise (sin (noise (u_time * speed) * range * dot (_st.x, _st.y)) * freq) * noise (random (_st) * intensity);
}
vec3 returnColor (vec3 col) {
    return col / 255.;
}



// void addColor (out vec3 curColor, vec3  newColor, float intensity) {
vec3 addColorF (vec3 curColor, vec3  newColor, float intensity) {
    vec3 col = curColor;
    col *= step (intensity, 0.0);
    col += newColor * (1. - step (intensity, 0.));
    return col;
}

// vec3 addColor (vec3 curColor, vec3  newColor, float intensity) {
//     vec3 col = curColor;

//     col *= step (intensity, 0.0);
//     col += newColor * (1. - step (intensity, 0.));

//     return col;
// }

void addColor (inout vec3 curColor, vec3  newColor, float intensity) {
    vec3 col = curColor;
    col *= step (intensity, 0.0);
    col += newColor * (1. - step (intensity, 0.));
    curColor = col;
}

vec3 scratchCol1 = vec3 (.5,0.,0.0);
vec3 scratchCol2 = vec3 (.5,0.5,0.0);
vec3 scratchCol3 = vec3 (.25,0.95,0.0);
vec3 scratchCol4 = returnColor (vec3 (112., 229., 255));
vec3 scratchCol5 = returnColor (vec3 (255., 172., 69.));    //organge
vec3 scratchCol6 = returnColor (vec3 (93., 191., 82.));    //green

vec3 scratchCol7 = returnColor (vec3 (72., 85., 255.));    //organge
vec3 scratchCol8 = returnColor (vec3 (255., 76., 76.));    //green

void main () {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // st *= 2.;
    // st -= 1.;

    vec3 col = vec3 (0.);

    //box 1
    st.x += .33;
    float freqAnimation = 65. + (noise (u_time) * 55.);
    // float box1 = box (st + vec2 (addStroke (st, 0.5, freqAnimation)), vec2 (0.275, 0.75));
    vec2 box1Size = vec2 (0.275, 0.75);
    float box1 = box (
        st 
        + vec2 (addBlur (st, 5.5)  //blur
        + vec2 (-0.1)),     //offset
        box1Size
    );
     float box1_2 = box (
        st 
        + vec2 (addBlur (st, 0.5 + freqAnimation)  //blur
        + vec2 (-0.1)),     //offset
        box1Size
    );
    float box1Mask = box (st, box1Size);
    // col += box1;
    col = addColorF (col, box1 * scratchCol5 * box1Mask, box1);
    col = addColorF (col, box1_2 * scratchCol6 * box1Mask, box1_2);
    
    //box 2
    st.x -= .33;
    float freqAnimation2 = min (sin (noise (u_time)) + cos (noise (u_time)), 0.05);
    float box2 = box (st + vec2 (addBlur (st, 0.5 - freqAnimation2)), vec2 (0.275, 0.75));      //create blurred mask
    float boxStroke = box (st + vec2 (addStroke (st - vec2 (-0.3, 0.), 1.5, 250.)), vec2 (0.275, 0.75));    //sharp stroke 1
    float boxStroke2 = box (st + vec2 (addStroke (st - vec2 (1.3, 0.), 50.5, 1000.)), vec2 (0.5, 0.75));    //sharp stroke 2
   
    col = addColorF (col, scratchCol1 * box2, boxStroke * box2);
    col = addColorF (col, scratchCol2 * box2, boxStroke2 * box2);
    
    //box 3
    st.x -= .33;
    float freqAnimation3 = 5. + (sin (noise (u_time)) * 15.);
    // float box3 = box (st + vec2 (addStroke (st, 0.5, freqAnimation3)), vec2 (0.275, 0.75));

    vec2 box3_size = vec2 (0.275, 0.75);
    float box3_mask = box (st, box3_size);
    float box3_pct1 = addBlur (st, 0.5);
    float box3_pct2 = addSmudge (st, 0.5, freqAnimation3);

    // float box3 = box (st + vec2 (addStroke (st, 0.5, freqAnimation3)), vec2 (0.275, 0.75));
    float box3 = box (st + vec2 (addStroke (st, 0.5, freqAnimation)), vec2 (0.275, 0.75));
    // col = addColorF (col, box3 * mix (scratchCol7, scratchCol8, abs (sin (dot (noise (dot (st.y, st.x)), u_time * 15.)))), box3);
    // addColor (col, box3 * mix (scratchCol7, scratchCol8, abs (sin (dot (noise (dot (st.y, st.x)), u_time * 15.)))), box3);
    addColor (col, box3 * mix (scratchCol7, scratchCol8, dot (noise (dot (st.y, st.x)), u_time * 15.)), box3);
    
    float adj = (u_mouse.y / u_resolution.y) * 25.;
    

    gl_FragColor = vec4(col, 1.0);
}





