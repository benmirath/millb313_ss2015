// Author: Ben Miller
// twitter: @diaBeets - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
    vec2 pos = gl_FragCoord.xy/vec2(300,200);
    gl_FragColor = vec4(0.0,u_mouse.x,pos.y,1.0); 
    gl_FragColor.r = abs(cos(u_time));
//     gl_FragColor = vec4(0.0,0.0,1.0); 
//     gl_FragColor.b = pos.y;
}