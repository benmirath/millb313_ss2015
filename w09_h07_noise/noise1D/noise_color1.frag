// Author: @diaBEETS (ben miller) - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

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

// float noise (in vec2 _st) {
    
// }

void main () {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color =  hsb2rgb (vec3 (noise (u_time), noise (u_time), 1.));

    gl_FragColor = vec4 (color, 1.0);
}