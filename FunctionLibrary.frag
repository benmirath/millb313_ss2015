// Author @patriciogv - 2015    //modified by Ben...
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec4 DrawSquare (vec2 st, vec2 pos1, vec2 pos2) {
    vec2 bl = floor(st + 1.0 - pos1);    // bottom-left
    vec2 tr = floor(1.0 - st + pos2);   // top-right     
    vec3 color = vec3(bl.x * bl.y * tr.x * tr.y);
    return vec4(color,1.0);
}

void main(){

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    gl_FragColor = DrawSquare (st, vec2 (0.3,0.2), vec2 (0.9,0.9));

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