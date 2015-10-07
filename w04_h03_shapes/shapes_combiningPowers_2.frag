#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float DrawPolygon (vec2 st, int sides, float size, float blur, float rot) {
   float d = 0.0;

  // Remap the space to -1. to 1.
  st = st *2.0 - 1.0;

  // Angle and radius from the current pixel
  float angle = atan(st.x,st.y)+PI + rot;
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

vec3 colBR = vec3 (0.56, 0.09, 0.25);
vec3 colTL = vec3 (0.08, 0.00, 0.01);
vec3 colTR = vec3 (0.37, 0.06, 0.16);
vec3 colBL = vec3 (0.73, 0.04, 0.29);
float squareOffset1 = 0.16;
vec2 squareOffset2 = vec2 (-0.315, -0.315);
vec2 squareOffset3 = vec2 (-0.16, -0.48);

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	st.x *= u_resolution.x/u_resolution.y;
	st *= 2.0;
	st -= 0.5;
  
	vec3 color = vec3 (0.0);
	// color += vec3 (DrawPolygon (st, 3, 0.4, 0.0, 0.0));
	float startSquare = DrawPolygon (st, 4, 0.45, 0.0, PI * 0.25);

	// color += vec3 (DrawPolygon (ModifyScreenSpace (st, vec2 (1.0), vec2 (-0.163, -0.163)), 4, 0.32, 0.0, 0.0));

	// color += DistanceField_Min (DrawPolygon (ModifyScreenSpace (st, vec2 (1.0), vec2 (-0.163, -0.163)), 4, 0.32, 0.0, 0.0), startSquare);


	color += vec3 (startSquare) * colBR;
	color += vec3 (DistanceField_Min (
		startSquare,
		DrawPolygon (
			ModifyScreenSpace (st, vec2 (1.0), vec2 (-squareOffset1, squareOffset1)), 4, 0.32, 0.0, 0.0)
		)
	) * colTL;
	color += vec3 (DistanceField_Min (
		startSquare,
		DrawPolygon (
			ModifyScreenSpace (st, vec2 (1.0), vec2 (squareOffset1, squareOffset1)), 4, 0.32, 0.0, 0.0)
		)
	) * colTR;
	color += vec3 (DistanceField_Min (
		startSquare,
		DrawPolygon (
			ModifyScreenSpace (st, vec2 (1.0), vec2 (-squareOffset1, -squareOffset1)), 4, 0.32, 0.0, 0.0)
		)
	) * colBL;
  

	float newSquare = DrawPolygon (
		ModifyScreenSpace (st, vec2 (1.0), squareOffset2), 
		4, 0.45, 0.0, PI * 0.25
	);
	// color += newSquare;

	color += vec3 (DistanceField_Min (
		newSquare,
		DrawPolygon (
			ModifyScreenSpace (st, vec2 (1.0), vec2 (-squareOffset1, -squareOffset1)), 4, 0.32, 0.0, 0.0)
		)
	) * colBL;

	float newSquare2 = DrawPolygon (
		ModifyScreenSpace (st, vec2 (1.0), squareOffset3), 
		4, 0.32, 0.0, PI
	);

	// color += newSquare2;

	color += vec3 (DistanceField_Min (
		newSquare2,
		DrawPolygon (
			ModifyScreenSpace (st, vec2 (1.0), squareOffset3), 4, 0.32, 0.0, PI * 0.25)
		)
	) * colBL;


	// color += DistanceField_Min (newSquare, DrawPolygon (ModifyScreenSpace (st, vec2 (1.0), vec2 (-0.163, -0.163)), 4, 0.32, 0.0, 0.0));

	// color = vec3 (startSquare) * colBR;
	// float newSquare = DrawPolygon (st, 4, 0.45, 0.0, PI * 0.25);
	// color += vec3 (newSquare);

  // vec3 color = vec3 (DrawPolygon (st, 5, 0.4, 0.03));

  // st *= 2.0;
  // st += 0.1;
  // st = ModifyScreenSpace (st, 2.0, -0.8);
  // st = ModifyScreenSpace (st, vec2 (2.0), vec2 (0.8, 1.3));
  // color += vec3 (DrawPolygon (st, 6, 0.4, 0.03));

  // color = 

  gl_FragColor = vec4(color,1.0);
}