// Author: Ben Miller
// twitter: @diaBeets - 2015
// http://fabraz.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    
    // bottom-left
    vec2 bl = floor(st + 1.0 - vec2(0.3,0.2));
    float pct = bl.x * bl.y;

    // top-right 
    vec2 tr = floor(1.0 - st + vec2 (0.9,0.9)); 
    pct *= tr.x * tr.y;
    
    color = vec3(pct);

    gl_FragColor = vec4(color,1.0);
}