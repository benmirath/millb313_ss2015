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
//DRAWING FUNCTIONS
//====================================================================================
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
    color = vec3 (DrawPolygon (st, 2, 0.4, 0.01));
    color = vec3 (DrawPolygon (st, 8, 0.4, 0.01));
    color = vec3( 
        DistanceField_Min ( 
            DrawPolygon (st, 5, 0.4, 0.01), 
            // DrawPolygon (st, 2, 0.4, 0.01)
            DrawPolygon (ModifyScreenSpace (st, 2.0, 0.25), 5, 0.4, 0.01)
        ) 
    );
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