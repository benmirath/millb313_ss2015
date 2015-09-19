#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float F (float _x, float _peak, float _width) {
    return (smoothstep(_peak - (_width * 0.5), _peak, _x) * (smoothstep(_peak + (_width * 0.5), _peak, _x)));
}

float Patricircle (in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
}


float parabola( float k, float x ) {
    // return pow( 4.0*x*(x), k );      //one directional
    return pow( 4.0*x*(1.0-x), k );     //two directional
}
float pcurve( float a, float b, float x ) {
    float k = pow(a+b,a+b) / (pow(a,a)*pow(b,b));
    return k * pow( x, a ) * pow( 1.0-x, b );
}

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) - 
          smoothstep( pct, pct+0.01, st.y);
}


void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    st *= 2.0;
	vec2 coord = vec2 (0.0, 0.0);

    // spreading flash
    float pct = F ( st.y, abs (sin ( u_time + parabola ( 0.5, st.x ))), 0.25);
         pct *= F ( st.x, abs (sin ( u_time + parabola ( 0.5, st.y ))), 0.25);

    //ping pong sunburst
    // float pct = F ( st.y, abs (sin ( u_time + parabola ( 0.5, st.y ))), 0.25);
    //      pct *= F ( st.x, abs (sin ( u_time + parabola ( 0.5, st.x ))), 0.25);

    vec3 col = vec3(pct);

    gl_FragColor = vec4(col, 1.0);
}