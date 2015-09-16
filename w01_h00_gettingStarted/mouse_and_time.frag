#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
 	vec2 pos = gl_FragCoord.xy/vec2(300,200);
    gl_FragColor = vec4(0.0,1.0,1.0,1.0); 
    gl_FragColor.r = abs(cos(u_time * (u_mouse.x / (u_resolution.x))));
    // gl_FragColor.r = abs(cos(u_time * 100.0));
    // gl_FragColor.r = abs(cos(u_time));
    // vec2 mouse = u_mouse;
    // mouse.x = 1.0-mouse.x;
    // mouse.y = 1.0-mouse.y;
    gl_FragColor.g = pos.y * (u_mouse.y / u_resolution.y);
    gl_FragColor.b = abs(sin(u_time * (u_mouse.y / (u_resolution.y))));
    // gl_FragColor.b = u_mouse.x / u_resolution.x;
}