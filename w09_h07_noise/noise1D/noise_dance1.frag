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

	// float y = random(i); //rand() is described in the previous chapter
	// y = mix(random(i), random(i + 1.0), f);
	float y = mix(random(i), random(i + 1.0), smoothstep(0.,1.,f));
	return y;
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


// float noise (in vec2 _st) {
    
// }

void main () {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // st -= .5;
    // st *= 50.;

    vec3 color =  hsb2rgb (vec3 (noise (u_time), noise (u_time), 1.));

    // st *= scale (vec2 (4.,2.));
    st *= scale (vec2 (5.));

    // st *= rotationMatrix(u_time);
    // float shape1 = polygon (
    //   st, 
    //   3, 
    //   5. + noise (u_time) * 10., 
    //   sin(u_time) * 5.  
    // );

    // // st *= identityMatrix ();

    // st *= rotationMatrix(-u_time);
    // float shape2 = polygon (
    //   st, 
    //   2 + int(noise (u_time) * 10.), 
    //   5. + abs (sin (u_time * 2.)) * 10., 
    //   noise(u_time) 
    // );


    // float pct = min (shape2, shape1);

    // st += translate (vec2 (0.,.7));
    // st += vec2 (-1., 0.);
    vec2 coord0 = st - vec2 (0., max (sin (u_time) * .5, 0.));
    float pct = box (coord0, vec2 (0.5 + noise (u_time) * 0.5, .8));

    float animTime1 = 2.;
    float animScale1 = .5;


    vec2 coord1 = st + vec2 (-1., -0.25 - noise (u_time + st.x));
    pct += box (coord1, vec2 (0.35, 1.3));

    vec2 coord2 = st + vec2 (-2., -0.15 - noise (u_time) * 0.5);
    // st += vec2 (-1., 0.1);
    pct += box (coord2, vec2 (0.65, 1.1 - (noise (u_time) * 0.5) ));

    // st += vec2 (-1.5, 0.15);
    
    float animTimeTri = sin (noise(u_time));
    vec2 coord3 = st + vec2 (-3.5, -animTimeTri);
    coord3 *= rotate (max (animTimeTri, 0.));
    // coord3 *= rotate (u_time * animTimeTri);

    pct += polygon (coord3, 3, 0.8, 0.);

    // float pct = mix (shape1, shape2, noise (u_time));

    gl_FragColor = vec4 (vec3 (pct), 1.0);
}