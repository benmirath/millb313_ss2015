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
    return pow( 4.0*x*(1.0-x), k );
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
    st.y -= 0.5;
    vec2 coord = vec2 (0.0, 0.0);
    float x = st.x + (sin (u_time * 5.0) * 0.05);
    x -= (u_time * 0.1);
    float y = st.y - sin (u_time) * 0.1;
    
    vec3 col = vec3 (Patricircle (vec2 (x, y), 0.005));
    float alpha = 1.0;
    gl_FragColor = vec4(vec3 (col), alpha);

}