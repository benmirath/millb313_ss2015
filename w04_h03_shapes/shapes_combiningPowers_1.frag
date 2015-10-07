#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


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
  st.x *= u_resolution.x/u_resolution.y;
  
  vec3 color = vec3 (DrawPolygon (st, 5, 0.4, 0.03));

  // st *= 2.0;
  // st += 0.1;
  // st = ModifyScreenSpace (st, 2.0, -0.8);
  st = ModifyScreenSpace (st, vec2 (2.0), vec2 (0.8, 1.3));
  color += vec3 (DrawPolygon (st, 6, 0.4, 0.03));

  // color = 

  gl_FragColor = vec4(color,1.0);
}