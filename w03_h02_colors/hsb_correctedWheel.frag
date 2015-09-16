#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;

float exponentialEasing (float x, float a){
  
    float epsilon = 0.00001;
    float min_param_a = 0.0 + epsilon;
    float max_param_a = 1.0 - epsilon;
    a = max(min_param_a, min(max_param_a, a));

    if (a < 0.5){
    // emphasis
        a = 2.0*(a);
        float y = pow(x, a);
        return y;
    } else {
    // de-emphasis
        a = 2.0*(a-0.5);
        float y = pow(x, 1.0/(1.0-a));
        return y;
    }
}

float logisticSigmoid (float x, float a){
    // n.b.: this Logistic Sigmoid has been normalized.

    float epsilon = 0.0001;
    float min_param_a = 0.0 + epsilon;
    float max_param_a = 1.0 - epsilon;
    a = max(min_param_a, min(max_param_a, a));
    a = (1.0/(1.0-a) - 1.0);

    float A = 1.0 / (1.0 + exp(0.0 -((x-0.5)*a*2.0)));
    float B = 1.0 / (1.0 + exp(a));
    float C = 1.0 / (1.0 + exp(0.0-a)); 
    float y = (A-B)/(C-B);
    return y;
}

float doubleCubicSeat (float x, float a, float b){

    float epsilon = 0.00001;
    float min_param_a = 0.0 + epsilon;
    float max_param_a = 1.0 - epsilon;
    float min_param_b = 0.0;
    float max_param_b = 1.0;
    a = min(max_param_a, max(min_param_a, a));  
    b = min(max_param_b, max(min_param_b, b)); 

    float y = 0.0;
    if (x <= a){
        y = b - b*pow(1.0-x/a, 3.0);
    } else {
        y = b + (1.0-b)*pow((x-a)/(1.0-a), 3.0);
    }
    return y;
}
float circularEaseIn (float x){
  float y = 1.0 - sqrt(1.0 - x*x);
  return y;
}

//------------------------------
float circularEaseOut (float x){
  float y = sqrt(1.0 - sqrt(1.0 - x));
  return y;
}
// Helper functions:
float slopeFromT (float t, float A, float B, float C){
  float dtdx = 1.0/(3.0*A*t*t + 2.0*B*t + C); 
  return dtdx;
}

float xFromT (float t, float A, float B, float C, float D){
  float x = A*(t*t*t) + B*(t*t) + C*t + D;
  return x;
}

float yFromT (float t, float E, float F, float G, float H){
  float y = E*(t*t*t) + F*(t*t) + G*t + H;
  return y;
}

float cubicBezier (float x, float a, float b, float c, float d){

  float y0a = 0.00; // initial y
  float x0a = 0.00; // initial x 
  float y1a = b;    // 1st influence y   
  float x1a = a;    // 1st influence x 
  float y2a = d;    // 2nd influence y
  float x2a = c;    // 2nd influence x
  float y3a = 1.00; // final y 
  float x3a = 1.00; // final x 

  float A =   x3a - 3.0*x2a + 3.0*x1a - x0a;
  float B = 3.0*x2a - 6.0*x1a + 3.0*x0a;
  float C = 3.0*x1a - 3.0*x0a;   
  float D =   x0a;

  float E =   y3a - 3.0*y2a + 3.0*y1a - y0a;    
  float F = 3.0*y2a - 6.0*y1a + 3.0*y0a;             
  float G = 3.0*y1a - 3.0*y0a;             
  float H =   y0a;

  // Solve for t given x (using Newton-Raphelson), then solve for y given t.
  // Assume for the first guess that t = x.
  float currentt = x;
  int nRefinementIterations = 5;
  for (int i=0; i < nRefinementIterations; i++){
    float currentx = xFromT (currentt, A,B,C,D); 
    float currentslope = slopeFromT (currentt, A,B,C);
    currentt -= (currentx - x)*(currentslope);
    currentt = clamp(currentt, 0.0,1.0);
  } 

  float y = yFromT (currentt,  E,F,G,H);
  return y;
}


//  Function from Iñigo Quiles 
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x) - 0.6;
    float radius = length(toCenter)*2.0;

    if (radius <= 1.0) {
        color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0));
        
        //bezier
        // color.r = cubicBezier (color.r, 0.25, 0.32, 0.75, 0.25);
        // color.g = cubicBezier (color.g, 0.25, 0.72, 0.75, 0.25);
        // color.b = cubicBezier (color.b, 0.25, 0.72, 0.75, 0.25);
        
        //circular
        // color.r = circularEaseIn (color.r);
        // color.g = circularEaseIn (color.g);
        // color.b = circularEaseIn (color.b);

        // exponential
        color.r = exponentialEasing (color.r, 0.75);
        color.g = exponentialEasing (color.g, 0.3);
        color.b = exponentialEasing (color.b, 0.75);

        //doubleCubic
        // float correctionB = 0.3;
        // color.r = doubleCubicSeat (color.r, correction, correctionB);
        // color.g = doubleCubicSeat (color.g, correction, correctionB);
        // color.b = doubleCubicSeat (color.b, correction, correctionB);         
    } else {
        color = vec3(0.0);
    }
    gl_FragColor = vec4(color,1.0);
  
    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius

    // if (angle >= 0.0001) {
    
}