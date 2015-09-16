#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float Patricircle (in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
}

void main() {
 	// vec2 pos = gl_FragCoord.xy/vec2(300,200);
	vec2 st = gl_FragCoord.xy/u_resolution;


	vec2 coord = vec2 (0.0, 0.0);
    // if (u_time < 1)
    coord.x = smoothstep (0.0, 0.5, abs(sin(u_time * 2.0))) / 2.0;
	float circleCoord = Patricircle (st - coord, 0.001);

	gl_FragColor = vec4 (vec3(0.0),1.0);
 	gl_FragColor += circleCoord;

    // gl_FragColor = vec4(0.0,1.0,1.0,1.0); 
    // gl_FragColor.r = abs(cos(u_time * (u_mouse.x / (u_resolution.x))));
    // // gl_FragColor.r = abs(cos(u_time * 100.0));
    // // gl_FragColor.r = abs(cos(u_time));
    // gl_FragColor.g = pos.y * (u_mouse.y / u_resolution.y);
    // gl_FragColor.b = abs(sin(u_time * (u_mouse.y / (u_resolution.y))));
    // gl_FragColor.b = u_mouse.x / u_resolution.x;
}